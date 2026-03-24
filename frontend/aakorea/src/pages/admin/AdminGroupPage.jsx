import { useEffect, useMemo, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { fetchAdminDistricts } from '../../api/districts'
import { fetchAdminGsrs } from '../../api/gsrs'
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
import { DAY_OF_WEEKS, MEETING_STATUSES, MEETING_TYPES, PROVINCES } from '../../utils/constants'

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
  meetingLatitude: '37.5665',
  meetingLongitude: '126.9780',
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

export default function AdminGroupPage() {
  const [groups, setGroups] = useState([])
  const [districts, setDistricts] = useState([])
  const [gsrs, setGsrs] = useState([])
  const [meetings, setMeetings] = useState([])
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
      setError(err.message || '그룹 정보를 불러오는 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const sortedGroups = useMemo(
    () => [...groups].sort((left, right) => left.name.localeCompare(right.name, 'ko-KR')),
    [groups],
  )

  async function loadMeetings(groupId) {
    try {
      const response = await fetchAdminGroupMeetings(groupId)
      setMeetings(response || [])
    } catch (err) {
      setError(err.message || '모임 정보를 불러오는 중 오류가 발생했습니다.')
    }
  }

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleMeetingChange(event) {
    const { name, value } = event.target
    setMeetingForm((prev) => ({ ...prev, [name]: value }))
  }

  function resetForm() {
    setForm(initialFormState)
    setEditingId(null)
    setMeetings([])
    resetMeetingForm()
  }

  function resetMeetingForm() {
    setMeetingForm(initialMeetingFormState)
    setMeetingEditingId(null)
  }

  function toPayload() {
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
      meetingLatitude: Number(form.meetingLatitude),
      meetingLongitude: Number(form.meetingLongitude),
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

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccessMessage('')

    try {
      const payload = toPayload()
      if (editingId) {
        const updated = await updateAdminGroup(editingId, payload)
        setGroups((prev) => prev.map((group) => (group.id === editingId ? updated : group)))
        setSuccessMessage('그룹 정보를 수정했습니다.')
      } else {
        const created = await createAdminGroup(payload)
        setGroups((prev) => [...prev, created])
        setSuccessMessage('그룹을 등록했습니다. 이제 아래에서 정기 모임을 추가하세요.')
        setEditingId(created.id)
        await loadMeetings(created.id)
      }
      if (editingId) {
        await loadMeetings(editingId)
      }
    } catch (err) {
      setError(err.message || '그룹 저장 중 오류가 발생했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleEdit(group) {
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
      meetingLatitude: String(group.meetingLatitude ?? ''),
      meetingLongitude: String(group.meetingLongitude ?? ''),
    })
    setError('')
    setSuccessMessage('')
    resetMeetingForm()
    await loadMeetings(group.id)
  }

  async function handleDelete(group) {
    const confirmed = window.confirm(`'${group.name}' 그룹을 삭제할까요?`)
    if (!confirmed) return

    setDeletingId(group.id)
    setError('')
    setSuccessMessage('')

    try {
      await deleteAdminGroup(group.id)
      setGroups((prev) => prev.filter((item) => item.id !== group.id))
      if (editingId === group.id) {
        resetForm()
      }
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
        setSuccessMessage('모임 정보를 등록했습니다.')
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
    const confirmed = window.confirm('이 모임을 삭제할까요?')
    if (!confirmed) return

    setMeetingDeletingId(meeting.id)

    try {
      await deleteAdminGroupMeeting(editingId, meeting.id)
      setSuccessMessage('모임을 삭제했습니다.')
      await loadMeetings(editingId)
      if (meetingEditingId === meeting.id) resetMeetingForm()
    } catch (err) {
      setError(err.message || '모임 삭제 중 오류가 발생했습니다.')
    } finally {
      setMeetingDeletingId(null)
    }
  }

  return (
    <AdminLayout
      title="그룹 관리"
      description="그룹 기본 정보, 우편물/이메일 수신 주소, 전화번호, GSR 연결, 그리고 정기 모임 정보까지 함께 관리합니다."
    >
      <div className="space-y-6">
        <section className="grid gap-6 xl:grid-cols-[minmax(0,460px)_minmax(0,1fr)]">
          <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
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
                  {gsrs.map((gsr) => <option key={gsr.id} value={gsr.id}>{gsr.nickname}</option>)}
                </select>
              </div>

              <input name="contactAddress" value={form.contactAddress} onChange={handleChange} placeholder="그룹 우편물 수신 주소" className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
              <div className="grid gap-4 md:grid-cols-2">
                <input name="contactEmail" value={form.contactEmail} onChange={handleChange} placeholder="그룹 이메일 수신 주소" className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
                <input name="contactPhone" value={form.contactPhone} onChange={handleChange} placeholder="그룹 전화번호" className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
              </div>

              <input name="meetingRoadAddress" value={form.meetingRoadAddress} onChange={handleChange} placeholder="기본 모임 도로명주소" required className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
              <input name="meetingDetailAddress" value={form.meetingDetailAddress} onChange={handleChange} placeholder="기본 모임 상세주소" required className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
              <textarea name="meetingGuide" value={form.meetingGuide} onChange={handleChange} placeholder="기본 모임 장소 안내" rows={2} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
              <div className="grid gap-4 md:grid-cols-2">
                <input type="number" step="any" name="meetingLatitude" value={form.meetingLatitude} onChange={handleChange} required placeholder="위도" className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
                <input type="number" step="any" name="meetingLongitude" value={form.meetingLongitude} onChange={handleChange} required placeholder="경도" className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
              </div>
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
                      <button type="button" onClick={() => handleEdit(group)} className="rounded-xl border border-slate-200 px-3 py-1 text-sm">수정</button>
                      <button type="button" onClick={() => handleDelete(group)} disabled={deletingId === group.id} className="rounded-xl border border-red-200 px-3 py-1 text-sm text-red-600">{deletingId === group.id ? '삭제 중...' : '삭제'}</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </section>

        {editingId ? (
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">정기 모임 관리</h2>
            <p className="mt-2 text-sm text-slate-500">현재 편집 중인 그룹(ID: {editingId})의 모임을 등록/변경/삭제할 수 있습니다.</p>
            <form onSubmit={handleMeetingSubmit} className="mt-4 grid gap-4 md:grid-cols-2">
              <select name="dayOfWeek" value={meetingForm.dayOfWeek} onChange={handleMeetingChange} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm">
                {DAY_OF_WEEKS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
              </select>
              <input type="time" name="startTime" value={meetingForm.startTime} onChange={handleMeetingChange} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
              <select name="meetingType" value={meetingForm.meetingType} onChange={handleMeetingChange} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm">
                {MEETING_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
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
        ) : null}

        {successMessage ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">{successMessage}</div> : null}
        {error ? <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}
      </div>
    </AdminLayout>
  )
}
