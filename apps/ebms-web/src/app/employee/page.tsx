import { NewRequest } from "./components/benefit_req";
import { Header } from "./components/Header";

export default function EmployeePage() {
    return (
        <div className="w-full h-full bg-[#0f172a]">
            <Header/>
            <NewRequest />
        </div>
    )
}