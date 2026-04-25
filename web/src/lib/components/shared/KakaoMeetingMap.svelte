<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  interface Props {
    latitude: number;
    longitude: number;
    groupName: string;
  }

  let { latitude, longitude, groupName }: Props = $props();

  const KAKAO_MAP_SCRIPT_ID = 'aakorea-kakao-map-sdk';
  const KAKAO_MAP_JAVASCRIPT_KEY = import.meta.env.VITE_KAKAO_MAP_JAVASCRIPT_KEY;

  let mapContainer: HTMLDivElement;
  let map: any;
  let marker: any;
  let loadError = $state(false);

  async function loadKakaoMapSdk(): Promise<any> {
    if (typeof window === 'undefined') return;
    if (window.kakao?.maps) {
      return new Promise((resolve) => {
        window.kakao.maps.load(() => resolve(window.kakao));
      });
    }

    return new Promise((resolve, reject) => {
      const existingScript = document.getElementById(KAKAO_MAP_SCRIPT_ID);
      if (existingScript) {
        existingScript.addEventListener('load', () => {
          window.kakao.maps.load(() => resolve(window.kakao));
        });
        return;
      }

      const script = document.createElement('script');
      script.id = KAKAO_MAP_SCRIPT_ID;
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_JAVASCRIPT_KEY}&autoload=false`;
      script.async = true;
      script.onload = () => {
        window.kakao.maps.load(() => resolve(window.kakao));
      };
      script.onerror = () => reject(new Error('Failed to load Kakao Maps SDK'));
      document.head.appendChild(script);
    });
  }

  async function initMap() {
    try {
      const kakao = await loadKakaoMapSdk();
      if (!mapContainer) return;

      const position = new kakao.maps.LatLng(latitude, longitude);
      const options = {
        center: position,
        level: 3
      };

      map = new kakao.maps.Map(mapContainer, options);
      marker = new kakao.maps.Marker({
        position: position
      });
      marker.setMap(map);
      
      loadError = false;
    } catch (e) {
      console.error('Kakao Map Load Error:', e);
      loadError = true;
    }
  }

  // Update map when coordinates change
  $effect(() => {
    if (latitude && longitude && map) {
      const kakao = window.kakao;
      const position = new kakao.maps.LatLng(latitude, longitude);
      map.setCenter(position);
      marker.setPosition(position);
    }
  });

  onMount(() => {
    initMap();
  });
</script>

<div class="map-wrapper">
  <div bind:this={mapContainer} class="map-canvas"></div>
  {#if loadError}
    <div class="map-error">
      <p>지도 정보를 불러오지 못했습니다.</p>
    </div>
  {/if}
</div>

<style>
  .map-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
    border-radius: 1rem;
    overflow: hidden;
  }

  .map-canvas {
    width: 100%;
    height: 100%;
    background: #f0f0f0;
  }

  .map-error {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(243, 244, 246, 0.9);
    color: var(--color-text-soft);
    font-size: 0.9rem;
    z-index: 10;
  }
</style>
