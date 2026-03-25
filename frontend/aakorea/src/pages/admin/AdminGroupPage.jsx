import { useEffect, useMemo, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { fetchAdminDistricts } from '../../api/districts'
import { createAdminGsr, deleteAdminGsr, fetchAdminGsrs, updateAdminGsr } from '../../api/gsrs'
import {
  createAdminGroupNotice,
  deleteAdminGroupNotice,
  fetchAdminGroupNotices,
  updateAdminGroupNotice,
} from '../../api/notices'
import {
  createAdminGroup,
  createAdminGroupMeeting,
  deleteAdminGroup,
  deleteAdminGroupMeeting,
  fetchAdminGroupMeetings,
  fetchAdminGroups,
  updateAdminGroup,
  updateAdminGroupMeeting,
} from '../../api/groups'
import { DAY_OF_WEEKS, MEETING_STATUSES, MEETING_TYPES, NOTICE_TYPES, PROVINCES } from '../../utils/constants'

const initialFormState = {
  name: '',
  startDate: '',
  province: 'SEOUL',
  districtId: '',
  gsrId: '',
  contactAddress: '',
  contactEmail: '',
  contactPhone: '',
  meetingRoadAddress: '',
  meetingDetailAddress: '',
  meetingGuide: '',
}

const initialMeetingFormState = {
  dayOfWeek: 'MONDAY',
  startTime: '19:00',
  meetingType: 'OPEN',
  status: 'ACTIVE',
  meetingRoadAddress: '',
  meetingDetailAddress: '',
  meetingGuide: '',
  meetingLatitude: '',
  meetingLongitude: '',
}

const initialNoticeFormState = {
  title: '',
  content: '',
  type: 'GENERAL',
  published: true,
  displayStartAt: '',
  displayEndAt: '',
}

const initialGsrFormState = { nickname: '', phone: '', mailingAddress: '', email: '' }

function toDateTimeLocalValue(value) {
  if (!value) return ''
  return String(value).slice(0, 16)
}

export default function AdminGroupPage() {
  const [tab, setTab] = useState('groups')
  const [groups, setGroups] = useState([])
  const [districts, setDistricts] = useState([])
  const [gsrs, setGsrs] = useState([])
  const [meetings, setMeetings] = useState([])
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(initialFormState)

  const [meetingForm, setMeetingForm] = useState(initialMeetingFormState)
  const [meetingEditingId, setMeetingEditingId] = useState(null)
  const [meetingSubmitting, setMeetingSubmitting] = useState(false)
  const [meetingDeletingId, setMeetingDeletingId] = useState(null)

  const [noticeForm, setNoticeForm] = useState(initialNoticeFormState)
  const [noticeEditingId, setNoticeEditingId] = useState(null)
  const [noticeSubmitting, setNoticeSubmitting] = useState(false)
  const [noticeDeletingId, setNoticeDeletingId] = useState(null)

  const [gsrForm, setGsrForm] = useState(initialGsrFormState)
  const [gsrEditingId, setGsrEditingId] = useState(null)

  async function loadData() {
    setLoading(true)
    setError('')

    try {
      const [groupResponse, districtResponse, gsrResponse] = await Promise.all([
        fetchAdminGroups(),
        fetchAdminDistricts(),
        fetchAdminGsrs(),
      ])
      setGroups(groupResponse.groups || [])
      setDistricts(districtResponse.districts || [])
      setGsrs(gsrResponse.gsrs || [])
    } catch (err) {
      setError(err.message || '데이터를 불러오는 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const sortedGroups = useMemo(() => [...groups].sort((a, b) => a.name.localeCompare(b.name, 'ko-KR')), [groups])
  const sortedGsrs = useMemo(() => [...gsrs].sort((a, b) => a.nickname.localeCompare(b.nickname, 'ko-KR')), [gsrs])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleMeetingChange(event) {
    const { name, value } = event.target
    setMeetingForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleGsrChange(event) {
    const { name, value } = event.target
    setGsrForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleNoticeChange(event) {
    const { name, value, type, checked } = event.target
    setNoticeForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  function resetMeetingForm() {
    setMeetingForm(initialMeetingFormState)
    setMeetingEditingId(null)
  }

  function resetNoticeForm() {
    setNoticeForm(initialNoticeFormState)
    setNoticeEditingId(null)
  }

  function resetForm() {
    setForm(initialFormState)
    setEditingId(null)
    setMeetings([])
    setNotices([])
    resetMeetingForm()
    resetNoticeForm()
  }

  function resetGsrForm() {
    setGsrForm(initialGsrFormState)
    setGsrEditingId(null)
  }

  async function loadMeetings(groupId) {
    try {
      const response = await fetchAdminGroupMeetings(groupId)
      setMeetings(response || [])
    } catch (err) {
      setError(err.message || '모임 정보를 불러오는 중 오류가 발생했습니다.')
    }
  }

  async function loadNotices(groupId) {
    try {
      const response = await fetchAdminGroupNotices(groupId)
      setNotices(response || [])
    } catch (err) {
      setError(err.message || '공지 정보를 불러오는 중 오류가 발생했습니다.')
    }
  }

  function toGroupPayload() {
    return {
      name: form.name,
      startDate: form.startDate || null,
      province: form.province,
      districtId: form.districtId ? Number(form.districtId) : null,
      gsrId: form.gsrId ? Number(form.gsrId) : null,
      contactAddress: form.contactAddress || null,
      contactEmail: form.contactEmail || null,
      contactPhone: form.contactPhone || null,
      meetingRoadAddress: form.meetingRoadAddress,
      meetingDetailAddress: form.meetingDetailAddress,
      meetingGuide: form.meetingGuide || null,
      meetingLatitude: null,
      meetingLongitude: null,
    }
  }

  function toMeetingPayload() {
    return {
      dayOfWeek: meetingForm.dayOfWeek,
      startTime: meetingForm.startTime,
      meetingType: meetingForm.meetingType,
      status: meetingForm.status,
      meetingRoadAddress: meetingForm.meetingRoadAddress || null,
      meetingDetailAddress: meetingForm.meetingDetailAddress || null,
      meetingGuide: meetingForm.meetingGuide || null,
      meetingLatitude: meetingForm.meetingLatitude ? Number(meetingForm.meetingLatitude) : null,
      meetingLongitude: meetingForm.meetingLongitude ? Number(meetingForm.meetingLongitude) : null,
    }
  }

  function toNoticePayload() {
    return {
      title: noticeForm.title,
      content: noticeForm.content,
      type: noticeForm.type,
      published: Boolean(noticeForm.published),
      displayStartAt: noticeForm.displayStartAt || null,
      displayEndAt: noticeForm.displayEndAt || null,
    }
  }

  function findSelectedGsr() {
    if (!form.gsrId) return null
    return gsrs.find((gsr) => gsr.id === Number(form.gsrId)) || null
  }

  function applyGsrContactToGroup() {
    const gsr = findSelectedGsr()
    if (!gsr) {
      setError('먼저 연결할 GSR를 선택해주세요.')
      return
    }

    setForm((prev) => ({
      ...prev,
      contactAddress: gsr.mailingAddress || prev.contactAddress,
      contactEmail: gsr.email || prev.contactEmail,
      contactPhone: gsr.phone || prev.contactPhone,
    }))
    setSuccessMessage('GSR 우편/이메일/전화 정보를 그룹 연락처에 반영했습니다.')
  }

  async function handleGroupSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccessMessage('')

    try {
      const payload = toGroupPayload()
      if (editingId) {
        const updated = await updateAdminGroup(editingId, payload)
        setGroups((prev) => prev.map((group) => (group.id === editingId ? updated : group)))
        await Promise.all([loadMeetings(editingId), loadNotices(editingId)])
        setSuccessMessage('그룹 정보를 수정했습니다.')
      } else {
        const created = await createAdminGroup(payload)
        setGroups((prev) => [...prev, created])
        setEditingId(created.id)
        await Promise.all([loadMeetings(created.id), loadNotices(created.id)])
        setSuccessMessage('그룹을 등록했습니다.')
      }
    } catch (err) {
      setError(err.message || '그룹 저장 중 오류가 발생했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleEditGroup(group) {
    setEditingId(group.id)
    setForm({
      name: group.name || '',
      startDate: group.startDate || '',
      province: group.province || 'SEOUL',
      districtId: group.districtId ? String(group.districtId) : '',
      gsrId: group.gsrId ? String(group.gsrId) : '',
      contactAddress: group.contactAddress || '',
      contactEmail: group.contactEmail || '',
      contactPhone: group.contactPhone || '',
      meetingRoadAddress: group.meetingRoadAddress || '',
      meetingDetailAddress: group.meetingDetailAddress || '',
      meetingGuide: group.meetingGuide || '',
    })
    resetMeetingForm()
    resetNoticeForm()
    setError('')
    setSuccessMessage('')
    await Promise.all([loadMeetings(group.id), loadNotices(group.id)])
  }

  async function handleDeleteGroup(group) {
    if (!window.confirm(`'${group.name}' 그룹을 삭제할까요?`)) return

    setDeletingId(group.id)
    setError('')
    setSuccessMessage('')

    try {
      await deleteAdminGroup(group.id)
      setGroups((prev) => prev.filter((item) => item.id !== group.id))
      if (editingId === group.id) resetForm()
      setSuccessMessage('그룹을 삭제했습니다.')
    } catch (err) {
      setError(err.message || '그룹 삭제 중 오류가 발생했습니다.')
    } finally {
      setDeletingId(null)
    }
  }

  async function handleMeetingSubmit(event) {
    event.preventDefault()
    if (!editingId) return

    setMeetingSubmitting(true)
    setError('')
    setSuccessMessage('')

    try {
      const payload = toMeetingPayload()
      if (meetingEditingId) {
        await updateAdminGroupMeeting(editingId, meetingEditingId, payload)
        setSuccessMessage('모임 정보를 수정했습니다.')
      } else {
        await createAdminGroupMeeting(editingId, payload)
        setSuccessMessage('모임을 등록했습니다.')
      }
      await loadMeetings(editingId)
      resetMeetingForm()
    } catch (err) {
      setError(err.message || '모임 저장 중 오류가 발생했습니다.')
    } finally {
      setMeetingSubmitting(false)
    }
  }

  function handleMeetingEdit(meeting) {
    setMeetingEditingId(meeting.id)
    setMeetingForm({
      dayOfWeek: meeting.dayOfWeek,
      startTime: meeting.startTime,
      meetingType: meeting.meetingType,
      status: meeting.status,
      meetingRoadAddress: meeting.meetingRoadAddress || '',
      meetingDetailAddress: meeting.meetingDetailAddress || '',
      meetingGuide: meeting.meetingGuide || '',
      meetingLatitude: meeting.meetingLatitude ?? '',
      meetingLongitude: meeting.meetingLongitude ?? '',
    })
  }

  async function handleMeetingDelete(meeting) {
    if (!editingId) return
    if (!window.confirm('이 모임을 삭제할까요?')) return

    setMeetingDeletingId(meeting.id)
    try {
      await deleteAdminGroupMeeting(editingId, meeting.id)
      await loadMeetings(editingId)
      if (meetingEditingId === meeting.id) resetMeetingForm()
      setSuccessMessage('모임을 삭제했습니다.')
    } catch (err) {
      setError(err.message || '모임 삭제 중 오류가 발생했습니다.')
    } finally {
      setMeetingDeletingId(null)
    }
  }

  async function handleNoticeSubmit(event) {
    event.preventDefault()
    if (!editingId) return

    setNoticeSubmitting(true)
    setError('')
    setSuccessMessage('')

    try {
      const payload = toNoticePayload()
      if (noticeEditingId) {
        await updateAdminGroupNotice(editingId, noticeEditingId, payload)
        setSuccessMessage('공지를 수정했습니다.')
      } else {
        await createAdminGroupNotice(editingId, payload)
        setSuccessMessage('공지를 등록했습니다.')
      }
      await loadNotices(editingId)
      resetNoticeForm()
    } catch (err) {
      setError(err.message || '공지 저장 중 오류가 발생했습니다.')
    } finally {
      setNoticeSubmitting(false)
    }
  }

  function handleNoticeEdit(notice) {
    setNoticeEditingId(notice.id)
    setNoticeForm({
      title: notice.title || '',
      content: notice.content || '',
      type: notice.type || 'GENERAL',
      published: Boolean(notice.published),
      displayStartAt: toDateTimeLocalValue(notice.displayStartAt),
      displayEndAt: toDateTimeLocalValue(notice.displayEndAt),
    })
  }

  async function handleNoticeDelete(notice) {
    if (!editingId) return
    if (!window.confirm(`'${notice.title}' 공지를 삭제할까요?`)) return

    setNoticeDeletingId(notice.id)
    try {
      await deleteAdminGroupNotice(editingId, notice.id)
      await loadNotices(editingId)
      if (noticeEditingId === notice.id) resetNoticeForm()
      setSuccessMessage('공지를 삭제했습니다.')
    } catch (err) {
      setError(err.message || '공지 삭제 중 오류가 발생했습니다.')
    } finally {
      setNoticeDeletingId(null)
    }
  }

  async function handleGsrSubmit(event) {
    event.preventDefault()
    setError('')
    setSuccessMessage('')

    try {
      if (gsrEditingId) {
        const updated = await updateAdminGsr(gsrEditingId, {
          nickname: gsrForm.nickname,
          phone: gsrForm.phone || null,
          mailingAddress: gsrForm.mailingAddress || null,
          email: gsrForm.email || null,
        })
        setGsrs((prev) => prev.map((gsr) => (gsr.id === gsrEditingId ? updated : gsr)))
        setSuccessMessage('GSR 정보를 수정했습니다.')
      } else {
        const created = await createAdminGsr({
          nickname: gsrForm.nickname,
          phone: gsrForm.phone || null,
          mailingAddress: gsrForm.mailingAddress || null,
          email: gsrForm.email || null,
        })
        setGsrs((prev) => [...prev, created])
        setSuccessMessage('GSR을 등록했습니다.')
      }
      resetGsrForm()
    } catch (err) {
      setError(err.message || 'GSR 저장에 실패했습니다.')
    }
  }

  function handleGsrEdit(gsr) {
    setGsrEditingId(gsr.id)
    setGsrForm({
      nickname: gsr.nickname || '',
      phone: gsr.phone || '',
      mailingAddress: gsr.mailingAddress || '',
      email: gsr.email || '',
    })
  }

  async function handleGsrDelete(gsr) {
    if (!window.confirm(`'${gsr.nickname}' GSR을 삭제할까요?`)) return

    try {
      await deleteAdminGsr(gsr.id)
      setGsrs((prev) => prev.filter((item) => item.id !== gsr.id))
      if (gsrEditingId === gsr.id) resetGsrForm()
      setSuccessMessage('GSR을 삭제했습니다.')
    } catch (err) {
      setError(err.message || 'GSR 삭제에 실패했습니다.')
    }
  }

  return (
    <AdminLayout
      title="그룹 관리"
      description="그룹 정보, 그룹 연락처, GSR 관리, 그리고 그룹 정기 모임까지 하나의 관리 메뉴 안에서 처리합니다."
    >
      <div className="space-y-6">
        <div className="inline-flex rounded-2xl border border-slate-200 bg-white p-1">
          <button type="button" onClick={() => setTab('groups')} className={`rounded-xl px-4 py-2 text-sm ${tab === 'groups' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}>그룹 정보/모임</button>
          <button type="button" onClick={() => setTab('gsrs')} className={`rounded-xl px-4 py-2 text-sm ${tab === 'gsrs' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}>GSR 정보</button>
        </div>

        {tab === 'groups' ? (
          <>
            <section className="grid gap-6 xl:grid-cols-[minmax(0,460px)_minmax(0,1fr)]">
              <form onSubmit={handleGroupSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">{editingId ? '그룹 수정' : '그룹 등록'}</h2>
                <div className="mt-4 space-y-4">
                  <input name="name" value={form.name} onChange={handleChange} placeholder="그룹명" required className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
                  <div className="grid gap-4 md:grid-cols-2">
                    <input type="date" name="startDate" value={form.startDate} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
                    <select name="province" value={form.province} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm">
                      {PROVINCES.map((province) => <option key={province.value} value={province.value}>{province.label}</option>)}
                    </select>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <select name="districtId" value={form.districtId} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm">
                      <option value="">지역연합 미지정</option>
                      {districts.map((district) => <option key={district.id} value={district.id}>{district.name}</option>)}
                    </select>
                    <select name="gsrId" value={form.gsrId} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm">
                      <option value="">GSR 미지정</option>
                      {sortedGsrs.map((gsr) => <option key={gsr.id} value={gsr.id}>{gsr.nickname}</option>)}
                    </select>
                  </div>

                  <div className="rounded-2xl border border-blue-100 bg-blue-50 p-3 text-xs text-blue-700">
                    그룹 연락처가 GSR 연락처와 동일하면 아래 버튼을 눌러 자동 반영할 수 있습니다.
                    <button type="button" onClick={applyGsrContactToGroup} className="ml-2 rounded-lg bg-blue-600 px-3 py-1 text-white">GSR 연락처 가져오기</button>
                  </div>

                  <input name="contactAddress" value={form.contactAddress} onChange={handleChange} placeholder="그룹 우편 수신 주소" className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
                  <div className="grid gap-4 md:grid-cols-2">
                    <input name="contactEmail" value={form.contactEmail} onChange={handleChange} placeholder="그룹 이메일 수신 주소" className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
                    <input name="contactPhone" value={form.contactPhone} onChange={handleChange} placeholder="그룹 전화번호" className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
                  </div>

                  <input name="meetingRoadAddress" value={form.meetingRoadAddress} onChange={handleChange} placeholder="기본 모임 도로명주소" required className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
                  <input name="meetingDetailAddress" value={form.meetingDetailAddress} onChange={handleChange} placeholder="기본 모임 상세주소" required className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
                  <p className="text-xs text-slate-500">위도/경도는 도로명주소 기반 지도 API 반환값으로 추후 자동 입력될 예정입니다.</p>
                  <textarea name="meetingGuide" value={form.meetingGuide} onChange={handleChange} placeholder="기본 모임 장소 안내" rows={2} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
                </div>
                <div className="mt-6 flex gap-2">
                  <button type="submit" disabled={submitting} className="rounded-2xl bg-slate-900 px-4 py-3 text-sm text-white disabled:bg-slate-300">{submitting ? '저장 중...' : editingId ? '수정하기' : '등록하기'}</button>
                  {editingId ? <button type="button" onClick={resetForm} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm">취소</button> : null}
                </div>
              </form>

              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">그룹 목록</h2>
                <div className="mt-4 space-y-3">
                  {loading ? <div className="text-sm text-slate-500">불러오는 중...</div> : sortedGroups.map((group) => (
                    <div key={group.id} className="rounded-2xl border border-slate-200 p-3">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <div className="font-semibold">{group.name}</div>
                          <div className="text-xs text-slate-500">{group.contactEmail || group.contactAddress || '연락처 미등록'} / {group.contactPhone || '전화번호 미등록'}</div>
                        </div>
                        <div className="flex gap-2">
                          <button type="button" onClick={() => handleEditGroup(group)} className="rounded-xl border border-slate-200 px-3 py-1 text-sm">수정</button>
                          <button type="button" onClick={() => handleDeleteGroup(group)} disabled={deletingId === group.id} className="rounded-xl border border-red-200 px-3 py-1 text-sm text-red-600">{deletingId === group.id ? '삭제 중...' : '삭제'}</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </section>

            {editingId ? (
              <div className="space-y-6">
                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-slate-900">정기 모임 관리</h2>
                  <p className="mt-2 text-sm text-slate-500">현재 편집 중인 그룹(ID: {editingId})의 모임을 등록/변경/삭제할 수 있습니다.</p>
                  <form onSubmit={handleMeetingSubmit} className="mt-4 grid gap-4 md:grid-cols-2">
                    <select name="dayOfWeek" value={meetingForm.dayOfWeek} onChange={handleMeetingChange} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm">
                      {DAY_OF_WEEKS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
                    </select>
                    <input type="time" name="startTime" value={meetingForm.startTime} onChange={handleMeetingChange} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
                    <select name="meetingType" value={meetingForm.meetingType} onChange={handleMeetingChange} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm">
                      {MEETING_TYPES.filter((t) => t.value).map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                    <select name="status" value={meetingForm.status} onChange={handleMeetingChange} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm">
                      {MEETING_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                    <input name="meetingRoadAddress" value={meetingForm.meetingRoadAddress} onChange={handleMeetingChange} placeholder="(선택) 개별 모임 도로명주소" className="rounded-2xl border border-slate-200 px-4 py-3 text-sm md:col-span-2" />
                    <input name="meetingDetailAddress" value={meetingForm.meetingDetailAddress} onChange={handleMeetingChange} placeholder="(선택) 개별 모임 상세주소" className="rounded-2xl border border-slate-200 px-4 py-3 text-sm md:col-span-2" />
                    <input type="number" step="any" name="meetingLatitude" value={meetingForm.meetingLatitude} onChange={handleMeetingChange} placeholder="(선택) 개별 모임 위도" className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
                    <input type="number" step="any" name="meetingLongitude" value={meetingForm.meetingLongitude} onChange={handleMeetingChange} placeholder="(선택) 개별 모임 경도" className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
                    <textarea name="meetingGuide" value={meetingForm.meetingGuide} onChange={handleMeetingChange} rows={2} placeholder="(선택) 개별 모임 장소 안내" className="rounded-2xl border border-slate-200 px-4 py-3 text-sm md:col-span-2" />
                    <div className="md:col-span-2 flex gap-2">
                      <button type="submit" disabled={meetingSubmitting} className="rounded-2xl bg-slate-900 px-4 py-2 text-white text-sm">{meetingSubmitting ? '저장 중...' : meetingEditingId ? '모임 수정' : '모임 등록'}</button>
                      {meetingEditingId ? <button type="button" onClick={resetMeetingForm} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm">취소</button> : null}
                    </div>
                  </form>

                  <div className="mt-6 space-y-2">
                    {meetings.map((meeting) => (
                      <div key={meeting.id} className="rounded-2xl border border-slate-200 p-3 flex items-center justify-between gap-2">
                        <div className="text-sm">
                          <div className="font-semibold">{DAY_OF_WEEKS.find((d) => d.value === meeting.dayOfWeek)?.label} {meeting.startTime}</div>
                          <div className="text-slate-500">{meeting.meetingType} / {meeting.status} / {meeting.usesGroupDefaultPlace ? '기본 장소 사용' : '개별 장소 사용'}</div>
                        </div>
                        <div className="flex gap-2">
                          <button type="button" onClick={() => handleMeetingEdit(meeting)} className="rounded-xl border border-slate-200 px-3 py-1 text-sm">수정</button>
                          <button type="button" onClick={() => handleMeetingDelete(meeting)} disabled={meetingDeletingId === meeting.id} className="rounded-xl border border-red-200 px-3 py-1 text-sm text-red-600">{meetingDeletingId === meeting.id ? '삭제 중...' : '삭제'}</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-slate-900">그룹 공지 관리</h2>
                  <p className="mt-2 text-sm text-slate-500">검색 결과와 그룹 상세에 노출될 공지를 등록하고 공개 상태를 조절할 수 있습니다.</p>
                  <form onSubmit={handleNoticeSubmit} className="mt-4 grid gap-4 md:grid-cols-2">
                    <input name="title" value={noticeForm.title} onChange={handleNoticeChange} placeholder="공지 제목" required className="rounded-2xl border border-slate-200 px-4 py-3 text-sm md:col-span-2" />
                    <select name="type" value={noticeForm.type} onChange={handleNoticeChange} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm">
                      {NOTICE_TYPES.map((noticeType) => <option key={noticeType.value} value={noticeType.value}>{noticeType.label}</option>)}
                    </select>
                    <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700">
                      <input type="checkbox" name="published" checked={noticeForm.published} onChange={handleNoticeChange} />
                      공개 상태로 노출
                    </label>
                    <input type="datetime-local" name="displayStartAt" value={noticeForm.displayStartAt} onChange={handleNoticeChange} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
                    <input type="datetime-local" name="displayEndAt" value={noticeForm.displayEndAt} onChange={handleNoticeChange} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
                    <textarea name="content" value={noticeForm.content} onChange={handleNoticeChange} rows={4} placeholder="공지 내용" required className="rounded-2xl border border-slate-200 px-4 py-3 text-sm md:col-span-2" />
                    <div className="md:col-span-2 flex gap-2">
                      <button type="submit" disabled={noticeSubmitting} className="rounded-2xl bg-slate-900 px-4 py-2 text-white text-sm">{noticeSubmitting ? '저장 중...' : noticeEditingId ? '공지 수정' : '공지 등록'}</button>
                      {noticeEditingId ? <button type="button" onClick={resetNoticeForm} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm">취소</button> : null}
                    </div>
                  </form>

                  <div className="mt-6 space-y-2">
                    {notices.map((notice) => (
                      <div key={notice.id} className="rounded-2xl border border-slate-200 p-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-semibold">{notice.title}</span>
                              <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">{NOTICE_TYPES.find((item) => item.value === notice.type)?.label || notice.type}</span>
                              <span className={`rounded-full px-2 py-1 text-xs ${notice.published ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{notice.published ? '공개' : '비공개'}</span>
                              {notice.activeNow ? <span className="rounded-full bg-amber-50 px-2 py-1 text-xs text-amber-700">현재 노출 중</span> : null}
                            </div>
                            <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">{notice.content}</p>
                            <div className="mt-2 text-xs text-slate-500">
                              시작 {notice.displayStartAt || '-'} / 종료 {notice.displayEndAt || '-'}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button type="button" onClick={() => handleNoticeEdit(notice)} className="rounded-xl border border-slate-200 px-3 py-1 text-sm">수정</button>
                            <button type="button" onClick={() => handleNoticeDelete(notice)} disabled={noticeDeletingId === notice.id} className="rounded-xl border border-red-200 px-3 py-1 text-sm text-red-600">{noticeDeletingId === notice.id ? '삭제 중...' : '삭제'}</button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {!notices.length ? <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">아직 등록된 공지가 없습니다.</div> : null}
                  </div>
                </section>
              </div>
            ) : null}
          </>
        ) : (
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">GSR 하위 관리</h2>
            <p className="mt-2 text-sm text-slate-500">그룹 관리 메뉴 안에서 GSR 정보 CRUD를 처리합니다.</p>

            <form onSubmit={handleGsrSubmit} className="mt-4 space-y-3">
              <input name="nickname" value={gsrForm.nickname} onChange={handleGsrChange} required placeholder="닉네임" className="w-full rounded-xl border border-slate-200 px-3 py-2" />
              <div className="grid gap-3 md:grid-cols-2">
                <input name="phone" value={gsrForm.phone} onChange={handleGsrChange} placeholder="전화번호" className="w-full rounded-xl border border-slate-200 px-3 py-2" />
                <input type="email" name="email" value={gsrForm.email} onChange={handleGsrChange} placeholder="이메일" className="w-full rounded-xl border border-slate-200 px-3 py-2" />
              </div>
              <input name="mailingAddress" value={gsrForm.mailingAddress} onChange={handleGsrChange} placeholder="우편 수신 주소" className="w-full rounded-xl border border-slate-200 px-3 py-2" />
              <div className="flex gap-2">
                <button type="submit" className="rounded-xl bg-slate-900 px-4 py-2 text-white text-sm">{gsrEditingId ? '수정' : '등록'}</button>
                {gsrEditingId ? <button type="button" onClick={resetGsrForm} className="rounded-xl border border-slate-200 px-4 py-2 text-sm">취소</button> : null}
              </div>
            </form>

            <div className="mt-6 space-y-2">
              {sortedGsrs.map((gsr) => (
                <div key={gsr.id} className="rounded-xl border border-slate-200 p-3 flex items-center justify-between gap-2">
                  <div>
                    <div className="font-semibold">{gsr.nickname}</div>
                    <div className="text-xs text-slate-500">{gsr.email || '이메일 없음'} / {gsr.phone || '전화 없음'} / {gsr.mailingAddress || '주소 없음'}</div>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => handleGsrEdit(gsr)} className="rounded-xl border border-slate-200 px-3 py-1 text-sm">수정</button>
                    <button type="button" onClick={() => handleGsrDelete(gsr)} className="rounded-xl border border-red-200 px-3 py-1 text-sm text-red-600">삭제</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {successMessage ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">{successMessage}</div> : null}
        {error ? <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}
      </div>
    </AdminLayout>
  )
}
