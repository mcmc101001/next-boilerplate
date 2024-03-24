"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import { LogIn, Loader2 } from "lucide-react";

export default function LoginButton() {
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleLogin = async () => {
    setIsSigningIn(true);
    try {
      await signIn("google");
    } catch (error) {
      toast.error("There was an error signing in");
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="flex items-center justify-center gap-y-4">
      <Button
        id="loginButton"
        variant="default"
        onClick={handleLogin}
        className="w-24 px-2"
      >
        Login
        {isSigningIn ? (
          <Loader2 className="ml-1 h-4 w-4 animate-spin" />
        ) : (
          <LogIn className="ml-1 h-5 w-5" />
        )}
      </Button>
    </div>
  );
}
