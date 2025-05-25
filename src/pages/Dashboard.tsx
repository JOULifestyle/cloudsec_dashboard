import { useState } from 'react'
import { scanNow, scanCWPP } from '../lib/api'
import { ClipLoader } from 'react-spinners'
import { toast } from 'react-toastify'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts'

export default function Dashboard() {
    const [scanResult, setScanResult] = useState<any[] | null>(null)
    const [cwppResult, setCwppResult] = useState<any[] | null>(null)
    const [loading, setLoading] = useState(false)

    const handleScan = async () => {
        setLoading(true)
        try {
            const data = await scanNow()
            setScanResult(data.results)
            toast.success('CSPM scan completed')
        } catch (err) {
            toast.error('Error running CSPM scan')
        } finally {
            setLoading(false)
        }
    }

    const handleCWPPScan = async () => {
        setLoading(true)
        try {
            const data = await scanCWPP()
            setCwppResult(data.results)
            toast.success('CWPP scan completed')
        } catch (err) {
            toast.error('Error running CWPP scan')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">CloudSec Dashboard</h1>
            <div className="space-x-4 mb-4">
                <button className="btn" onClick={handleScan}>Run CSPM Scan</button>
                <button className="btn" onClick={handleCWPPScan}>Run CWPP Scan</button>
            </div>

            {loading ? (
                <div className="flex justify-center">
                    <ClipLoader size={35} color="#2563EB" />
                </div>
            ) : (
                <>
                    {scanResult && (
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-2">CSPM Results</h2>
                            <pre className="bg-gray-100 p-4 rounded text-sm">
                                {JSON.stringify(scanResult, null, 2)}
                            </pre>
                        </div>
                    )}

                    {cwppResult && (
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-2">CWPP Results</h2>
                            <pre className="bg-green-100 p-4 rounded text-sm">
                                {JSON.stringify(cwppResult, null, 2)}
                            </pre>
                        </div>
                    )}

                    {(scanResult || cwppResult) && (
                        <div className="mt-6">
                            <h2 className="text-xl font-semibold mb-2">Scan Summary Chart</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={[
                                    {
                                        name: 'CSPM',
                                        count: scanResult ? scanResult.length : 0,
                                    },
                                    {
                                        name: 'CWPP',
                                        count: cwppResult ? cwppResult.length : 0,
                                    },
                                ]}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#2563EB" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
