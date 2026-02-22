import AdminSidebar from "./components/AdminSidebar"


export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-gray-200 dark:bg-gray-900">
      <AdminSidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
