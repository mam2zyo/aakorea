import { useEffect, useEffectEvent, useState } from 'react';
import { getApiFieldErrors, omitFieldErrors } from '@/shared/api';
import { formatKoreanPhoneNumber, normalizePhoneFieldValue } from '@/shared/utils/phone';
import { DAY_OF_WEEK_OPTIONS, MEETING_TYPE_OPTIONS } from '@/shared/constants/options';
import { groupApi, groupContactApi, meetingApi } from '@/shared/api';
import { toPostalContactPayload } from '../utils';
import type { Group, GroupContact, Meeting } from '../types';

// ── 폼 초기값 ──────────────────────────────────────────────

const EMPTY_CONTACT_FORM = {
  id: null as number | null,
  phone: '',
  email: '',
  postalRecipient: '',
  postalCode: '',
  postalRoadAddress: '',
  postalDetailAddress: '',
};

const EMPTY_MEETING_FORM = {
  id: null as number | null,
  locationDetail: '',
  locationAddress: '',
  contactPhoneOverride: '',
  dayOfWeek: DAY_OF_WEEK_OPTIONS[0]?.value ?? 'MONDAY',
  startTime: '19:00',
  type: MEETING_TYPE_OPTIONS[0]?.value ?? 'OPEN',
  active: true,
};

// ── 타입 ────────────────────────────────────────────────────

interface UseGroupEditorParams {
  group: Group | null;
  onError: (error: unknown, fallback?: string) => void;
  onGroupSaved?: (group: Group) => void;
  onSuccess: (message: string) => void;
}

