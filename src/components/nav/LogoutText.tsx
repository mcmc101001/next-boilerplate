"use client";

import { signOut } from "next-auth/react";
import toast from "react-hot-toast";

export default function LogoutText() {
  const handleLogin = async () => {
    try {
      await signOut();
    } catch (error) {
      toast.error("There was an error signing out");
    }
  };

  return (
    <button id="loginButton" onClick={handleLogin}>
      Sign Out
    </button>
  );
}
