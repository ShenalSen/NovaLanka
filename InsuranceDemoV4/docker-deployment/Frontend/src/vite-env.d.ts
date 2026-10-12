/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AUTH_SIGN_IN_REDIRECT_URL: string
  readonly VITE_AUTH_SIGN_OUT_REDIRECT_URL: string
  readonly VITE_AUTH_CLIENT_ID: string
  readonly VITE_AUTH_BASE_URL: string
  readonly VITE_AUTH_SCOPE: string
  readonly VITE_MISSED_CALL_API_KEY: string
  readonly VITE_API_GATEWAY_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}