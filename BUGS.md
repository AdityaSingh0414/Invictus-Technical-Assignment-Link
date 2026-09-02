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

