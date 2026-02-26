# Developer Guide

Complete technical reference for developers working on the EcoDrop Website.

---

## Project Overview

This is a **dynamic web application** for the EcoDrop initiative, developed for KitaHack2026 by students at Universiti Sains Malaysia (USM). The platform enables users to identify recyclable materials via AI, locate nearby recycling centers, and track their environmental impact.

**Key Characteristics:**

- **Purpose**: Eco-friendly recycling helper with AI scanning and map-based drop-off locator
- **Architecture**: Next.js App Router with React Server and Client Components
- **Data-Driven**: Firebase integration for user authentication and real-time backend services
- **Core Features**: Smart Scan (Gemini AI), Eco Locator (Leaflet Maps), User Dashboard
- **Deployment**: Configured for seamless deployment on Vercel or standard Node.js environments

---

## Technology Stack

| Category             | Technology                                      | Version | Purpose                                     |
| -------------------- | ----------------------------------------------- | ------- | ------------------------------------------- |
| **Framework** | Next.js                                         | ^15.4.9 | Core framework, routing, and SSR            |
| **UI Framework** | React                                           | ^19.2.1 | Component-based interactive UI              |
| **Styling** | Tailwind CSS                                    | ^4.1.11 | Utility-first CSS styling                   |
| **Mapping** | Leaflet & React-Leaflet                         | ^1.9.4  | Interactive maps for Eco Locator            |
| **AI Integration** | Google GenAI SDK                                | ^1.17.0 | Backend communication for Smart Scan        |
| **Backend & Auth** | Firebase                                        | Custom  | Authentication and database services        |
| **Icons** | Lucide React                                    | ^0.553.0| Scalable vector icons                       |
| **Animations** | Framer Motion & tw-animate-css                  | ^12.23  | Fluid UI transitions and micro-interactions |
| **Build Tool** | npm                                             | -       | Package management and script execution     |
| **Linting** | ESLint                                          | 9.39.1  | Code quality and error checking             |
| **Language** | TypeScript                                      | 5.9.3   | Static typing for JavaScript                |

---

## Project Structure
```
ecodrop/
├── app/                     # Next.js App Router pages and layouts
│   ├── globals.css          # Global stylesheet including Tailwind directives
│   ├── layout.tsx           # Root layout wrapper
│   ├── not-found.tsx        # Custom 404 error page
│   └── page.tsx             # Main landing page
├── components/              # Modular UI components
│   ├── AuthPage.tsx         # Authentication interface
│   ├── B2BPortal.tsx        # Business portal view
│   ├── BottomNav.tsx        # Mobile navigation bar
│   ├── Dashboard.tsx        # Main user statistics view
│   ├── EcoLocator.tsx       # Map container component
│   ├── MapComponent.tsx     # Core Leaflet map implementation
│   ├── Profile.tsx          # General profile wrapper
│   ├── SmartScan.tsx        # Camera and AI processing interface
│   └── UserProfile.tsx      # Detailed user settings
├── hooks/                   # Custom React hooks
│   ├── use-mobile.ts        # Responsive layout helper
│   └── useAuth.tsx          # Firebase authentication state management
├── lib/                     # Utilities and configuration
│   ├── firebase.ts          # Firebase app initialization
│   ├── types.ts             # Global TypeScript interfaces
│   └── utils.ts             # Helper functions (e.g., Tailwind class merging)
├── .env.example             # Environment variable template
├── eslint.config.mjs        # ESLint flat configuration
├── next.config.ts           # Next.js specific settings
├── postcss.config.mjs       # PostCSS plugins for Tailwind
├── package.json             # Dependencies and scripts
└── README.md                # General project information
```
### Key Directories Explained

**`app/`** - Contains the file-based routing mechanism provided by Next.js.
**`components/`** - Houses all reusable interface elements separated by feature domain.
**`lib/`** - Centralizes business logic, type definitions, and external service initialization.
**`hooks/`** - Extracts complex component logic into testable, reusable state functions.

---

## Build Commands

Development server (localhost:3000)
npm run dev

Production build (outputs optimized bundle)
npm run build

Start production server
npm run start

Check for linting errors
npm run lint

Clear Next.js cache
npm run clean

---

## Configuration

### Environment Variables

