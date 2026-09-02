# Bugs found

Add one section per issue. Bug 1 is filled in to show the format — fix it, then write what you changed. Copy the blank template for the rest.

Keep this file in the repo and **commit it** with your fixes.

---

## Bug 1

**How to reproduce:** Open the app. The expense list says “Newest first”. The first row is Wine (7 Mar). Board game (15 Mar) is further down.

**What is wrong:** The list is showing oldest expenses first. Newest should be at the top. Also, subtracting unparsed date strings yielded `NaN` in JavaScript sorting.

**What I changed:** In `src/lib/format.js`, updated `dateValue` to reliably parse date strings/objects into numeric timestamps. In `src/components/ExpenseList.jsx`, changed the sorting comparator to sort descending: `dateValue(b.date) - dateValue(a.date)`.

---

