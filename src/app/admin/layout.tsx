"use client";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import "../../styles/globals.css";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {/* Sidebar */}
        <aside className="w-64 text-white h-screen fixed left-0 top-0">
          <Sidebar />
        </aside>

        {/* Main Content */}
        <div className="flex-1 md:ml-64">
          {/* Navbar */}
          <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-10 md:left-64">
            <Navbar />
          </header>

          {/* Page Content */}
          <main className="p-6 mt-16 bg-gray-100 min-h-screen">{children}</main>
        </div>
      </body>
    </html>
  );
}

