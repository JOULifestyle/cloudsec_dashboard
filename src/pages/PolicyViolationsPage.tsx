import { useEffect, useState } from "react";
import { getPolicyViolations } from "../lib/api";

export default function PolicyViolationsPage() {
  const [violations, setViolations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchViolations() {
      const res = await getPolicyViolations();
      setViolations(res || []);
      setLoading(false);
    }
    fetchViolations();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Policy Violations</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-900 border rounded-2xl shadow">
            <thead>
              <tr>
                <th className="p-3 border-b">Control</th>
                <th className="p-3 border-b">Description</th>
                <th className="p-3 border-b">Severity</th>
              </tr>
            </thead>
            <tbody>
              {violations.map((v, idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-3">{v.control}</td>
                  <td className="p-3">{v.description}</td>
                  <td className={`p-3 font-bold ${v.severity === "HIGH" ? "text-red-500" : v.severity === "MEDIUM" ? "text-yellow-500" : "text-green-500"}`}>
                    {v.severity}
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
