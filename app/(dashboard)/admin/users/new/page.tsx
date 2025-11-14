"use client";
import { DashboardSidebar } from "@/components";
import { isValidEmailAddressFormat } from "@/lib/utils";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { sanitizeFormData } from "@/lib/form-sanitize";
import apiClient from "@/lib/api"; // Added apiClient import

const DashboardCreateNewUser = () => {
  const [userInput, setUserInput] = useState<{
    email: string;
    password: string;
    role: string;
  }>({
    email: "",
    password: "",
    role: "user",
  });

  const addNewUser = async () => {
    // Simplified validation checks
    if (userInput.email === "" || userInput.password === "") {
      return toast.error("You must enter all input values to add a user");
    }
    if (!isValidEmailAddressFormat(userInput.email)) {
      return toast.error("You entered invalid email address format");
    }
    if (userInput.password.length <= 7) {
      return toast.error("Password must be longer than 7 characters");
    }

    try {
      // Sanitize form data before sending to API
      const sanitizedUserInput = sanitizeFormData(userInput);

      const response = await apiClient.post(`/api/users`, sanitizedUserInput);

      if (response.status === 201) {
        await response.json();
        toast.success("User added successfully");
        setUserInput({
          email: "",
          password: "",
          role: "user",
        });
      } else {
        // Throw an error to be caught by the catch block
        const errorData = await response.json().catch(() => null); // Try to get error details
        throw new Error(errorData?.error || "Error while creating user");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error(error instanceof Error ? error.message : "An unknown error occurred");
    }
  };

  return (
    <div className="bg-white flex justify-start max-w-screen-2xl mx-auto xl:h-full max-xl:flex-col max-xl:gap-y-5">
      <DashboardSidebar />
      <div className="flex flex-col gap-y-7 xl:pl-5 max-xl:px-5 w-full">
        <h1 className="text-3xl font-semibold">Add new user</h1>
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Email:</span>
            </div>
            <input
              type="email"
              className="input input-bordered w-full max-w-xs"
              value={userInput.email}
              onChange={(e) =>
                setUserInput({ ...userInput, email: e.target.value })
              }
            />
          </label>
        </div>

        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Password:</span>
            </div>
            <input
              type="password"
              className="input input-bordered w-full max-w-xs"
              value={userInput.password}
              onChange={(e) =>
                setUserInput({ ...userInput, password: e.target.value })
              }
            />
          </label>
        </div>

        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">User role: </span>
            </div>
            <select
              className="select select-bordered"
              value={userInput.role} // Use value instead of defaultValue for controlled component
              onChange={(e) =>
                setUserInput({ ...userInput, role: e.target.value })
              }
            >
              <option value="admin">admin</option>
              <option value="user">user</option>
            </select>
          </label>
        </div>

        <div className="flex gap-x-2">
          <button
            type="button"
            className="uppercase bg-blue-500 px-10 py-5 text-lg border border-black border-gray-300 font-bold text-white shadow-sm hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2"
            onClick={addNewUser}
          >
            Create user
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardCreateNewUser;