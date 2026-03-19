import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

/**
 * 将简历预览元素导出为 PDF，直接下载无需打印对话框。
 *
 * 策略：用 html2canvas 对原始元素截图（不设置 windowWidth，
 * 让它使用浏览器当前的实际视口宽度，避免 CSS mm/pt 单位被重新解析），
 * 然后用 jsPDF 将截图等比缩放写入 A4 页面。
 */
export async function exportToPdf(elementId: string, fileName: string): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with id "${elementId}" not found`);
  }

  // 截图：不设置 windowWidth 和 width，完全使用元素在当前页面中的实际渲染状态
  // scale=2 提高清晰度，但不影响布局计算
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
    logging: false,
  });

  // 元素在页面中的实际 CSS 像素宽度（不含 scale）
  const elementCssWidth = element.offsetWidth;
  const elementCssHeight = element.offsetHeight;

  // canvas 实际像素 = CSS像素 × scale
  // 我们需要把 elementCssWidth 映射到 A4 的 210mm
  // 计算元素实际高度对应的 mm 数
  const elementHeightMm = (elementCssHeight / elementCssWidth) * A4_WIDTH_MM;

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // 单页：内容高度 ≤ A4 高度
  if (elementHeightMm <= A4_HEIGHT_MM) {
    const imageData = canvas.toDataURL('image/jpeg', 0.95);
    pdf.addImage(imageData, 'JPEG', 0, 0, A4_WIDTH_MM, elementHeightMm);
    pdf.save(`${fileName}.pdf`);
    return;
  }

  // 多页：按 A4 高度比例裁切 canvas
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  // 每页在 canvas 上对应的像素高度
  const pageCanvasHeight = (A4_HEIGHT_MM / A4_WIDTH_MM) * canvasWidth;
  const totalPages = Math.ceil(canvasHeight / pageCanvasHeight);

  for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
    if (pageIndex > 0) {
      pdf.addPage();
    }

    const sliceY = pageIndex * pageCanvasHeight;
    const sliceHeight = Math.min(pageCanvasHeight, canvasHeight - sliceY);
    const sliceHeightMm = (sliceHeight / canvasWidth) * A4_WIDTH_MM;

    const pageCanvas = document.createElement('canvas');
    pageCanvas.width = canvasWidth;
    pageCanvas.height = sliceHeight;

    const context = pageCanvas.getContext('2d');
    if (!context) {
      throw new Error('Failed to get canvas 2d context');
    }

    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvasWidth, sliceHeight);
    context.drawImage(
      canvas,
      0, sliceY, canvasWidth, sliceHeight,
      0, 0, canvasWidth, sliceHeight,
    );

    const pageImageData = pageCanvas.toDataURL('image/jpeg', 0.95);
    pdf.addImage(pageImageData, 'JPEG', 0, 0, A4_WIDTH_MM, sliceHeightMm);
  }

  pdf.save(`${fileName}.pdf`);
}
