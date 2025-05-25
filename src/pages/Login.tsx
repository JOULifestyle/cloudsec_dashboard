import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            toast.error("Login failed: " + error.message);
        } else {
            toast.success("Login successful!");
            navigate("/dashboard");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>

                <input
                    className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    className="w-full mb-6 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    onClick={handleLogin}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition duration-200"
                >
                    Login
                </button>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Don’t have an account?{" "}
                    <span
                        className="text-blue-500 hover:underline cursor-pointer"
                        onClick={() => navigate("/signup")}
                    >
                        Sign up
                    </span>
                </p>
            </div>
        </div>
    );
}
