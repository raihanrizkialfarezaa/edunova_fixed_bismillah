import CategoryList from "~/components/CategoryList";

export function meta() {
  return [
    { title: "List Category - EduNova" },
    { name: "description", content: "Create new quiz" },
  ];
}

export default function CategoryCreate() {
  return <CategoryList />;
}