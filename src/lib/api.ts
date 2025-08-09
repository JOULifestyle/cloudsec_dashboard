import axios from 'axios';
import { supabase } from '../lib/supabaseClient';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// Get token in interceptor using async getSession
api.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession();
  if (data?.session?.access_token) {
    config.headers.Authorization = `Bearer ${data.session.access_token}`;
    console.log("Token attached:", data.session.access_token);
  }
  return config;
}, (error) => Promise.reject(error));

export const getCSPMScanResults = async () => {
  const response = await api.get('/scan/cspm');
  return response.data;
};

export const getCWPPScanResults = async () => {
  const response = await api.get('/scan/cwpp');
  return response.data;
};

export const triggerCSPMScan = async () => {
  const response = await api.post('/scan/cspm');
  return response.data;
};

export const triggerCWPPScan = async () => {
  const response = await api.post('/scan/cwpp');
  return response.data;
};

export const getScanHistory = async () => {
  const response = await api.get('/results/history');
  return response.data;
};

export const getPolicyViolations = async () => {
  const response = await api.get('/policy/violations');
  return response.data;
};

export const getDashboardStats = async () => {
  const response = await api.get('/dashboard/stats');
  return response.data;
};


