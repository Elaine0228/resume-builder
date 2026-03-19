import { useState, useCallback } from 'react';
import { Eye, EyeOff, ChevronUp, ChevronDown, Trash2, X, GraduationCap, Briefcase, Rocket, Wrench, FileText, Pin, Sparkles } from 'lucide-react';
import type { ResumeSection, EducationItem, ExperienceItem, ProjectItem } from '../types/resume';
import { generateId } from '../utils/storage';
import { polishDescription, hasApiKey } from '../utils/ai';

interface SectionEditorProps {
  section: ResumeSection;
  onUpdate: (sectionId: string, updated: Partial<ResumeSection>) => void;
  onRemove: (sectionId: string) => void;
  onMove: (sectionId: string, direction: 'up' | 'down') => void;
  isFirst: boolean;
  isLast: boolean;
}

export default function SectionEditor({ section, onUpdate, onRemove, onMove, isFirst, isLast }: SectionEditorProps) {
  const [polishingItemId, setPolishingItemId] = useState<string | null>(null);
  const [polishError, setPolishError] = useState<string | null>(null);

  const handlePolish = useCallback(async (
    itemId: string,
    description: string,
    context: { company?: string; position?: string; projectName?: string; role?: string },
    onPolished: (polishedText: string) => void
  ) => {
    if (!hasApiKey()) {
      setPolishError('请先在顶部导航的「⚙️ AI 设置」中配置通义千问 API Key');
      return;
    }
    if (!description.trim()) {
      setPolishError('请先填写描述内容再进行润色');
      return;
    }
    setPolishingItemId(itemId);
    setPolishError(null);
    try {
      const polishedText = await polishDescription(description, context);
      onPolished(polishedText);
    } catch (error) {
      setPolishError(error instanceof Error ? error.message : 'AI 润色失败，请重试');
    } finally {
      setPolishingItemId(null);
    }
  }, []);

  const sectionIconComponents: Record<string, React.ReactNode> = {
    education: <GraduationCap size={16} strokeWidth={1.8} />,
    experience: <Briefcase size={16} strokeWidth={1.8} />,
    project: <Rocket size={16} strokeWidth={1.8} />,
    skills: <Wrench size={16} strokeWidth={1.8} />,
    summary: <FileText size={16} strokeWidth={1.8} />,
    custom: <Pin size={16} strokeWidth={1.8} />,
  };

  const handleRemoveItem = useCallback((items: unknown[], index: number) => {
    const newItems = (items as Record<string, unknown>[]).filter((_, itemIndex) => itemIndex !== index);
    onUpdate(section.id, { items: newItems as unknown as ResumeSection['items'] });
  }, [section.id, onUpdate]);

  const renderItemHeader = (index: number, totalCount: number, items: unknown[]) => (
    <div className="entry-header">
      <span className="entry-number">
        {index + 1} / {totalCount}
      </span>
      {totalCount > 1 && (
        <button
          className="entry-remove"
          onClick={() => handleRemoveItem(items, index)}
          title="移除此条"
        >
          <X size={14} strokeWidth={2} />
        </button>
      )}
    </div>
  );

  const renderEducationItems = useCallback(() => {
    const items = section.items as EducationItem[];
    return (
      <div className="entry-list">
        {items.map((item, index) => (
          <div key={item.id} className="entry-card">
            {renderItemHeader(index, items.length, items)}
            <div className="entry-fields">
              <div>
                <label className="form-label">学校</label>
                <input
                  className="form-input"
                  value={item.school}
                  onChange={(event) => {
                    const newItems = [...items];
                    newItems[index] = { ...item, school: event.target.value };
                    onUpdate(section.id, { items: newItems });
                  }}
                  placeholder="学校名称"
                />
              </div>
              <div>
                <label className="form-label">学历</label>
                <select
                  className="form-input"
                  value={item.degree}
                  onChange={(event) => {
                    const newItems = [...items];
                    newItems[index] = { ...item, degree: event.target.value };
                    onUpdate(section.id, { items: newItems });
                  }}
                >
                  <option value="">请选择</option>
                  <option value="博士">博士</option>
                  <option value="硕士">硕士</option>
                  <option value="本科">本科</option>
                  <option value="大专">大专</option>
                  <option value="MBA">MBA</option>
                </select>
              </div>
              <div>
                <label className="form-label">专业</label>
                <input
                  className="form-input"
                  value={item.major}
                  onChange={(event) => {
                    const newItems = [...items];
                    newItems[index] = { ...item, major: event.target.value };
                    onUpdate(section.id, { items: newItems });
                  }}
                  placeholder="专业名称"
                />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ flex: 1 }}>
                  <label className="form-label">开始</label>
                  <input
                    className="form-input"
                    type="month"
                    value={item.startDate}
                    onChange={(event) => {
                      const newItems = [...items];
                      newItems[index] = { ...item, startDate: event.target.value };
                      onUpdate(section.id, { items: newItems });
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="form-label">结束</label>
                  <input
                    className="form-input"
                    value={item.endDate}
                    onChange={(event) => {
                      const newItems = [...items];
                      newItems[index] = { ...item, endDate: event.target.value };
                      onUpdate(section.id, { items: newItems });
                    }}
                    placeholder="至今"
                  />
                </div>
              </div>
            </div>
            <div style={{ marginTop: '10px' }}>
              <label className="form-label">补充说明</label>
              <textarea
                className="form-textarea"
                value={item.description}
                onChange={(event) => {
                  const newItems = [...items];
                  newItems[index] = { ...item, description: event.target.value };
                  onUpdate(section.id, { items: newItems });
                }}
                placeholder="如：GPA、奖学金、荣誉等"
              />
            </div>
          </div>
        ))}
        <button
          className="btn-add-entry"
          onClick={() => {
            const newItem: EducationItem = {
              id: generateId(),
              school: '',
              degree: '',
              major: '',
              startDate: '',
              endDate: '',
              description: '',
            };
            onUpdate(section.id, { items: [...items, newItem] });
          }}
        >
          + 添加教育经历
        </button>
      </div>
    );
  }, [section, onUpdate, handleRemoveItem]);

  const renderExperienceItems = useCallback(() => {
    const items = section.items as ExperienceItem[];
    return (
      <div className="entry-list">
        {items.map((item, index) => (
          <div key={item.id} className="entry-card">
            {renderItemHeader(index, items.length, items)}
            <div className="entry-fields">
              <div>
                <label className="form-label">公司</label>
                <input
                  className="form-input"
                  value={item.company}
                  onChange={(event) => {
                    const newItems = [...items];
                    newItems[index] = { ...item, company: event.target.value };
                    onUpdate(section.id, { items: newItems });
                  }}
                  placeholder="公司名称"
                />
              </div>
              <div>
                <label className="form-label">职位</label>
                <input
                  className="form-input"
                  value={item.position}
                  onChange={(event) => {
                    const newItems = [...items];
                    newItems[index] = { ...item, position: event.target.value };
                    onUpdate(section.id, { items: newItems });
                  }}
                  placeholder="职位名称"
                />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ flex: 1 }}>
                  <label className="form-label">开始</label>
                  <input
                    className="form-input"
                    type="month"
                    value={item.startDate}
                    onChange={(event) => {
                      const newItems = [...items];
                      newItems[index] = { ...item, startDate: event.target.value };
                      onUpdate(section.id, { items: newItems });
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="form-label">结束</label>
                  <input
                    className="form-input"
                    value={item.endDate}
                    onChange={(event) => {
                      const newItems = [...items];
                      newItems[index] = { ...item, endDate: event.target.value };
                      onUpdate(section.id, { items: newItems });
                    }}
                    placeholder="至今"
                  />
                </div>
              </div>
            </div>
            <div style={{ marginTop: '10px' }}>
              <label className="form-label">工作描述</label>
              <textarea
                className="form-textarea"
                style={{ minHeight: '100px' }}
                value={item.description}
                onChange={(event) => {
                  const newItems = [...items];
                  newItems[index] = { ...item, description: event.target.value };
                  onUpdate(section.id, { items: newItems });
                }}
                placeholder="描述你的工作职责和成果，建议使用数据量化（如：提升了XX%的转化率）"
              />
            </div>
          </div>
        ))}
        <button
          className="btn-add-entry"
          onClick={() => {
            const newItem: ExperienceItem = {
              id: generateId(),
              company: '',
              position: '',
              startDate: '',
              endDate: '',
              description: '',
            };
            onUpdate(section.id, { items: [...items, newItem] });
          }}
        >
          + 添加工作经历
        </button>
      </div>
    );
  }, [section, onUpdate, handleRemoveItem]);

  const renderProjectItems = useCallback(() => {
    const items = section.items as ProjectItem[];
    return (
      <div className="entry-list">
        {items.map((item, index) => (
          <div key={item.id} className="entry-card">
            {renderItemHeader(index, items.length, items)}
            <div className="entry-fields">
              <div>
                <label className="form-label">项目名称</label>
                <input
                  className="form-input"
                  value={item.projectName}
                  onChange={(event) => {
                    const newItems = [...items];
                    newItems[index] = { ...item, projectName: event.target.value };
                    onUpdate(section.id, { items: newItems });
                  }}
                  placeholder="项目名称"
                />
              </div>
              <div>
                <label className="form-label">角色</label>
                <input
                  className="form-input"
                  value={item.role}
                  onChange={(event) => {
                    const newItems = [...items];
                    newItems[index] = { ...item, role: event.target.value };
                    onUpdate(section.id, { items: newItems });
                  }}
                  placeholder="如：项目负责人"
                />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ flex: 1 }}>
                  <label className="form-label">开始</label>
                  <input
                    className="form-input"
                    type="month"
                    value={item.startDate}
                    onChange={(event) => {
                      const newItems = [...items];
                      newItems[index] = { ...item, startDate: event.target.value };
                      onUpdate(section.id, { items: newItems });
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="form-label">结束</label>
                  <input
                    className="form-input"
                    value={item.endDate}
                    onChange={(event) => {
                      const newItems = [...items];
                      newItems[index] = { ...item, endDate: event.target.value };
                      onUpdate(section.id, { items: newItems });
                    }}
                    placeholder="至今"
                  />
                </div>
              </div>
            </div>
            <div style={{ marginTop: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label className="form-label" style={{ marginBottom: 0 }}>项目描述</label>
                <button
                  className="btn-polish"
                  disabled={polishingItemId === item.id}
                  onClick={() => handlePolish(
                    item.id,
                    item.description,
                    { projectName: item.projectName, role: item.role },
                    (polishedText) => {
                      const newItems = [...items];
                      newItems[index] = { ...item, description: polishedText };
                      onUpdate(section.id, { items: newItems });
                    }
                  )}
                >
                  <Sparkles size={12} strokeWidth={2} />
                  {polishingItemId === item.id ? '润色中...' : 'AI 润色'}
                </button>
              </div>
              <textarea
                className="form-textarea"
                style={{ minHeight: '100px' }}
                value={item.description}
                onChange={(event) => {
                  const newItems = [...items];
                  newItems[index] = { ...item, description: event.target.value };
                  onUpdate(section.id, { items: newItems });
                }}
                placeholder="描述项目背景、你的职责和取得的成果"
              />
              {polishError && polishingItemId === null && (
                <p style={{ fontSize: '12px', color: 'var(--danger)', marginTop: '6px' }}>{polishError}</p>
              )}
            </div>
          </div>
        ))}
        <button
          className="btn-add-entry"
          onClick={() => {
            const newItem: ProjectItem = {
              id: generateId(),
              projectName: '',
              role: '',
              startDate: '',
              endDate: '',
              description: '',
            };
            onUpdate(section.id, { items: [...items, newItem] });
          }}
        >
          + 添加项目经历
        </button>
      </div>
    );
  }, [section, onUpdate, handleRemoveItem, polishingItemId, polishError, handlePolish]);

  const renderSkillsEditor = useCallback(() => {
    const skills = section.items as string[];
    return (
      <div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
          {skills.map((skill, index) => (
            <span key={index} className="tag-input-tag">
              {skill}
              <button
                style={{ marginLeft: '4px', color: 'var(--gold)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', lineHeight: 1, padding: 0 }}
                onClick={() => {
                  const newSkills = skills.filter((_, skillIndex) => skillIndex !== index);
                  onUpdate(section.id, { items: newSkills });
                }}
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <input
          className="form-input"
          placeholder="输入技能后按回车添加"
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              const inputElement = event.target as HTMLInputElement;
              const value = inputElement.value.trim();
              if (value && !skills.includes(value)) {
                onUpdate(section.id, { items: [...skills, value] });
                inputElement.value = '';
              }
              event.preventDefault();
            }
          }}
        />
      </div>
    );
  }, [section, onUpdate]);

  const renderSummaryEditor = useCallback(() => {
    const summaryText = section.items as string;
    return (
      <textarea
        className="form-textarea"
        style={{ minHeight: '100px' }}
        value={summaryText}
        onChange={(event) => onUpdate(section.id, { items: event.target.value })}
        placeholder="简要描述你的职业优势、核心能力和求职意向"
      />
    );
  }, [section, onUpdate]);

  const renderContent = () => {
    switch (section.type) {
      case 'education':
        return renderEducationItems();
      case 'experience':
        return renderExperienceItems();
      case 'project':
        return renderProjectItems();
      case 'skills':
        return renderSkillsEditor();
      case 'summary':
        return renderSummaryEditor();
      case 'custom':
        return renderSummaryEditor();
      default:
        return null;
    }
  };

  return (
    <div className="section-card">
      <div className="section-card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ color: 'var(--gold)', display: 'flex', alignItems: 'center' }}>
            {sectionIconComponents[section.type] ?? <Pin size={16} strokeWidth={1.8} />}
          </span>
          <input
            className="section-title-input"
            value={section.title}
            onChange={(event) => onUpdate(section.id, { title: event.target.value })}
          />
        </div>
        <div className="section-actions">
          <button
            className="btn-icon"
            onClick={() => onUpdate(section.id, { visible: !section.visible })}
            title={section.visible ? '隐藏此模块（不在简历中显示）' : '显示此模块'}
          >
            {section.visible
              ? <Eye size={15} strokeWidth={1.6} />
              : <EyeOff size={15} strokeWidth={1.6} style={{ opacity: 0.4 }} />
            }
          </button>
          {!isFirst && (
            <button className="btn-icon" onClick={() => onMove(section.id, 'up')} title="上移">
              <ChevronUp size={16} strokeWidth={1.8} />
            </button>
          )}
          {!isLast && (
            <button className="btn-icon" onClick={() => onMove(section.id, 'down')} title="下移">
              <ChevronDown size={16} strokeWidth={1.8} />
            </button>
          )}
          <button
            className="btn-icon btn-icon-danger"
            onClick={() => onRemove(section.id)}
            title="删除模块"
          >
            <Trash2 size={14} strokeWidth={1.6} />
          </button>
        </div>
      </div>

      {section.visible && renderContent()}
    </div>
  );
}
