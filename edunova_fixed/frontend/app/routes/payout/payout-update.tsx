import PayoutUpdate from "~/components/payout/PayoutUpdate";

export function meta() {
  return [
    { title: "Status Payout - EduNova" },
    { name: "description", content: "Create new quiz" },
  ];
}

export default function CategoryCreate() {
  return <PayoutUpdate />;
}