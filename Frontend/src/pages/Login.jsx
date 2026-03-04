import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {

    const res = await fetch("http://127.0.0.1:5000/login", {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email,
        password,
      }),

    });

    const data = await res.json();

    if (data.token) {

      localStorage.setItem("token", data.token);

      navigate("/dashboard");

    } else {

      alert("Invalid credentials");

    }

  };

  return (

    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
"url('https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80')"
      }}
    >

      {/* Dark Overlay */}

      <div className="absolute inset-0 bg-black/70"></div>

      {/* Login Card */}

      <div className="relative bg-white/10 backdrop-blur-lg p-10 rounded-2xl shadow-2xl border border-white/10 w-[400px]">

        {/* Icon */}

        <div className="flex justify-center mb-6">

          <div className="bg-indigo-600 p-4 rounded-full">

            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-2 0-4 1-4 3s2 3 4 3 4 1 4 3-2 3-4 3m0-12V4m0 16v-2"
              />

            </svg>

          </div>

        </div>

        <h2 className="text-2xl font-bold text-white text-center mb-6">
          Expense Tracker Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-800 text-white rounded-lg"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-800 text-white rounded-lg"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-indigo-600 hover:bg-indigo-700 transition p-3 rounded-lg text-white font-semibold"
        >
          Login
        </button>

        <p className="text-gray-300 mt-4 text-sm text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-indigo-400">
            Register
          </Link>
        </p>

      </div>

    </div>

  );

}

export default Login;