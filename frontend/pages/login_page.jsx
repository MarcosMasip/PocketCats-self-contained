"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../styles/LoginPage_old.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginForm from "../components/LoginForm";
import { toast } from "react-toastify";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  // Checking for token on mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      router.push("/page_after_login");
    }
  }, []);

  const isEmailValid = (email) => {
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isEmailValid(email)) {
      toast.error("Invalid email format");
      return;
    } else if (password.length === 0) {
      toast.error("Please enter your password");
      return;
    } else if (password.length <= 6) {
      toast.error("Your password must be at least 6 characters long");
      return;
    } else {
      // Here we can check if the email and the password are correct according to DB.
      router.push("/page_after_login");
    }
  };

  const handleDemoLogin = async () => {
    try {
      const res = await fetch("http://localhost:5432/auth/demo", { method: "POST" });
      if (!res.ok) {
        toast.error("Demo login failed");
        return;
      }
      const data = await res.json();
      localStorage.setItem("authToken", data.token);
      router.push("/page_after_login");
    } catch (err) {
      toast.error("Demo login error");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <h1 className={styles.title2}>PocketCats</h1>
        <LoginForm
          email={email}
          password={password}
          onEmailChange={(e) => setEmail(e.target.value)}
          onPasswordChange={(e) => setPassword(e.target.value)}
          onSubmit={handleSubmit}
        />
        <div style={{ marginTop: 12 }}>
          <button className={styles.submitButton} onClick={handleDemoLogin}>
            Demo Login (local)
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default LoginPage;
