/** @format */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { fetchMe } from "../_lib/api";
import { ThemeToggle } from "@/app/_components/ThemeToggle";
import {
	fetchSwitchUserOptions,
	getInitialUserProfile,
	getActiveUserProfile,
	setActiveUserProfile,
	type ActiveUserProfile,
	type SwitchUserOption,
} from "@/app/_lib/activeUser";

import {
	HiOutlineBell,
	HiBars3,
	HiXMark,
	HiOutlineUserCircle,
	HiOutlineArrowRightOnRectangle,
	HiOutlineCheckCircle,
	HiOutlineChartBar,
	HiOutlineInformationCircle,
	HiOutlineArrowTopRightOnSquare,
} from "react-icons/hi2";
import { IoDiceOutline } from "react-icons/io5";
import { ProfileIcon } from "@/app/icons/profile";

const STORAGE_KEY = "ebms_employee_notifications";
const TAGLINE_INDEX_KEY = "ebms_employee_tagline_index";
const TAGLINE_LAST_CHANGE_KEY = "ebms_employee_tagline_last_change";
const TAGLINE_CHANGE_MS = 24 * 60 * 60 * 1000;

const TAGLINES = [
	"✨ Таны ирээдүйг хамтдаа бүтээцгээе",
	"🚀 Хамтдаа амжилтад хүрье",
	"🌟 Өнөөдөр ч гайхалтай өдөр байх болно",
	"💪 Та үнэхээр гайхалтай ажил хийж байна",
	"🌈 Бүх зүйл боломжтой, зүгээр л эхэл",
	"💫 Чи чадна, бид чамд итгэж байна",
	"🔥 Өдрийн амжилт эхлэх цаг боллоо",
	"🎯 Таны хичээл зүтгэл үр дүнгээ өгөх болно",
	"💡 Урам зориг бүтээлч санаанаас төрнө",
	"🌅 Өнөөдрийн хүчин чармайлт маргаашийн амжилт",
	"🧭 Зорилго тодорхой бол зам тодорхой",
	"🤝 Хамтдаа бид илүү хүчтэй",
	"⚡ Амжилтын түлхүүр бол тасралтгүй хөдөлгөөн",
	"🎊 Таны хөгжил бидний баяр баясгалан",
	"🌱 Өнөөдрийн хэцүү нь маргаашийн амархан",
	"🌸 Итгэл найдвар үүсгэх үйлчилгээ",
	"🧘 Ажил амьдралын тэнцвэр бол амжилт",
	"🏆 Та өөрийгөө үнэлж, бид таныг дэмжинэ",
	"✨ Шинэ өдөр шинэ боломж",
	"🔮 Хамтдаа ирээдүйг тодорхойлье",
] as const;

const DEFAULT_NOTIFICATIONS = [
	{
		id: "1",
		title: "You're Now Eligible for Education Allowance!",
		body: "Congratulations! You've reached 1 year tenure with an OKR score of 82%. You can now request Education Allowance.",
		time: "2 hours ago",
		tone: "success" as const,
		unread: true,
	},
	{
		id: "2",
		title: "OKR Score Updated",
		body: "Your Q1 2026 OKR score has been updated to 82%. This may affect your benefit eligibility.",
		time: "5 hours ago",
		tone: "info" as const,
		unread: true,
	},
	{
		id: "3",
		title: "Transit Pass Request Approved",
		body: "Your Transit Pass benefit request has been approved. You'll receive further details via email.",
		time: "1 day ago",
		tone: "success" as const,
		unread: false,
	},
];

type EmployeeNotification = (typeof DEFAULT_NOTIFICATIONS)[number];

