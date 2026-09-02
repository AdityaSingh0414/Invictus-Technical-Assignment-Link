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

