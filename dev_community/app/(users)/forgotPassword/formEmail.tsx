"use client"
import React, { useState } from "react"

const fetchEmail = async (email: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/v1/authenticate/forgot-pass/${email}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }), 
    });
    if (!res.ok) {
        throw new Error("Failed email");
    }
};

const FormEmail = () => {
    const [email, setEmail] = useState<string>("");

    const handleSubmitEmail = () => {
        fetchEmail(email)
            .then(() => {
                console.log("Email successfully sent!");
            })
            .catch((error) => {
                console.error("Failed to send email", error);
            });
    }

    return (
        <div className="ml-320px">
            <div className="mb-4">Email</div>
            <input 
                className="border px-4 py-2" 
                type="email" 
                placeholder="Enter email here" 
                onChange={(e) => setEmail(e.target.value)}
                value={email}
            />
            <button className="border px-12 py-4" onClick={handleSubmitEmail}>Submit</button>
        </div>
    );
};

export default FormEmail;
