import PayoutDetail from "~/components/payout/PayoutDetails";

export function meta() {
  return [
    { title: "Details Payout - EduNova" },
    { name: "description", content: "Create new quiz" },
  ];
}

export default function CategoryCreate() {
  return <PayoutDetail />;
}