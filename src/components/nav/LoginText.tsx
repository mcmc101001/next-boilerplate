"use client";

import { signIn } from "next-auth/react";
import toast from "react-hot-toast";

export default function LoginText() {
  const handleLogin = async () => {
    try {
      await signIn("google");
    } catch (error) {
      toast.error("There was an error signing in");
    }
  };

  return (
    <button id="loginButton" onClick={handleLogin}>
      Sign In
    </button>
  );
}
