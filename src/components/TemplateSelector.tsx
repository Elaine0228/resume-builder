import { useState } from 'react';
import { visualTemplates } from '../data/visualTemplates';
import { contentTemplates } from '../data/contentTemplates';

interface TemplateSelectorProps {
  onSelect: (contentTemplateId: string, visualTemplateId: string) => void;
  onClose?: () => void;
  showClose?: boolean;
}

export default function TemplateSelector({ onSelect, onClose, showClose = false }: TemplateSelectorProps) {
  const [step, setStep] = useState<'content' | 'visual'>('content');
  const [selectedContentId, setSelectedContentId] = useState('');
  const [selectedVisualId, setSelectedVisualId] = useState('simple-white');

  const handleContentSelect = (templateId: string) => {
    setSelectedContentId(templateId);
    setStep('visual');
  };

  const handleConfirm = () => {
    if (selectedContentId && selectedVisualId) {
      onSelect(selectedContentId, selectedVisualId);
    }
  };

  return (
    <div className="modal-overlay" onClick={(event) => { if (event.target === event.currentTarget && showClose && onClose) onClose(); }}>
      <div className="modal-content">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1f2937', marginBottom: '6px' }}>
              {step === 'content' ? '📋 选择简历模板' : '🎨 选择视觉风格'}
            </h2>
            <p style={{ fontSize: '13px', color: '#9ca3af' }}>
              {step === 'content'
                ? '选择一个适合你的职业方向的模板，预填示例内容帮你快速上手'
                : '选择一个视觉风格，让你的简历更具个性'}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {step === 'visual' && (
              <button className="btn-secondary" onClick={() => setStep('content')}>
                ← 返回
              </button>
            )}
            {showClose && onClose && (
              <button className="btn-icon" style={{ fontSize: '16px' }} onClick={onClose}>✕</button>
            )}
          </div>
        </div>

        {step === 'content' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {contentTemplates.map((template) => (
              <button
                key={template.id}
                className={`template-card ${selectedContentId === template.id ? 'active' : ''}`}
                style={{ textAlign: 'left' }}
                onClick={() => handleContentSelect(template.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '20px' }}>{template.icon}</span>
                  <span style={{ fontWeight: 600, color: '#374151', fontSize: '13px' }}>{template.name}</span>
                </div>
                <p style={{ fontSize: '12px', color: '#9ca3af', lineHeight: 1.5 }}>{template.description}</p>
              </button>
            ))}
          </div>
        )}

        {step === 'visual' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '28px' }}>
              {visualTemplates.map((template) => (
                <button
                  key={template.id}
                  className={`template-card ${selectedVisualId === template.id ? 'active' : ''}`}
                  style={{ textAlign: 'left' }}
                  onClick={() => setSelectedVisualId(template.id)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <span style={{ fontSize: '18px' }}>{template.icon}</span>
                    <span style={{ fontWeight: 600, color: 'var(--ink)', fontSize: '13px' }}>{template.name}</span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--ink-subtle)', lineHeight: 1.6, marginBottom: '12px' }}>{template.description}</p>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    {Object.values(template.colorScheme).slice(0, 4).map((color, index) => (
                      <div
                        key={index}
                        style={{
                          backgroundColor: color,
                          width: '16px', height: '16px', borderRadius: '50%',
                          border: '1px solid rgba(0,0,0,0.06)',
                        }}
                      />
                    ))}
                  </div>
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                className="btn-primary"
                style={{ padding: '11px 36px', fontSize: '14px', letterSpacing: '0.02em' }}
                onClick={handleConfirm}
                disabled={!selectedContentId || !selectedVisualId}
              >
                开始制作简历 →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
