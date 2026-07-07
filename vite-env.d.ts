/// <reference types="vite/client" />

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_URL: string
  readonly VITE_API_URL?: string
  // tambahkan variabel environment lainnya di sini
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

