import { useResume } from './hooks/useResume';
import TopNav from './components/TopNav';
import EditorPanel from './components/EditorPanel';
import PreviewPanel from './components/PreviewPanel';
import TemplateSelector from './components/TemplateSelector';
import ResumeScorePanel from './components/ResumeScorePanel';

function App() {
  const {
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
  } = useResume();

  if (showTemplateSelector || !resume) {
    return (
      <div
        className="h-full w-full flex items-center justify-center"
        style={{
          background: 'linear-gradient(145deg, #faf9f7 0%, #f0ede8 40%, #e8e4dc 100%)',
          backgroundImage: `
            radial-gradient(circle at 15% 85%, rgba(201, 169, 110, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 85% 15%, rgba(26, 26, 46, 0.04) 0%, transparent 50%)
          `,
        }}
      >
        <TemplateSelector
          onSelect={createNewResume}
          onClose={resume ? () => setShowTemplateSelector(false) : undefined}
          showClose={!!resume}
        />
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col">
      <TopNav
        resume={resume}
        drafts={drafts}
        onChangeVisualTemplate={changeVisualTemplate}
        onChangeThemeColor={changeThemeColor}
        onSwitchResume={switchResume}
        onNewResume={() => setShowTemplateSelector(true)}
        onDeleteDraft={removeDraft}
      />
      <div className="flex flex-1 overflow-hidden">
        <EditorPanel
          resume={resume}
          onUpdateBasic={updateBasic}
          onUpdateSection={updateSection}
          onAddSection={addSection}
          onRemoveSection={removeSection}
          onMoveSection={moveSection}
          lastRemovedSection={lastRemovedSection}
          onUndoRemove={undoRemoveSection}
          onDismissUndo={dismissUndo}
        />
        <PreviewPanel resume={resume} />
      </div>
      <ResumeScorePanel resume={resume} />
    </div>
  );
}

export default App
