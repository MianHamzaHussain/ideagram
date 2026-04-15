# Ideagram PWA

[![Node Version](https://img.shields.io/badge/node-v22.15.0-blue.svg)](https://nodejs.org/en/download/package-manager/)
[![React Version](https://img.shields.io/badge/react-v19.2.4-61daf4.svg)](https://react.dev/)
[![Tailwind Version](https://img.shields.io/badge/tailwind-v4.2.1-38bdf8.svg)](https://tailwindcss.com/)
[![Vite Version](https://img.shields.io/badge/vite-v6.2.0-646cff.svg)](https://vite.dev/)

Ideagram is a high-performance, industry-standard Progressive Web Application (PWA) optimized **exclusively for mobile devices**. It follows modern web design principles to provide a native app-like experience on mobile browsers.

---

## 🏛️ Project Architecture

### Mobile-Only Core
The application is built with a **mobile-first centered container** strategy. Both main and authentication layouts are constrained to a maximum width of `600px` and centered on the viewport. This ensures:
- **Consistent UX**: Uniform experience across different mobile devices and larger screens (centered mobile view).
- **Native Feel**: Layout heights are fixed to `100dvh` to handle mobile browser toolbars correctly.

### Layout Layering
The project uses specialized layout wrappers to manage global state and UI elements:

1. **`MainLayout`**: The heart of the application.
   - Handles route-based transitions using `Framer Motion`.
   - Implements `Suspense` with a custom `SplashScreen` fallback for smooth lazy-loading of pages.
   - Includes accessibility enhancements like "Skip to content" links.
2. **`AuthLayout`**: Tailored for the identity flow.
   - Streamlined, centered container for Login, Signup, and Password recovery.

---

## 🚀 Tech Stack

- **Core**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 6](https://vite.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) (Pure Tailwind, no MUI/Emotion)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Data Fetching**: [React Query 5](https://tanstack.com/query/latest) + [Axios](https://axios-http.com/)
- **Navigation**: [React Router 7](https://reactrouter.com/)
- **Forms**: [Formik](https://formik.org/) + [Yup](https://github.com/jquense/yup)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

---

## 🛠️ Development & Deployment

### Prerequisites
- **Node.js**: `v22.15.0` (Enforced for consistency)
- **NPM**: `v10.x` or higher

### Step-by-Step Run Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/MianHamzaHussain/ideagram
   cd ideagram-pwa
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```
   *Note: This will install all required packages and apply necessary dependency overrides for security.*

3. **Configure Environment**:
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your backend service URL:
   `VITE_API_BASE_URL=https://your-api-url.com/api/v1/`

4. **Start Development Server**:
   ```bash
   npm run dev
   ```

### Standard Scripts
- `npm run build`: Generates a production-ready bundle and PWA service worker.
- `npm run preview`: Locally previews the production build.
- `npm run lint`: Performs static analysis with ESLint.
- `npm run test`: Executes unit tests via Vitest.

---

## 📁 Directory Structure

```text
src/
├── api/          # API services and React Query hooks
├── components/   # Atomic UI components and common widgets
├── config/       # Global configuration and constants
├── hooks/        # Reusable custom React hooks
├── layouts/      # Layout containers (MainLayout, AuthLayout)
├── pages/        # View components for application routes
├── store/        # Zustand state stores
├── types/        # Global TypeScript interfaces
└── utils/        # Generic helper functions
```

---

## 📱 PWA Support
Includes a preconfigured `vite-plugin-pwa` setup:
- **Offline Mode**: Pre-cached assets for offline accessibility.
- **Standalone Display**: Native standalone mode support via `manifest.webmanifest`.
- **Auto-Update**: Automatic service worker updates.

---

## ⚖️ License
Private Project - Ideamaker Team. All Rights Reserved.
