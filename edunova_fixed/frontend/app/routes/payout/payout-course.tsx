import PayoutCourse from "~/components/payout/PayoutCourse";

export function meta() {
  return [
    { title: "Course Payout - EduNova" },
    { name: "description", content: "Create new quiz" },
  ];
}

export default function CategoryCreate() {
  return <PayoutCourse />;
}