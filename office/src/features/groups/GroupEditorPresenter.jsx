import { CreateGroupWizard } from '@/features/groups/components/CreateGroupWizard'
import { EditGroupSheet } from '@/features/groups/components/EditGroupSheet'

export function GroupEditorPresenter({
  editorState,
  isCreateMode,
  editorTitle,
  createStep,
  createStepLabel,
  createForm,
  createErrors,
  saving,
  deleting,
  sortedDistricts,
  currentEditorGroup,
  onClose,
  onUpdateField,
  onNext,
  onPrevious,
  onResetPostal,
  onCompleteCreate,
  onGroupSaved,
  onError,
  onSuccess,
}) {
  if (!editorState.open) return null

  return (
    <div 
      className="office-overlay"
      onClick={onClose}
    >
      <section
        aria-labelledby="group-editor-title"
        aria-modal="true"
        className={`office-overlay__dialog office-overlay__dialog--wide office-overlay__dialog--editor${
          isCreateMode ? ' office-overlay__dialog--editor-create' : ''
        }`}
        role="dialog"
        onClick={(e) => e.stopPropagation()}
      >
        {isCreateMode ? (
          <header className="office-group-modal__header">
            <div className="office-overlay__heading">
              <h2 id="group-editor-title">{editorTitle}</h2>
              <p className="office-group-wizard__progress">
                {createStep} / 2 · {createStepLabel}
              </p>
            </div>

            <button
              className="ghost-button ghost-button--small"
              type="button"
              onClick={onClose}
              disabled={saving || deleting}
            >
              취소
            </button>
          </header>
        ) : null}

        <div className="office-group-modal__body">
          {isCreateMode ? (
            <CreateGroupWizard
              createErrors={createErrors}
              createForm={createForm}
              createStep={createStep}
              saving={saving}
              sortedDistricts={sortedDistricts}
              onFieldChange={onUpdateField}
              onNext={onNext}
              onPrevious={onPrevious}
              onResetPostalContactInfo={onResetPostal}
              onSubmit={onCompleteCreate}
            />
          ) : (
            <EditGroupSheet
              group={currentEditorGroup}
              onError={onError}
              onGroupSaved={onGroupSaved}
              onClose={onClose}
              onSuccess={onSuccess}
              sortedDistricts={sortedDistricts}
            />
          )}
        </div>
      </section>
    </div>
  )
}
