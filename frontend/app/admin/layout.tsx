import React from 'react';
import AdminSidebar from '@/components/AdminSidebar';

export const metadata = {
  title: 'Happiwrapz Admin Control Center',
  description: 'Production Admin Panel for Happiwrapz E-Commerce',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#050505] text-[#F8F1E7]">
      <AdminSidebar />
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <main className="flex-1 p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
