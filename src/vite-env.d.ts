/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_ENV: 'development' | 'production' | 'test'
  readonly VITE_APP_BASE_URI: string
}

declare interface Window {
  gtag: any
  fbq: any
}
