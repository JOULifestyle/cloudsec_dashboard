
import axios from 'axios'

const API_BASE = 'https://cloudsec-backend.onrender.com' // change to your backend URL

export const scanNow = async () => {
    const res = await axios.get(`${API_BASE}/scan/cspm`)
    return res.data
}

export const scanCWPP = async () => {
    const res = await axios.get(`${API_BASE}/scan/cwpp`)
    return res.data
}

export const getSteampipeResults = async () => {
    const res = await axios.get(`${API_BASE}/steampipe/results`)
    return res.data
}
