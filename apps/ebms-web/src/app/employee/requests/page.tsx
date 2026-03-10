import { Header } from "../components/Header";
import { NewRequest } from "../components/benefit_req";

export default function RequestsPage() {
  return (
    <div className="w-full h-full bg-[#0f172a]">
      <Header />
      <NewRequest />
    </div>
  );
}
