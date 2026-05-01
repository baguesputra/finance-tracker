import { useState } from "react";
import API from "../services/API";
import { useNavigate } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await API.post("/auth/login", { email, password });

            localStorage.setItem('token', res.data.token);
            navigate("/dashboard");
        } catch (err) {
            alert(err.response?.data?.error || "Login failed");
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                <input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;