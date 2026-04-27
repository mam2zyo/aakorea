import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: '/office/',
  plugins: [react()],
  resolve: {
    alias: {
      // @/를 사용하여 src 폴더 내부 파일에 쉽게 접근할 수 있게 합니다.
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3001, // 오피스 개발 서버 포트
    proxy: {
      // /api로 시작하는 요청은 백엔드 서버(Spring Boot)로 전달합니다.
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
    },
  },
  build: {
    // 빌드 결과물은 office/dist에 생성됩니다.
    outDir: 'dist',
    emptyOutDir: true,
  }
})