export const Header = () => {
	const [menuOpen, setMenuOpen] = useState(false);
	const [notificationOpen, setNotificationOpen] = useState(false);
	const [profileOpen, setProfileOpen] = useState(false);
	const [currentTaglineIndex, setCurrentTaglineIndex] = useState(0);
	const [me, setMe] = useState<{ name: string; id: string } | null>(null);
	const [selectedUser, setSelectedUser] = useState<ActiveUserProfile>(
		getInitialUserProfile(),
	);
	const initialProfile = getInitialUserProfile();
	const [userOptions, setUserOptions] = useState<SwitchUserOption[]>([
		{
			id: initialProfile.id,
			name: initialProfile.name || initialProfile.id,
			role: (initialProfile.role || "employee").toLowerCase(),
		},
	]);
	const [notifications, setNotifications] = useState<EmployeeNotification[]>(
		DEFAULT_NOTIFICATIONS,
	);
	const notificationRef = useRef<HTMLDivElement>(null);
	const profileRef = useRef<HTMLDivElement>(null);
	const diceButtonRef = useRef<HTMLButtonElement>(null);
	const pathname = usePathname();

	useEffect(() => {
		let cancelled = false;
		fetchMe()
			.then((data) => {
				if (!cancelled) setMe({ name: data.name, id: data.id });
			})
			.catch(() => {});
		return () => {
			cancelled = true;
		};
	}, [selectedUser.id]);

	useEffect(() => {
		const current = getActiveUserProfile();
		setSelectedUser(current);
	}, []);

	useEffect(() => {
		let cancelled = false;
		(async () => {
			try {
				const mapped = await fetchSwitchUserOptions();
				if (!cancelled && mapped.length > 0) {
					setUserOptions(mapped);
					if (!mapped.some((u) => u.id === selectedUser.id)) {
						const first = mapped[0];
						const next = { id: first.id, name: first.name, role: first.role };
						setSelectedUser(next);
						setActiveUserProfile(next);
					}
				}
			} catch {
				// Keep fallback list when employees query fails.
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [selectedUser.id]);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (
				notificationRef.current &&
				!notificationRef.current.contains(e.target as Node)
			) {
				setNotificationOpen(false);
			}
			if (
				profileRef.current &&
				!profileRef.current.contains(e.target as Node)
			) {
				setProfileOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	useEffect(() => {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (raw) {
			try {
				const parsed = JSON.parse(raw) as EmployeeNotification[];
				if (Array.isArray(parsed) && parsed.length > 0) {
					setNotifications(parsed);
				}
			} catch {
				// Ignore malformed storage.
			}
		}
	}, []);

	useEffect(() => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
	}, [notifications]);

	useEffect(() => {
		const savedIndex = Number(localStorage.getItem(TAGLINE_INDEX_KEY) ?? "0");
		const lastChange = Number(
			localStorage.getItem(TAGLINE_LAST_CHANGE_KEY) ?? "0",
		);
		if (Number.isFinite(savedIndex) && savedIndex >= 0) {
			setCurrentTaglineIndex(savedIndex % TAGLINES.length);
		}
		if (!lastChange) {
			localStorage.setItem(TAGLINE_LAST_CHANGE_KEY, Date.now().toString());
			return;
		}
		if (Date.now() - lastChange >= TAGLINE_CHANGE_MS) {
			const next = (savedIndex + 1) % TAGLINES.length;
			setCurrentTaglineIndex(next);
			localStorage.setItem(TAGLINE_INDEX_KEY, String(next));
			localStorage.setItem(TAGLINE_LAST_CHANGE_KEY, Date.now().toString());
		}
	}, []);

	useEffect(() => {
		const interval = window.setInterval(() => {
			setCurrentTaglineIndex((prev) => {
				const next = (prev + 1) % TAGLINES.length;
				localStorage.setItem(TAGLINE_INDEX_KEY, String(next));
				localStorage.setItem(TAGLINE_LAST_CHANGE_KEY, Date.now().toString());
				return next;
			});
		}, TAGLINE_CHANGE_MS);
		return () => window.clearInterval(interval);
	}, []);

	const handleRandomTagline = () => {
		if (TAGLINES.length <= 1) return;
		diceButtonRef.current?.animate(
			[
				{ transform: "translateY(-50%) rotate(0deg) scale(1)" },
				{ transform: "translateY(-50%) rotate(-10deg) scale(0.96)" },
				{ transform: "translateY(-50%) rotate(12deg) scale(1.03)" },
				{ transform: "translateY(-50%) rotate(0deg) scale(1)" },
			],
			{ duration: 320, easing: "ease-in-out" },
		);
		let next = currentTaglineIndex;
		while (next === currentTaglineIndex) {
			next = Math.floor(Math.random() * TAGLINES.length);
		}
		setCurrentTaglineIndex(next);
		localStorage.setItem(TAGLINE_INDEX_KEY, String(next));
		localStorage.setItem(TAGLINE_LAST_CHANGE_KEY, Date.now().toString());
	};

	const unreadCount = pathname?.startsWith("/employee/notification")
		? 0
		: notifications.filter((n) => n.unread).length;

	const handleUserChange = (value: string) => {
		const nextUser = userOptions.find((u) => u.id === value);
		if (!nextUser) return;
		const profile = {
			id: nextUser.id,
			name: nextUser.name,
			role: nextUser.role,
		};
		setSelectedUser(profile);
		setActiveUserProfile(profile);
	};

	const isAdminUser = (selectedUser.role ?? "").toLowerCase() === "admin";

	const handleAdminNavigate = (e: { preventDefault: () => void }) => {
		if (isAdminUser) return;
		e.preventDefault();
		alert("Зөвхөн admin role-тэй хэрэглэгч Admin хэсэг рүү орж чадна.");
	};

	return (
		<header className="sticky top-0 z-50 h-[72px] w-full border-b border-white/10 bg-[#0A121B]/95 px-4 backdrop-blur-md">
			<div className="mx-auto flex h-[72px] w-full max-w-[1500px] items-center justify-between gap-4">
				<div className="flex min-w-[180px] items-center gap-8 md:gap-6 ">
					<Link
						href="/employee"
						className="flex items-center gap-2 text-slate-900 dark:text-white hover:opacity-90 transition-opacity"
					>
						<div className="flex items-center gap-2">
							<img src="/logo.png" alt="EBMS Logo" className="h-10 w-auto" />
							<div className="leading-[24px] ">
								<p className="flex justify-start items-start text-[20px] font-semibold tracking-[0px] text-white dark:text-white">
									UPDATE
								</p>
							</div>
						</div>
					</Link>
				</div>

				<div className="hidden flex-1 items-center justify-center px-2 md:flex ">
					<div className="relative w-full max-w-[650px] flex gap-3 items-center">
						<div className="w-[600px] h-10 border border-white/10 rounded-xl flex items-center justify-center">
							<p className="truncate px-16 text-center text-[18px] font-medium tracking-[-0.2px] text-[#CFD6D8] letter-spacing-[0.2px] line-height-[20px]">
								{TAGLINES[currentTaglineIndex]}
							</p>
						</div>
						<button
							ref={diceButtonRef}
							onClick={handleRandomTagline}
							className="group absolute right-0 top-1/2 inline-flex h-[40px] w-[40px] -translate-y-1/2 items-center justify-center rounded-[18px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_10px_24px_rgba(0,0,0,0.35)] transition hover:border-white/20 hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.09),rgba(255,255,255,0.03))] active:scale-[0.98]"
							title="Шинэ уриа үг"
							aria-label="Change tagline"
						>
							<IoDiceOutline className="h-5 w-5 text-white/55 transition group-hover:text-white/85" />
						</button>
					</div>
				</div>

				<div className="flex min-w-[180px] items-center justify-end gap-2">
					<Link
						href="/admin"
						onClick={handleAdminNavigate}
						aria-disabled={!isAdminUser}
						className="hidden md:inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:border-[#334155] dark:text-[#A7B6D3] dark:hover:bg-[#24364F] dark:hover:text-white"
					>
						<HiOutlineArrowTopRightOnSquare className="h-4 w-4" />
						Admin
					</Link>
					<label className="hidden md:flex items-center gap-2 rounded-lg border border-slate-300 px-2 py-1.5 text-xs text-slate-600 dark:border-[#334155] dark:text-[#A7B6D3]">
						<span>User</span>
						<select
							value={selectedUser.id}
							onChange={(e) => handleUserChange(e.target.value)}
							className="bg-transparent text-xs text-slate-700 outline-none dark:text-[#D1DBEF]"
							aria-label="Select active user"
						>
							{userOptions.map((opt) => (
								<option key={opt.id} value={opt.id} className="text-slate-900">
									{opt.name} ({opt.id})
								</option>
							))}
						</select>
					</label>
					<div className="flex items-center gap-3">
						<div className="h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-[#D1DBEF] dark:hover:text-white dark:hover:bg-[#0a121b]">
							<ThemeToggle />
						</div>
						<button
							className="md:hidden h-10 w-10 rounded-full bg-slate-100 text-slate-600 grid place-items-center ring-1 ring-transparent hover:ring-blue-300 hover:bg-slate-200 transition dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
							onClick={() => setMenuOpen(!menuOpen)}
							aria-label="Toggle navigation"
						>
							<HiBars3 className="text-sm" />
						</button>
						<div className="hidden md:flex items-center gap-2">
							<div className="relative" ref={notificationRef}>
								<button
									onClick={() => {
										setNotificationOpen(!notificationOpen);
										setProfileOpen(false);
									}}
									className="relative h-10 w-10 rounded-full border border-slate-200  grid place-items-center ring-1 ring-transparent  hover:bg-slate-200 transition  "
									aria-label="Notifications"
								>
									<HiOutlineBell className="text-sm w-5 h-5" />
									{unreadCount > 0 && (
										<span className="absolute top-0.5 right-0.5 h-2 w-2 rounded-full bg-red-500" />
									)}
								</button>
								{notificationOpen && (
									<div className="absolute right-0 top-full z-50 mt-3 w-[360px] overflow-hidden rounded-2xl border border-white/10 bg-[#0E1622] shadow-[0_28px_70px_-40px_rgba(0,0,0,0.85)]">
										<div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
											<div>
												<p className="text-sm font-semibold text-white">
													Notifications
												</p>
												<p className="text-xs text-white/60">
													{unreadCount} unread
												</p>
											</div>
											<button
												onClick={() => setNotificationOpen(false)}
												className="grid h-8 w-8 place-items-center rounded-full border border-white/10 text-white/60 transition hover:border-white/20 hover:text-white"
											>
												<HiXMark className="text-base" />
											</button>
										</div>

										<div className="max-h-[280px] space-y-2 overflow-y-auto px-3 py-3">
											{notifications.slice(0, 5).map((n) => {
												const iconClass =
													n.tone === "success"
														? "text-emerald-300 bg-emerald-500/15"
														: n.tone === "info"
															? "text-blue-300 bg-blue-500/15"
															: "text-slate-300 bg-slate-500/15";
												return (
													<button
														key={n.id}
														className="flex w-full gap-3 rounded-xl border border-transparent bg-white/5 p-3 text-left transition hover:border-white/10 hover:bg-white/10"
													>
														<div
															className={`flex-shrink-0 h-9 w-9 rounded-lg grid place-items-center ${iconClass}`}
														>
															{n.tone === "success" ? (
																<HiOutlineCheckCircle className="text-lg" />
															) : n.tone === "info" ? (
																<HiOutlineChartBar className="text-lg" />
															) : (
																<HiOutlineInformationCircle className="text-lg" />
															)}
														</div>
														<div className="flex-1 min-w-0">
															<p className="text-sm font-semibold text-white">
																{n.title}
															</p>
															<p className="mt-1 line-clamp-2 text-xs text-white/60">
																{n.body}
															</p>
															<p className="mt-2 text-[11px] text-white/40">
																{n.time}
															</p>
														</div>
														{n.unread && (
															<span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-red-500" />
														)}
													</button>
												);
											})}
										</div>

										<div className="border-t border-white/10 px-3 py-3">
											<Link
												href="/employee/notification"
												onClick={() => setNotificationOpen(false)}
												className="block w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-center text-xs font-semibold text-white/80 transition hover:border-white/20 hover:text-white"
											>
												View all notifications
											</Link>
										</div>
									</div>
								)}
							</div>
						</div>
						<div className="relative" ref={profileRef}>
							<button
								onClick={() => {
									setProfileOpen(!profileOpen);
									setNotificationOpen(false);
								}}
								className="flex h-10 w-10 items-center justify-center rounded-full  text-sm font-semibold text-white "
								aria-label="Profile"
							>
								<ProfileIcon />
							</button>
							{profileOpen && (
								<div className="absolute right-0 top-full mt-2 w-[280px] bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50 dark:bg-[#1A2333] dark:border-[#243041]">
									<div className="p-4 border-b border-slate-200 dark:border-[#243041]">
										<div className="flex items-center gap-3">
											<div className="flex h-12 w-12 items-center justify-center rounded-full  text-sm font-semibold text-white ">
												<ProfileIcon />
											</div>
											<div>
												<p className="text-slate-900 font-semibold dark:text-white">
													{me?.name ?? "—"}
												</p>
												<p className="text-slate-500 text-xs mt-1 dark:text-slate-500">
													{me?.id ?? "—"}
												</p>
											</div>
										</div>
									</div>
									<div className="p-2">
										<Link
											href="/admin"
											className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white"
										>
											<HiOutlineArrowTopRightOnSquare className="h-4 w-4" />
											Admin
										</Link>
										<Link
											href="/employee/myprofile"
											onClick={() => setProfileOpen(false)}
											className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white"
										>
											<HiOutlineUserCircle className="text-lg" />
											Profile
										</Link>
										<div className="my-2 h-px bg-slate-200 dark:bg-[#243041]" />
										<button
											onClick={() => setProfileOpen(false)}
											className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition"
										>
											<HiOutlineArrowRightOnRectangle className="text-lg" />
											Sign out
										</button>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
			<div className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-full bg-[linear-gradient(90deg,rgba(118,55,255,0.0)_0%,rgba(118,55,255,0.65)_50%,rgba(118,55,255,0.0)_100%)]" />
			<div
				className={`md:hidden absolute left-0 top-[72px] w-full bg-white border-t border-slate-200 dark:bg-slate-900 dark:border-slate-800 ${
					menuOpen ? "block" : "hidden"
				}`}
			>
				<nav className="flex flex-col gap-1 p-3 text-slate-600 dark:text-slate-300 text-sm">
					<Link
						href="/admin"
						onClick={(e) => {
							handleAdminNavigate(e);
							if (isAdminUser) setMenuOpen(false);
						}}
						aria-disabled={!isAdminUser}
						className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-slate-600 ring-1 ring-transparent hover:ring-blue-300 hover:text-slate-900 hover:bg-slate-100 transition dark:text-slate-300 dark:hover:ring-blue-300 dark:hover:text-white dark:hover:bg-slate-800"
					>
						<HiOutlineArrowTopRightOnSquare className="text-base" />
						Admin руу шилжих
					</Link>
					<div className="h-px bg-slate-200 dark:bg-slate-800 my-2" />
					<label className="inline-flex items-center justify-between rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-600 dark:border-[#334155] dark:text-[#A7B6D3]">
						<span>User</span>
						<select
							value={selectedUser.id}
							onChange={(e) => handleUserChange(e.target.value)}
							className="ml-3 bg-transparent text-xs text-slate-700 outline-none dark:text-[#D1DBEF]"
							aria-label="Select active user"
						>
							{userOptions.map((opt) => (
								<option key={opt.id} value={opt.id} className="text-slate-900">
									{opt.name} ({opt.id})
								</option>
							))}
						</select>
					</label>
					<div className="h-px bg-slate-200 dark:bg-slate-800 my-2" />
					<div className="flex items-center gap-2">
						<Link
							href="/employee/notification"
							onClick={() => setMenuOpen(false)}
							className="h-8 w-8 rounded-full bg-slate-100 text-slate-600 grid place-items-center ring-1 ring-transparent hover:ring-blue-300 hover:bg-slate-200 transition dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
						>
							<HiOutlineBell className="text-sm" />
						</Link>
						<Link
							href="/employee/notification"
							onClick={() => setMenuOpen(false)}
							className="flex items-center gap-2"
						>
							<div className="h-8 w-8 rounded-full bg-blue-600 text-white text-[10px] font-semibold grid place-items-center">
								{me?.name
									?.split(" ")
									.map((s) => s[0])
									.join("")
									.slice(0, 2)
									.toUpperCase() ?? "JD"}
							</div>
							<span className="text-slate-600 text-xs dark:text-slate-300">
								Account
							</span>
						</Link>
					</div>
				</nav>
			</div>
		</header>
	);
};
