"use client";

import Form from "@app/ui/Create";
import { useState } from "react";
import Show from "./ui/Show";

export default function Home() {
  const [email, setEmail] = useState<string[]>([]);

  const createEmail = async () => {
    await fetch("/api/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(email),
    });
  };
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Form email={email} setEmail={setEmail} handleSubmit={createEmail} />
      <Show />
    </div>
  );
}
