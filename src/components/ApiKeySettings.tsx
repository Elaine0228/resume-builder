import { useState, useEffect } from 'react';
import { getApiKey, setApiKey } from '../utils/ai';

interface ApiKeySettingsProps {
  onClose: () => void;
}

export default function ApiKeySettings({ onClose }: ApiKeySettingsProps) {
  const [inputKey, setInputKey] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const existingKey = getApiKey();
    if (existingKey) {
      setInputKey(existingKey);
    }
  }, []);

  const handleSave = () => {
    setApiKey(inputKey.trim());
    setSaved(true);
    setTimeout(() => {
      onClose();
    }, 800);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '30rem' }} onClick={(event) => event.stopPropagation()}>
        <h3 className="heading-display" style={{ fontSize: '18px', marginBottom: '6px' }}>AI 功能设置</h3>
        <div className="gold-accent" style={{ marginBottom: '20px' }} />

        <p style={{ fontSize: '13px', color: 'var(--ink-muted)', marginBottom: '10px', lineHeight: 1.8 }}>
          配置通义千问 API Key，即可解锁以下 AI 能力：
        </p>
        <ul style={{ fontSize: '12px', color: 'var(--ink-muted)', lineHeight: 2, paddingLeft: '18px', margin: '0 0 10px 0' }}>
          <li><strong>AI 一键润色</strong> — 用 STAR 法则优化经历描述，让表达更专业</li>
          <li><strong>AI 简历评分</strong> — 多维度评估简历质量，生成雷达图和优化建议</li>
        </ul>

        <div style={{
          marginBottom: '24px',
          padding: '16px 18px',
          background: 'var(--cream)',
          borderRadius: '8px',
          border: '1px solid var(--border)',
        }}>
          <p style={{ fontSize: '13px', color: 'var(--ink-light)', lineHeight: 1.8, marginBottom: '12px' }}>
            <strong>如何获取 API Key？</strong>
          </p>
          <ol style={{ fontSize: '12px', color: 'var(--ink-muted)', lineHeight: 2, paddingLeft: '18px', margin: 0 }}>
            <li>
              访问{' '}
              <a
                href="https://bailian.console.aliyun.com/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--gold)', fontWeight: 600, textDecoration: 'none', borderBottom: '1px solid var(--gold-light)' }}
              >
                阿里云百炼平台
              </a>
              ，注册并登录
            </li>
            <li>新用户可申请 <strong>免费试用额度</strong>，无需付费</li>
            <li>
              在{' '}
              <a
                href="https://bailian.console.aliyun.com/?apiKey=1#/api-key"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--gold)', fontWeight: 600, textDecoration: 'none', borderBottom: '1px solid var(--gold-light)' }}
              >
                API Key 管理页面
              </a>
              {' '}创建并复制你的 Key
            </li>
          </ol>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label className="form-label">API Key</label>
          <input
            className="form-input"
            type="password"
            value={inputKey}
            onChange={(event) => { setInputKey(event.target.value); setSaved(false); }}
            placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxx"
          />
          <p style={{ fontSize: '11px', color: 'var(--ink-subtle)', marginTop: '8px', lineHeight: 1.6 }}>
            Key 仅保存在浏览器本地，不会上传到任何服务器
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            {saved && (
              <span style={{ fontSize: '13px', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
                ✅ 已保存
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-secondary" onClick={onClose}>
              取消
            </button>
            <button
              className="btn-primary"
              onClick={handleSave}
              disabled={!inputKey.trim()}
            >
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
