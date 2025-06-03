import PayoutTotal from "~/components/payout/PayoutTotal";

export function meta() {
  return [
    { title: "Payout - EduNova" },
    { name: "description", content: "Create new quiz" },
  ];
}

export default function CategoryCreate() {
  return <PayoutTotal />;
}