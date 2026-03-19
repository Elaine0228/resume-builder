import type { ResumeData } from '../types/resume';

const STORAGE_KEY = 'resume-builder-drafts';
const CURRENT_RESUME_KEY = 'resume-builder-current';

export function generateId(): string {
  return `resume-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function saveDraft(resume: ResumeData): void {
  const drafts = getAllDrafts();
  const existingIndex = drafts.findIndex((draft) => draft.meta.id === resume.meta.id);
  const updatedResume = {
    ...resume,
    meta: { ...resume.meta, updatedAt: new Date().toISOString() },
  };

  if (existingIndex >= 0) {
    drafts[existingIndex] = updatedResume;
  } else {
    drafts.push(updatedResume);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
  localStorage.setItem(CURRENT_RESUME_KEY, resume.meta.id);
}

export function getAllDrafts(): ResumeData[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored) as ResumeData[];
  } catch {
    return [];
  }
}

export function getDraft(resumeId: string): ResumeData | null {
  const drafts = getAllDrafts();
  return drafts.find((draft) => draft.meta.id === resumeId) ?? null;
}

export function deleteDraft(resumeId: string): void {
  const drafts = getAllDrafts().filter((draft) => draft.meta.id !== resumeId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
}

export function getCurrentResumeId(): string | null {
  return localStorage.getItem(CURRENT_RESUME_KEY);
}

export function setCurrentResumeId(resumeId: string): void {
  localStorage.setItem(CURRENT_RESUME_KEY, resumeId);
}

export function encodeResumeForShare(resume: ResumeData): string {
  const jsonString = JSON.stringify(resume);
  const encoded = btoa(unescape(encodeURIComponent(jsonString)));
  return `${window.location.origin}${window.location.pathname}?share=${encoded}`;
}

export function decodeResumeFromShare(encodedData: string): ResumeData | null {
  try {
    const jsonString = decodeURIComponent(escape(atob(encodedData)));
    return JSON.parse(jsonString) as ResumeData;
  } catch {
    return null;
  }
}

export function getShareDataFromUrl(): string | null {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('share');
}
