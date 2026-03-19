import type { ResumeBasicInfo } from '../types/resume';

interface BasicInfoEditorProps {
  basic: ResumeBasicInfo;
  onUpdate: (field: keyof ResumeBasicInfo, value: string) => void;
}

export default function BasicInfoEditor({ basic, onUpdate }: BasicInfoEditorProps) {
  return (
    <div className="section-card">
      <div style={{ marginBottom: '18px' }}>
        <h3 className="heading-section" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '14px', opacity: 0.7 }}>◉</span> 基本信息
        </h3>
        <div className="gold-accent" style={{ marginTop: '6px' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <div>
          <label className="form-label">姓名 *</label>
          <input
            className="form-input"
            value={basic.name}
            onChange={(event) => onUpdate('name', event.target.value)}
            placeholder="请输入姓名"
          />
        </div>
        <div>
          <label className="form-label">求职意向</label>
          <input
            className="form-input"
            value={basic.title}
            onChange={(event) => onUpdate('title', event.target.value)}
            placeholder="如：前端开发工程师"
          />
        </div>
        <div>
          <label className="form-label">手机号 *</label>
          <input
            className="form-input"
            value={basic.phone}
            onChange={(event) => onUpdate('phone', event.target.value)}
            placeholder="请输入手机号"
          />
        </div>
        <div>
          <label className="form-label">邮箱 *</label>
          <input
            className="form-input"
            value={basic.email}
            onChange={(event) => onUpdate('email', event.target.value)}
            placeholder="请输入邮箱"
          />
        </div>
        <div>
          <label className="form-label">所在城市</label>
          <input
            className="form-input"
            value={basic.location}
            onChange={(event) => onUpdate('location', event.target.value)}
            placeholder="如：北京"
          />
        </div>
        <div>
          <label className="form-label">LinkedIn</label>
          <input
            className="form-input"
            value={basic.linkedin}
            onChange={(event) => onUpdate('linkedin', event.target.value)}
            placeholder="LinkedIn 链接"
          />
        </div>
        <div>
          <label className="form-label">GitHub</label>
          <input
            className="form-input"
            value={basic.github}
            onChange={(event) => onUpdate('github', event.target.value)}
            placeholder="GitHub 链接"
          />
        </div>
        <div>
          <label className="form-label">个人网站</label>
          <input
            className="form-input"
            value={basic.website}
            onChange={(event) => onUpdate('website', event.target.value)}
            placeholder="个人网站链接"
          />
        </div>
      </div>
    </div>
  );
}
