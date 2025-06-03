import RequestPayout from "~/components/payout/payout";

export function meta() {
  return [
    { title: "Request Payout - EduNova" },
    { name: "description", content: "Create new quiz" },
  ];
}

export default function CategoryCreate() {
  return <RequestPayout />;
}