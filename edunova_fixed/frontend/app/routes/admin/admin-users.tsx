import AdminUsers from "~/components/dashboard/AdminUsers";

export function meta() {
  return [
    { title: "Admin Users Stats - EduNova" },
  ];
}

export default function CategoryCreate() {
  return <AdminUsers />;
}