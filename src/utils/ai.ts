const API_KEY_STORAGE = 'resume-builder-qwen-api-key';

export function getApiKey(): string {
  return localStorage.getItem(API_KEY_STORAGE) ?? '';
}

export function setApiKey(key: string): void {
  localStorage.setItem(API_KEY_STORAGE, key);
}

export function hasApiKey(): boolean {
  return !!getApiKey();
}

interface QwenMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface QwenResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

async function callQwenApi(messages: QwenMessage[]): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('请先在设置中配置通义千问 API Key');
  }

  const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'qwen-plus',
      messages,
      temperature: 0.7,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    if (response.status === 401) {
      throw new Error('API Key 无效，请检查后重试');
    }
    throw new Error(`API 调用失败 (${response.status}): ${errorText}`);
  }

  const data = (await response.json()) as QwenResponse;
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('AI 返回内容为空，请重试');
  }
  return content;
}

const POLISH_SYSTEM_PROMPT = `你是一位专业的简历润色专家。你的任务是将用户提供的工作经历或项目经历描述进行润色优化。

润色要求：
1. 按照 STAR 法则重新组织内容，确保包含以下要素：
   - 【目标/背景】：简要说明做这件事的背景和目标
   - 【难点/挑战】：指出过程中的核心难点或挑战
   - 【解决方案】：描述你采取的具体行动和方法
   - 【达成成果】：用数据量化成果（如提升XX%、降低XX%、覆盖XX用户等）

2. 语言风格要求：
   - 使用简洁专业的语言，避免口语化
   - 动词开头，体现主动性（如"主导"、"搭建"、"优化"、"推动"）
   - 适当补充合理的量化指标（如果原文没有数据，可以用占位符如"XX%"提示用户补充）
   - 每个要点控制在1-2句话

3. 输出格式：
   - 直接输出润色后的文本，不要加任何标题、标签或解释
   - 使用分行展示不同要点，每行以"• "开头
   - 总共3-5个要点，控制在150-250字`;

export interface ResumeScoreResult {
  overallScore: number;
  dimensions: {
    name: string;
    score: number;
    comment: string;
  }[];
  summary: string;
  suggestions: string[];
}

const SCORE_SYSTEM_PROMPT = `你是一位严格的HR和简历评审专家。请对用户提供的简历内容进行严格的多维度评分。

⚠️ 核心原则：你必须严格评分，绝不手软。空白、占位符、模板默认内容一律视为未填写，直接给低分。

评分维度（每项满分100分）及严格扣分标准：

1. 内容完整度（基本信息、教育、工作、项目、技能是否齐全）
   - 姓名/电话/邮箱每缺一项扣10分
   - 缺少工作经历模块扣30分
   - 缺少教育经历模块扣20分
   - 缺少技能模块扣15分
   - 内容为空或仅有占位符文字（如"请输入"、"示例"、"xxx"）视为未填写

2. 工作经历（描述是否具体、有数据支撑、体现成果）
   - 没有任何工作经历条目：0-10分
   - 有条目但描述为空或仅一句话：10-30分
   - 有描述但无量化数据：30-60分
   - 有具体描述+量化成果：60-85分
   - 使用STAR法则+多维度量化：85-100分

3. 项目经历（描述是否清晰、角色明确、成果量化）
   - 没有任何项目经历：0-10分
   - 有条目但描述空白：10-25分
   - 有描述但角色不明确：25-50分
   - 描述清晰+角色明确+有成果：50-80分
   - 完整STAR+量化+技术深度：80-100分

4. 技能匹配度（技能是否丰富、有层次感）
   - 没有技能或为空：0-10分
   - 仅1-2个泛泛的技能：10-30分
   - 3-5个技能但无层次：30-55分
   - 技能丰富且分类清晰：55-80分
   - 技能与经历高度匹配+有专精方向：80-100分

5. 表达专业度（语言是否简洁专业）
   - 内容基本为空无法评价：0-15分
   - 口语化、啰嗦、无重点：15-40分
   - 基本通顺但缺乏专业感：40-60分
   - 简洁专业、动词开头：60-80分
   - 完美的STAR法则+精炼表达：80-100分

6. 整体印象（结构、逻辑性、可读性）
   - 几乎空白的简历：0-15分
   - 结构混乱或大量空白：15-35分
   - 基本结构完整但内容单薄：35-55分
   - 结构清晰、内容充实：55-80分
   - 逻辑严密、重点突出、令人印象深刻：80-100分

overallScore = 各维度分数的加权平均（内容完整度20%、工作经历25%、项目经历20%、技能匹配度10%、表达专业度10%、整体印象15%）

请严格按照以下JSON格式返回，不要输出任何其他内容：
{
  "overallScore": 35,
  "dimensions": [
    {"name": "内容完整度", "score": 40, "comment": "一句话点评，指出具体缺失"},
    {"name": "工作经历", "score": 20, "comment": "一句话点评，指出具体问题"},
    {"name": "项目经历", "score": 30, "comment": "一句话点评，指出具体问题"},
    {"name": "技能匹配度", "score": 25, "comment": "一句话点评，指出具体问题"},
    {"name": "表达专业度", "score": 15, "comment": "一句话点评，指出具体问题"},
    {"name": "整体印象", "score": 30, "comment": "一句话点评，指出具体问题"}
  ],
  "summary": "2-3句话的严格整体评价，直接指出最大的问题",
  "suggestions": ["具体可操作的优化建议1", "具体可操作的优化建议2", "具体可操作的优化建议3", "具体可操作的优化建议4"]
}`;

