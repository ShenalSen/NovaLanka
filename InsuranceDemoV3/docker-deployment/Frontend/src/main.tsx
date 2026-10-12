import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'  
import GlobalStyles from './styles/GlobalStyles'
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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GlobalStyles />
    <App />
  </React.StrictMode>,
)