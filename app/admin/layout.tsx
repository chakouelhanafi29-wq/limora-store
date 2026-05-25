"use client";

import { usePathname } from "next/navigation";
import AdminSidebar from "./components/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";

  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#f8f5f0]">
      <AdminSidebar />
      <div className="min-h-screen lg:mr-64">
        <main className="p-4 pt-16 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
