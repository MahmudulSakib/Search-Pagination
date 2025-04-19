"use client";

import { useState } from "react";

type FormProps = {
  email: string[];
  setEmail: (value: string[]) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

const Form: React.FC<FormProps> = ({ email, setEmail, handleSubmit }) => {
  const [inputValue, setInputValue] = useState("");

  const addEmail = () => {
    if (inputValue.trim()) {
      setEmail([...email, inputValue.trim()]);
      setInputValue("");
    }
  };

  return (
    <div className="mt-20">
      <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
        <div className="mb-5">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Your email
          </label>
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            type="email"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="name@abc.com"
          />
        </div>
        <button
          onClick={addEmail}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Form;
