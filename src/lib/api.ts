import { supabase } from "./supabase"
import { toast } from "react-toastify"
import axios from 'axios'

const API_BASE = 'http://localhost:8000' // change to your backend URL

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

export const signup = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    })

    if (error) {
        toast.error(error.message) // Show meaningful Supabase error
        throw new Error(error.message)
    }

    toast.success("Signup successful! Check your email to confirm.")
    return data
}