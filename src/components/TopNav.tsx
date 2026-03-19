import { useState, useCallback } from 'react';
import type { ResumeData } from '../types/resume';
import { visualTemplates } from '../data/visualTemplates';
import { encodeResumeForShare } from '../utils/storage';
import { exportToPdf } from '../utils/pdf';
import ApiKeySettings from './ApiKeySettings';

interface TopNavProps {
  resume: ResumeData;
  drafts: ResumeData[];
  onChangeVisualTemplate: (templateId: string) => void;
  onChangeThemeColor: (color: string) => void;
  onSwitchResume: (resumeId: string) => void;
  onNewResume: () => void;
  onDeleteDraft: (resumeId: string) => void;
}

const themeColors = [
  { name: '默认', value: '' },
  { name: '蓝色', value: '#2563eb' },
  { name: '绿色', value: '#059669' },
  { name: '紫色', value: '#7c3aed' },
  { name: '红色', value: '#dc2626' },
  { name: '橙色', value: '#ea580c' },
  { name: '青色', value: '#0891b2' },
  { name: '粉色', value: '#db2777' },
];

export default function TopNav({
  resume,
  drafts,
  onChangeVisualTemplate,
  onChangeThemeColor,
  onSwitchResume,
  onNewResume,
  onDeleteDraft,
}: TopNavProps) {
  const [showVisualMenu, setShowVisualMenu] = useState(false);
  const [showColorMenu, setShowColorMenu] = useState(false);
  const [showDraftMenu, setShowDraftMenu] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showApiKeySettings, setShowApiKeySettings] = useState(false);

  const handleShare = useCallback(() => {
    const url = encodeResumeForShare(resume);
    setShareUrl(url);
    setShowShareModal(true);
  }, [resume]);

  const handleExportPdf = useCallback(async () => {
    setIsExporting(true);
    try {
      await exportToPdf('resume-preview', resume.basic.name ? `${resume.basic.name}的简历` : '我的简历');
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('PDF 导出失败，请重试');
    } finally {
      setIsExporting(false);
    }
  }, [resume]);

  const handleCopyShareUrl = useCallback(() => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert('分享链接已复制到剪贴板！');
    }).catch(() => {
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('分享链接已复制到剪贴板！');
    });
  }, [shareUrl]);

  return (
    <>
      <nav className="top-nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: '16px',
            fontWeight: 600,
            color: 'var(--ink)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            letterSpacing: '-0.02em',
          }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '28px',
              height: '28px',
              background: 'linear-gradient(135deg, var(--ink), var(--ink-light))',
              borderRadius: '6px',
              fontSize: '13px',
            }}>📄</span>
            Résumé Builder
          </h1>

          <div style={{ width: '1px', height: '24px', background: 'var(--border)' }} />

          <div className="relative">
            <button
              className="btn-secondary"
              onClick={() => { setShowDraftMenu(!showDraftMenu); setShowVisualMenu(false); setShowColorMenu(false); }}
            >
              {resume.meta.name || '我的简历'} ▾
            </button>
            {showDraftMenu && (
              <div className="dropdown-menu" style={{ left: 0 }}>
                {drafts.map((draft) => (
                  <div key={draft.meta.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <button
                      className="dropdown-item"
                      style={{ flex: 1 }}
                      onClick={() => { onSwitchResume(draft.meta.id); setShowDraftMenu(false); }}
                    >
                      {draft.meta.id === resume.meta.id && <span style={{ color: 'var(--gold)' }}>✓</span>}
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{draft.meta.name || '未命名'}</span>
                    </button>
                    {drafts.length > 1 && (
                      <button
                        style={{
                          fontSize: '11px',
                          color: 'var(--danger)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          transition: 'opacity 0.15s',
                        }}
                        onClick={(event) => { event.stopPropagation(); onDeleteDraft(draft.meta.id); }}
                      >
                        删除
                      </button>
                    )}
                  </div>
                ))}
                <div style={{ borderTop: '1px solid var(--border-light)', marginTop: '4px', paddingTop: '4px' }}>
                  <button
                    className="dropdown-item"
                    style={{ color: 'var(--gold)', fontWeight: 600 }}
                    onClick={() => { onNewResume(); setShowDraftMenu(false); }}
                  >
                    + 新建简历
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="relative">
            <button
              className="btn-secondary"
              onClick={() => { setShowVisualMenu(!showVisualMenu); setShowColorMenu(false); setShowDraftMenu(false); }}
            >
              模板 ▾
            </button>
            {showVisualMenu && (
              <div className="dropdown-menu" style={{ right: 0 }}>
                {visualTemplates.map((template) => (
                  <button
                    key={template.id}
                    className="dropdown-item"
                    onClick={() => { onChangeVisualTemplate(template.id); setShowVisualMenu(false); }}
                  >
                    <span>{template.icon}</span>
                    <span>{template.name}</span>
                    {resume.meta.visualTemplateId === template.id && <span style={{ marginLeft: 'auto', color: 'var(--gold)', fontSize: '12px' }}>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              className="btn-secondary"
              onClick={() => { setShowColorMenu(!showColorMenu); setShowVisualMenu(false); setShowDraftMenu(false); }}
            >
              配色 ▾
            </button>
            {showColorMenu && (
              <div className="dropdown-menu" style={{ right: 0, padding: '14px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                  {themeColors.map((color) => (
                    <button
                      key={color.value}
                      style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px',
                        background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
                      }}
                      onClick={() => { onChangeThemeColor(color.value); setShowColorMenu(false); }}
                      title={color.name}
                    >
                      <div
                        style={{
                          width: '26px', height: '26px', borderRadius: '50%',
                          backgroundColor: color.value || '#666',
                          border: resume.meta.themeColor === color.value ? '2.5px solid var(--gold)' : '1.5px solid var(--border)',
                          transform: resume.meta.themeColor === color.value ? 'scale(1.15)' : 'scale(1)',
                          transition: 'all 0.2s ease',
                          boxShadow: resume.meta.themeColor === color.value ? '0 2px 8px rgba(201, 169, 110, 0.3)' : 'none',
                        }}
                      />
                      <span style={{ fontSize: '10px', color: 'var(--ink-subtle)', fontWeight: 500 }}>{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div style={{ width: '1px', height: '24px', background: 'var(--border)' }} />

          <button className="btn-secondary" onClick={() => setShowApiKeySettings(true)}>
            AI 设置
          </button>

          <button className="btn-secondary" onClick={handleShare}>
            分享
          </button>

          <button className="btn-primary" onClick={handleExportPdf} disabled={isExporting}>
            {isExporting ? '导出中...' : '导出 PDF'}
          </button>
        </div>
      </nav>

      {showApiKeySettings && (
        <ApiKeySettings onClose={() => setShowApiKeySettings(false)} />
      )}

      {showShareModal && (
        <div className="modal-overlay" onClick={() => setShowShareModal(false)}>
          <div className="modal-content" style={{ maxWidth: '480px' }} onClick={(event) => event.stopPropagation()}>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '18px',
              fontWeight: 600,
              color: 'var(--ink)',
              marginBottom: '6px',
              letterSpacing: '-0.02em',
            }}>分享简历</h3>
            <div className="gold-accent" style={{ marginBottom: '16px' }} />
            <p style={{ fontSize: '13px', color: 'var(--ink-muted)', marginBottom: '18px', lineHeight: 1.6 }}>
              复制下方链接发送给他人，对方打开即可查看你的简历
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                className="form-input"
                style={{ flex: 1, fontSize: '12px' }}
                value={shareUrl}
                readOnly
                onClick={(event) => (event.target as HTMLInputElement).select()}
              />
              <button className="btn-primary" style={{ whiteSpace: 'nowrap' }} onClick={handleCopyShareUrl}>
                复制链接
              </button>
            </div>
            <p style={{
              fontSize: '12px',
              color: 'var(--ink-muted)',
              marginTop: '14px',
              padding: '10px 14px',
              background: 'var(--cream)',
              borderRadius: '6px',
              border: '1px solid var(--border)',
              lineHeight: 1.6,
            }}>
              ⚠️ 分享链接包含简历数据，请谨慎分享
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '18px' }}>
              <button className="btn-secondary" onClick={() => setShowShareModal(false)}>
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
