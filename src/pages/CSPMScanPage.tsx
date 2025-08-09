import { useEffect, useState } from "react";
import { getCSPMScanResults } from "../lib/api";

type ScanResult = {
  service: string;
  resource: string;
  issue: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
};

export default function CSPMScanPage() {
  const [results, setResults] = useState<ScanResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanTime, setScanTime] = useState<string>("");

  const fetchResults = async () => {
    setLoading(true);
    const res = await getCSPMScanResults();
    const flattened: ScanResult[] = [];

    if (res?.results) {
      // EC2
      const ec2Instances = res.results.ec2?.ec2_instances?.Reservations || [];
      if (ec2Instances.length === 0) {
        flattened.push({
          service: "EC2",
          resource: "None found",
          issue: "No EC2 instances",
          severity: "LOW",
        });
      }

      // S3
      const s3Buckets = res.results.s3?.s3_buckets || [];
      for (const bucket of s3Buckets) {
        flattened.push({
          service: "S3",
          resource: bucket.bucket,
          issue: "Public ACLs might exist",
          severity: "MEDIUM",
        });
      }

      // IAM
      const users = res.results.iam?.iam_users?.Users || [];
      for (const user of users) {
        flattened.push({
          service: "IAM",
          resource: user.UserName,
          issue: "IAM user detected",
          severity: "LOW",
        });
      }
    }

    setResults(flattened);
    setScanTime(new Date().toLocaleString());
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
    a.download = "cspm-scan-results.json";
    a.click();
  };

  const exportCSV = () => {
    const header = "Service,Resource,Issue,Severity\n";
    const rows = results
      .map((r) => `${r.service},${r.resource},${r.issue},${r.severity}`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cspm-scan-results.csv";
    a.click();
  };

  const getSummary = () => {
    const total = results.length;
    const high = results.filter((r) => r.severity === "HIGH").length;
    const medium = results.filter((r) => r.severity === "MEDIUM").length;
    const low = results.filter((r) => r.severity === "LOW").length;
    return { total, high, medium, low };
  };

  const { total, high, medium, low } = getSummary();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">CSPM Scan Results</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-4">
        Last scanned: {scanTime || "N/A"}
      </p>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <button
          onClick={fetchResults}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Scan Again
        </button>
        <button
          onClick={downloadJSON}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Download JSON
        </button>
        <button
          onClick={exportCSV}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
        >
          Export CSV
        </button>
      </div>

      {/* Summary Card */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <p className="text-gray-500 text-sm">Total Findings</p>
          <p className="text-xl font-bold">{total}</p>
        </div>
        <div className="bg-red-100 dark:bg-red-900 p-4 rounded shadow">
          <p className="text-gray-700 dark:text-white text-sm">High Severity</p>
          <p className="text-xl font-bold text-red-600">{high}</p>
        </div>
        <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded shadow">
          <p className="text-gray-700 dark:text-white text-sm">Medium Severity</p>
          <p className="text-xl font-bold text-yellow-600">{medium}</p>
        </div>
        <div className="bg-green-100 dark:bg-green-900 p-4 rounded shadow">
          <p className="text-gray-700 dark:text-white text-sm">Low Severity</p>
          <p className="text-xl font-bold text-green-600">{low}</p>
        </div>
      </div>

      {loading ? (
        <p className="text-lg text-gray-600 dark:text-gray-300">Loading...</p>
      ) : results.length === 0 ? (
        <p className="text-lg text-gray-600 dark:text-gray-300">
          No scan results found.
        </p>
      ) : (
        <div className="overflow-x-auto rounded shadow">
          <table className="min-w-full bg-white dark:bg-gray-900 border rounded">
            <thead>
              <tr className="text-left">
                <th className="p-3 border-b">Service</th>
                <th className="p-3 border-b">Resource</th>
                <th className="p-3 border-b">Issue</th>
                <th className="p-3 border-b">Severity</th>
              </tr>
            </thead>
            <tbody>
              {results.map((row, idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-3">{row.service}</td>
                  <td className="p-3">{row.resource}</td>
                  <td className="p-3">{row.issue}</td>
                  <td className="p-3">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                        row.severity === "HIGH"
                          ? "bg-red-200 text-red-700"
                          : row.severity === "MEDIUM"
                          ? "bg-yellow-200 text-yellow-700"
                          : "bg-green-200 text-green-700"
                      }`}
                    >
                      {row.severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
