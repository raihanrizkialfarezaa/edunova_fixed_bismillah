import CategoryForm from '../components/CategoryForm';

export function meta() {
  return [
    { title: "Create Category - EduNova" },
    { name: "description", content: "Create new quiz" },
  ];
}

export default function CategoryCreate() {
  return <CategoryForm />;
}