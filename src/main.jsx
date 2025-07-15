import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './css/index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router";
import '@fortawesome/fontawesome-free/css/all.css'
import '@ant-design/v5-patch-for-react-19' ; 
import { initAxiosInterceptors } from '@helpers/auth/auth';
  initAxiosInterceptors();
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
