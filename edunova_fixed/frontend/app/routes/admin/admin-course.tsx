import AdminCourses from "~/components/dashboard/AdminCourse";
export function meta() {
  return [
    { title: "Admin Courses Stats - EduNova" },
  ];
}

export default function CategoryCreate() {
  return <AdminCourses />;
}