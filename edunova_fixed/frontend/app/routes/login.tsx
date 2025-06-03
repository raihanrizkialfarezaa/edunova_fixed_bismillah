import Login from "../components/Login";

export function meta() {
  return [
    { title: "Login - EduNova" },
    { name: "description", content: "Sign in to your EduNova account" },
  ];
}

export default function LoginPage() {
  return <Login />;
}