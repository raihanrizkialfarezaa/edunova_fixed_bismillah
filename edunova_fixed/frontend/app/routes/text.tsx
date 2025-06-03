import CoursesList from "~/components/CourseList";

export function meta() {
  return [
    { title: "Course - EduNova" },
    { name: "description", content: "Create new quiz" },
  ];
}

export default function CategoryCreate() {
  return <CoursesList />;
}