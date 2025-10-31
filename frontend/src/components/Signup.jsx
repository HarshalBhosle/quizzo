import React from "react";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { signupUser } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(signupUser(form)).then(() => navigate("/dashboard"));
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-96">
        <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
        <input type="text" placeholder="Name" className="border p-2 w-full mb-3"
          onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input type="email" placeholder="Email" className="border p-2 w-full mb-3"
          onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input type="password" placeholder="Password" className="border p-2 w-full mb-3"
          onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button className="bg-green-600 text-white w-full p-2 rounded">
          Register
        </button>
      </form>
    </div>
  );
}
