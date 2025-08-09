import { useEffect, useState } from "react";
import { api } from "../lib/api"; 

export default function ScanTable() {
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    api.get("/scan/all").then(res => setResults(res.data));
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-3">Recent Scan Results</h3>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th>Date</th>
            <th>EC2</th>
            <th>S3</th>
            <th>IAM</th>
          </tr>
        </thead>
        <tbody>
          {results.map((scan, i) => (
            <tr key={i} className="border-t">
              <td>{new Date(scan.timestamp || Date.now()).toLocaleString()}</td>
              <td>{scan.ec2?.ec2_instances?.Reservations?.length || 0}</td>
              <td>{scan.s3?.s3_buckets?.length || 0}</td>
              <td>{scan.iam?.iam_users?.Users?.length || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
