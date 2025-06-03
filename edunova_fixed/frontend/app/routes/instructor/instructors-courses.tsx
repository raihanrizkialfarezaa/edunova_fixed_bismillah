import InstructorCourses from "~/components/instructor/instructorsCourses";

export function meta() {
  return [
    { title: "Courses By Instructors - EduNova" },
  ];
}

export default function CategoryCreate() {
  return <InstructorCourses />;
}