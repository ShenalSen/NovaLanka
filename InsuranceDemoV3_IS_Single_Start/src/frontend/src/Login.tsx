import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

const credentials = [
  {
    role: "admin",
    email: "admin@abc.com",
    password: "admin123",
    redirect: "/admin",
  },
  {
    role: "customer",
    email: "customer@abc.com",
    password: "customer123",
    redirect: "/customer",
  },
  {
    role: "employee",
    email: "employee@abc.com",
    password: "employee123",
    redirect: "/employee",
  },
];

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const user = credentials.find(
      (cred) => cred.email === email && cred.password === password
    );

    if (!user) {
      setError("Invalid email or password.");
      return;
    }

    setError("");
     localStorage.setItem(
      "portalUser",
      JSON.stringify({ portal: user.role, email: user.email })
    );
    navigate(user.redirect);
  };
  return (
    <div className="login-container">
      <div className="login-left">
        <img src="/src/assets/loginfront.png" alt="Login Illustration" className="login-image" />
      </div>
      <div className="login-right">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2 className="login-title">Welcome back!</h2>
          <p className="login-subtitle">Enter your Credentials to access your account</p>
          {error && <div className="login-error" style={{ color: 'red' }}>{error}</div>}
          <label className="login-label" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            className="login-input"
            placeholder="mail@abc.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <label className="login-label" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className="login-input"
            placeholder="********"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <div className="login-options">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
              />
              Remember Me
            </label>
            <a href="/forgot-password" className="forgot-password">Forgot Password?</a>
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;