import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

export const DriverLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
    if(!email || !password) {   
        toast.error("Please enter both email and password");
        return;
    }
    const login = async () => {
      const response = await fetch("https://localhost:7011/driver/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      localStorage.setItem("userEmail", data.name);
      localStorage.setItem("taxiToken", data.token);
    };
    login();
    navigate("/driver");
    setEmail("");
    setPassword("");
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>Login</div>
        <div>Email</div>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div>Password</div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </>
  );
};
