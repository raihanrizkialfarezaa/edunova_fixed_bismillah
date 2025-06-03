import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { quizApi } from '../lib/quizApi';

interface Quiz {
  id: number;
  title: string;
  timeLimit?: number;
  Questions: Array<{
    id: number;
    text: string;
    correctAnswer: string;
    points: number;
    Options: Array<{ id: number; text: string }>;
  }>;
  lesson: {
    title: string;
    section: {
      title: string;
      course: { title: string };
    };
  };
}

export function meta() {
  return [
    { title: "View Quiz - EduNova" },
    { name: "description", content: "View quiz details" },
  ];
}

export default function QuizViewPage() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchQuiz();
    }
  }, [id]);

  const fetchQuiz = async () => {
    try {
      const response = await quizApi.getQuizById(Number(id));
      setQuiz(response.data.quiz);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch quiz');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!quiz) return <div className="p-4">Quiz not found</div>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-2xl font-bold">{quiz.title}</h1>
          <p className="text-gray-600">
            {quiz.lesson.section.course.title} → {quiz.lesson.section.title} → {quiz.lesson.title}
          </p>
          <p className="text-sm text-gray-500">
            Time Limit: {quiz.timeLimit ? `${quiz.timeLimit} minutes` : 'No limit'}
          </p>
        </div>
        <div className="flex gap-2">
          <Link to={`/quiz/${quiz.id}/edit`} className="bg-green-500 text-white px-3 py-2 rounded">
            Edit Quiz
          </Link>
          <Link to="/quiz/list" className="bg-gray-500 text-white px-3 py-2 rounded">
            Back to List
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Questions ({quiz.Questions.length})</h2>
        
        {quiz.Questions.map((question, index) => (
          <div key={question.id} className="border p-4 rounded">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium">Question {index + 1}</h3>
              <span className="text-sm bg-blue-500 px-2 py-1 rounded">{question.points} point(s)</span>
            </div>
            
            <p className="mb-3">{question.text}</p>
            
            <div className="mb-3">
              <p className="text-sm font-medium text-green-600">
                Correct Answer: {question.correctAnswer}
              </p>
            </div>

            {question.Options && question.Options.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Options:</p>
                <ul className="list-disc pl-5 space-y-1">
                  {question.Options.map((option, oIndex) => (
                    <li key={option.id} className="text-sm">
                      {option.text}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}

        {quiz.Questions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No questions added yet
          </div>
        )}
      </div>
    </div>
  );
}