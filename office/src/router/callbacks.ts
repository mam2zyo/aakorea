/**
 * 전역 콜백 — 페이지/컴포넌트에서 발생한 성공/실패를 처리합니다.
 * TODO: alert() 대신 Toast 시스템으로 교체 예정
 */
export function createRouteCallbacks() {
  function onSuccess(message: string) {
    console.log('SUCCESS:', message);
    alert(message);
  }

  function onError(error: any, fallbackMessage?: string) {
    console.error('ERROR:', error);
    const message =
      error?.response?.data?.message || fallbackMessage || '오류가 발생했습니다.';
    alert(message);
  }

  return { onSuccess, onError };
}
