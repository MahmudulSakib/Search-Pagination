"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type EmailEntry = {
  id: string;
  email: string;
  createdAt: string;
};

function useDebounce(func: Function, delay: number) {
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  return useMemo(() => {
    return (...args: any[]) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      const newTimeoutId = setTimeout(() => func(...args), delay);
      setTimeoutId(newTimeoutId);
    };
  }, [timeoutId, delay]);
}

const Show = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [emails, setEmails] = useState<EmailEntry[]>([]);
  const pageFromParams = parseInt(searchParams.get("page") || "1");
  const [page, setPage] = useState(pageFromParams);
  const [total, setTotal] = useState(0);
  const [suggestionResults, setSuggestionResults] = useState<EmailEntry[]>([]);

  const [searchInput, setSearchInput] = useState(
    searchParams.get("query") || ""
  );
  // const [query, setQuery] = useState(searchParams.get("query") || "");
  const query = searchParams.get("query") || "";

  const limit = 1;

  // const goToPage = (newPage: number) => {
  //   const params = new URLSearchParams();
  //   params.set("page", newPage.toString());
  //   if (query) params.set("query", query);
  //   router.push(`?${params.toString()}`);
  // };

  // const debouncedSearch = useDebounce((value: string) => {
  //   goToPage(1, value.trim());
  // }, 500);

  const debouncedSearch = useDebounce(async (value: string) => {
    const res = await fetch(`/api/submit?limit=5&query=${value}`);
    const data = await res.json();
    setSuggestionResults(data.data); // <- new state we'll add next
  }, 300);

  const goToPage = (newPage: number, newQuery = query) => {
    const params = new URLSearchParams();
    params.set("page", newPage.toString());
    if (newQuery) params.set("query", newQuery);
    router.push(`?${params.toString()}`);
    setSuggestionResults([]); // clear suggestions after click
  };

  // useEffect(() => {
  //   setPage(parseInt(searchParams.get("page") || "1"));
  // }, [searchParams]);

  // useEffect(() => {
  //   setPage(pageFromParams);
  // }, [pageFromParams]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const res = await fetch(`/api/submit?page=${page}&limit=${limit}`);
  //     const data = await res.json();
  //     setEmails(data.data);
  //     setTotal(data.total);
  //   };
  //   fetchData();
  // }, [page]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const res = await fetch(
  //       `/api/submit?page=${page}&limit=${limit}&query=${query}`
  //     );
  //     const data = await res.json();
  //     setEmails(data.data);
  //     setTotal(data.total);
  //   };
  //   fetchData();
  // }, [page, query]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const res = await fetch(
  //       `/api/submit?page=${page}&limit=${limit}&query=${query}`
  //     );
  //     const data = await res.json();
  //     setEmails(data.data);
  //     setTotal(data.total);
  //   };
  //   fetchData();
  // }, [page, query]);

  // const debouncedSearch = useMemo(
  //   () =>
  //     debounce((value: string) => {
  //       goToPage(1, value.trim());
  //     }, 500), // 500ms debounce delay
  //   []
  // );

  useEffect(() => {
    const fetchData = async () => {
      const currentPage = parseInt(searchParams.get("page") || "1");
      const currentQuery = searchParams.get("query") || "";

      const res = await fetch(
        `/api/submit?page=${currentPage}&limit=${limit}&query=${currentQuery}`
      );
      const data = await res.json();
      setEmails(data.data);
      setTotal(data.total);
      setPage(currentPage);
      setSearchInput(currentQuery); // optional: sync UI input box
    };
    fetchData();
  }, [searchParams]);

  // useEffect(() => {
  //   return () => {
  //     debouncedSearch.cancel(); // cancel on unmount
  //   };
  // }, [debouncedSearch]);

  const totalPages = Math.ceil(total / limit);
  const renderPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      const startPages = [1, 2];
      const endPages = [totalPages - 2, totalPages - 1, totalPages];
      const middlePages = [page - 1, page, page + 1].filter(
        (p) => p > 2 && p < totalPages - 2
      );

      const uniquePages = Array.from(
        new Set([...startPages, ...middlePages, ...endPages])
      ).sort((a, b) => Number(a) - Number(b));

      for (let i = 0; i < uniquePages.length; i++) {
        const current = uniquePages[i];
        const prev = uniquePages[i - 1];

        if (prev && (current as number) - (prev as number) > 1) {
          pages.push("...");
        }

        pages.push(current);
      }
    }

    return pages.map((pageNum, idx) =>
      typeof pageNum === "number" ? (
        <button
          key={idx}
          onClick={() => goToPage(pageNum)}
          className={`px-3 py-1 rounded ${
            pageNum === page
              ? "bg-blue-700 text-white"
              : "bg-gray-200 text-black hover:bg-gray-300"
          }`}
        >
          {pageNum}
        </button>
      ) : (
        <span key={idx} className="px-2">
          ...
        </span>
      )
    );
  };

  return (
    <div className="relative">
      <div className="mb-4">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            debouncedSearch(e.target.value);
          }}
          placeholder="Search email..."
          className="border px-3 py-2 rounded w-64"
        />
        <button
          onClick={() => goToPage(1, searchInput.trim())} // trigger search from page 1
          className="ml-2 bg-blue-500 text-white px-3 py-2 rounded"
        >
          Search
        </button>
      </div>

      {searchInput && suggestionResults.length > 0 && (
        <div className="absolute top-full left-0 mt-1 bg-white border rounded shadow z-10 w-64 max-h-60 overflow-y-auto text-black">
          <ul>
            {suggestionResults.flatMap((entry) =>
              entry.email.split(",").map((email, idx) => (
                <li
                  key={`${entry.id}-${idx}`}
                  className="cursor-pointer px-3 py-2 hover:bg-blue-100"
                  onClick={() => goToPage(1, email.trim())}
                >
                  {email.trim()}
                </li>
              ))
            )}
          </ul>
        </div>
      )}

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
        {/* <span>
          Page {page} of {totalPages}
        </span> */}
        {/* {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => goToPage(pageNum)}
            className={`px-3 py-1 rounded ${
              pageNum === page
                ? "bg-blue-700 text-white"
                : "bg-gray-200 text-black hover:bg-gray-300"
            }`}
          >
            {pageNum}
          </button>
        ))} */}
        {renderPageNumbers()}
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
