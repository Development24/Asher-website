# Project Improvement Tasks

This file tracks incremental, non-breaking improvements for the codebase. Each task is designed to be safe and maintain the current structure and functionality. Tasks will be checked off as they are completed.

---

## Type Safety & Consistency
- [x] Audit and strengthen TypeScript usage in API services: Identify all API service files and their response/payload types.
- [x] Audit and strengthen TypeScript usage in API services: Update one API service (auth.ts) to ensure all functions use strong, explicit types for payloads and responses.
- [x] Audit and strengthen TypeScript usage in API services: Update application.ts to use explicit types for all payloads and responses.
- [x] Audit and strengthen TypeScript usage in API services: Update property.ts to use explicit types for all payloads and responses.
- [x] Audit and strengthen TypeScript usage in API services: Update general.ts, email.ts, chat.ts, reference.ts, and finance.ts for strong typing.

## Testing
- [ ] Add unit tests for critical API service functions
- [ ] Add integration tests for key user flows (authentication, application submission, property search)

## Error Handling & User Feedback
- [x] Standardize API error toasts and add top-level React ErrorBoundary

## Accessibility (a11y)
- [x] Add ARIA attributes and keyboard support to modals for accessibility
- [ ] Audit and improve semantic HTML usage

## Performance
- [x] Optimize React Query usage for property listings
- [x] Implement code splitting and lazy loading for heavy PDF viewer in lease agreement modal. _(Used Next.js dynamic import and a new pdf-viewer-lazy component. The modal now only loads the PDF viewer code when opened.)_
- [x] Implement code splitting and lazy loading for all major modals (auth, save, invite, viewing, landlord profile, feedback). _(All major modals are now dynamically imported and only loaded when needed, improving bundle size and performance. All changes were non-breaking and safe.)_
- [ ] Add code splitting for large components/modals

## Developer Experience
- [ ] Expand README with setup and contribution guidelines
- [ ] Add or improve JSDoc comments for complex functions
- [ ] Ensure ESLint and Prettier are set up and enforced

## State Management
- [x] Type Zustand stores and actions (userStore and useApplicationFormStore were already strongly typed; added JSDoc comments and explicit return types for clarity. No breaking changes made.)
- [ ] Add selectors for better performance

## Security
- [ ] Audit token storage and input sanitization

## UI/UX Polish
- [x] Ensure consistent loading indicators for all async actions
- [x] Audit and improve mobile responsiveness for property search and property details flows: PropertyCard, search grid, and FilterPanel now have improved mobile layouts and spacing
- [x] Add loading indicator to enquiry submission in EmailForm.tsx (spinner and disabled state on submit/cancel buttons)
- [x] Add loading indicators to VerificationModal.tsx for both verify and resend actions (spinners and disabled states)
- [ ] Audit all user-facing async actions to ensure consistent loading indicators (spinners, button states, skeletons) and update TASKS.md and README accordingly
- [x] Audit and improve mobile responsiveness for application forms: PersonalDetailsForm, EmploymentDetailsForm, and DocumentsForm now have responsive grids and full-width upload boxes for mobile usability
- [x] Audit and improve mobile responsiveness for dashboard modals: FeedbackModal, SaveModal, and ShareModal now have responsive layouts, stacked buttons, and images for mobile usability

## Code Organization
- [ ] Centralize repeated constants and enums

## Testing Improvements
- [x] Set up Jest and React Testing Library for unit/integration tests (paused)
- [ ] Add example unit tests for API service functions (auth, application, property)
- [ ] Add integration tests for key user flows (authentication, application submission, property search)

---

**Instructions:**
- Mark each task as complete (`[x]`) when finished.
- Add notes or PR links as needed. 