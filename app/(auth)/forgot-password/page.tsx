"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";


export default function () {

    const [email, setEmail] = useState("");
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Check your email for the link to reset password!");
        router.push("/login");
    };

    return (
        <Card>
            <div>
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-dark mb-2"> School Management System</h1>
                    <p className="text-gray-700 font-semibold">Change your password here</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                    />

                    <Button type="submit" className="w-full bg-gray-900 hover:bg-gray-800 text-white cursor-pointer ">
                        Change Password
                    </Button>
                </form>
            </div>
        </Card>
    )
}