export async function scoreResume(resumeText: string): Promise<ResumeScoreResult> {
  const content = await callQwenApi([
    { role: 'system', content: SCORE_SYSTEM_PROMPT },
    { role: 'user', content: `请对以下简历进行评分：\n\n${resumeText}` },
  ]);

  // 从返回内容中提取 JSON（可能包含 markdown 代码块）
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('AI 返回格式异常，请重试');
  }

  const result = JSON.parse(jsonMatch[0]) as ResumeScoreResult;

  if (!result.overallScore || !result.dimensions || !result.summary || !result.suggestions) {
    throw new Error('AI 返回数据不完整，请重试');
  }

  return result;
}

/**
 * 将 ResumeData 转换为纯文本，用于 AI 评分
 */
export function resumeToText(resume: import('../types/resume').ResumeData): string {
  const lines: string[] = [];

  const { basic } = resume;
  lines.push(`姓名：${basic.name || '未填写'}`);
  if (basic.title) lines.push(`职位：${basic.title}`);
  if (basic.phone) lines.push(`电话：${basic.phone}`);
  if (basic.email) lines.push(`邮箱：${basic.email}`);
  if (basic.location) lines.push(`所在地：${basic.location}`);
  lines.push('');

  for (const section of resume.sections) {
    if (!section.visible) continue;
    lines.push(`【${section.title}】`);

    if (section.type === 'education') {
      for (const item of section.items as import('../types/resume').EducationItem[]) {
        lines.push(`${item.school} - ${item.degree} ${item.major} (${item.startDate} ~ ${item.endDate})`);
        if (item.description) lines.push(item.description);
      }
    } else if (section.type === 'experience') {
      for (const item of section.items as import('../types/resume').ExperienceItem[]) {
        lines.push(`${item.company} - ${item.position} (${item.startDate} ~ ${item.endDate})`);
        if (item.description) lines.push(item.description);
      }
    } else if (section.type === 'project') {
      for (const item of section.items as import('../types/resume').ProjectItem[]) {
        lines.push(`${item.projectName} - ${item.role} (${item.startDate} ~ ${item.endDate})`);
        if (item.description) lines.push(item.description);
      }
    } else if (section.type === 'skills') {
      lines.push((section.items as string[]).join('、'));
    } else {
      lines.push(section.items as string);
    }
    lines.push('');
  }

  return lines.join('\n');
}

export async function polishDescription(
  description: string,
  context: { position?: string; company?: string; projectName?: string; role?: string }
): Promise<string> {
  const contextInfo = [
    context.company && `公司：${context.company}`,
    context.position && `职位：${context.position}`,
    context.projectName && `项目：${context.projectName}`,
    context.role && `角色：${context.role}`,
  ].filter(Boolean).join('，');

  const userPrompt = contextInfo
    ? `以下是我的经历描述，请帮我润色。\n\n背景信息：${contextInfo}\n\n原始描述：\n${description}`
    : `以下是我的经历描述，请帮我润色。\n\n原始描述：\n${description}`;

  return callQwenApi([
    { role: 'system', content: POLISH_SYSTEM_PROMPT },
    { role: 'user', content: userPrompt },
  ]);
}
