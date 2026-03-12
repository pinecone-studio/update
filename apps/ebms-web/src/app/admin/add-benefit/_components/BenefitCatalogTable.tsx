'use client';

import { Skeleton } from '@/app/_components/Skeleton';
import type { BenefitFromCatalog } from '../_lib/types';

const sectionClass = 'mt-8 rounded-xl border border-slate-200 bg-slate-50 p-6 dark:border-[#334155] dark:bg-[#0F172A]';
const btnClass = 'rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50 dark:border-[#334155] dark:text-[#94A3B8] dark:hover:bg-[#24364F] dark:hover:text-white';

type Props = {
  benefits: BenefitFromCatalog[];
  loading: boolean;
  onRefresh: () => void;
};

export function BenefitCatalogTable({ benefits, loading, onRefresh }: Props) {
  return (
    <section className={sectionClass}>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="text-xl font-medium text-slate-900 dark:text-white">D1-д байгаа benefit-үүд</h2>
        <button type="button" onClick={onRefresh} disabled={loading} className={btnClass}>
          {loading ? 'Татаж байна...' : 'Дахин татах'}
        </button>
      </div>
      <p className="mt-1 text-sm text-slate-600 dark:text-[#94A3B8]">benefits query-аар D1-ээс татсан жагсаалт.</p>

      {loading && benefits.length === 0 ? (
        <p className="mt-4 text-slate-600 text-sm dark:text-[#94A3B8]">Уншиж байна...</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#334155] text-[#94A3B8]">
                {['ID', 'Нэр', 'Ангилал', 'Subsidy %', 'Гэрээ'].map((h) => (
                  <th key={h} className="py-2 pr-4 font-medium">
                    <Skeleton className="h-4 w-12" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="border-b border-[#334155]/70 last:border-b-0">
                  <td className="py-2 pr-4"><Skeleton className="h-4 w-16" /></td>
                  <td className="py-2 pr-4"><Skeleton className="h-4 w-24" /></td>
                  <td className="py-2 pr-4"><Skeleton className="h-4 w-20" /></td>
                  <td className="py-2 pr-4"><Skeleton className="h-4 w-8" /></td>
                  <td className="py-2"><Skeleton className="h-4 w-12" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : benefits.length === 0 ? (
        <p className="mt-4 text-slate-600 text-sm dark:text-[#94A3B8]">D1-д benefit байхгүй. Дээрх хэсгээс нэмнэ үү.</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-300 text-slate-500 dark:border-[#334155] dark:text-[#94A3B8]">
                <th className="py-2 pr-4 font-medium">ID</th>
                <th className="py-2 pr-4 font-medium">Нэр</th>
                <th className="py-2 pr-4 font-medium">Ангилал</th>
                <th className="py-2 pr-4 font-medium">Subsidy %</th>
                <th className="py-2 font-medium">Гэрээ</th>
              </tr>
            </thead>
            <tbody>
              {benefits.map((b) => (
                <tr key={b.id} className="border-b border-slate-200 last:border-b-0 dark:border-[#334155]/70">
                  <td className="py-2 pr-4 text-slate-700 font-mono dark:text-[#E2E8F0]">{b.id}</td>
                  <td className="py-2 pr-4 text-slate-900 dark:text-white">{b.name}</td>
                  <td className="py-2 pr-4 text-slate-600 dark:text-[#A7B6D3]">{b.category}</td>
                  <td className="py-2 pr-4 text-slate-600 dark:text-[#A7B6D3]">{b.subsidyPercent}</td>
                  <td className="py-2 text-slate-600 dark:text-[#A7B6D3]">{b.requiresContract ? 'Тийм' : 'Үгүй'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
