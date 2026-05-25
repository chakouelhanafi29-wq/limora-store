"use client";

import AdminSidebar from "./components/AdminSidebar";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f8f5f0]">
      <AdminSidebar />
      <div className="min-h-screen lg:mr-64">
        <main className="p-4 pt-16 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
