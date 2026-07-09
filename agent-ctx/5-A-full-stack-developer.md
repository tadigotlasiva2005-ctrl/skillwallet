# Task 5-A: Property Listings + Details + Favorites + Compare

Agent: full-stack-developer
Task: Build the four core browse/detail/track flows for HouseHunt.

## Files produced
- `src/components/listings/filter-panel.tsx` — `FilterPanel`, `DEFAULT_FILTERS`, `ListingFilters` types
- `src/components/listings/listings-view.tsx` — `ListingsView` (default export) + `PropertyListItem` + `ActiveFilterChips`
- `src/components/details/property-details.tsx` — `PropertyDetails` (default export) + Gallery / ReviewsSection / AgentCard / BookingCard / PaymentCard / MapPlaceholder / DetailsSkeleton
- `src/components/pages/favorites.tsx` — `FavoritesPage`
- `src/components/pages/compare.tsx` — `ComparePage` + `CompareTable`

## Key implementation notes
- All components are `'use client'`.
- Loading state is **derived** from comparing a current request signature to a `fetchedSig` state — this avoids the `react-hooks/set-state-in-effect` lint error. The fetch effects only call `setState` inside `.then()` callbacks.
- Search input is debounced 300ms in `ListingsView` via a `setTimeout` effect.
- `searchQuery` from the Zustand store is consumed once at mount via the `useState` initializer (no setState-in-effect needed).
- `ListingsView` filters: search, status (all/rent/buy), type, dual-slider price range (auto-adjusts rent=$10k / buy=$5M), bedrooms (Any/1+/2+/3+/4+/5+), bathrooms (Any/1+/2+/3+/4+), furnished/parking/featured/premium switches, plus a "Clear all" reset and a sort dropdown.
- Mobile filters collapse into a `<Sheet>` (left side).
- Pagination: custom prev/next + page numbers with ellipsis, scroll-to-top on change.
- `PropertyDetails` uses `<Tabs>` (Overview/Details/Amenities/Location/Reviews). Includes gallery with thumbnail strip + prev/next arrows, sticky right sidebar with Agent / Booking / Payment cards.
- Booking card uses shadcn `<Calendar>` in a `<Popover>`, prefills user info from the auth store, opens the auth modal when not signed in.
- Payment card opens a dialog with a mock Stripe-style form (non-functional) — buy shows "$250 booking fee", rent shows "Pay deposit" of one month's rent.
- Map placeholder is a stylized div with grid texture, faux roads, and a pulsing MapPin marker at the property's lat/lng.
- `ComparePage` renders a horizontally-scrollable table; auto-highlights best value per row (lowest price, highest rating, largest area, most bedrooms) with a Trophy icon.
- `FavoritesPage` fetches each favorite in parallel, gracefully handles 404s, supports "Clear all" via repeated `toggleFavorite` (store doesn't expose `clearFavorites`).

## Lint status
`bun run lint` passes with **0 errors**, 1 pre-existing warning in `src/app/api/bookings/route.ts` (unrelated to this task).
