import { useEffect, useState, useMemo, useCallback } from 'react';
import { PageHeader, Field } from '@/shared/components/ui';
import { districtApi, groupApi, getApiFieldErrors, omitFieldErrors, readFieldError } from '@/shared/api';

interface District {
  id: number;
  name: string;
}

interface DistrictManagementPageProps {
  onError: (error: unknown, message: string) => void;
  onSuccess: (message: string) => void;
}

const EMPTY_DISTRICT_FORM = { id: undefined as number | undefined, name: '' };

export function DistrictManagementPage({ onError, onSuccess }: DistrictManagementPageProps) {
  const [districts, setDistricts] = useState<District[]>([]);
  const [groupCountByDistrictId, setGroupCountByDistrictId] = useState<Record<number, number>>({});
  const [saving, setSaving] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [districtForm, setDistrictForm] = useState(EMPTY_DISTRICT_FORM);
  const [districtErrors, setDistrictErrors] = useState<Record<string, string>>({});

  const loadData = useCallback(async () => {
    try {
      const [districtData, groupData] = await Promise.all([
        districtApi.getDistricts(),
        groupApi.getGroups(),
      ]);
      setDistricts(districtData);
      
      const counts: Record<number, number> = {};
      groupData.forEach((group: { districtId: number }) => {
        counts[group.districtId] = (counts[group.districtId] || 0) + 1;
      });
      setGroupCountByDistrictId(counts);
    } catch (error) {
      onError(error, '데이터를 불러오지 못했습니다.');
    }
  }, [onError]);

  useEffect(() => {
    // 린트 경고 방지를 위해 비동기적으로 실행
    const timer = setTimeout(() => {
      void loadData();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadData]);

  const filteredDistricts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return districts.filter(d => d.name.toLowerCase().includes(q));
  }, [districts, searchQuery]);

  const saveDistrict = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (districtForm.id) {
        await districtApi.updateDistrict(districtForm.id, { name: districtForm.name });
        onSuccess('지역연합을 수정했습니다.');
      } else {
        await districtApi.createDistrict({ name: districtForm.name });
        onSuccess('지역연합을 생성했습니다.');
      }
      setEditorOpen(false);
      loadData();
    } catch (error) {
      const errors = getApiFieldErrors(error);
      if (errors) setDistrictErrors(errors);
      else onError(error, '저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const deleteDistrict = async (id: number, name: string) => {
    if (!window.confirm(`"${name}" 지역연합을 삭제하시겠습니까?`)) return;
    try {
      await districtApi.deleteDistrict(id);
      onSuccess('삭제했습니다.');
      loadData();
    } catch (error) {
      onError(error, '삭제에 실패했습니다.');
    }
  };

  return (
    <div className="office-flat-page">
      <PageHeader title="지역연합 관리" />
      
      <div className="office-list-toolbar">
        <div className="office-list-toolbar__cluster office-list-toolbar__cluster--start">
          <input 
            placeholder="이름으로 검색" 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)}
            className="office-input"
          />
        </div>
        <div className="office-list-toolbar__cluster office-list-toolbar__cluster--end">
          <button className="primary-button" onClick={() => {
            setDistrictForm(EMPTY_DISTRICT_FORM);
            setDistrictErrors({});
            setEditorOpen(true);
          }}>
            새 지역연합
          </button>
        </div>
      </div>

      <div className="office-flat-page__workspace">
        <div className="office-table">
          <div className="office-table__header">
            <span>이름</span>
            <span>그룹 수</span>
            <span>관리</span>
          </div>
          {filteredDistricts.map(d => (
            <div key={d.id} className="office-table__row">
              <span>{d.name}</span>
              <span>{groupCountByDistrictId[d.id] || 0}</span>
              <div className="office-table__cell--action">
                <button className="ghost-button" onClick={() => {
                  setDistrictForm(d);
                  setEditorOpen(true);
                }}>수정</button>
                <button className="ghost-button ghost-button--danger" onClick={() => deleteDistrict(d.id, d.name)}>삭제</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {editorOpen && (
        <div className="office-overlay">
          <div className="office-overlay__dialog">
            <h2>{districtForm.id ? '수정' : '추가'}</h2>
            <form onSubmit={saveDistrict}>
              <Field label="지역연합 이름" error={readFieldError(districtErrors, 'name')}>
                <input 
                  value={districtForm.name} 
                  onChange={e => {
                    setDistrictForm({...districtForm, name: e.target.value});
                    setDistrictErrors(omitFieldErrors(districtErrors, 'name'));
                  }}
                />
              </Field>
              <div className="button-row">
                <button type="submit" className="primary-button" disabled={saving}>저장</button>
                <button type="button" className="ghost-button" onClick={() => setEditorOpen(false)}>취소</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
