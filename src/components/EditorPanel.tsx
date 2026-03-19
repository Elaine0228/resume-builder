import { useState } from 'react';
import { GraduationCap, Briefcase, Rocket, Wrench, FileText, Pin, Undo2, X } from 'lucide-react';
import type { ResumeData, ResumeBasicInfo, ResumeSection, SectionType } from '../types/resume';
import BasicInfoEditor from './BasicInfoEditor';
import SectionEditor from './SectionEditor';

interface EditorPanelProps {
  resume: ResumeData;
  onUpdateBasic: (field: keyof ResumeBasicInfo, value: string) => void;
  onUpdateSection: (sectionId: string, updated: Partial<ResumeSection>) => void;
  onAddSection: (type: SectionType, title: string) => void;
  onRemoveSection: (sectionId: string) => void;
  onMoveSection: (sectionId: string, direction: 'up' | 'down') => void;
  lastRemovedSection: { section: ResumeSection; resumeId: string } | null;
  onUndoRemove: () => void;
  onDismissUndo: () => void;
}

const sectionIconMap: Record<SectionType, React.ReactNode> = {
  education: <GraduationCap size={15} strokeWidth={1.8} />,
  experience: <Briefcase size={15} strokeWidth={1.8} />,
  project: <Rocket size={15} strokeWidth={1.8} />,
  skills: <Wrench size={15} strokeWidth={1.8} />,
  summary: <FileText size={15} strokeWidth={1.8} />,
  custom: <Pin size={15} strokeWidth={1.8} />,
};

const addableSections: { type: SectionType; title: string }[] = [
  { type: 'education', title: '教育经历' },
  { type: 'experience', title: '工作经历' },
  { type: 'project', title: '项目经历' },
  { type: 'skills', title: '技能特长' },
  { type: 'summary', title: '自我评价' },
  { type: 'custom', title: '自定义模块' },
];

export default function EditorPanel({
  resume,
  onUpdateBasic,
  onUpdateSection,
  onAddSection,
  onRemoveSection,
  onMoveSection,
  lastRemovedSection,
  onUndoRemove,
  onDismissUndo,
}: EditorPanelProps) {
  const [showAddMenu, setShowAddMenu] = useState(false);

  const sortedSections = [...resume.sections].sort((sectionA, sectionB) => sectionA.order - sectionB.order);

  return (
    <div className="editor-panel">
      <div style={{ marginBottom: '24px' }}>
        <h2 className="heading-display" style={{ fontSize: '20px', marginBottom: '4px' }}>
          编辑简历
        </h2>
        <div className="gold-accent" style={{ marginBottom: '8px' }} />
        <p style={{ fontSize: '12px', color: 'var(--ink-subtle)', letterSpacing: '0.02em' }}>
          修改内容将实时同步到右侧预览
        </p>
      </div>

      <BasicInfoEditor basic={resume.basic} onUpdate={onUpdateBasic} />

      {sortedSections.map((section, index) => (
        <SectionEditor
          key={section.id}
          section={section}
          onUpdate={onUpdateSection}
          onRemove={onRemoveSection}
          onMove={onMoveSection}
          isFirst={index === 0}
          isLast={index === sortedSections.length - 1}
        />
      ))}

      <div className="relative" style={{ marginTop: '14px' }}>
        <button
          className="btn-secondary"
          style={{
            width: '100%',
            justifyContent: 'center',
            padding: '10px 16px',
            borderStyle: 'dashed',
            color: 'var(--ink-muted)',
          }}
          onClick={() => setShowAddMenu(!showAddMenu)}
        >
          + 添加模块
        </button>

        {showAddMenu && (
          <div className="dropdown-menu" style={{ bottom: '100%', left: 0, right: 0, marginBottom: '6px', top: 'auto' }}>
            {addableSections.map((sectionOption) => (
              <button
                key={sectionOption.type}
                className="dropdown-item"
                onClick={() => {
                  onAddSection(sectionOption.type, sectionOption.title);
                  setShowAddMenu(false);
                }}
              >
                <span style={{ color: 'var(--gold)', display: 'flex', alignItems: 'center' }}>{sectionIconMap[sectionOption.type]}</span>
                <span>{sectionOption.title}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {lastRemovedSection && (
        <div className="undo-toast">
          <span className="undo-toast-text">
            已删除「{lastRemovedSection.section.title}」
          </span>
          <button className="undo-toast-btn" onClick={onUndoRemove}>
            <Undo2 size={13} strokeWidth={2} />
            撤回
          </button>
          <button className="undo-toast-close" onClick={onDismissUndo}>
            <X size={14} strokeWidth={2} />
          </button>
        </div>
      )}
    </div>
  );
}
