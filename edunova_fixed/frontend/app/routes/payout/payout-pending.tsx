import PayoutPending from "~/components/payout/PayoutPending";

export function meta() {
  return [
    { title: "All Pending Payout - EduNova" },
    { name: "description", content: "Create new quiz" },
  ];
}

export default function CategoryCreate() {
  return <PayoutPending />;
}