export function useGroupEditor({ group, onError, onGroupSaved, onSuccess }: UseGroupEditorParams) {
  const groupId = group?.id ?? null;

  const [groupContacts, setGroupContacts] = useState<GroupContact[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [groupForm, setGroupForm] = useState(toGroupForm(group));
  const [contactForm, setContactForm] = useState(EMPTY_CONTACT_FORM);
  const [meetingForm, setMeetingForm] = useState(EMPTY_MEETING_FORM);
  const [groupErrors, setGroupErrors] = useState<Record<string, string>>({});
  const [contactErrors, setContactErrors] = useState<Record<string, string>>({});
  const [meetingErrors, setMeetingErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const [prevGroup, setPrevGroup] = useState(group);

  if (group !== prevGroup) {
    setPrevGroup(group);
    setGroupForm(toGroupForm(group));
    setGroupErrors({});
    setContactErrors({});
    setMeetingErrors({});
  }

  async function loadEditorData() {
    if (!Number.isFinite(groupId)) {
      setLoading(false);
      setGroupContacts([]);
      setMeetings([]);
      setContactForm(EMPTY_CONTACT_FORM);
      setMeetingForm(EMPTY_MEETING_FORM);
      return;
    }

    try {
      const [contactData, meetingData] = await Promise.all([
        groupContactApi.getGroupContacts(groupId!) as unknown as Promise<GroupContact[]>,
        meetingApi.getMeetings({ groupId: groupId! }) as unknown as Promise<Meeting[]>,
      ]);

      setGroupContacts(contactData);
      setMeetings(meetingData);
      setContactForm(contactData[0] ? toContactForm(contactData[0]) : EMPTY_CONTACT_FORM);
      setMeetingForm(meetingData[0] ? toMeetingForm(meetingData[0]) : EMPTY_MEETING_FORM);
    } catch (error) {
      onError(error, '그룹 편집 정보를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }

  const loadEditorDataEffect = useEffectEvent(() => {
    void loadEditorData();
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      loadEditorDataEffect();
    }, 0);
    return () => clearTimeout(timer);
  }, [groupId]);

  async function saveGroup(): Promise<boolean> {
    if (!groupId) return false;

    try {
      const updatedGroup = (await groupApi.updateGroup(groupId, {
        districtId: Number(groupForm.districtId),
        name: groupForm.name,
        notice: groupForm.notice,
      })) as unknown as Group;

      onGroupSaved?.(updatedGroup);
      setGroupForm(toGroupForm(updatedGroup));
      setGroupErrors({});
      onSuccess('그룹 기본 정보를 저장했습니다.');
      return true;
    } catch (error) {
      const fieldErrors = getApiFieldErrors(error);
      if (fieldErrors) {
        setGroupErrors(fieldErrors);
        return false;
      }
      setGroupErrors({});
      onError(error, '그룹 기본 정보 저장에 실패했습니다.');
      return false;
    }
  }

  async function saveContact(): Promise<boolean> {
    if (!groupId) return false;

    try {
      const savedContact = (contactForm.id
        ? await groupContactApi.updateGroupContact(contactForm.id, {
          phone: contactForm.phone,
          email: contactForm.email,
          postalContact: toPostalContactPayload(contactForm),
        })
        : await groupContactApi.createGroupContact({
          groupId,
          phone: contactForm.phone,
          email: contactForm.email,
          postalContact: toPostalContactPayload(contactForm),
        })) as unknown as GroupContact;

      setContactErrors({});
      setContactForm(toContactForm(savedContact));
      setGroupContacts((previous) =>
        mergeById(previous, savedContact).sort((left, right) => left.id - right.id),
      );
      onSuccess(contactForm.id ? '연락처를 수정했습니다.' : '연락처를 추가했습니다.');
      return true;
    } catch (error) {
      const fieldErrors = getApiFieldErrors(error);
      if (fieldErrors) {
        setContactErrors(fieldErrors);
        return false;
      }
      setContactErrors({});
      onError(error, '연락처 저장에 실패했습니다.');
      return false;
    }
  }

  async function saveMeeting(): Promise<boolean> {
    if (!groupId) return false;

    try {
      const payload = {
        groupId,
        locationDetail: meetingForm.locationDetail,
        locationAddress: meetingForm.locationAddress,
        contactPhoneOverride: meetingForm.contactPhoneOverride,
        dayOfWeek: meetingForm.dayOfWeek,
        startTime: meetingForm.startTime,
        type: meetingForm.type,
        active: meetingForm.active,
      };

      const savedMeeting = (meetingForm.id
        ? await meetingApi.updateMeeting(meetingForm.id, payload)
        : await meetingApi.createMeeting(payload)) as unknown as Meeting;

      setMeetingErrors({});
      setMeetingForm(toMeetingForm(savedMeeting));
      setMeetings((previous) =>
        mergeById(previous, savedMeeting).sort((left, right) => left.id - right.id),
      );
      onSuccess(meetingForm.id ? '모임을 수정했습니다.' : '모임을 추가했습니다.');
      return true;
    } catch (error) {
      const fieldErrors = getApiFieldErrors(error);
      if (fieldErrors) {
        setMeetingErrors(fieldErrors);
        return false;
      }
      setMeetingErrors({});
      onError(error, '모임 저장에 실패했습니다.');
      return false;
    }
  }

  async function deleteMeeting(meetingId: number): Promise<boolean> {
    try {
      await meetingApi.deleteMeeting(meetingId);
      const remainingMeetings = meetings.filter((meeting) => meeting.id !== meetingId);

      setMeetings(remainingMeetings);
      if (meetingForm.id === meetingId) {
        setMeetingForm(remainingMeetings[0] ? toMeetingForm(remainingMeetings[0]) : EMPTY_MEETING_FORM);
      }
      setMeetingErrors({});
      onSuccess('모임을 삭제했습니다.');
      return true;
    } catch (error) {
      onError(error, '모임 삭제에 실패했습니다.');
      return false;
    }
  }

  function startNewContact() {
    setContactForm(EMPTY_CONTACT_FORM);
    setContactErrors({});
  }

  function startEditContact(contact: GroupContact) {
    setContactForm(toContactForm(contact));
    setContactErrors({});
  }

  function startNewMeeting() {
    const sourceMeeting = hasMeetingLocation(meetingForm as Record<string, unknown>) ? meetingForm : (meetings[0] as unknown as Partial<typeof EMPTY_MEETING_FORM>) ?? {};
    setMeetingForm(createMeetingFormDefaults(sourceMeeting));
    setMeetingErrors({});
  }

  function startEditMeeting(meeting: Meeting) {
    setMeetingForm(toMeetingForm(meeting));
    setMeetingErrors({});
  }

  function updateGroupField(field: string, value: string) {
    setGroupForm((previous) => ({ ...previous, [field]: value }));
    setGroupErrors((previous) => omitFieldErrors(previous, field));
  }

  function updateContactField(field: string, value: string) {
    const nextValue = (field === 'phone') ? normalizePhoneFieldValue(value) : value;
    setContactForm((previous) => ({ ...previous, [field]: nextValue }));
    setContactErrors((previous) => omitFieldErrors(previous, field));
  }

  function updateMeetingField(field: string, value: string) {
    const nextValue = (field === 'contactPhoneOverride') ? normalizePhoneFieldValue(value) : value;
    setMeetingForm((previous) => ({ ...previous, [field]: nextValue }));
    setMeetingErrors((previous) => omitFieldErrors(previous, field));
  }

  function updateMeetingActive(active: boolean) {
    setMeetingForm((previous) => ({ ...previous, active }));
  }

  function resetGroupForm() {
    setGroupForm(toGroupForm(group));
    setGroupErrors({});
  }

  return {
    groupContacts,
    meetings,
    groupForm,
    contactForm,
    meetingForm,
    groupErrors,
    contactErrors,
    meetingErrors,
    loading,
    saveGroup,
    saveContact,
    saveMeeting,
    deleteMeeting,
    startNewContact,
    startEditContact,
    startNewMeeting,
    startEditMeeting,
    updateGroupField,
    updateContactField,
    updateMeetingField,
    updateMeetingActive,
    resetGroupForm,
  };
}

// ── 내부 헬퍼 함수 ────────────────────────────────────────

function toGroupForm(group: Group | null) {
  return {
    districtId: group ? String(group.districtId) : '',
    name: group?.name ?? '',
    notice: group?.notice ?? '',
  };
}

function toContactForm(contact: GroupContact) {
  return {
    id: contact.id,
    phone: formatKoreanPhoneNumber(contact.phone),
    email: contact.email ?? '',
    postalRecipient: contact.postalContact?.recipient ?? '',
    postalCode: contact.postalContact?.postalCode ?? '',
    postalRoadAddress: contact.postalContact?.roadAddress ?? '',
    postalDetailAddress: contact.postalContact?.detailAddress ?? '',
  };
}

function toMeetingForm(meeting: Meeting) {
  return {
    id: meeting.id,
    locationDetail: meeting.locationDetail ?? '',
    locationAddress: meeting.locationAddress ?? '',
    contactPhoneOverride: formatKoreanPhoneNumber(meeting.contactPhoneOverride),
    dayOfWeek: meeting.dayOfWeek ?? EMPTY_MEETING_FORM.dayOfWeek,
    startTime: meeting.startTime ?? EMPTY_MEETING_FORM.startTime,
    type: meeting.type ?? EMPTY_MEETING_FORM.type,
    active: meeting.active ?? EMPTY_MEETING_FORM.active,
  };
}

function createMeetingFormDefaults(source: Partial<typeof EMPTY_MEETING_FORM> = {}) {
  return {
    ...EMPTY_MEETING_FORM,
    locationDetail: source.locationDetail ?? '',
    locationAddress: source.locationAddress ?? '',
  };
}

function hasMeetingLocation(meeting: Record<string, unknown>): boolean {
  return Boolean(meeting.locationDetail || meeting.locationAddress);
}

function mergeById<T extends { id: number }>(items: T[], savedItem: T): T[] {
  const existingIndex = items.findIndex((item) => item.id === savedItem.id);
  if (existingIndex === -1) return [...items, savedItem];
  const nextItems = [...items];
  nextItems[existingIndex] = savedItem;
  return nextItems;
}
