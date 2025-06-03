import Register from "../components/Register";

export function meta() {
  return [
    { title: "Register - EduNova" },
    { name: "description", content: "Create your EduNova account" },
  ];
}

export default function RegisterPage() {
  return <Register />;
}