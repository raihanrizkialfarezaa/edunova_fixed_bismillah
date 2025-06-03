import CourseDelete from "~/components/CoursesDelete";

export function meta() {
  return [
    { title: "Delete Courses - EduNova" },
  ];
}

export default function CategoryCreate() {
  return <CourseDelete />;
}