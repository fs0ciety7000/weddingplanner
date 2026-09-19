import type { BudgetItem } from "@/lib/types/database";

export interface BudgetRow {
  item: BudgetItem;
  hasQuote: boolean;
  engaged: number;
  paid: number;
  balance: number;
}

export interface BudgetCalc {
  rows: BudgetRow[];
  estimated: number;
  engaged: number;
  paid: number;
  balance: number;
  unquoted: number;
}

export function computeBudget(items: BudgetItem[], budgetTotal: number | null): BudgetCalc {
  const rows: BudgetRow[] = items.map((item) => {
    const hasQuote = item.quote_amount !== null;
    const engaged = hasQuote ? (item.quote_amount as number) : item.estimated_amount;
    const paid = item.paid_amount;
    return { item, hasQuote, engaged, paid, balance: Math.max(engaged - paid, 0) };
  });

  const estimated = rows.reduce((s, r) => s + r.item.estimated_amount, 0);
  const engaged = rows.reduce((s, r) => s + r.engaged, 0);
  const paid = rows.reduce((s, r) => s + r.paid, 0);
  const balance = rows.reduce((s, r) => s + r.balance, 0);
  const unquoted = rows.filter((r) => !r.hasQuote).reduce((s, r) => s + r.engaged, 0);

  void budgetTotal;
  return { rows, estimated, engaged, paid, balance, unquoted };
}
