import React from 'react'
import ReactDOM from 'react-dom/client'
import { AuthProvider } from "@asgardeo/auth-react"
import App from './App'  
import GlobalStyles from './styles/GlobalStyles'
import './index.css'
import axios from 'axios'

axios.defaults.headers.common['Accept'] = 'application/json'
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.withCredentials = false

axios.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.status, error.response?.statusText, error.config?.url);
    return Promise.reject(error);
  }
);

const asgardeoAuthConfig = {
    signInRedirectURL: import.meta.env.VITE_AUTH_SIGN_IN_REDIRECT_URL,
    signOutRedirectURL: import.meta.env.VITE_AUTH_SIGN_OUT_REDIRECT_URL,
    clientID: import.meta.env.VITE_AUTH_CLIENT_ID,
    baseUrl: import.meta.env.VITE_AUTH_BASE_URL,
    scope: import.meta.env.VITE_AUTH_SCOPE?.split(' ') || ["openid", "profile", "groups", "email"]
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GlobalStyles />
    <AuthProvider config={ asgardeoAuthConfig }>
      <App />
    </AuthProvider>
  </React.StrictMode>,
)