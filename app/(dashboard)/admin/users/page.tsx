"use client";
import { CustomButton, DashboardSidebar } from "@/components";
import apiClient from "@/lib/api";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus, FaUserShield, FaUser } from "react-icons/fa";
import toast from "react-hot-toast";

interface User {
  id: string;
  name?: string | null;
  email: string;
  role: "ADMIN" | "USER";
}

const DashboardUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get("/api/users");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      toast.error("Failed to fetch users.");
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId: string) => {
    if (confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      try {
        const response = await apiClient.delete(`/api/users/${userId}`);
        if (response.ok) {
          toast.success("User deleted successfully");
          fetchUsers(); // Refresh users list
        } else {
          const errorData = await response.json();
          toast.error(`Failed to delete user: ${errorData.message}`);
        }
      } catch (error) {
        toast.error("An error occurred while deleting the user.");
        console.error(error);
      }
    }
  };

  const RoleIndicator = ({ role }: { role: "ADMIN" | "USER" }) => (
    <div className={`inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium ${
      role === 'ADMIN' 
        ? 'bg-green-500/20 text-green-400' 
        : 'bg-gray-500/20 text-gray-400'
    }`}>
      {role === 'ADMIN' ? <FaUserShield /> : <FaUser />}
      {role}
    </div>
  );

  return (
    <div className="bg-transparent flex justify-start max-w-screen-2xl mx-auto xl:h-full max-xl:flex-col max-xl:gap-y-5">
      <DashboardSidebar />
      <div className="p-8 rounded-3xl backdrop-blur-md bg-white/10 dark:bg-gray-800/10 shadow-xl border border-white/20 dark:border-gray-700/20 flex flex-col gap-y-7 w-full">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-semibold text-gray-800 dark:text-white">
            User Management
          </h1>
          <Link href="/admin/users/new">
            <CustomButton
              buttonType="button"
              className="bg-grilli-gold/80 hover:bg-grilli-gold text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-lg flex items-center gap-2"
            >
              <FaPlus />
              Add New User
            </CustomButton>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-28 bg-white/5 dark:bg-gray-700/20 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-400/30 dark:border-gray-600/30 rounded-xl">
            <p className="text-xl font-semibold text-gray-500 dark:text-gray-400">No users found.</p>
            <p className="text-gray-400 dark:text-gray-500 mt-2">Get started by adding a new user.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <div
                key={user.id}
                className="group relative p-5 bg-white/5 dark:bg-gray-800/50 rounded-xl shadow-md border border-white/10 dark:border-gray-700/50 hover:shadow-xl hover:border-grilli-gold/50 transition-all duration-300 flex flex-col justify-between min-h-[120px]"
              >
                <div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white truncate pr-4">
                    {user.name || user.email}
                  </h3>
                  {user.name && (
                    <p className="text-sm text-gray-600 dark:text-white truncate">{user.email}</p>
                  )}
                  <div className="mt-2">
                    <RoleIndicator role={user.role} />
                  </div>
                </div>
                <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Link href={`/admin/users/${user.id}`}>
                    <button className="p-2 rounded-full bg-blue-500/20 hover:bg-blue-500/40 text-blue-400 hover:text-white transition-colors">
                      <FaEdit />
                    </button>
                  </Link>
                  <button 
                    onClick={() => handleDelete(user.id)}
                    className="p-2 rounded-full bg-red-500/20 hover:bg-red-500/40 text-red-400 hover:text-white transition-colors"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardUsers;
