import type { ReactNode } from "react";
import { HrTotalEmployeeIcon } from "../icons/hrTotalEmployee";
import { HrActiveBenefitsIcon } from "../icons/hrActiveBenefits";
import { PendingIcon } from "../icons/pending";
import { HrActiveExceptIcon } from "../icons/hrActiveExcept";

type StatCard = {
  title: string;
  value: string;
  icon: ReactNode;
  iconBg: string;
};

type ActivityItem = {
  initials: string;
  name: string;
  text: string;
  time: string;
};

const statCards: StatCard[] = [
  {
    title: "Total Employees",
    value: "1,247",
    iconBg: "bg-[#2A8BFF]",
    icon: <HrTotalEmployeeIcon />,
  },
  {
    title: "Active Benefits",
    value: "3,892",
    iconBg: "bg-[#00C95F]",
    icon: <HrActiveBenefitsIcon />,
  },
  {
    title: "Pending Overrides",
    value: "12",
    iconBg: "bg-[#FFAD0F]",
    icon: <PendingIcon />,
  },
  {
    title: "Active Exceptions",
    value: "34",
    iconBg: "bg-[#A74BFF]",
    icon: <HrActiveExceptIcon />,
  },
];

const activities: ActivityItem[] = [
  {
    initials: "SJ",
    name: "Sarah Johnson",
    text: "Override granted for Health Insurance",
    time: "2 hours ago",
  },
  {
    initials: "MC",
    name: "Mike Chen",
    text: "Created temporary exception for Medical Leave",
    time: "4 hours ago",
  },
  {
    initials: "ER",
    name: "Emily Rodriguez",
    text: "Updated PTO eligibility rule",
    time: "Yesterday",
  },
  {
    initials: "JW",
    name: "James Wilson",
    text: "Approved vendor contract renewal",
    time: "Yesterday",
  },
];

export default function HrDashboardPage() {
  return (
    <>
      <div className="mb-10">
        <h1 className="text-3xl font-semibold text-white">Dashboard</h1>
        <p className="mt-3 text-5 text-[#A7B6D3]">
          Overview of your HR benefits management system
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {statCards.map((card) => (
          <article
            key={card.title}
            className="flex items-start justify-between rounded-3xl border border-[#2C4264] bg-[#1E293B] px-8 py-7"
          >
            <div>
              <p className="text-5 text-[#A7B6D3]">{card.title}</p>
              <p className="mt-2 text-15 leading-none text-white">
                {card.value}
              </p>
            </div>
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.iconBg}`}
            >
              {card.icon}
            </div>
          </article>
        ))}
      </div>

      <article className="mt-8 rounded-3xl border border-[#2C4264] bg-[#1E293B] p-8">
        <h2 className="mb-6 text-11 font-semibold text-white">
          Recent Activity
        </h2>
        <div className="space-y-1">
          {activities.map((activity) => (
            <div
              key={`${activity.name}-${activity.time}`}
              className="flex items-center justify-between border-b border-[#2B405F] py-5 last:border-b-0"
            >
              <div className="flex items-center gap-5">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#17386D] text-6 text-[#79A1FF]">
                  {activity.initials}
                </div>
                <div>
                  <p className="text-10 font-medium text-white">
                    {activity.name}
                  </p>
                  <p className="text-5 text-[#A7B6D3]">{activity.text}</p>
                </div>
              </div>
              <p className="text-5 text-[#8FA3C5]">{activity.time}</p>
            </div>
          ))}
        </div>
      </article>
    </>
  );
}
