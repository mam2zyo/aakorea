import { useState } from 'react';
import { DetailItem } from '@/shared/components/ui';
import { meetingApi } from '@/shared/api';

const BACKFILL_ITEM_LIMIT = 12;

interface BackfillItem {
  meetingId: number;
  groupName: string;
  locationAddress: string;
  status: string;
  message: string;
  latitude?: number;
  longitude?: number;
}

interface BackfillResult {
  totalCandidateCount: number;
  resolvedCount: number;
  failedCount: number;
  updatedCount: number;
  items: BackfillItem[];
}

interface MeetingCoordinateBackfillPanelProps {
  onError: (error: any, fallback?: string) => void;
  onSuccess: (message: string) => void;
}

export function MeetingCoordinateBackfillPanel({ onError, onSuccess }: MeetingCoordinateBackfillPanelProps) {
  const [backfillPreview, setBackfillPreview] = useState<BackfillResult | null>(null);
  const [previewingBackfill, setPreviewingBackfill] = useState(false);
  const [applyingBackfill, setApplyingBackfill] = useState(false);

  const backfillBusy = previewingBackfill || applyingBackfill;
  const previewItems = backfillPreview?.items?.slice(0, BACKFILL_ITEM_LIMIT) ?? [];

  async function previewBackfill() {
    setPreviewingBackfill(true);
    try {
      const result = await meetingApi.backfillCoordinates(true);
      setBackfillPreview(result);
      onSuccess(
        `dry-run 완료: 대상 ${result.totalCandidateCount}개, 좌표 확인 가능 ${result.resolvedCount}개, 실패 ${result.failedCount}개`
      );
    } catch (error) {
      onError(error, '모임 좌표 dry-run 조회에 실패했습니다.');
    } finally {
      setPreviewingBackfill(false);
    }
  }

  async function applyBackfill() {
    const targetCount = backfillPreview?.resolvedCount ?? 0;
    const confirmed = window.confirm(
      `좌표 일괄 보정을 실행하시겠습니까?\n현재 미리보기 기준으로 최대 ${targetCount}개 모임에 좌표가 반영됩니다.`
    );
    if (!confirmed) return;

    setApplyingBackfill(true);
    try {
      const result = await meetingApi.backfillCoordinates(false);
      setBackfillPreview(result);
      onSuccess(
        `좌표 보정을 완료했습니다. 대상 ${result.totalCandidateCount}개 중 ${result.updatedCount}개 반영, 실패 ${result.failedCount}개`
      );
    } catch (error) {
      onError(error, '모임 좌표 보정에 실패했습니다.');
    } finally {
      setApplyingBackfill(false);
    }
  }

  return (
    <section className="editor-card office-ops-panel" aria-label="모임 좌표 보정">
      <div className="section-header">
        <div>
          <h3>모임 좌표 일괄 보정</h3>
          <p className="office-form-note">
            주소는 있지만 좌표가 비어 있는 모임만 찾아 카카오 지오코딩으로 좌표를 채웁니다.
            먼저 dry-run으로 대상과 실패 건을 확인한 뒤 실제 반영할 수 있습니다.
          </p>
        </div>

        <div className="button-row button-row--compact">
          <button
            className="ghost-button ghost-button--small"
            type="button"
            onClick={previewBackfill}
            disabled={backfillBusy}
          >
            {previewingBackfill ? '대상 조회 중...' : 'dry-run 미리보기'}
          </button>
          <button
            className="primary-button primary-button--small"
            type="button"
            onClick={applyBackfill}
            disabled={backfillBusy || !backfillPreview?.totalCandidateCount}
          >
            {applyingBackfill ? '좌표 반영 중...' : '좌표 반영'}
          </button>
        </div>
      </div>

      <div className="office-ops-panel__body">
        <div className="content-note">
          <strong>실행 기준</strong>
          <p>주소가 있고 위도 또는 경도가 비어 있는 모임만 대상으로 삼습니다. 이미 좌표가 있는 모임은 건드리지 않습니다.</p>
        </div>

        {backfillPreview ? (
          <div className="office-ops-panel__summary">
            <div className="detail-grid">
              <DetailItem label="보정 대상" value={`${backfillPreview.totalCandidateCount}개`} />
              <DetailItem label="좌표 확인 가능" value={`${backfillPreview.resolvedCount}개`} />
              <DetailItem label="실패" value={`${backfillPreview.failedCount}개`} />
              <DetailItem label="실제 반영" value={`${backfillPreview.updatedCount}개`} />
            </div>

            <div className="content-note">
              <strong>최근 결과 {previewItems.length}건</strong>
              <div className="entity-list">
                {previewItems.map((item) => (
                  <article
                    key={`${item.meetingId}-${item.status}`}
                    className="entity-item office-ops-panel__result-item"
                  >
                    <div className="entity-item__body">
                      <strong>
                        #{item.meetingId} {item.groupName}
                      </strong>
                      <span className="entity-item__meta">{item.locationAddress}</span>
                      <span className="entity-item__meta">
                        {formatBackfillStatus(item.status)} · {item.message}
                      </span>
                      {typeof item.latitude === 'number' && typeof item.longitude === 'number' ? (
                        <span className="entity-item__meta">
                          {item.latitude.toFixed(6)}, {item.longitude.toFixed(6)}
                        </span>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
              {(backfillPreview?.items?.length ?? 0) > BACKFILL_ITEM_LIMIT ? (
                <p className="section-note">
                  나머지 {backfillPreview.items.length - BACKFILL_ITEM_LIMIT}건은 API 응답에서 계속 확인할 수 있습니다.
                </p>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="content-note">
            <strong>아직 실행 전입니다.</strong>
            <p>먼저 dry-run 미리보기로 보정 대상과 실패 건수를 확인해 주세요.</p>
          </div>
        )}
      </div>
    </section>
  );
}

function formatBackfillStatus(status: string) {
  switch (status) {
    case 'READY':
      return '반영 가능';
    case 'UPDATED':
      return '반영 완료';
    case 'FAILED':
      return '실패';
    default:
      return status;
  }
}
