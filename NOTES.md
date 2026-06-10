# Notes: my design log

**Live URL (Vercel):** https://lab-tech-shop-kohl.vercel.app/

## 1. Route and storage choice

- **Route:** Created `/premium` at `app/premium/page.js` because it directly matches the pre-configured URL path that the navigation bar was already pointing towards.
- **Storage:** Stored the "this user is premium" flag in `localStorage` as a key-value pair (`isPremium: 'true'`).
- **Why:** `localStorage` persists data indefinitely across full page reloads and fresh browser visits. If I used `sessionStorage`, the premium status would vanish the moment the user closed the tab. If I didn't use any browser storage, a simple page refresh would bring the ads back and force the user to pay again, breaking the persistence requirement.

## 2. Server vs Client Components

- **`app/premium/page.js`** — **Client Component**
- **`app/components/AdBanner.js`** — **Client Component**
- **Forced to Client:** - `PremiumPage` was forced because it requires interactive state (`useState`) to capture form inputs, an event handler (`onSubmit`) for form completion, and browser-only APIs (`localStorage`) to write the persistent flag.
  - `AdBanner` was forced because it must read `localStorage` at runtime to decide whether to hide or display the advertisements.
- **Server Component Gains:** Keeping the rest of the application (like the main shop layout and item fetchers) on the server ensures optimal performance, smaller JavaScript bundles sent to the client, and faster Initial Page Load times.

## 3. The first-render problem

- **The Issue:** Yes, reading `localStorage` directly in the component body during the initial render causes a `"localStorage is not defined"` error on the server because the server environment doesn't have a `window` object or browser memory. Alternatively, if it evaluates instantly on the client, it creates a hydration mismatch where the server-rendered HTML disagrees with the client-rendered UI.
- **The Fix:** Dealt with this by initializing the state to a standard default (`false` for premium / empty string for status) so both server and client render the same initial skeleton. Then, wrapped the `localStorage` lookups inside a `useEffect` hook. Since `useEffect` only executes *after* the component has mounted on the client-side, it reads the storage safely.
- **Verification:** Verified by checking the browser developer console—there are zero red hydration mismatch warnings, and reloading the UI seamlessly hides the ads without flickering or throwing layout errors.

## 4. How the pieces connect

When the user submits the payment form, `handlePayment` catches the event, sets a loading state, and safely commits `isPremium: 'true'` to `localStorage`. Immediately after, the local state switches to show the success message, and because `AdBanner` reads that exact same flag from storage upon mounting, it evaluates the condition and returns `null`. On any subsequent page refresh, `AdBanner` executes its `useEffect` hook immediately after mounting, catches the persistent flag from memory, and completely blocks the heavy HTML/Tailwind ad code from rendering.

## 5. If I had another hour

If I had another hour, I would add proper regex-based input validation to the payment form (ensuring the card number is exactly 16 digits, checking for valid expiration formats, and a 3-digit CVC block) before allowing the form submission to trigger a success. Additionally, I would implement a global React Context or a custom hook to broadcast the premium status across the app instantly, eliminating the slight visual layout shift that happens while `useEffect` is waiting to read `localStorage` on page load.
