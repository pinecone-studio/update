"use client";

import { useEffect, useMemo, useState } from "react";

type BenefitDraft = {
  name: string;
  category: string;
  subsidyPercent: string;
  vendorName: string;
  effectiveFrom: string;
  effectiveTo: string;
  requiresContract: boolean;
  isActive: boolean;
};

type RuleDraft = {
  id: string;
  ruleType: string;
  operator: string;
  value: string;
  approverRole: "finance" | "hr_admin";
  errorMessage: string;
  priority: string;
  isActive: boolean;
};

type ContractDraft = {
  vendorName: string;
  version: string;
  r2ObjectKey: string;
  sha256Hash: string;
  effectiveDate: string;
  expiryDate: string;
  isActive: boolean;
};

type CreatedBenefitItem = {
  id: string;
  name: string;
  category: string;
  subsidyPercent: number;
  vendorName: string | null;
  effectiveFrom: string | null;
  effectiveTo: string | null;
  requiresContract: boolean;
  ruleCount: number;
  createdAt: string;
};

const CATEGORIES = ["Wellness", "Equipment", "Financial", "Career Development", "Flexibility"];
const RULE_TYPES = ["responsibilityLevel", "role", "tenure", "okrSubmitted", "lateArrivalCount", "employmentStatus"];
const OPERATORS = ["eq", "neq", "gte", "lte", "in", "not_in"];
const RULE_LABELS: Record<string, string> = {
  responsibilityLevel: "Хариуцлагын түвшин",
  role: "Роль",
  tenure: "Ажилласан хугацаа",
  okrSubmitted: "OKR өгсөн эсэх",
  lateArrivalCount: "Хоцролтын тоо",
  employmentStatus: "Ажил эрхлэлтийн төлөв",
};

const inputClass =
  "h-12 w-full rounded-xl border border-[#324A70] bg-[#0F172A] px-4 text-5 text-[#D7E0F3] outline-none placeholder:text-[#6D7F9F] focus:border-[#4B6FA8]";
const cardClass = "rounded-2xl border border-[#2C4264] bg-[#1E293B] p-6";

function createRule(seed: number): RuleDraft {
  return {
    id: `tmp-rule-${seed}`,
    ruleType: RULE_TYPES[0],
    operator: OPERATORS[0],
    value: "",
    approverRole: "hr_admin",
    errorMessage: "",
    priority: "0",
    isActive: true,
  };
}

function createEmptyContract(): ContractDraft {
  return {
    vendorName: "",
    version: "",
    r2ObjectKey: "",
    sha256Hash: "",
    effectiveDate: "",
    expiryDate: "",
    isActive: true,
  };
}

