import type { ResumeData, EducationItem, ExperienceItem, ProjectItem } from '../types/resume';
import { visualTemplates } from '../data/visualTemplates';

interface PreviewPanelProps {
  resume: ResumeData;
}

export default function PreviewPanel({ resume }: PreviewPanelProps) {
  const visualTemplate = visualTemplates.find(
    (template) => template.id === resume.meta.visualTemplateId
  ) ?? visualTemplates[0];

  const colors = resume.meta.themeColor
    ? { ...visualTemplate.colorScheme, accent: resume.meta.themeColor, primary: resume.meta.themeColor }
    : visualTemplate.colorScheme;

  const sortedSections = [...resume.sections]
    .filter((section) => section.visible)
    .sort((sectionA, sectionB) => sectionA.order - sectionB.order);

  const isDoubleColumn = visualTemplate.layout === 'double';

  const renderHeader = () => {
    const { basic } = resume;
    const contactItems = [
      basic.phone && `📱 ${basic.phone}`,
      basic.email && `✉️ ${basic.email}`,
      basic.location && `📍 ${basic.location}`,
    ].filter(Boolean);

    const linkItems = [
      basic.github && `GitHub: ${basic.github}`,
      basic.linkedin && `LinkedIn: ${basic.linkedin}`,
      basic.website && `🌐 ${basic.website}`,
    ].filter(Boolean);

    if (visualTemplate.headerStyle === 'banner') {
      return (
        <div
          style={{
            backgroundColor: colors.primary,
            color: '#ffffff',
            padding: '24px 28px',
            margin: '-20mm -18mm 20px -18mm',
            borderRadius: '0',
          }}
        >
          <h1 style={{ fontSize: '22pt', fontWeight: 700, marginBottom: '4px' }}>
            {basic.name || '你的姓名'}
          </h1>
          {basic.title && (
            <p style={{ fontSize: '12pt', opacity: 0.9, marginBottom: '8px' }}>{basic.title}</p>
          )}
          <div style={{ fontSize: '9pt', opacity: 0.85, display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {contactItems.map((item, index) => (
              <span key={index}>{item}</span>
            ))}
          </div>
          {linkItems.length > 0 && (
            <div style={{ fontSize: '8pt', opacity: 0.75, marginTop: '4px', display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {linkItems.map((item, index) => (
                <span key={index}>{item}</span>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (visualTemplate.headerStyle === 'centered') {
      return (
        <div style={{ textAlign: 'center', marginBottom: '20px', paddingBottom: '16px', borderBottom: `2px solid ${colors.accent}` }}>
          <h1 style={{ fontSize: '22pt', fontWeight: 700, color: colors.primary, marginBottom: '4px' }}>
            {basic.name || '你的姓名'}
          </h1>
          {basic.title && (
            <p style={{ fontSize: '11pt', color: colors.secondary, marginBottom: '8px' }}>{basic.title}</p>
          )}
          <div style={{ fontSize: '9pt', color: colors.secondary, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '12px' }}>
            {contactItems.map((item, index) => (
              <span key={index}>{item}</span>
            ))}
          </div>
          {linkItems.length > 0 && (
            <div style={{ fontSize: '8pt', color: colors.secondary, marginTop: '4px', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '12px' }}>
              {linkItems.map((item, index) => (
                <span key={index}>{item}</span>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: `2px solid ${colors.accent}` }}>
        <h1 style={{ fontSize: '22pt', fontWeight: 700, color: colors.primary, marginBottom: '4px' }}>
          {basic.name || '你的姓名'}
        </h1>
        {basic.title && (
          <p style={{ fontSize: '11pt', color: colors.secondary, marginBottom: '8px' }}>{basic.title}</p>
        )}
        <div style={{ fontSize: '9pt', color: colors.secondary, display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          {contactItems.map((item, index) => (
            <span key={index}>{item}</span>
          ))}
        </div>
        {linkItems.length > 0 && (
          <div style={{ fontSize: '8pt', color: colors.secondary, marginTop: '4px', display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {linkItems.map((item, index) => (
              <span key={index}>{item}</span>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderSectionTitle = (title: string) => (
    <h2
      style={{
        fontSize: '13pt',
        fontWeight: 700,
        color: colors.primary,
        marginBottom: '12px',
        paddingBottom: '8px',
        borderBottom: `1.5px solid ${colors.accent}`,
      }}
    >
      {title}
    </h2>
  );

  const renderEducation = (items: EducationItem[]) => (
    <div>
      {items.map((item) => (
        <div key={item.id} style={{ marginBottom: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontWeight: 600, fontSize: '10.5pt', color: colors.text }}>
              {item.school}
            </span>
            <span style={{ fontSize: '9pt', color: colors.secondary }}>
              {item.startDate} - {item.endDate}
            </span>
          </div>
          <div style={{ fontSize: '9.5pt', color: colors.secondary, marginTop: '2px' }}>
            {item.degree} · {item.major}
          </div>
          {item.description && (
            <p style={{ fontSize: '9pt', color: colors.text, marginTop: '4px', whiteSpace: 'pre-wrap' }}>
              {item.description}
            </p>
          )}
        </div>
      ))}
    </div>
  );

  const renderExperience = (items: ExperienceItem[]) => (
    <div>
      {items.map((item) => (
        <div key={item.id} style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontWeight: 600, fontSize: '10.5pt', color: colors.text }}>
              {item.company}
            </span>
            <span style={{ fontSize: '9pt', color: colors.secondary }}>
              {item.startDate} - {item.endDate}
            </span>
          </div>
          <div style={{ fontSize: '9.5pt', color: colors.accent, fontWeight: 500, marginTop: '2px' }}>
            {item.position}
          </div>
          {item.description && (
            <p style={{ fontSize: '9pt', color: colors.text, marginTop: '4px', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
              {item.description}
            </p>
          )}
        </div>
      ))}
    </div>
  );

  const renderProject = (items: ProjectItem[]) => (
    <div>
      {items.map((item) => (
        <div key={item.id} style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontWeight: 600, fontSize: '10.5pt', color: colors.text }}>
              {item.projectName}
            </span>
            <span style={{ fontSize: '9pt', color: colors.secondary }}>
              {item.startDate} - {item.endDate}
            </span>
          </div>
          {item.role && (
            <div style={{ fontSize: '9.5pt', color: colors.accent, fontWeight: 500, marginTop: '2px' }}>
              {item.role}
            </div>
          )}
          {item.description && (
            <p style={{ fontSize: '9pt', color: colors.text, marginTop: '4px', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
              {item.description}
            </p>
          )}
        </div>
      ))}
    </div>
  );

  const renderSkills = (items: string[]) => (
    <p style={{ fontSize: '9.5pt', color: colors.text, lineHeight: 1.8 }}>
      {items.join('、')}
    </p>
  );

  const renderSummary = (text: string) => (
    <p style={{ fontSize: '9.5pt', color: colors.text, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
      {text}
    </p>
  );

  const renderSectionContent = (section: typeof sortedSections[0]) => {
    switch (section.type) {
      case 'education':
        return renderEducation(section.items as EducationItem[]);
      case 'experience':
        return renderExperience(section.items as ExperienceItem[]);
      case 'project':
        return renderProject(section.items as ProjectItem[]);
      case 'skills':
        return renderSkills(section.items as string[]);
      case 'summary':
      case 'custom':
        return renderSummary(section.items as string);
      default:
        return null;
    }
  };

  if (isDoubleColumn) {
    const skillsAndSummary = sortedSections.filter(
      (section) => section.type === 'skills' || section.type === 'summary'
    );
    const mainSections = sortedSections.filter(
      (section) => section.type !== 'skills' && section.type !== 'summary'
    );

    return (
      <div className="preview-panel">
        <div
          id="resume-preview"
          className="a4-page"
          style={{
            fontFamily: visualTemplate.fontFamily,
            backgroundColor: colors.background,
            color: colors.text,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {renderHeader()}
          <div style={{ display: 'flex', gap: '24px', flex: 1 }}>
            <div style={{ width: '30%', borderRight: `1px solid ${colors.accent}20`, paddingRight: '16px' }}>
              {skillsAndSummary.map((section) => (
                <div key={section.id} style={{ marginBottom: '20px' }}>
                  {renderSectionTitle(section.title)}
                  {renderSectionContent(section)}
                </div>
              ))}
            </div>
            <div style={{ width: '70%' }}>
              {mainSections.map((section) => (
                <div key={section.id} style={{ marginBottom: '20px' }}>
                  {renderSectionTitle(section.title)}
                  {renderSectionContent(section)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="preview-panel">
      <div
        id="resume-preview"
        className="a4-page"
        style={{
          fontFamily: visualTemplate.fontFamily,
          backgroundColor: colors.background,
          color: colors.text,
        }}
      >
        {renderHeader()}
        {sortedSections.map((section) => (
          <div key={section.id} style={{ marginBottom: '20px' }}>
            {renderSectionTitle(section.title)}
            {renderSectionContent(section)}
          </div>
        ))}
      </div>
    </div>
  );
}
