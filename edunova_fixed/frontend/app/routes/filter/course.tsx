import CoursesList from "~/components/CourseList";

export function meta() {
  return [
    { title: "Courses - EduNova" },
  ];
}

export default function CategoryCreate() {
  return <CoursesList />;
}