export default function AddBenefitPage() {
  const [benefit, setBenefit] = useState<BenefitDraft>({
    name: "",
    category: CATEGORIES[0],
    subsidyPercent: "0",
    vendorName: "",
    effectiveFrom: "",
    effectiveTo: "",
    requiresContract: false,
    isActive: true,
  });

  const [benefitRulesMap, setBenefitRulesMap] = useState<Record<string, RuleDraft[]>>({});
  const [selectedBenefitId, setSelectedBenefitId] = useState<string | null>(null);
  const [editingRules, setEditingRules] = useState<RuleDraft[]>([]);

  const [contractByBenefit, setContractByBenefit] = useState<Record<string, ContractDraft>>({});
  const [editingContract, setEditingContract] = useState<ContractDraft>(createEmptyContract());

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hint, setHint] = useState<string>("");
  const [createdBenefits, setCreatedBenefits] = useState<CreatedBenefitItem[]>([]);

  const STORAGE_KEY = "ebms_add_benefit_state_v1";

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as {
        createdBenefits?: CreatedBenefitItem[];
        benefitRulesMap?: Record<string, RuleDraft[]>;
        contractByBenefit?: Record<string, ContractDraft>;
      };
      if (parsed.createdBenefits) setCreatedBenefits(parsed.createdBenefits);
      if (parsed.benefitRulesMap) setBenefitRulesMap(parsed.benefitRulesMap);
      if (parsed.contractByBenefit) setContractByBenefit(parsed.contractByBenefit);
    } catch {
      // Ignore corrupted local state.
    }
  }, []);

  useEffect(() => {
    const snapshot = JSON.stringify({ createdBenefits, benefitRulesMap, contractByBenefit });
    localStorage.setItem(STORAGE_KEY, snapshot);
  }, [createdBenefits, benefitRulesMap, contractByBenefit]);

  const setBenefitField = <K extends keyof BenefitDraft>(key: K, value: BenefitDraft[K]) => {
    setBenefit((prev) => ({ ...prev, [key]: value }));
  };

  const onToggleActive = (checked: boolean) => {
    setBenefit((prev) => ({
      ...prev,
      isActive: checked,
      // "Идэвхтэй" сонговол дуусах огноо шаардахгүй, тиймээс цэвэрлэнэ.
      effectiveTo: checked ? "" : prev.effectiveTo,
    }));
  };

  const onChangeEffectiveTo = (value: string) => {
    setBenefit((prev) => ({
      ...prev,
      effectiveTo: value,
      // Дуусах огноо оруулбал "Идэвхтэй"-г автоматаар болиулна.
      isActive: value ? false : prev.isActive,
    }));
  };

  const setContractField = <K extends keyof ContractDraft>(key: K, value: ContractDraft[K]) => {
    setEditingContract((prev) => ({ ...prev, [key]: value }));
  };

  const setRuleField = <K extends keyof RuleDraft>(idx: number, key: K, value: RuleDraft[K]) => {
    setEditingRules((prev) => prev.map((r, i) => (i === idx ? { ...r, [key]: value } : r)));
  };

  const addRule = () => setEditingRules((prev) => [...prev, createRule(prev.length + 1)]);
  const removeRule = (idx: number) => setEditingRules((prev) => prev.filter((_, i) => i !== idx));

  const openRuleEditor = (benefitId: string) => {
    setSelectedBenefitId(benefitId);
    setEditingRules(benefitRulesMap[benefitId] ?? [createRule(1)]);
    setEditingContract(contractByBenefit[benefitId] ?? createEmptyContract());
  };

  const selectedBenefit = useMemo(
    () => createdBenefits.find((item) => item.id === selectedBenefitId) ?? null,
    [createdBenefits, selectedBenefitId]
  );

  const toggleSelectedBenefitRequiresContract = (checked: boolean) => {
    if (!selectedBenefitId) return;
    setCreatedBenefits((prev) =>
      prev.map((item) => (item.id === selectedBenefitId ? { ...item, requiresContract: checked } : item))
    );
    if (!checked) {
      setContractByBenefit((prev) => {
        const next = { ...prev };
        delete next[selectedBenefitId];
        return next;
      });
      setEditingContract(createEmptyContract());
    }
  };

  const saveRulesForSelectedBenefit = () => {
    if (!selectedBenefitId) return;

    // Цонхтой холбоотой хуучин validation алдаануудыг эхэлж цэвэрлэнэ.
    setErrors((prev) => {
      const next: Record<string, string> = {};
      Object.entries(prev).forEach(([key, value]) => {
        const isRuleError = key.startsWith("rule_");
        const isContractError =
          key === "contractVendorName" || key === "contractVersion" || key === "r2ObjectKey";
        if (!isRuleError && !isContractError) {
          next[key] = value;
        }
      });
      return next;
    });

    const ruleErrors: Record<string, string> = {};
    editingRules.forEach((r, idx) => {
      if (!r.value.trim()) ruleErrors[`rule_${idx}_value`] = "Дүрмийн утга заавал шаардлагатай";
    });

    if (Object.keys(ruleErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...ruleErrors }));
      setHint("Дүрмийн утгуудаа гүйцэд бөглөнө үү.");
      return;
    }

    if (selectedBenefit?.requiresContract) {
      if (!editingContract.vendorName.trim()) ruleErrors.contractVendorName = "Гэрээний vendor нэр шаардлагатай";
      if (!editingContract.version.trim()) ruleErrors.contractVersion = "Гэрээний хувилбар шаардлагатай";
      if (!editingContract.r2ObjectKey.trim()) ruleErrors.r2ObjectKey = "r2ObjectKey заавал шаардлагатай";
      if (Object.keys(ruleErrors).length > 0) {
        setErrors((prev) => ({ ...prev, ...ruleErrors }));
        setHint("Гэрээний мэдээллээ гүйцэд бөглөнө үү.");
        return;
      }
    }

    setBenefitRulesMap((prev) => ({ ...prev, [selectedBenefitId]: editingRules }));
    if (selectedBenefit?.requiresContract) {
      setContractByBenefit((prev) => ({ ...prev, [selectedBenefitId]: editingContract }));
    }
    setCreatedBenefits((prev) =>
      prev.map((item) => (item.id === selectedBenefitId ? { ...item, ruleCount: editingRules.length } : item))
    );
    setHint("Дүрэм амжилттай хадгалагдлаа. (Refresh хийсэн ч хадгалагдана)");
  };

  const payload = useMemo(() => {
    return {
      benefits: {
        name: benefit.name,
        category: benefit.category,
        subsidyPercent: Number(benefit.subsidyPercent || 0),
        vendorName: benefit.vendorName || null,
        requiresContract: 0,
        isActive: benefit.isActive ? 1 : 0,
      },
      uiOnly: {
        effectiveFrom: benefit.effectiveFrom || null,
        effectiveTo: benefit.isActive ? null : benefit.effectiveTo || null,
      },
      eligibilityRules: [],
      uiRuleApprovals: editingRules.map((r) => ({
        ruleType: r.ruleType,
        approverRole: r.approverRole,
      })),
      contract: null,
    };
  }, [benefit]);

  const validate = () => {
    const next: Record<string, string> = {};

    if (!benefit.name.trim()) next.name = "Benefit нэр заавал шаардлагатай";
    if (!benefit.category.trim()) next.category = "Ангилал заавал шаардлагатай";
    if (!benefit.effectiveFrom.trim()) next.effectiveFrom = "Хэрэгжих хугацааны эхлэх огноо шаардлагатай";
    if (!benefit.isActive && !benefit.effectiveTo.trim()) {
      next.effectiveTo = "Дуусах огноо оруулах эсвэл Идэвхтэй-г сонгоно.";
    }

    const subsidy = Number(benefit.subsidyPercent);
    if (Number.isNaN(subsidy) || subsidy < 0 || subsidy > 100) {
      next.subsidyPercent = "Хөнгөлөлтийн хувь 0-100 хооронд байх ёстой";
    }
    if (!benefit.isActive && benefit.effectiveFrom && benefit.effectiveTo && benefit.effectiveFrom > benefit.effectiveTo) {
      next.effectiveTo = "Дуусах огноо эхлэх огнооноос өмнө байж болохгүй";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmitMock = () => {
    if (!validate()) {
      setHint("Шалгалт амжилтгүй. Тодруулсан талбаруудыг засна уу.");
      return;
    }

    const now = new Date();
    const createdItem: CreatedBenefitItem = {
      id: `tmp-${now.getTime()}`,
      name: benefit.name.trim(),
      category: benefit.category,
      subsidyPercent: Number(benefit.subsidyPercent || 0),
      vendorName: benefit.vendorName.trim() || null,
      effectiveFrom: benefit.effectiveFrom || null,
      effectiveTo: benefit.isActive ? null : benefit.effectiveTo || null,
      requiresContract: false,
      ruleCount: 0,
      createdAt: now.toLocaleString(),
    };

    setCreatedBenefits((prev) => [createdItem, ...prev]);
    setHint("Benefit амжилттай үүслээ. Доор үүссэн жагсаалтад нэмэгдсэн.");
    setErrors({});

    setBenefit({
      name: "",
      category: CATEGORIES[0],
      subsidyPercent: "0",
      vendorName: "",
      effectiveFrom: "",
      effectiveTo: "",
      requiresContract: false,
      isActive: true,
    });
    setEditingContract(createEmptyContract());
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold text-white">Шинэ Benefit Нэмэх</h1>
        <p className="mt-3 text-5 text-[#A7B6D3]">
          Энэ form нь backend-ийн хүснэгтүүдтэй таарсан: benefits, eligibility_rules, contracts.
        </p>
      </header>

      <section className={cardClass}>
        <h2 className="text-10 font-semibold text-white">1. benefits</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-5 text-[#A7B6D3]">Benefit нэр (name)</label>
            <input className={inputClass} value={benefit.name} onChange={(e) => setBenefitField("name", e.target.value)} />
            {errors.name && <p className="mt-1 text-5 text-[#FF8B8B]">{errors.name}</p>}
          </div>
          <div>
            <label className="mb-2 block text-5 text-[#A7B6D3]">Ангилал (category)</label>
            <select className={inputClass} value={benefit.category} onChange={(e) => setBenefitField("category", e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-5 text-[#A7B6D3]">Хөнгөлөлтийн хувь (subsidyPercent 0-100)</label>
            <input
              className={inputClass}
              value={benefit.subsidyPercent}
              onChange={(e) => setBenefitField("subsidyPercent", e.target.value)}
            />
            {errors.subsidyPercent && <p className="mt-1 text-5 text-[#FF8B8B]">{errors.subsidyPercent}</p>}
          </div>
          <div>
            <label className="mb-2 block text-5 text-[#A7B6D3]">Vendor нэр (vendorName, optional)</label>
            <input className={inputClass} value={benefit.vendorName} onChange={(e) => setBenefitField("vendorName", e.target.value)} />
          </div>
          <div>
            <label className="mb-2 block text-5 text-[#A7B6D3]">Хэрэгжих хугацаа - Эхлэх огноо</label>
            <input
              type="date"
              className={inputClass}
              value={benefit.effectiveFrom}
              onChange={(e) => setBenefitField("effectiveFrom", e.target.value)}
            />
            {errors.effectiveFrom && <p className="mt-1 text-5 text-[#FF8B8B]">{errors.effectiveFrom}</p>}
          </div>
          <label className="flex items-end gap-3 pb-2 text-5 text-[#D7E0F3]">
            <input type="checkbox" checked={benefit.isActive} onChange={(e) => onToggleActive(e.target.checked)} />
            Идэвхтэй (isActive)
          </label>
          <div>
            <label className="mb-2 block text-5 text-[#A7B6D3]">Хэрэгжих хугацаа - Дуусах огноо</label>
            <input
              type="date"
              className={`${inputClass} ${benefit.isActive ? "cursor-not-allowed opacity-60" : ""}`}
              value={benefit.effectiveTo}
              onChange={(e) => onChangeEffectiveTo(e.target.value)}
              disabled={benefit.isActive}
            />
            <p className="mt-1 text-5 text-[#9FB3D5]">Зарчмын дагуу: Дуусах огноо оруулах эсвэл Идэвхтэй-г сонгоно.</p>
            {errors.effectiveTo && <p className="mt-1 text-5 text-[#FF8B8B]">{errors.effectiveTo}</p>}
          </div>
        </div>
      </section>

      <section className={cardClass}>
        <h2 className="text-10 font-semibold text-white">2. Дүрэм нэмэх урсгал</h2>
        <p className="mt-3 text-5 text-[#A7B6D3]">
          Эхлээд benefit-ээ үүсгэнэ. Үүссэний дараа доорх хүснэгт дээрх тухайн мөрөн дээр
          <span className="mx-1 text-[#4F86FF]">Дүрэм нэмэх</span>
          товчоор орж eligibility_rules нэмнэ. Энгийн хувилбар: `Дүрмийн төрөл + Утга + Идэвхтэй` л бөглөнө.
        </p>
      </section>

      <section className={cardClass}>
        <h2 className="text-10 font-semibold text-white">4. Илгээх Payload (schema aligned)</h2>
        <pre className="mt-4 overflow-x-auto rounded-xl border border-[#324A70] bg-[#0F172A] p-4 text-5 text-[#9EB0D1]">
{JSON.stringify(payload, null, 2)}
        </pre>
      </section>

      <div className="flex items-center gap-3 pb-4">
        <button
          type="button"
          onClick={onSubmitMock}
          className="rounded-xl border border-[#2F66E8] bg-[#1A2D59] px-5 py-2 text-5 text-[#4F86FF] transition hover:bg-[#213872]"
        >
          Шалгах & Үүсгэх
        </button>
        {hint && <p className="text-5 text-[#7EE2A0]">{hint}</p>}
      </div>

      {createdBenefits.length > 0 && (
        <section className={cardClass}>
          <h2 className="text-10 font-semibold text-white">5. Үүссэн Benefit-үүд</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-5">
              <thead className="border-b border-[#324A70] text-[#A7B6D3]">
                <tr>
                  <th className="px-4 py-3 font-medium">Нэр</th>
                  <th className="px-4 py-3 font-medium">Ангилал</th>
                  <th className="px-4 py-3 font-medium">Subsidy %</th>
                  <th className="px-4 py-3 font-medium">Vendor</th>
                  <th className="px-4 py-3 font-medium">Хэрэгжих хугацаа</th>
                  <th className="px-4 py-3 font-medium">Дүрмийн тоо</th>
                  <th className="px-4 py-3 font-medium">Үүсгэсэн цаг</th>
                  <th className="px-4 py-3 font-medium">Үйлдэл</th>
                </tr>
              </thead>
              <tbody>
                {createdBenefits.map((item) => (
                  <tr key={item.id} className="border-b border-[#2B405F] last:border-b-0">
                    <td className="px-4 py-3 font-medium text-white">{item.name}</td>
                    <td className="px-4 py-3 text-slate-300">{item.category}</td>
                    <td className="px-4 py-3 text-slate-300">{item.subsidyPercent}</td>
                    <td className="px-4 py-3 text-slate-300">{item.vendorName ?? "-"}</td>
                    <td className="px-4 py-3 text-slate-300">
                      {item.effectiveFrom ?? "-"} ~ {item.effectiveTo ?? "Идэвхтэй"}
                    </td>
                    <td className="px-4 py-3 text-slate-300">{item.ruleCount}</td>
                    <td className="px-4 py-3 text-slate-300">{item.createdAt}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => openRuleEditor(item.id)}
                        className="rounded-lg border border-[#2F66E8] bg-[#1A2D59] px-3 py-1 text-5 text-[#4F86FF] hover:bg-[#213872]"
                      >
                        Дүрэм нэмэх
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {selectedBenefitId && (
        <section className={cardClass}>
          <div className="flex items-center justify-between">
            <h2 className="text-10 font-semibold text-white">6. Eligibility Rules Editor</h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={addRule}
                className="rounded-xl border border-[#2F66E8] bg-[#1A2D59] px-4 py-2 text-5 text-[#4F86FF]"
              >
                + Дүрэм нэмэх
              </button>
              <button
                type="button"
                onClick={saveRulesForSelectedBenefit}
                className="rounded-xl border border-[#0E6B4F] bg-[#15342B] px-4 py-2 text-5 text-[#00E08B]"
              >
                Дүрэм хадгалах
              </button>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-[#324A70] bg-[#0F172A] p-4">
            <label className="flex items-center gap-3 text-5 text-[#D7E0F3]">
              <input
                type="checkbox"
                checked={selectedBenefit?.requiresContract ?? false}
                onChange={(e) => toggleSelectedBenefitRequiresContract(e.target.checked)}
              />
              Гэрээ шаардлагатай (requiresContract) - энэ benefit дээр
            </label>
          </div>

          {selectedBenefit?.requiresContract && (
            <div className="mt-4 rounded-xl border border-[#324A70] bg-[#0F172A] p-4">
              <h3 className="text-5 font-semibold text-white">Contract мэдээлэл</h3>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-5 text-[#A7B6D3]">Vendor нэр (vendorName)</label>
                  <input className={inputClass} value={editingContract.vendorName} onChange={(e) => setContractField("vendorName", e.target.value)} />
                  {errors.contractVendorName && <p className="mt-1 text-5 text-[#FF8B8B]">{errors.contractVendorName}</p>}
                </div>
                <div>
                  <label className="mb-2 block text-5 text-[#A7B6D3]">Гэрээний хувилбар (version)</label>
                  <input className={inputClass} value={editingContract.version} onChange={(e) => setContractField("version", e.target.value)} />
                  {errors.contractVersion && <p className="mt-1 text-5 text-[#FF8B8B]">{errors.contractVersion}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="mb-2 block text-5 text-[#A7B6D3]">R2 Object Key (r2ObjectKey)</label>
                  <input className={inputClass} value={editingContract.r2ObjectKey} onChange={(e) => setContractField("r2ObjectKey", e.target.value)} />
                  {errors.r2ObjectKey && <p className="mt-1 text-5 text-[#FF8B8B]">{errors.r2ObjectKey}</p>}
                </div>
                <div>
                  <label className="mb-2 block text-5 text-[#A7B6D3]">SHA256 Hash (optional)</label>
                  <input className={inputClass} value={editingContract.sha256Hash} onChange={(e) => setContractField("sha256Hash", e.target.value)} />
                </div>
                <div>
                  <label className="mb-2 block text-5 text-[#A7B6D3]">Идэвхтэй эсэх (isActive)</label>
                  <label className="mt-3 flex items-center gap-3 text-5 text-[#D7E0F3]">
                    <input
                      type="checkbox"
                      checked={editingContract.isActive}
                      onChange={(e) => setContractField("isActive", e.target.checked)}
                    />
                    идэвхтэй гэрээ
                  </label>
                </div>
                <div>
                  <label className="mb-2 block text-5 text-[#A7B6D3]">Эхлэх огноо (effectiveDate)</label>
                  <input
                    type="date"
                    className={inputClass}
                    value={editingContract.effectiveDate}
                    onChange={(e) => setContractField("effectiveDate", e.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-5 text-[#A7B6D3]">Дуусах огноо (expiryDate)</label>
                  <input
                    type="date"
                    className={inputClass}
                    value={editingContract.expiryDate}
                    onChange={(e) => setContractField("expiryDate", e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="mt-4 space-y-4">
            <p className="text-5 text-[#9FB3D5]">
              Хадгалагдсан дүрмийн тоо: {benefitRulesMap[selectedBenefitId]?.length ?? 0}
            </p>
            {editingRules.map((rule, idx) => (
              <div key={rule.id} className="rounded-xl border border-[#324A70] bg-[#0F172A] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-5 text-white">Дүрэм {idx + 1}</p>
                  {editingRules.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRule(idx)}
                      className="rounded-lg border border-[#7B3041] px-3 py-1 text-5 text-[#F39AAF]"
                    >
                      Устгах
                    </button>
                  )}
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-5 text-[#A7B6D3]">Дүрмийн төрөл (ruleType)</label>
                    <select
                      className={inputClass}
                      value={rule.ruleType}
                      onChange={(e) => setRuleField(idx, "ruleType", e.target.value)}
                    >
                      {RULE_TYPES.map((r) => (
                        <option key={r} value={r}>
                          {RULE_LABELS[r]}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-5 text-[#A7B6D3]">Утга (value)</label>
                    <input
                      className={inputClass}
                      value={rule.value}
                      onChange={(e) => setRuleField(idx, "value", e.target.value)}
                      placeholder={
                        rule.ruleType === "okrSubmitted"
                          ? "true эсвэл false"
                          : rule.ruleType === "lateArrivalCount"
                            ? "ж: 3"
                            : rule.ruleType === "employmentStatus"
                              ? "active"
                              : "утгаа оруулна уу"
                      }
                    />
                    {errors[`rule_${idx}_value`] && <p className="mt-1 text-5 text-[#FF8B8B]">{errors[`rule_${idx}_value`]}</p>}
                  </div>
                  <div>
                    <label className="mb-1 block text-5 text-[#A7B6D3]">Батлах хүн (approver)</label>
                    <select
                      className={inputClass}
                      value={rule.approverRole}
                      onChange={(e) => setRuleField(idx, "approverRole", e.target.value as "finance" | "hr_admin")}
                    >
                      <option value="finance">finance</option>
                      <option value="hr_admin">hr_admin</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-5 text-[#A7B6D3]">Идэвхтэй эсэх (isActive)</label>
                    <label className="mt-3 flex items-center gap-3 text-5 text-[#D7E0F3]">
                      <input
                        type="checkbox"
                        checked={rule.isActive}
                        onChange={(e) => setRuleField(idx, "isActive", e.target.checked)}
                      />
                      идэвхтэй
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
