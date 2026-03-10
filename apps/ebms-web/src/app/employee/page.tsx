/** @format */

import { FiCheck, FiStar, FiActivity, FiCalendar, FiInfo } from "react-icons/fi";
import { CgArrowRight } from "react-icons/cg";
import { BenefitCard } from "@/app/_components/BenefitCard";
import { Header } from "./components/Header";

const CardIcon = ({
	children,
	className,
}: {
	children: React.ReactNode;
	className: string;
}) => (
	<div
		className={`flex items-center justify-center w-12 h-12 rounded-lg ${className}`}
	>
		{children}
	</div>
);
export default function Home() {
    return(
        <div>
            <Header/>
    <div className="min-h-screen w-full bg-[#0f172a] p-8">
                <div className="flex flex-col mb-8">
                    <h1 className="text-[32px] font-bold text-white leading-tight">
                        Welcome back, John!
                    </h1>
                    <p className="text-base text-[#AAAAAA] mt-1">
                        Your complete benefits portfolio and eligibility status
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-4 w-full">
                    <div className="min-w-0 rounded-[10px] bg-[#334155] p-6 flex flex-col min-h-[134px]">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-[#99A1AF]">Active Benefits</p>
                                <p className="text-[48px] font-bold text-white leading-none mt-1">
                                    2
                                </p>
                                <p className="text-sm text-[#99A1AF] mt-1">Currently enrolled</p>
                            </div>
                            <CardIcon className="bg-[#4CAF50]/20">
                                <FiCheck size={24} color="#4CAF50" strokeWidth={2.5} />
                            </CardIcon>
                        </div>
                    </div>
    
                    <div className="min-w-0 rounded-[10px] bg-[#334155] p-6 flex flex-col min-h-[134px]">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-[#99A1AF]">Eligible Benefits</p>
                                <p className="text-[48px] font-bold text-white leading-none mt-1">
                                    1
                                </p>
                                <p className="text-sm text-[#99A1AF] mt-1">Ready to request</p>
                            </div>
                            <CardIcon className="bg-[#2196F3]/20">
                                <FiStar size={24} color="#2196F3" strokeWidth={2} />
                            </CardIcon>
                        </div>
                    </div>
    
                    <div className="min-w-0 rounded-[10px] bg-[#334155] p-6 flex flex-col min-h-[134px]">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-[#99A1AF]">OKR Performance</p>
                                <p className="text-[48px] font-bold text-white leading-none mt-1">
                                    82%
                                </p>
                                <p className="text-sm text-[#00A63E] mt-1">↑ Above average</p>
                            </div>
                            <CardIcon className="bg-[#9C27B0]/20">
                                <FiActivity size={24} color="#9C27B0" strokeWidth={2} />
                            </CardIcon>
                        </div>
                    </div>
    
                    <div className="min-w-0 rounded-[10px] bg-[#334155] p-6 flex flex-col min-h-[134px]">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-[#CCCCCC]">Tenure</p>
                                <p className="text-[48px] font-bold text-white leading-none mt-1">
                                    185
                                </p>
                                <p className="text-sm text-[#AAAAAA] mt-1">days (6 months)</p>
                            </div>
                            <CardIcon className="bg-[#FF9800]/20">
                                <FiCalendar size={24} color="#FF9800" strokeWidth={2} />
                            </CardIcon>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between items-center mt-8 mb-6">
                    <h2 className="text-xl text-white font-semibold">Benefit Portfolio</h2>
                    <button className="px-4 py-2 border border-[#64748b] flex items-center gap-2 rounded-full text-white text-sm hover:bg-[#334155] transition-colors">
                        View Eligibility Details
                        <CgArrowRight size={16} />
                    </button>
                </div>
                <div className="w-full min-w-0">
                    <BenefitCard />
                </div>
                <div className="mt-6 rounded-lg bg-[#1f2a40] p-5 flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#2196F3]/30 flex items-center justify-center border border-[#2196F3]/50">
                        <FiInfo size={20} color="#2196F3" strokeWidth={2.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-white">
                            Automatic Eligibility Tracking
                        </h3>
                        <p className="text-sm text-[#94a3b8] mt-1">
                            Your eligibility is automatically tracked based on tenure (185 days)
                            and OKR performance (82%). You'll receive notifications when you
                            become eligible for new benefits.
                        </p>
                    </div>
                </div>
            </div> </div>
            )
}