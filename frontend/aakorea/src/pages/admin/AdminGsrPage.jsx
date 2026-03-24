import { useEffect, useMemo, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { createAdminGsr, deleteAdminGsr, fetchAdminGsrs, updateAdminGsr } from '../../api/gsrs'

const initialFormState = { nickname: '', phone: '', email: '' }

export default function AdminGsrPage() {
  const [gsrs, setGsrs] = useState([])
  const [form, setForm] = useState(initialFormState)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function load() {
    try {
      const response = await fetchAdminGsrs()
      setGsrs(response.gsrs || [])
    } catch (err) {
      setError(err.message || 'GSR 목록을 불러오지 못했습니다.')
    }
  }

  useEffect(() => { load() }, [])

  const sortedGsrs = useMemo(() => [...gsrs].sort((a, b) => a.nickname.localeCompare(b.nickname, 'ko-KR')), [gsrs])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function reset() {
    setForm(initialFormState)
    setEditingId(null)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSuccess('')

    try {
      if (editingId) {
        const updated = await updateAdminGsr(editingId, {
          nickname: form.nickname,
          phone: form.phone || null,
          email: form.email || null,
        })
        setGsrs((prev) => prev.map((gsr) => (gsr.id === editingId ? updated : gsr)))
        setSuccess('GSR 정보를 수정했습니다.')
      } else {
        const created = await createAdminGsr({
          nickname: form.nickname,
          phone: form.phone || null,
          email: form.email || null,
        })
        setGsrs((prev) => [...prev, created])
        setSuccess('GSR을 등록했습니다.')
      }
      reset()
    } catch (err) {
      setError(err.message || 'GSR 저장에 실패했습니다.')
    }
  }

  function handleEdit(gsr) {
    setEditingId(gsr.id)
    setForm({ nickname: gsr.nickname || '', phone: gsr.phone || '', email: gsr.email || '' })
  }

  async function handleDelete(gsr) {
    if (!window.confirm(`'${gsr.nickname}' GSR을 삭제할까요?`)) return
    try {
      await deleteAdminGsr(gsr.id)
      setGsrs((prev) => prev.filter((item) => item.id !== gsr.id))
      if (editingId === gsr.id) reset()
      setSuccess('GSR을 삭제했습니다.')
    } catch (err) {
      setError(err.message || 'GSR 삭제에 실패했습니다.')
    }
  }

  return (
    <AdminLayout title="GSR 관리" description="그룹 봉사자(GSR) 정보를 등록/수정/삭제합니다.">
      <div className="space-y-6">
        <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
          <h2 className="text-lg font-semibold">{editingId ? 'GSR 수정' : 'GSR 등록'}</h2>
          <input name="nickname" value={form.nickname} onChange={handleChange} required placeholder="닉네임" className="w-full rounded-xl border border-slate-200 px-3 py-2" />
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="전화번호" className="w-full rounded-xl border border-slate-200 px-3 py-2" />
          <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="이메일" className="w-full rounded-xl border border-slate-200 px-3 py-2" />
          <div className="flex gap-2">
            <button type="submit" className="rounded-xl bg-slate-900 px-4 py-2 text-white">{editingId ? '수정' : '등록'}</button>
            {editingId ? <button type="button" onClick={reset} className="rounded-xl border border-slate-200 px-4 py-2">취소</button> : null}
          </div>
        </form>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-2">
          <h2 className="text-lg font-semibold">GSR 목록</h2>
          {sortedGsrs.map((gsr) => (
            <div key={gsr.id} className="rounded-xl border border-slate-200 p-3 flex items-center justify-between gap-2">
              <div>
                <div className="font-semibold">{gsr.nickname}</div>
                <div className="text-xs text-slate-500">{gsr.email || '이메일 없음'} / {gsr.phone || '전화 없음'}</div>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => handleEdit(gsr)} className="rounded-xl border border-slate-200 px-3 py-1 text-sm">수정</button>
                <button type="button" onClick={() => handleDelete(gsr)} className="rounded-xl border border-red-200 px-3 py-1 text-sm text-red-600">삭제</button>
              </div>
            </div>
          ))}
        </section>

        {success ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">{success}</div> : null}
        {error ? <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}
      </div>
    </AdminLayout>
  )
}
