import { useEffect, useState } from "react";
import { getDashboardStats } from "../lib/api";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    async function fetchStats() {
      const res = await getDashboardStats();
      setStats(res);
    }
    fetchStats();
  }, []);

  const data = stats?.trend || [];

  return (
    <div className="p-6 space-y-8">
      <section>
        <h1 className="text-3xl font-bold mb-2">Welcome to CloudSec!</h1>
        <p className="text-gray-500 dark:text-gray-400">Monitor and secure your cloud resources effectively.</p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow">
          <h2 className="text-lg font-semibold">Total Scans</h2>
          <p className="text-2xl">{stats?.total_scans ?? "..."}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow">
          <h2 className="text-lg font-semibold">Critical Findings</h2>
          <p className="text-2xl text-red-500">{stats?.critical_findings ?? "..."}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow">
          <h2 className="text-lg font-semibold">Medium Findings</h2>
          <p className="text-2xl text-yellow-500">{stats?.medium_findings ?? "..."}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow">
          <h2 className="text-lg font-semibold">Low Findings</h2>
          <p className="text-2xl text-green-500">{stats?.low_findings ?? "..."}</p>
        </div>
      </section>

      <section className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow">
        <h2 className="text-xl font-semibold mb-4">Scan Trends</h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="scans" stroke="#8884d8" fill="#8884d8" />
          </AreaChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
}
