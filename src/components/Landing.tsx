import { useNavigate } from "react-router-dom";

export default function Landing() {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-6">Welcome to CloudSec Platform</h1>
            <button
                onClick={() => navigate("/login")}
                className="btn mb-4 px-6 py-2 bg-blue-600 text-white rounded"
            >
                Login
            </button>
            <button
                onClick={() => navigate("/signup")}
                className="btn px-6 py-2 bg-green-600 text-white rounded"
            >
                Signup
            </button>
        </div>
    );
}
