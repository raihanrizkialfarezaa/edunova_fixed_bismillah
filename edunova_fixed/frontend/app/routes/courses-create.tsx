import CourseCreate from "~/components/CourseCreate";

export function meta() {
  return [
    { title: "Edit Category - EduNova" },
    { name: "description", content: "Create new quiz" },
  ];
}

export default function CategoryCreate() {
  return <CourseCreate />;
}