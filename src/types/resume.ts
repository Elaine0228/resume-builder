export interface ResumeBasicInfo {
  name: string;
  phone: string;
  email: string;
  location: string;
  avatar: string;
  linkedin: string;
  github: string;
  website: string;
  title: string;
}

export interface EducationItem {
  id: string;
  school: string;
  degree: string;
  major: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface ProjectItem {
  id: string;
  projectName: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

export type SectionType = 'education' | 'experience' | 'project' | 'skills' | 'summary' | 'custom';

export interface ResumeSection {
  id: string;
  type: SectionType;
  title: string;
  visible: boolean;
  order: number;
  items: EducationItem[] | ExperienceItem[] | ProjectItem[] | string[] | string;
}

export interface ResumeMeta {
  id: string;
  name: string;
  visualTemplateId: string;
  contentTemplateId: string;
  themeColor: string;
  updatedAt: string;
}

export interface ResumeData {
  meta: ResumeMeta;
  basic: ResumeBasicInfo;
  sections: ResumeSection[];
}

export interface VisualTemplate {
  id: string;
  name: string;
  icon: string;
  description: string;
  layout: 'single' | 'double';
  fontFamily: string;
  headerStyle: 'centered' | 'left-aligned' | 'banner';
  colorScheme: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
}

export interface ContentTemplate {
  id: string;
  name: string;
  icon: string;
  description: string;
  sectionOrder: string[];
  sampleData: Partial<ResumeData>;
}
