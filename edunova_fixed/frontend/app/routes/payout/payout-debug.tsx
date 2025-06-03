import PayoutDebug from "~/components/payout/PayoutDebug";

export function meta() {
  return [
    { title: "Debug Payout - EduNova" },
    { name: "description", content: "Create new quiz" },
  ];
}

export default function CategoryCreate() {
  return <PayoutDebug />;
}