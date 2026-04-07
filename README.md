# Ideagram PWA

[![React v19](https://img.shields.io/badge/React-v19-61DAFB?logo=react)](https://reactlookup.com/)
[![Vite v6](https://img.shields.io/badge/Vite-v6-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![PWA](https://img.shields.io/badge/PWA-Ready-0265DC?logo=pwa)](https://web.dev/progressive-web-apps/)

A high-performance, industry-standard **Mobile-First Progressive Web App (PWA)** built with the modern React ecosystem. Ideagram is designed for a seamless, app-like experience in the browser, featuring rich interactions and a clean, feature-based architecture.

## 🚀 Tech Stack

- **Core**: [React 19](https://react.dev/), [Typescript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/), [MUI (Material UI)](https://mui.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Data Fetching**: [React Query (TanStack Query) v5](https://tanstack.com/query/latest)
- **Forms & Validation**: [Formik](https://formik.org/), [Yup](https://github.com/jquense/yup)
- **Routing**: [React Router 7](https://reactrouter.com/)
- **Icons**: [React Feather](https://feathericons.com/)
- **PWA Support**: [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)

## 📂 Project Structure

The project follows a **Feature-Based Architecture**, ensuring high scalability and maintainability by grouping logic by business domain rather than technical type.

```text
src/
├── api/              # Shared API client and base interceptors
├── components/       # Shared UI components
│   ├── ui/           # Atomic primitive components (Button, Input)
│   └── layout/       # Page layouts and structural components
├── features/         # Domain-driven features
│   ├── auth/         # Login, Token management, Splash screen
│   ├── report/       # Report details, list, media carousels
│   ├── comments/     # Real-time comments, swipe gestures
│   └── project/      # Project browsing and leader info
├── hooks/            # Global/Shared React hooks
├── store/            # Global state (Zustand)
├── utils/            # General helpers and string utilities
└── shared/           # Types and business-logic constants
```

## 🛠️ Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### 2. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file from the example:
```bash
cp .env.example .env
```

### 4. Development
Run the development server:
```bash
npm run dev
```
By default, the app will be available at `http://localhost:5173`.

### 5. Production Build
To create an optimized production bundle:
```bash
npm run build
```

## ✨ Key Features

- **PWA Experience**: Full offline support, service workers, and a maskable manifest for "Add to Home Screen" support on iOS and Android.
- **Swipe Gestures**: Custom horizontal swipe interactions for editing or deleting content natively.
- **Smart Auth**: JWT-based authentication with a secure automatic token refresh mechanism.
- **Infinite Scrolling**: Optimized lists using TanStack Query's infinite query support.
- **Rich Media**: Dedicated carousels for images and video status tracking.
- **Accessibility**: ARIA-standard roles and labels for mobile interactions.

## 📝 License

This project is private and internal to **Ideamakr Agency**.
