import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {WebsocketChat} from "./components/websocket-chat";

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <WebsocketChat />
  </>
)
