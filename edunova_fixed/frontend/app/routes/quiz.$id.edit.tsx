import QuizForm from '../components/QuizForm';

export function meta() {
  return [
    { title: "Edit Quiz - EduNova" },
    { name: "description", content: "Edit quiz" },
  ];
}

export default function QuizEditPage() {
  return <QuizForm />;
}