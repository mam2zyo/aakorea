import { useEffect, useRef, useState, useSyncExternalStore } from 'react'

const DESKTOP_MAP_MEDIA_QUERY = '(min-width: 921px)'
const KAKAO_MAP_SCRIPT_ID = 'aakorea-kakao-map-sdk'
const KAKAO_MAP_JAVASCRIPT_KEY = import.meta.env.VITE_KAKAO_MAP_JAVASCRIPT_KEY?.trim() ?? ''

let kakaoMapSdkPromise = null

function useMediaQuery(query) {
  return useSyncExternalStore(
    (onChange) => {
      if (typeof window === 'undefined') {
        return () => {}
      }

      const mediaQuery = window.matchMedia(query)
      mediaQuery.addEventListener('change', onChange)

      return () => {
        mediaQuery.removeEventListener('change', onChange)
      }
    },
    () => {
      if (typeof window === 'undefined') {
        return false
      }

      return window.matchMedia(query).matches
    },
    () => false,
  )
}

function loadKakaoMapSdk() {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Kakao Maps SDK requires a browser environment'))
  }

  if (!KAKAO_MAP_JAVASCRIPT_KEY) {
    return Promise.reject(new Error('VITE_KAKAO_MAP_JAVASCRIPT_KEY is missing'))
  }

  if (window.kakao?.maps) {
    return new Promise((resolve) => {
      window.kakao.maps.load(() => resolve(window.kakao))
    })
  }

  if (kakaoMapSdkPromise) {
    return kakaoMapSdkPromise
  }

  kakaoMapSdkPromise = new Promise((resolve, reject) => {
    function handleReady() {
      if (!window.kakao?.maps) {
        reject(new Error('Kakao Maps SDK did not initialize correctly'))
        return
      }

      window.kakao.maps.load(() => resolve(window.kakao))
    }

    function handleError() {
      reject(new Error('Failed to load Kakao Maps SDK'))
    }

    const existingScript = document.getElementById(KAKAO_MAP_SCRIPT_ID)

    if (existingScript) {
      if (existingScript.dataset.loaded === 'true') {
        handleReady()
        return
      }

      existingScript.addEventListener('load', handleReady, { once: true })
      existingScript.addEventListener('error', handleError, { once: true })
      return
    }

    const script = document.createElement('script')
    script.id = KAKAO_MAP_SCRIPT_ID
    script.async = true
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_JAVASCRIPT_KEY}&autoload=false`
    script.addEventListener('load', () => {
      script.dataset.loaded = 'true'
      handleReady()
    }, { once: true })
    script.addEventListener('error', handleError, { once: true })
    document.head.appendChild(script)
  }).catch((error) => {
    kakaoMapSdkPromise = null
    throw error
  })

  return kakaoMapSdkPromise
}

export function KakaoMeetingMap({
  latitude,
  longitude,
}) {
  const isDesktopViewport = useMediaQuery(DESKTOP_MAP_MEDIA_QUERY)
  const mapContainerRef = useRef(null)
  const [loadError, setLoadError] = useState(false)
  const hasCoordinates = Number.isFinite(latitude) && Number.isFinite(longitude)

  useEffect(() => {
    if (!hasCoordinates || !mapContainerRef.current) {
      return undefined
    }

    let cancelled = false

    void loadKakaoMapSdk()
      .then((kakao) => {
        if (cancelled || !mapContainerRef.current) {
          return
        }

        setLoadError(false)
        const position = new kakao.maps.LatLng(latitude, longitude)
        const map = new kakao.maps.Map(mapContainerRef.current, {
          center: position,
          level: isDesktopViewport ? 3 : 4,
        })
        const marker = new kakao.maps.Marker({
          position,
        })

        marker.setMap(map)
      })
      .catch(() => {
        if (!cancelled) {
          setLoadError(true)
        }
      })

    return () => {
      cancelled = true
    }
  }, [hasCoordinates, isDesktopViewport, latitude, longitude])

  if (!hasCoordinates) {
    return null
  }

  return (
    <div
      className={`meeting-focus-map${loadError ? ' meeting-focus-map--error' : ''}`}
      aria-label="모임 위치 지도"
    >
      <div
        ref={mapContainerRef}
        className="meeting-focus-map__canvas"
        aria-hidden="true"
      />

      {loadError ? (
        <p className="meeting-focus-map__error">지도 정보를 불러오지 못했습니다.</p>
      ) : null}
    </div>
  )
}
