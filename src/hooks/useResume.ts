import { useState, useCallback, useEffect, useRef } from 'react';
import type { ResumeData, ResumeSection, ResumeBasicInfo } from '../types/resume';
import { saveDraft, getAllDrafts, getDraft, deleteDraft, getCurrentResumeId, setCurrentResumeId, getShareDataFromUrl, decodeResumeFromShare } from '../utils/storage';
import { createEmptyResume } from '../data/contentTemplates';

interface RemovedSectionRecord {
  section: ResumeSection;
  resumeId: string;
}

export function useResume() {
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [drafts, setDrafts] = useState<ResumeData[]>([]);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [lastRemovedSection, setLastRemovedSection] = useState<RemovedSectionRecord | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const undoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const shareData = getShareDataFromUrl();
    if (shareData) {
      const sharedResume = decodeResumeFromShare(shareData);
      if (sharedResume) {
        setResume(sharedResume);
        window.history.replaceState({}, '', window.location.pathname);
        return;
      }
    }

    const allDrafts = getAllDrafts();
    setDrafts(allDrafts);

    const currentId = getCurrentResumeId();
    if (currentId) {
      const currentDraft = getDraft(currentId);
      if (currentDraft) {
        setResume(currentDraft);
        return;
      }
    }

    if (allDrafts.length > 0) {
      setResume(allDrafts[0]);
      setCurrentResumeId(allDrafts[0].meta.id);
    } else {
      setShowTemplateSelector(true);
    }
  }, []);

  const autoSave = useCallback((updatedResume: ResumeData) => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }
    saveTimerRef.current = setTimeout(() => {
      saveDraft(updatedResume);
      setDrafts(getAllDrafts());
    }, 500);
  }, []);

  const updateBasic = useCallback((field: keyof ResumeBasicInfo, value: string) => {
    setResume((prev) => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        basic: { ...prev.basic, [field]: value },
      };
      autoSave(updated);
      return updated;
    });
  }, [autoSave]);

  const updateSection = useCallback((sectionId: string, updatedSection: Partial<ResumeSection>) => {
    setResume((prev) => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        sections: prev.sections.map((section) =>
          section.id === sectionId ? { ...section, ...updatedSection } : section
        ),
      };
      autoSave(updated);
      return updated;
    });
  }, [autoSave]);

  const addSection = useCallback((type: ResumeSection['type'], title: string) => {
    setResume((prev) => {
      if (!prev) return prev;
      const newSection: ResumeSection = {
        id: `${type}-${Date.now()}`,
        type,
        title,
        visible: true,
        order: prev.sections.length,
        items: type === 'skills' ? [] : type === 'summary' ? '' : [],
      };
      const updated = {
        ...prev,
        sections: [...prev.sections, newSection],
      };
      autoSave(updated);
      return updated;
    });
  }, [autoSave]);

  const removeSection = useCallback((sectionId: string) => {
    setResume((prev) => {
      if (!prev) return prev;
      const removedSection = prev.sections.find((section) => section.id === sectionId);
      if (removedSection) {
        setLastRemovedSection({ section: removedSection, resumeId: prev.meta.id });
        if (undoTimerRef.current) {
          clearTimeout(undoTimerRef.current);
        }
        undoTimerRef.current = setTimeout(() => {
          setLastRemovedSection(null);
        }, 8000);
      }
      const updated = {
        ...prev,
        sections: prev.sections
          .filter((section) => section.id !== sectionId)
          .map((section, index) => ({ ...section, order: index })),
      };
      autoSave(updated);
      return updated;
    });
  }, [autoSave]);

  const undoRemoveSection = useCallback(() => {
    if (!lastRemovedSection) return;
    setResume((prev) => {
      if (!prev || prev.meta.id !== lastRemovedSection.resumeId) return prev;
      const restoredSection = {
        ...lastRemovedSection.section,
        order: prev.sections.length,
      };
      const updated = {
        ...prev,
        sections: [...prev.sections, restoredSection],
      };
      autoSave(updated);
      return updated;
    });
    setLastRemovedSection(null);
    if (undoTimerRef.current) {
      clearTimeout(undoTimerRef.current);
    }
  }, [lastRemovedSection, autoSave]);

  const dismissUndo = useCallback(() => {
    setLastRemovedSection(null);
    if (undoTimerRef.current) {
      clearTimeout(undoTimerRef.current);
    }
  }, []);

  const moveSection = useCallback((sectionId: string, direction: 'up' | 'down') => {
    setResume((prev) => {
      if (!prev) return prev;
      const sections = [...prev.sections];
      const currentIndex = sections.findIndex((section) => section.id === sectionId);
      if (currentIndex < 0) return prev;

      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (targetIndex < 0 || targetIndex >= sections.length) return prev;

      [sections[currentIndex], sections[targetIndex]] = [sections[targetIndex], sections[currentIndex]];
      const reorderedSections = sections.map((section, index) => ({ ...section, order: index }));

      const updated = { ...prev, sections: reorderedSections };
      autoSave(updated);
      return updated;
    });
  }, [autoSave]);

  const createNewResume = useCallback((contentTemplateId: string, visualTemplateId: string) => {
    const newResume = createEmptyResume(contentTemplateId, visualTemplateId);
    setResume(newResume);
    saveDraft(newResume);
    setCurrentResumeId(newResume.meta.id);
    setDrafts(getAllDrafts());
    setShowTemplateSelector(false);
  }, []);

  const switchResume = useCallback((resumeId: string) => {
    const draft = getDraft(resumeId);
    if (draft) {
      setResume(draft);
      setCurrentResumeId(resumeId);
    }
  }, []);

  const removeDraft = useCallback((resumeId: string) => {
    deleteDraft(resumeId);
    const remaining = getAllDrafts();
    setDrafts(remaining);

    if (resume?.meta.id === resumeId) {
      if (remaining.length > 0) {
        setResume(remaining[0]);
        setCurrentResumeId(remaining[0].meta.id);
      } else {
        setResume(null);
        setShowTemplateSelector(true);
      }
    }
  }, [resume]);

  const changeVisualTemplate = useCallback((templateId: string) => {
    setResume((prev) => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        meta: { ...prev.meta, visualTemplateId: templateId },
      };
      autoSave(updated);
      return updated;
    });
  }, [autoSave]);

  const changeThemeColor = useCallback((color: string) => {
    setResume((prev) => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        meta: { ...prev.meta, themeColor: color },
      };
      autoSave(updated);
      return updated;
    });
  }, [autoSave]);

  return {
    resume,
    drafts,
    showTemplateSelector,
    setShowTemplateSelector,
    lastRemovedSection,
    updateBasic,
    updateSection,
    addSection,
    removeSection,
    undoRemoveSection,
    dismissUndo,
    moveSection,
    createNewResume,
    switchResume,
    removeDraft,
    changeVisualTemplate,
    changeThemeColor,
  };
}
