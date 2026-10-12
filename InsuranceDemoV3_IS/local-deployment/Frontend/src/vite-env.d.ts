/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AUTH_SIGN_IN_REDIRECT_URL: string
  readonly VITE_AUTH_SIGN_OUT_REDIRECT_URL: string
  readonly VITE_AUTH_CLIENT_ID: string
  readonly VITE_AUTH_BASE_URL: string
  readonly VITE_AUTH_SCOPE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
