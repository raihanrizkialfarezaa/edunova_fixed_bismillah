import TagList from "~/components/TagList";

export function meta() {
  return [
    { title: "Tag List - EduNova" },
    { name: "description", content: "Create new quiz" },
  ];
}

export default function CategoryCreate() {
  return <TagList />;
}