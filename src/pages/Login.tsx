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
        <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
            <h2 className="text-xl font-bold">Login</h2>
            <input
                className="input border p-2"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                className="input border p-2"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin} className="btn bg-blue-600 text-white px-4 py-2 rounded">
                Login
            </button>
            <p>
                Don’t have an account?{" "}
                <span className="text-blue-500 cursor-pointer" onClick={() => navigate("/signup")}>
                    Signup
                </span>
            </p>
        </div>
    );
}
