import React, { useEffect, useState } from "react";
import { getScanHistory } from "../lib/api";

const itemsPerPage = 5;

const ScanHistoryPage: React.FC = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await getScanHistory();
        const allHistory = res.history || [];
        setHistory(allHistory);
        setFilteredHistory(allHistory);
      } catch (err) {
        console.error("Failed to fetch history", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  useEffect(() => {
    const lower = searchTerm.toLowerCase();
    const filtered = history.filter((entry) => {
      const findings = entry.data.findings || [];
      const iamUsers = entry.data.iam?.iam_users?.Users || [];

      return (
        findings.some(
          (f: any) =>
            f.type?.toLowerCase().includes(lower) ||
            f.message?.toLowerCase().includes(lower)
        ) ||
        iamUsers.some((user: any) =>
          user.UserName?.toLowerCase().includes(lower)
        )
      );
    });

    setFilteredHistory(filtered);
    setCurrentPage(1);
  }, [searchTerm, history]);

  const handleDownloadJSON = () => {
    const blob = new Blob([JSON.stringify(filteredHistory, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "scan_history.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadCSV = () => {
    const sanitize = (value: any) => `"${String(value).replace(/"/g, '""')}"`;
    const csvRows = [
      ["Scan Type", "Scan Timestamp", "Finding Type", "Finding Message"],
      ...filteredHistory.flatMap((entry) => {
        const scanType = entry.data.scan_type;
        const timestamp = new Date(entry.data.timestamp).toLocaleString();

        if (scanType === "cwpp") {
          return entry.data.findings.map((f: any) => [
            sanitize(scanType),
            sanitize(timestamp),
            sanitize(f.type),
            sanitize(f.message),
          ]);
        } else if (scanType === "cspm") {
          return entry.data.iam?.iam_users?.Users?.map((user: any) => [
            sanitize(scanType),
            sanitize(timestamp),
            "IAM User",
            `User: ${user.UserName}`,
          ]) || [];
        }
        return [];
      }),
    ];

    const csvContent = csvRows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "scan_history.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredHistory.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Scan History</h1>

      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <input
          type="text"
          placeholder="Search findings or IAM users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-1/2"
        />
        <div className="flex gap-2">
          <button
            onClick={handleDownloadJSON}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Download JSON
          </button>
          <button
            onClick={handleDownloadCSV}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Download CSV
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : filteredHistory.length === 0 ? (
        <p>No scan history found.</p>
      ) : (
        <div className="space-y-4">
          {currentItems.map((entry) => {
            const { scan_type, timestamp } = entry.data;

            return (
              <div
                key={entry.id}
                className="border border-gray-300 p-4 rounded shadow"
              >
                <div className="mb-2">
                  <strong>Scan Type:</strong> {scan_type}
                </div>
                <div className="mb-2">
                  <strong>Scan Timestamp:</strong>{" "}
                  {new Date(timestamp).toLocaleString()}
                </div>

                {scan_type === "cwpp" && (
                  <div>
                    <strong>Findings:</strong>
                    <ul className="list-disc pl-5">
                      {entry.data.findings.map((f: any, index: number) => (
                        <li key={index}>
                          <span className="font-medium">{f.type}:</span>{" "}
                          {f.message}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {scan_type === "cspm" && (
                  <div className="space-y-2 mt-3">
                    <details>
                      <summary className="font-semibold cursor-pointer">
                        EC2 Instances
                      </summary>
                      <pre className="bg-gray-100 p-2 text-sm overflow-x-auto">
                        {JSON.stringify(entry.data.ec2, null, 2)}
                      </pre>
                    </details>
                    <details>
                      <summary className="font-semibold cursor-pointer">
                        S3 Buckets
                      </summary>
                      <pre className="bg-gray-100 p-2 text-sm overflow-x-auto">
                        {JSON.stringify(entry.data.s3, null, 2)}
                      </pre>
                    </details>
                    <details>
                      <summary className="font-semibold cursor-pointer">
                        IAM Users
                      </summary>
                      <pre className="bg-gray-100 p-2 text-sm overflow-x-auto">
                        {JSON.stringify(entry.data.iam, null, 2)}
                      </pre>
                    </details>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {filteredHistory.length > itemsPerPage && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-white text-black"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScanHistoryPage;
