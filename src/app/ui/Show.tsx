"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type EmailEntry = {
  id: string;
  email: string;
  createdAt: string;
};

const Show = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [emails, setEmails] = useState<EmailEntry[]>([]);
  const pageFromParams = parseInt(searchParams.get("page") || "1");
  const [page, setPage] = useState(pageFromParams);
  const [total, setTotal] = useState(0);
  const limit = 1;

  const goToPage = (newPage: number) => {
    router.push(`?page=${newPage}`);
  };

  useEffect(() => {
    setPage(pageFromParams);
  }, [pageFromParams]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/submit?page=${page}&limit=${limit}`);
      const data = await res.json();
      setEmails(data.data);
      setTotal(data.total);
    };
    fetchData();
  }, [page]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <ul>
        {emails.flatMap((entry) =>
          entry.email
            .split(",")
            .map((e, idx) => <li key={`${entry.id}-${idx}`}>{e.trim()}</li>)
        )}
      </ul>
      <div className="mt-4 flex gap-2">
        <button
          disabled={page === 1}
          //   onClick={() => setPage((p) => Math.max(1, p - 1))}
          onClick={() => goToPage(page - 1)}
          className="bg-blue-500 text-white px-3 py-1 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          //   onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          onClick={() => goToPage(page + 1)}
          className="bg-blue-500 text-white px-3 py-1 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Show;
