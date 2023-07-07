import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './Page/App.jsx'
import './index.css'
import MessageProvider from './MeesageProvier.jsx'


ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <MessageProvider>
    <App />
  </MessageProvider>
  //</React.StrictMode>,
)
