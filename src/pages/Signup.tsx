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
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            toast.error(error.message); // show Supabase error
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
        <form
            onSubmit={handleSignup}
            className="flex flex-col items-center justify-center min-h-screen space-y-4"
        >
            <h2 className="text-xl font-bold">Signup</h2>
            <input
                className="input border p-2"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                className="input border p-2"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button
                type="submit"
                disabled={loading}
                className="btn bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
                {loading ? "Signing up..." : "Signup"}
            </button>
        </form>
    );
}
