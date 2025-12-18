"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/select-role");
  };

  return (
    <Card>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-dark mb-2">Corradini School Management System</h1>
        <p className="text-gray-700 font-semibold">Sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />
        <div className="mt-4 text-sm text-right">
            <Link href="/forgot-password" className="text-[#000EEE] hover:underline">Forgot Password{" "}</Link>
        </div>

        <Button type="submit" className="w-full bg-gray-900 hover:bg-gray-800 text-white cursor-pointer ">
          Sign In
        </Button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-700">
          No Account? {" "}
          <Link href="/create-account" className="text-[#000EEE] hover:underline"> Create Account Here</Link>.
        </p>
      </div>
    </Card>
  );
}