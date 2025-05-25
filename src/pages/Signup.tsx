import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const signup = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) {
            toast.error(error.message);
            throw new Error(error.message);
        }
        toast.success("Signup successful! Check your email to confirm.");
        return data;
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await signup(email, password);
            navigate("/login");
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <form
                onSubmit={handleSignup}
                className="w-full max-w-md bg-white rounded-lg shadow-md p-8"
            >
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Signup</h2>

                <input
                    className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    className="w-full mb-6 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded transition duration-200 disabled:opacity-50"
                >
                    {loading ? "Signing up..." : "Signup"}
                </button>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <span
                        className="text-green-600 hover:underline cursor-pointer"
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </span>
                </p>
            </form>
        </div>
    );
}
