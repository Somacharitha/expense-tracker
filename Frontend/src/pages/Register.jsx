import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Register() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {

    const res = await fetch("http://127.0.0.1:5000/register", {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        name,
        email,
        password,
      }),

    });

    const data = await res.json();

    if (data.message) {

      alert("Registration successful!");

      navigate("/");

    } else {

      alert("Registration failed");

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

      {/* Register Card */}
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
                d="M12 4v16m8-8H4"
              />

            </svg>

          </div>

        </div>

        <h2 className="text-2xl font-bold text-white text-center mb-6">
          Create Account
        </h2>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-800 text-white rounded-lg"
        />

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
          onClick={handleRegister}
          className="w-full bg-indigo-600 hover:bg-indigo-700 hover:scale-105 transition p-3 rounded-lg text-white font-semibold"
        >
          Register
        </button>

        <p className="text-gray-300 mt-4 text-sm text-center">
          Already have an account?{" "}
          <Link to="/" className="text-indigo-400">
            Login
          </Link>
        </p>

      </div>

    </div>

  );

}

export default Register;