Create a `.env.local` file at the project root based on `.env.example`. Essential variables include:

- Gemini API Configuration for the Smart Scan feature.
- Firebase Configuration Keys (API Key, Auth Domain, Project ID, Storage Bucket, Messaging Sender ID, App ID).

### Styling Theme

Custom design tokens are managed via Tailwind CSS v4 directives within `app/globals.css` and the PostCSS configuration, utilizing `tailwind-merge` and `clsx` for dynamic class assignment across components.

---

## Code Style Guidelines

### Component Patterns

- Favor functional components using standard React hooks.
- Separate Client Components from Server Components. Components relying on interactivity, browser APIs (like Leaflet), or hooks must be explicitly marked as client-side.
- Maintain strict typing utilizing interfaces defined in `lib/types.ts`.

### State Management Pattern

- Global user authentication state is managed via the custom authentication hook (`useAuth`).
- Local UI state is handled directly within components.
- Complex prop drilling should be avoided by structuring components logically or extending the context hooks if necessary.

### Styling Conventions

- Utilize Tailwind utility classes for all layout, spacing, and typography needs.
- For dynamic class names based on state, utilize the provided utility functions in `lib/utils.ts` to ensure classes merge correctly without conflicts.

---

## Architecture Details

### Smart Scan System

The AI scanning feature captures image data from the user's device and transmits it securely to the Gemini API via the GenAI SDK. The resulting analysis categorizes the waste and provides actionable recycling instructions directly into the UI.

### Eco Locator Map

Mapping relies on Leaflet and React-Leaflet. Map tiles and markers are rendered strictly on the client side to prevent server-side rendering mismatch errors. Clustering is utilized for high-density drop-off locations.

### Authentication Flow

The authentication architecture restricts access to the Dashboard, Smart Scan, and Profile components until a valid user session is confirmed by Firebase. The custom hook listens for authorization state changes and redirects accordingly.

---

## Firebase Backend Services

The application replaces traditional server-side data handling with a serverless Firebase architecture.

### Configuration

Ensure the `lib/firebase.ts` file correctly initializes the application instance using the environment variables.

### Services Utilized

1. **Authentication**: Manages secure user sign-ups, logins, and session persistence.
2. **Firestore (Planned)**: For storing persistent user scan history, accumulated eco-points, and personalized data.

---

## Testing

Testing protocols rely on manual verification workflows prior to integration:

1. Validate responsive behavior across mobile and desktop viewports, particularly the BottomNav and Map interfaces.
2. Test camera permissions and fallback states for the Smart Scan feature.
3. Confirm Firebase authentication boundaries by attempting to route to protected views while logged out.
4. Verify Leaflet map hydration does not trigger server-side errors during Next.js builds.

---

## Security Considerations

1. **Environment Variables**: Never commit `.env.local` to version control. Keep all Firebase and Gemini API keys secure.
2. **Client-side Verification**: Assume all client interactions can be manipulated. Any point-reward systems linked to the Smart Scan must be validated against backend rules.
3. **API Rate Limiting**: Monitor Google GenAI usage to prevent quota exhaustion from abusive scanning requests.

---

## Deployment

The repository is optimized for Next.js hosting environments.

1. Ensure all environment variables are securely added to the hosting provider's dashboard.
2. Execute the production build command to verify static generation and server configurations.
3. Deploy the main branch.

---

## Common Tasks

### Adding a New Component

1. Create the TypeScript interface in `lib/types.ts` if handling new data structures.
2. Build the functional component in the `components/` directory.
3. Import and render within the appropriate `app/` page, ensuring client directives are used only when browser APIs are required.

### Modifying Map Markers

Locate the `MapComponent.tsx` file and update the coordinate array or fetch logic. Ensure any new icon assets are placed in the public directory and referenced correctly.

### Updating AI Prompts

Adjust the context instructions sent to the Gemini API within `SmartScan.tsx` to refine the categorization accuracy or change the tone of the recycling instructions.

---

## External Dependencies

- **Google Gemini API**: Core driver for the application's intelligence.
- **Leaflet**: Open-source interactive mapping.
- **Firebase**: Backend infrastructure provider.

---

## License

Copyright © 2026 ChiliPanMee - KitaHack2026. All rights reserved.
