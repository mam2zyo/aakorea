import {
  AdminPageHeader,
  EmptyState,
  PageSection,
} from '../../components/ui'
import { GroupBasicsCard } from '../../features/groups/admin/components/GroupBasicsCard'
import { GroupContactsCard } from '../../features/groups/admin/components/GroupContactsCard'
import { GroupMeetingsCard } from '../../features/groups/admin/components/GroupMeetingsCard'
import { useGroupWorkspace } from '../../features/groups/admin/hooks/useGroupWorkspace'

export function GroupEditorPage({ groupId, onError, onNavigate, onSuccess }) {
  const workspace = useGroupWorkspace({ groupId, onError, onSuccess })
  const {
    districts,
    groupData,
    groupContacts,
    meetings,
    groupForm,
    contactForm,
    meetingForm,
    groupErrors,
    contactErrors,
    meetingErrors,
    loading,
    missingGroup,
    saveGroup,
    saveContact,
    saveMeeting,
    startNewContact,
    startEditContact,
    startNewMeeting,
    startEditMeeting,
    updateGroupField,
    updateContactField,
    updateMeetingField,
    updateMeetingActive,
  } = workspace

  if (missingGroup) {
    return (
      <PageSection
        label="Group Editor"
        title="요청한 Group을 찾지 못했습니다."
        description="목록에서 다시 Group을 선택해 주세요."
      >
        <EmptyState
          title="Group 데이터가 없습니다."
          description="Group 목록 화면으로 돌아가 다시 선택해 주세요."
        />
        <div className="button-row">
          <button
            className="ghost-button"
            type="button"
            onClick={() => onNavigate('/admin/groups')}
          >
            Group 목록으로 이동
          </button>
        </div>
      </PageSection>
    )
  }

  return (
    <>
      <AdminPageHeader
        eyebrow="Group Workspace"
        title={groupData ? `${groupData.name} 작업공간` : 'Group 작업공간'}
        description="Group 기본 정보, 연락처, 모임 일정을 같은 화면에서 이어서 수정합니다."
        actions={
          <button
            className="ghost-button"
            type="button"
            onClick={() => onNavigate('/admin/groups')}
          >
            Group 목록으로 돌아가기
          </button>
        }
      />

      <PageSection
        label="Group Editor"
        title="Group 중심으로 공개 운영 정보를 관리합니다."
        description="기본 장소와 안내 문구는 Group에 두고, Meeting은 요일/시간과 예외 장소 안내만 관리하는 구조로 정리했습니다."
      >
        {loading ? <div className="section-note">Group 작업공간을 불러오는 중입니다...</div> : null}

        <div className="editor-grid">
          <GroupBasicsCard
            districts={districts}
            errors={groupErrors}
            form={groupForm}
            onFieldChange={updateGroupField}
            onSubmit={saveGroup}
          />

          <GroupContactsCard
            contacts={groupContacts}
            errors={contactErrors}
            form={contactForm}
            onEdit={startEditContact}
            onFieldChange={updateContactField}
            onStartNew={startNewContact}
            onSubmit={saveContact}
          />

          <GroupMeetingsCard
            errors={meetingErrors}
            form={meetingForm}
            meetings={meetings}
            onActiveChange={updateMeetingActive}
            onEdit={startEditMeeting}
            onFieldChange={updateMeetingField}
            onStartNew={startNewMeeting}
            onSubmit={saveMeeting}
          />
        </div>
      </PageSection>
    </>
  )
}
