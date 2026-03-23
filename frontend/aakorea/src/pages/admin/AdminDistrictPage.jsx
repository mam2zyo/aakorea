import { useEffect, useMemo, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import {
  createAdminDistrict,
  deleteAdminDistrict,
  fetchAdminDistricts,
  updateAdminDistrict,
} from '../../api/districts'

const initialFormState = {
  name: '',
}

export default function AdminDistrictPage() {
  const [districts, setDistricts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState(initialFormState)
  const [submitting, setSubmitting] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  async function loadDistricts() {
    setLoading(true)
    setError('')

    try {
      const response = await fetchAdminDistricts()
      setDistricts(response.districts || [])
    } catch (err) {
      setError(err.message || '지역연합 목록을 불러오는 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDistricts()
  }, [])

  const sortedDistricts = useMemo(
    () => [...districts].sort((left, right) => left.name.localeCompare(right.name, 'ko-KR')),
    [districts],
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

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccessMessage('')

    try {
      if (editingId) {
        const updated = await updateAdminDistrict(editingId, form)
        setDistricts((prev) =>
          prev.map((district) =>
            district.id === editingId ? updated : district,
          ),
        )
        setSuccessMessage('지역연합 정보를 수정했습니다.')
      } else {
        const created = await createAdminDistrict(form)
        setDistricts((prev) => [...prev, created])
        setSuccessMessage('지역연합을 등록했습니다.')
      }

      resetForm()
    } catch (err) {
      setError(err.message || '지역연합 저장 중 오류가 발생했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  function handleEdit(district) {
    setEditingId(district.id)
    setForm({ name: district.name })
    setSuccessMessage('')
    setError('')
  }

  async function handleDelete(district) {
    const confirmed = window.confirm(`'${district.name}' 지역연합을 삭제할까요?`)
    if (!confirmed) return

    setDeletingId(district.id)
    setError('')
    setSuccessMessage('')

    try {
      await deleteAdminDistrict(district.id)
      setDistricts((prev) => prev.filter((item) => item.id !== district.id))
      if (editingId === district.id) {
        resetForm()
      }
      setSuccessMessage('지역연합을 삭제했습니다.')
    } catch (err) {
      setError(err.message || '지역연합 삭제 중 오류가 발생했습니다.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <AdminLayout
      title="지역연합 관리"
      description="그룹 관리 기능이 확장되더라도 재사용할 수 있도록 관리자 전용 레이아웃 안에서 지역연합 CRUD를 제공합니다. 그룹 수를 함께 보여주어 삭제 가능 여부를 바로 판단할 수 있습니다."
    >
      <div className="space-y-6">
        <section className="grid gap-6 xl:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {editingId ? '지역연합 수정' : '지역연합 등록'}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  그룹 관리 메뉴에서 재사용할 기준 데이터이므로 공식 명칭 기준으로 입력해주세요.
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
                <span className="text-sm font-medium text-slate-700">지역연합명</span>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="예: 대경연합"
                  maxLength={100}
                  required
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                />
              </label>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {submitting ? '저장 중...' : editingId ? '수정하기' : '등록하기'}
              </button>
              <span className="text-xs text-slate-500">중복 이름은 등록할 수 없습니다.</span>
            </div>
          </form>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">운영 안내</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  지역연합은 행정구역과 별도로 운영되는 조직 단위입니다. 이후 그룹 생성/수정 화면에서 이 목록을 선택값으로 재사용할 수 있도록 별도 관리 기능으로 분리했습니다.
                </p>
              </div>
              <div className="rounded-2xl bg-slate-100 px-4 py-3 text-right">
                <div className="text-xs font-medium text-slate-500">등록된 지역연합</div>
                <div className="mt-1 text-2xl font-semibold text-slate-900">{districts.length}</div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-sm font-semibold text-slate-900">삭제 보호</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  소속 그룹이 있는 지역연합은 삭제할 수 없도록 막아 데이터 정합성을 유지합니다.
                </p>
              </article>
              <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-sm font-semibold text-slate-900">확장성 고려</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  좌측 관리자 메뉴를 공통으로 두어 그룹 관리 같은 신규 기능이 추가되어도 같은 구조를 사용할 수 있습니다.
                </p>
              </article>
            </div>
          </section>
        </section>

        {successMessage ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
            {successMessage}
          </div>
        ) : null}

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">지역연합 목록</h2>
              <p className="mt-2 text-sm text-slate-600">
                등록된 지역연합과 연결된 그룹 수를 확인하고 필요 시 즉시 수정 또는 삭제할 수 있습니다.
              </p>
            </div>
            <button
              type="button"
              onClick={loadDistricts}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
            >
              새로고침
            </button>
          </div>

          <div className="mt-6 overflow-x-auto">
            {loading ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
                불러오는 중...
              </div>
            ) : sortedDistricts.length ? (
              <table className="min-w-full border-separate border-spacing-y-3">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-[0.16em] text-slate-400">
                    <th className="px-4">지역연합명</th>
                    <th className="px-4">연결 그룹 수</th>
                    <th className="px-4">작업</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedDistricts.map((district) => {
                    const canDelete = district.groupCount === 0

                    return (
                      <tr key={district.id} className="rounded-2xl bg-slate-50 text-sm text-slate-700">
                        <td className="rounded-l-2xl px-4 py-4 font-semibold text-slate-900">
                          {district.name}
                        </td>
                        <td className="px-4 py-4">
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                            {district.groupCount}개
                          </span>
                        </td>
                        <td className="rounded-r-2xl px-4 py-4">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => handleEdit(district)}
                              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
                            >
                              수정
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(district)}
                              disabled={!canDelete || deletingId === district.id}
                              className="rounded-xl border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-300"
                              title={
                                canDelete
                                  ? '삭제'
                                  : '연결된 그룹이 있어 삭제할 수 없습니다.'
                              }
                            >
                              {deletingId === district.id ? '삭제 중...' : '삭제'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
                아직 등록된 지역연합이 없습니다. 왼쪽 등록 폼에서 첫 지역연합을 추가해보세요.
              </div>
            )}
          </div>
        </section>
      </div>
    </AdminLayout>
  )
}
