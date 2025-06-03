import TagForm from "~/components/TagCreate";

export function meta() {
  return [
    { title: "Create Tag - EduNova" },
    { name: "description", content: "Create new quiz" },
  ];
}

export default function CategoryCreate() {
  return <TagForm />;
}