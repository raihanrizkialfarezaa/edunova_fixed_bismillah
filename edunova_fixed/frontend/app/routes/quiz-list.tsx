import QuizList from '../components/QuizList';

export function meta() {
  return [
    { title: "Quiz Management - EduNova" },
    { name: "description", content: "Manage quizzes" },
  ];
}

export default function QuizListRoute() {
  return <QuizList />;
}