import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const CWPPResults = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const fetchScan = async () => {
        setLoading(true);
        try {
            const res = await axios.post("http://localhost:8000/scan/cwpp");
            setData(res.data.results);
            toast.success("CWPP scan successful");
        } catch (error) {
            console.error(error);
            toast.error("CWPP scan failed");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchScan();
    }, []);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">CWPP Runtime Scan Results</h2>
            {loading ? (
                <div className="text-blue-500 animate-pulse">Scanning for threats...</div>
            ) : (
                <div className="space-y-2">
                    {data?.findings?.map((item: any, index: number) => (
                        <div key={index} className="bg-red-100 p-3 rounded">
                            <strong>{item.type}:</strong> {item.message}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CWPPResults;
