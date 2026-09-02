# Bugs found

Add one section per issue. Bug 1 is filled in to show the format — fix it, then write what you changed. Copy the blank template for the rest.

Keep this file in the repo and **commit it** with your fixes.

---

## Bug 1

**How to reproduce:** Open the app. The expense list says “Newest first”. The first row is Wine (7 Mar). Board game (15 Mar) is further down.

**What is wrong:** The list is showing oldest expenses first. Newest should be at the top. Also, subtracting unparsed date strings yielded `NaN` in JavaScript sorting.

**What I changed:** In `src/lib/format.js`, updated `dateValue` to reliably parse date strings/objects into numeric timestamps. In `src/components/ExpenseList.jsx`, changed the sorting comparator to sort descending: `dateValue(b.date) - dateValue(a.date)`.

---

## Bug 2

**How to reproduce:** Look at the expense dates in the expense list or reload the app. Dates were either displayed as raw unformatted strings (e.g. `2026-03-12`), or when parsed as UTC `new Date("YYYY-MM-DD")`, shifted to the previous day in western timezones (e.g., March 11 instead of March 12).

**What is wrong:** `formatDate` only formatted instances of `Date`, falling back to `date.slice(0, 10)` for strings. Additionally, parsing date strings via standard UTC constructor caused timezone offset shift bugs depending on the user's local timezone.

**What I changed:** In `src/lib/format.js`, enhanced `formatDate` to parse both date strings and Date objects by individual year, month, and day components, formatting consistently to readable dates (e.g., `12 Mar 2026`) without timezone shifts.

---

## Bug 3

**How to reproduce:** Look at the seed expense "Uber to airport" ($60) paid by Diya (id: 4) split between Aisha (1) and Ben (2). Check Diya's balance in the Balances panel. Diya's credit was incorrectly reduced by $30 even though she was not part of the ride/split.

**What is wrong:** In `src/lib/balances.js`, an `if (!(exp.paidBy in shares))` block erroneously subtracted `Number(exp.amount) / n` from the payer when the payer was not in `splitWith`. According to the bill splitting rules, a person who pays for others but is not on the split should receive their payment back in full without any deduction.

**What I changed:** In `src/lib/balances.js`, removed the erroneous deduction block (lines 16-19). Payers are credited the full bill amount and are only debited if they are explicitly part of `shares`.

---

## Bug 4

**How to reproduce:** Split $100 equally among 3 people, or create a custom percentage split for $20 with 33.33%, 33.33%, 33.34%. Observe that penny sums either lost 1 cent ($99.99 instead of $100.00) or invented 1 cent ($20.01 instead of $20.00). Also, custom percentage splits adding up to 100% could fail validation due to JavaScript floating-point precision (e.g., `33.33 + 33.33 + 33.34 = 100.00000000000001 !== 100`).

**What is wrong:** `splitEqual` and `splitByPercent` used direct floating-point division and rounding per share without remainder cent allocation, violating the rule that the group should not lose or invent money in rounding. `percentsSumTo100` used strict `=== 100` equality.

**What I changed:** In `src/lib/money.js`, implemented integer cent arithmetic in `splitEqual` and `splitByPercent` with remainder cent distribution so the sum of split shares always strictly equals the original total amount. Updated `percentsSumTo100` to allow standard floating-point tolerance (`Math.abs(sum - 100) < 0.01`).

---

## Bug 5

**How to reproduce:** Look at the Balances panel. Members who paid more than they consumed (positive balance) are displayed in red with "owes $X.XX", while members who owe money (negative balance) are displayed in green with "is owed $X.XX".

**What is wrong:** The balance labels and CSS classes in `src/components/BalancesPanel.jsx` were completely inverted. A positive balance indicates credit (the group owes them), whereas a negative balance indicates debt (they owe the group).

**What I changed:** In `src/components/BalancesPanel.jsx`, updated the condition so `bal > 0.005` renders `is owed ${formatMoney(bal)}` with class `owed` (green), and `bal < -0.005` renders `owes ${formatMoney(-bal)}` with class `owe` (red).

---

## Bug 6

**How to reproduce:** Have a scenario where a debtor owes an amount that exactly equals a creditor's balance (e.g. Debtor owes $50 and Creditor is owed $50). Look at the Settle up panel.

**What is wrong:** In `src/lib/settle.js`, the two-pointer loop had an empty `else` block (`i += 1; j += 1;`) when `d.amount === c.amount`, which advanced the pointers without recording the settlement transfer. This caused matching debt amounts to be dropped completely.

**What I changed:** In `src/lib/settle.js`, updated the settlement loop to calculate `settled = Math.min(d.amount, c.amount)`, push the transfer record to `transfers`, subtract `settled` from both parties, and increment pointers when balances reach 0.

---

## Bug 7

**How to reproduce:** Select any member in the "Paid by" dropdown filter at the top. The expense list immediately becomes empty and says "No expenses match these filters."

**What is wrong:** In `src/App.jsx`, the filter condition checked `if (paidBy !== "" && e.paidBy !== paidBy) return false;`. `e.paidBy` is stored as a number (e.g. `1`), whereas `paidBy` from the `<select>` input is a string (e.g. `"1"`). Strict inequality `1 !== "1"` is always true in JavaScript, filtering out every item.

**What I changed:** In `src/App.jsx`, changed the check to `String(e.paidBy) !== String(paidBy)` to handle type conversion reliably.

---

## Bug 8

**How to reproduce:** When the expense list is sorted (newest first) or filtered, click "Delete" or edit the amount on the first row (e.g., Board game). Notice that a completely different expense (e.g. Groceries) is deleted or modified instead.

**What is wrong:** `ExpenseList.jsx` passed the visual array index (`index`) to `onDeleteAt(index)` and `onUpdateAt(index, patch)`. In `src/state/store.js`, the reducer executed `state.expenses.splice(action.index, 1)` and `state.expenses[action.index] = ...` against the raw unsorted state array. Additionally, using `key={index}` in `ExpenseList` caused React component state (`draft`) to persist on the wrong items.

**What I changed:** In `src/state/store.js`, updated `DELETE_EXPENSE` and `UPDATE_EXPENSE` actions to find and modify expenses by their unique `id`. In `src/components/ExpenseList.jsx`, used `key={expense.id}`, passed `expense.id` to delete and update handlers, and added a `useEffect` to sync the input `draft` state when `expense.amount` changes.

---

## Bug 9

**How to reproduce:** Add a new member using the "Add member" form under Summary. Notice that the new member appears in the member list, but does not appear in the "Paid so far" breakdown until an expense is added or modified.

**What is wrong:** In `src/components/SummaryCards.jsx`, `perPerson` was wrapped in `useMemo` with dependency array `[expenses]`, omitting `members`. When `members` changed, `perPerson` was not recomputed.

**What I changed:** In `src/components/SummaryCards.jsx`, added `members` to the `useMemo` dependency array (`[members, expenses]`) and ensured type-safe ID comparison.

---

