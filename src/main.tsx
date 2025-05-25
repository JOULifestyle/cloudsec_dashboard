
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React from "react";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
    <ToastContainer position="top-right" autoClose={3000} />
  </React.StrictMode>
);
