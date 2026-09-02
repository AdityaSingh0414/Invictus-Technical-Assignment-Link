export function formatMoney(amount) {
  const n = Number(amount);
  if (!Number.isFinite(n)) return "$0.00";
  const clean = Math.abs(n) < 0.001 ? 0 : n;
  const sign = clean < 0 ? "-" : "";
  return `${sign}$${Math.abs(clean).toFixed(2)}`;
}

export function splitEqual(amount, ids) {
  if (!ids || !ids.length) return {};
  const totalCents = Math.round(Number(amount) * 100);
  const n = ids.length;
  const baseCents = Math.floor(totalCents / n);
  const remainderCents = totalCents % n;

  const shares = {};
  ids.forEach((id, index) => {
    const cents = baseCents + (index < remainderCents ? 1 : 0);
    shares[id] = cents / 100;
  });
  return shares;
}

export function percentsSumTo100(percents) {
  const values = Object.values(percents).map(Number);
  const sum = values.reduce((a, b) => a + b, 0);
  return Math.abs(sum - 100) < 0.01;
}

export function splitByPercent(amount, percents) {
  const entries = Object.entries(percents);
  if (!entries.length) return {};
  const totalCents = Math.round(Number(amount) * 100);

  let allocatedCents = 0;
  const rawCentsMap = {};
  entries.forEach(([id, pct]) => {
    const cents = Math.round((totalCents * Number(pct)) / 100);
    rawCentsMap[id] = cents;
    allocatedCents += cents;
  });

  const diff = totalCents - allocatedCents;
  if (diff !== 0 && entries.length > 0) {
    const lastId = entries[entries.length - 1][0];
    rawCentsMap[lastId] += diff;
  }

  const shares = {};
  for (const [id, cents] of Object.entries(rawCentsMap)) {
    shares[id] = cents / 100;
  }
  return shares;
}

export function sharesForExpense(expense) {
  if (expense.splitType === "percent" && expense.percents) {
    return splitByPercent(expense.amount, expense.percents);
  }
  return splitEqual(expense.amount, expense.splitWith);
}

