import { useEffect, useMemo, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { fetchAdminDistricts } from '../../api/districts'
import {
  createAdminGroup,
  deleteAdminGroup,
  fetchAdminGroups,
  updateAdminGroup,
} from '../../api/groups'
import { PROVINCES } from '../../utils/constants'

const initialFormState = {
  name: '',
  startDate: '',
  province: 'SEOUL',
  districtId: '',
  contactAddress: '',
  contactEmail: '',
  contactPhone: '',
  meetingRoadAddress: '',
  meetingDetailAddress: '',
  meetingGuide: '',
  meetingLatitude: '37.5665',
  meetingLongitude: '126.9780',
}

export default function AdminGroupPage() {
  const [groups, setGroups] = useState([])
  const [districts, setDistricts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(initialFormState)

  async function loadData() {
    setLoading(true)
    setError('')

    try {
      const [groupResponse, districtResponse] = await Promise.all([
        fetchAdminGroups(),
        fetchAdminDistricts(),
      ])
      setGroups(groupResponse.groups || [])
      setDistricts(districtResponse.districts || [])
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

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  function resetForm() {
    setForm(initialFormState)
    setEditingId(null)
  }

  function toPayload() {
    return {
      name: form.name,
      startDate: form.startDate || null,
      province: form.province,
      districtId: form.districtId ? Number(form.districtId) : null,
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
        setSuccessMessage('그룹을 등록했습니다.')
      }
      resetForm()
    } catch (err) {
      setError(err.message || '그룹 저장 중 오류가 발생했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  function handleEdit(group) {
    setEditingId(group.id)
    setForm({
      name: group.name || '',
      startDate: group.startDate || '',
      province: group.province || 'SEOUL',
      districtId: group.districtId ? String(group.districtId) : '',
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

  return (
    <AdminLayout
      title="그룹 관리"
      description="그룹 기본 정보와 기본 모임 장소를 등록/수정/삭제할 수 있습니다. 지역연합과 행정구역 정보를 함께 관리해 검색 및 운영 데이터 품질을 유지합니다."
    >
      <div className="space-y-6">
        <section className="grid gap-6 xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
          <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{editingId ? '그룹 수정' : '그룹 등록'}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  그룹명, 행정구역, 기본 모임 장소는 필수입니다.
                </p>
              </div>
              {editingId ? (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
                >
                  취소
                </button>
              ) : null}
            </div>

            <div className="mt-6 space-y-4">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">그룹명 *</span>
                <input name="name" value={form.name} onChange={handleChange} required maxLength={100} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100" />
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-slate-700">시작일</span>
                  <input type="date" name="startDate" value={form.startDate} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100" />
                </label>
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-slate-700">행정구역 *</span>
                  <select name="province" value={form.province} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100">
                    {PROVINCES.map((province) => (
                      <option key={province.value} value={province.value}>{province.label}</option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">지역연합</span>
                <select name="districtId" value={form.districtId} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100">
                  <option value="">미지정</option>
                  {districts.map((district) => (
                    <option key={district.id} value={district.id}>{district.name}</option>
                  ))}
                </select>
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">기본 모임 장소(도로명주소) *</span>
                <input name="meetingRoadAddress" value={form.meetingRoadAddress} onChange={handleChange} required className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100" />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">기본 모임 장소(상세주소) *</span>
                <input name="meetingDetailAddress" value={form.meetingDetailAddress} onChange={handleChange} required className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100" />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">장소 안내</span>
                <textarea name="meetingGuide" value={form.meetingGuide} onChange={handleChange} rows={2} maxLength={500} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100" />
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-slate-700">위도 *</span>
                  <input type="number" step="any" name="meetingLatitude" value={form.meetingLatitude} onChange={handleChange} required className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100" />
                </label>
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-slate-700">경도 *</span>
                  <input type="number" step="any" name="meetingLongitude" value={form.meetingLongitude} onChange={handleChange} required className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100" />
                </label>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button type="submit" disabled={submitting} className="inline-flex items-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300">
                {submitting ? '저장 중...' : editingId ? '수정하기' : '등록하기'}
              </button>
            </div>
          </form>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">운영 현황</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              그룹은 모임 검색과 그룹 상세 페이지의 핵심 기준 데이터입니다. 정확한 장소/연락처를 유지해주세요.
            </p>
            <div className="mt-6 rounded-2xl bg-slate-100 px-4 py-3 text-right">
              <div className="text-xs font-medium text-slate-500">등록된 그룹</div>
              <div className="mt-1 text-2xl font-semibold text-slate-900">{groups.length}</div>
            </div>
          </section>
        </section>

        {successMessage ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">{successMessage}</div> : null}
        {error ? <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">그룹 목록</h2>
              <p className="mt-2 text-sm text-slate-600">등록된 그룹을 수정하거나 삭제할 수 있습니다.</p>
            </div>
            <button type="button" onClick={loadData} className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50">새로고침</button>
          </div>

          <div className="mt-6 overflow-x-auto">
            {loading ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">불러오는 중...</div>
            ) : sortedGroups.length ? (
              <table className="min-w-full border-separate border-spacing-y-3">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-[0.16em] text-slate-400">
                    <th className="px-4">그룹명</th>
                    <th className="px-4">행정구역/연합</th>
                    <th className="px-4">연결 모임 수</th>
                    <th className="px-4">작업</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedGroups.map((group) => (
                    <tr key={group.id} className="rounded-2xl bg-slate-50 text-sm text-slate-700">
                      <td className="rounded-l-2xl px-4 py-4 font-semibold text-slate-900">{group.name}</td>
                      <td className="px-4 py-4">{PROVINCES.find((p) => p.value === group.province)?.label || group.province} / {group.districtName || '미지정'}</td>
                      <td className="px-4 py-4"><span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">{group.meetingCount}개</span></td>
                      <td className="rounded-r-2xl px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button type="button" onClick={() => handleEdit(group)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100">수정</button>
                          <button type="button" onClick={() => handleDelete(group)} disabled={deletingId === group.id} className="rounded-xl border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-300">
                            {deletingId === group.id ? '삭제 중...' : '삭제'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">아직 등록된 그룹이 없습니다. 왼쪽 등록 폼에서 첫 그룹을 추가해보세요.</div>
            )}
          </div>
        </section>
      </div>
    </AdminLayout>
  )
}
