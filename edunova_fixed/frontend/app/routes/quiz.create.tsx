import QuizForm from '../components/QuizForm';

export function meta() {
  return [
    { title: "Create Quiz - EduNova" },
    { name: "description", content: "Create new quiz" },
  ];
}

export default function QuizCreatePage() {
  return <QuizForm />;
}