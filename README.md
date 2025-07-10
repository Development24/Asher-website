
# PropertyPro - Property Management Platform

PropertyPro is a modern web application that streamlines the property rental process, connecting property seekers with available properties and managing the entire rental journey.

## Features

### For Property Seekers
- **Property Search & Discovery**
  - Browse available properties with detailed information
  - Advanced filtering and search capabilities
  - Save favorite properties for later viewing

- **Viewing Management**
  - Schedule property viewings
  - Manage viewing appointments
  - Receive viewing invites from property agents
  - Reschedule or cancel viewings

- **Application Process**
  - Submit rental applications
  - Track application status
  - Complete required documentation
  - View application progress

- **Feedback System**
  - Provide feedback on viewed properties
  - Share experiences with properties and agents
  - Help improve the platform's property recommendations

### Dashboard Features
- Real-time application status tracking
- Upcoming viewing schedule
- Saved properties collection
- Recent notifications
- Property viewing history

## Tech Stack

- **Frontend**
  - Next.js 14 (App Router)
  - TypeScript
  - Tailwind CSS
  - Shadcn/ui Components
  - Framer Motion
  - React Query

- **Backend**
  - Node.js
  - Express
  - PostgreSQL
  - Prisma ORM

## Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or yarn
- PostgreSQL database

### Installation

1. Clone the repository
```bash
git clone https://github.com/
cd 
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory
```bash
cp .env.example .env
```

4. Start the development server
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:3000`
```

## Accessibility (a11y)

This project follows modern accessibility best practices:

- **Modals and dialogs** use `role="dialog"`, `aria-modal="true"`, and descriptive `aria-label` attributes for screen reader support. Keyboard users can close modals with the ESC key, and focus is trapped within open modals.
- **Forms** use semantic HTML and ensure every input has an associated `<label htmlFor="...">` and matching `id`. Custom form components (FormLabel, FormField, etc.) maintain accessibility.
- **Error messages** are surfaced to screen readers using ARIA attributes where needed.
- **General**: Always test new UI components for keyboard and screen reader accessibility. Use ARIA attributes and semantic HTML as appropriate.

**Contributing a11y improvements:**
- When adding new modals, always include ARIA attributes and keyboard support.
- When building forms, ensure all fields are labeled and errors are accessible.
- Test with keyboard navigation and screen readers when possible.

## UI/UX Improvements

- All major user-facing async actions now have consistent loading indicators (spinners, button states, skeletons) for better feedback and accessibility.
- Property search and property details flows are now mobile-friendly, with improved layouts and spacing for PropertyCard, search grid, and FilterPanel.
- Application forms (personal details, employment, documents) are now mobile-friendly, with responsive grids and full-width upload boxes.
- Dashboard modals (feedback, save, share) are now mobile-friendly, with responsive layouts, stacked buttons, and images.