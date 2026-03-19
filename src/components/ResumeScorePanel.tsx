import { useState, useCallback } from 'react';
import { Sparkles, X, AlertCircle, RefreshCw } from 'lucide-react';
import type { ResumeData } from '../types/resume';
import type { ResumeScoreResult } from '../utils/ai';
import { scoreResume, resumeToText, hasApiKey } from '../utils/ai';
import ApiKeySettings from './ApiKeySettings';

interface ResumeScorePanelProps {
  resume: ResumeData;
}

function RadarChart({ dimensions }: { dimensions: ResumeScoreResult['dimensions'] }) {
  const size = 220;
  const center = size / 2;
  const radius = 85;
  const levels = 5;
  const count = dimensions.length;
  const angleStep = (Math.PI * 2) / count;
  const startAngle = -Math.PI / 2;

  const getPoint = (index: number, value: number): [number, number] => {
    const angle = startAngle + angleStep * index;
    const normalizedRadius = (value / 100) * radius;
    return [
      center + normalizedRadius * Math.cos(angle),
      center + normalizedRadius * Math.sin(angle),
    ];
  };

  const gridPolygons = Array.from({ length: levels }, (_, levelIndex) => {
    const levelRadius = ((levelIndex + 1) / levels) * 100;
    const points = dimensions
      .map((_, dimensionIndex) => getPoint(dimensionIndex, levelRadius))
      .map(([pointX, pointY]) => `${pointX},${pointY}`)
      .join(' ');
    return points;
  });

  const dataPoints = dimensions
    .map((dimension, dimensionIndex) => getPoint(dimensionIndex, dimension.score))
    .map(([pointX, pointY]) => `${pointX},${pointY}`)
    .join(' ');

  const axisLines = dimensions.map((_, dimensionIndex) => {
    const [endX, endY] = getPoint(dimensionIndex, 100);
    return { x1: center, y1: center, x2: endX, y2: endY };
  });

  const labelPositions = dimensions.map((dimension, dimensionIndex) => {
    const [labelX, labelY] = getPoint(dimensionIndex, 118);
    return { x: labelX, y: labelY, name: dimension.name, score: dimension.score };
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block', margin: '0 auto' }}>
      {gridPolygons.map((points, gridIndex) => (
        <polygon
          key={gridIndex}
          points={points}
          fill="none"
          stroke="var(--border-light)"
          strokeWidth="0.8"
          opacity={0.6}
        />
      ))}

      {axisLines.map((line, lineIndex) => (
        <line
          key={lineIndex}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke="var(--border-light)"
          strokeWidth="0.6"
          opacity={0.5}
        />
      ))}

      <polygon
        points={dataPoints}
        fill="rgba(201, 169, 110, 0.15)"
        stroke="var(--gold)"
        strokeWidth="1.5"
      />

      {dimensions.map((_, dotIndex) => {
        const [dotX, dotY] = getPoint(dotIndex, dimensions[dotIndex].score);
        return (
          <circle
            key={dotIndex}
            cx={dotX}
            cy={dotY}
            r="3"
            fill="var(--gold)"
            stroke="white"
            strokeWidth="1.5"
          />
        );
      })}

      {labelPositions.map((label, labelIndex) => (
        <text
          key={labelIndex}
          x={label.x}
          y={label.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="9"
          fill="var(--ink-muted)"
          fontFamily="var(--font-body)"
        >
          {label.name}
        </text>
      ))}
    </svg>
  );
}

function ScoreRing({ score }: { score: number }) {
  const ringSize = 64;
  const strokeWidth = 5;
  const ringRadius = (ringSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * ringRadius;
  const progress = (score / 100) * circumference;

  const scoreColor = score >= 80 ? '#059669' : score >= 60 ? '#c9a96e' : '#dc2626';

  return (
    <div style={{ position: 'relative', width: ringSize, height: ringSize }}>
      <svg width={ringSize} height={ringSize} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={ringSize / 2}
          cy={ringSize / 2}
          r={ringRadius}
          fill="none"
          stroke="var(--border-light)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={ringSize / 2}
          cy={ringSize / 2}
          r={ringRadius}
          fill="none"
          stroke={scoreColor}
          strokeWidth={strokeWidth}
          strokeDasharray={`${progress} ${circumference}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.8s ease' }}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-display)',
          fontSize: '18px',
          fontWeight: 700,
          color: scoreColor,
        }}
      >
        {score}
      </div>
    </div>
  );
}

export default function ResumeScorePanel({ resume }: ResumeScorePanelProps) {
  const [scoreResult, setScoreResult] = useState<ResumeScoreResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showApiKeySettings, setShowApiKeySettings] = useState(false);

  const handleScore = useCallback(async () => {
    if (!hasApiKey()) {
      setShowApiKeySettings(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsExpanded(true);

    try {
      const resumeText = resumeToText(resume);
      const result = await scoreResume(resumeText);
      setScoreResult(result);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'AI 评分失败，请重试');
    } finally {
      setIsLoading(false);
    }
  }, [resume]);

  if (!isExpanded) {
    return (
      <>
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '24px',
            zIndex: 1000,
          }}
        >
          <button
            className="btn-secondary"
            style={{
              padding: '10px 20px',
              gap: '8px',
              background: 'linear-gradient(135deg, rgba(201, 169, 110, 0.08), rgba(201, 169, 110, 0.18))',
              borderColor: 'rgba(201, 169, 110, 0.35)',
              color: 'var(--ink-light)',
              boxShadow: '0 4px 16px rgba(26, 26, 46, 0.1), 0 1px 4px rgba(26, 26, 46, 0.06)',
              borderRadius: '12px',
              backdropFilter: 'blur(8px)',
            }}
            onClick={() => {
              if (scoreResult) {
                setIsExpanded(true);
              } else {
                handleScore();
              }
            }}
            disabled={isLoading}
          >
            <Sparkles size={15} strokeWidth={1.8} />
            {isLoading ? 'AI 评分中...' : '✨ AI 简历评分'}
          </button>
        </div>
        {showApiKeySettings && (
          <ApiKeySettings onClose={() => setShowApiKeySettings(false)} />
        )}
      </>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '24px',
        zIndex: 1000,
        width: '380px',
        maxHeight: 'calc(100vh - 100px)',
        background: 'var(--white)',
        borderRadius: '14px',
        border: '1px solid var(--border)',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(26, 26, 46, 0.12), 0 2px 8px rgba(26, 26, 46, 0.06)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 18px',
          borderBottom: '1px solid var(--border-light)',
          background: 'linear-gradient(135deg, rgba(201, 169, 110, 0.04), rgba(201, 169, 110, 0.08))',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={15} strokeWidth={1.8} style={{ color: 'var(--gold)' }} />
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--ink)',
            }}
          >
            AI 简历评分
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button
            className="btn-icon"
            style={{ width: '28px', height: '28px' }}
            onClick={handleScore}
            disabled={isLoading}
            title="重新评分"
          >
            <RefreshCw size={13} strokeWidth={2} style={{ animation: isLoading ? 'spin 1s linear infinite' : 'none' }} />
          </button>
          <button
            className="btn-icon"
            style={{ width: '28px', height: '28px' }}
            onClick={() => setIsExpanded(false)}
            title="收起"
          >
            <X size={14} strokeWidth={2} />
          </button>
        </div>
      </div>

      <div style={{ padding: '18px', overflowY: 'auto', flex: 1 }}>
        {isLoading && (
          <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--ink-subtle)' }}>
            <RefreshCw
              size={24}
              strokeWidth={1.5}
              style={{ animation: 'spin 1s linear infinite', marginBottom: '12px', color: 'var(--gold)' }}
            />
            <p style={{ fontSize: '13px', fontWeight: 500 }}>AI 正在分析你的简历...</p>
            <p style={{ fontSize: '11px', marginTop: '4px', color: 'var(--ink-subtle)' }}>预计需要 5-10 秒</p>
          </div>
        )}

        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              padding: '12px 14px',
              background: 'var(--danger-bg)',
              borderRadius: '6px',
              border: '1px solid #e8c4c4',
            }}
          >
            <AlertCircle size={16} strokeWidth={2} style={{ color: 'var(--danger)', flexShrink: 0, marginTop: '1px' }} />
            <div>
              <p style={{ fontSize: '12px', color: 'var(--danger)', fontWeight: 500 }}>{error}</p>
              <button
                style={{
                  marginTop: '8px',
                  fontSize: '12px',
                  color: 'var(--danger)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: 0,
                }}
                onClick={handleScore}
              >
                重试
              </button>
            </div>
          </div>
        )}

        {scoreResult && !isLoading && (
          <div>
            {/* 总分 + 雷达图 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '18px' }}>
              <div style={{ textAlign: 'center', flexShrink: 0 }}>
                <ScoreRing score={scoreResult.overallScore} />
                <p style={{ fontSize: '11px', color: 'var(--ink-subtle)', marginTop: '6px', fontWeight: 500 }}>
                  综合评分
                </p>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <RadarChart dimensions={scoreResult.dimensions} />
              </div>
            </div>

            {/* 各维度分数 */}
            <div style={{ marginBottom: '16px' }}>
              {scoreResult.dimensions.map((dimension, dimensionIndex) => (
                <div
                  key={dimensionIndex}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 0',
                    borderBottom: dimensionIndex < scoreResult.dimensions.length - 1 ? '1px solid var(--border-light)' : 'none',
                  }}
                >
                  <span style={{ fontSize: '12px', color: 'var(--ink-light)', width: '72px', flexShrink: 0, fontWeight: 500 }}>
                    {dimension.name}
                  </span>
                  <div
                    style={{
                      flex: 1,
                      height: '6px',
                      background: 'var(--cream)',
                      borderRadius: '3px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${dimension.score}%`,
                        height: '100%',
                        background: dimension.score >= 80
                          ? 'linear-gradient(90deg, #059669, #34d399)'
                          : dimension.score >= 60
                            ? 'linear-gradient(90deg, var(--gold), #e0c882)'
                            : 'linear-gradient(90deg, #dc2626, #f87171)',
                        borderRadius: '3px',
                        transition: 'width 0.6s ease',
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: dimension.score >= 80 ? '#059669' : dimension.score >= 60 ? 'var(--gold)' : '#dc2626',
                      width: '28px',
                      textAlign: 'right',
                    }}
                  >
                    {dimension.score}
                  </span>
                </div>
              ))}
            </div>

            {/* 整体评价 */}
            <div
              style={{
                padding: '12px 14px',
                background: 'var(--cream)',
                borderRadius: '6px',
                marginBottom: '14px',
                border: '1px solid var(--border-light)',
              }}
            >
              <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ink-muted)', marginBottom: '6px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                整体评价
              </p>
              <p style={{ fontSize: '12px', color: 'var(--ink-light)', lineHeight: 1.7 }}>
                {scoreResult.summary}
              </p>
            </div>

            {/* 优化建议 */}
            <div>
              <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ink-muted)', marginBottom: '8px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                优化建议
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {scoreResult.suggestions.map((suggestion, suggestionIndex) => (
                  <div
                    key={suggestionIndex}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                      padding: '8px 12px',
                      background: 'var(--white)',
                      borderRadius: '5px',
                      border: '1px solid var(--border-light)',
                    }}
                  >
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        background: 'var(--gold-glow)',
                        color: 'var(--gold)',
                        fontSize: '10px',
                        fontWeight: 700,
                        flexShrink: 0,
                        marginTop: '1px',
                        border: '1px solid rgba(201, 169, 110, 0.25)',
                      }}
                    >
                      {suggestionIndex + 1}
                    </span>
                    <p style={{ fontSize: '12px', color: 'var(--ink-light)', lineHeight: 1.6 }}>
                      {suggestion}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
