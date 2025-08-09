import { useEffect, useState } from "react";
import { getCWPPScanResults } from "../lib/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function CWPPScanPage() {
  const [results, setResults] = useState<any[]>([]);
  const [scanMeta, setScanMeta] = useState({ scan_type: "", timestamp: "" });
  const [loading, setLoading] = useState(true);

  const fetchResults = async () => {
    setLoading(true);
    const res = await getCWPPScanResults();
    const findings = res?.results?.findings || [];
    setResults(findings);
    setScanMeta({
      scan_type: res?.results?.scan_type || "cwpp",
      timestamp: res?.results?.timestamp || "",
    });
    setLoading(false);
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(results, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cwpp_results.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Type,Message", ...results.map((row) => `"${row.type}","${row.message}"`)].join("\n");
    const encodedUri = encodeURI(csvContent);
    const a = document.createElement("a");
    a.href = encodedUri;
    a.download = "cwpp_results.csv";
    a.click();
  };

  const getSeverity = (type: string) => {
    if (type.toLowerCase().includes("open port")) return "High";
    if (type.toLowerCase().includes("warning")) return "Medium";
    return "Info";
  };

  const getBadgeColor = (severity: string) => {
    switch (severity) {
      case "High":
        return "bg-red-600 text-white";
      case "Medium":
        return "bg-yellow-500 text-black";
      default:
        return "bg-gray-300 text-black";
    }
  };

  const chartData = Object.entries(
    results.reduce((acc: any, curr) => {
      acc[curr.type] = (acc[curr.type] || 0) + 1;
      return acc;
    }, {})
  ).map(([type, count]) => ({ type, count }));

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">CWPP Scan Results</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Scan metadata */}
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md shadow">
            <p>
              <strong>Scan Type:</strong> {scanMeta.scan_type}
            </p>
            <p>
              <strong>Timestamp:</strong>{" "}
              {new Date(scanMeta.timestamp).toLocaleString()}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mt-4">
            <button
              onClick={fetchResults}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
            >
              Scan Again
            </button>
            <button
              onClick={downloadJSON}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Export JSON
            </button>
            <button
              onClick={downloadCSV}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Export CSV
            </button>
          </div>

          {/* Chart */}
          {chartData.length > 0 && (
            <div className="h-64 mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="type" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#4F46E5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto mt-6">
            <table className="min-w-full bg-white dark:bg-gray-900 border rounded-lg shadow">
              <thead>
                <tr>
                  <th className="p-3 border-b text-left">Type</th>
                  <th className="p-3 border-b text-left">Message</th>
                  <th className="p-3 border-b text-left">Severity</th>
                </tr>
              </thead>
              <tbody>
                {results.map((row, idx) => {
                  const severity = getSeverity(row.type);
                  return (
                    <tr key={idx} className="border-t">
                      <td className="p-3">{row.type}</td>
                      <td className="p-3">{row.message}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 text-sm rounded-full ${getBadgeColor(
                            severity
                          )}`}
                        >
                          {severity}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
