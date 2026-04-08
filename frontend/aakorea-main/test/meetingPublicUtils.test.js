import assert from 'node:assert/strict'
import test from 'node:test'

import {
  buildKakaoMapAppUrl,
  buildKakaoMapUrl,
  shouldOpenKakaoMapAppFirst,
} from '../src/features/groups/public/utils.js'

test('kakao map URLs are built for app and desktop web targets', () => {
  assert.equal(
    buildKakaoMapAppUrl(37.5665, 126.978),
    'kakaomap://look?p=37.5665,126.978',
  )
  assert.equal(
    buildKakaoMapUrl('서울 시청', 37.5665, 126.978),
    'https://map.kakao.com/link/map/%EC%84%9C%EC%9A%B8%20%EC%8B%9C%EC%B2%AD,37.5665,126.978',
  )
})

test('kakao map app-first detection only enables mobile user agents', () => {
  assert.equal(
    shouldOpenKakaoMapAppFirst(
      'Mozilla/5.0 (Linux; Android 14; SM-S918N) AppleWebKit/537.36 Chrome/123.0 Mobile Safari/537.36',
    ),
    true,
  )
  assert.equal(
    shouldOpenKakaoMapAppFirst(
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 Version/17.4 Mobile/15E148 Safari/604.1',
    ),
    true,
  )
  assert.equal(
    shouldOpenKakaoMapAppFirst(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/123.0 Safari/537.36',
    ),
    false,
  )
})
