import AdminGuard from "./admin/components/AdminGuard";
import AdminLayout from "./admin/components/AdminLayout";

export default function AdminGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <AdminLayout>{children}</AdminLayout>
    </AdminGuard>
  );
}
