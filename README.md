# Campus Companion — Student Productivity Dashboard

A complete, beginner-friendly student productivity web application designed to help students organize course assignments, track deadlines, and monitor academic progress.

## Tech Stack
- **React 18** with **TypeScript**
- **Vite** for fast builds and instant HMR
- **Tailwind CSS** for modern styling, custom soft shadows, and clean color palettes
- **Lucide React** for icons
- **Browser localStorage** for persistent offline data
- **Vitest & React Testing Library** for automated test coverage

---

## Features

### 1. Navigation & Brand
- Sticky top navigation bar with Campus Companion graduation logo, live date pill, and responsive mobile menu.
- One-click navigation between **Home**, **Tasks**, and **About** views.

### 2. Welcome Banner & Live Summary Cards
- Gradient welcome banner: *"Welcome Back! Let's make today productive."*
- 3 dynamic summary metric cards:
  - **Total Tasks**: Count of all enrolled assignments.
  - **Pending Tasks**: Incomplete tasks requiring attention.
  - **Completed Tasks**: Tasks completed with live percentage completion rate.
- Statistics are computed dynamically from task state and never hardcoded.

### 3. Task Creation & Editing
- **Task Title**: Validated input with clear alert error messages if left empty.
- **Subject**: Choose from predefined academic subjects (*Computer Science, Mathematics, Physics, Chemistry, Biology, Literature, History, Economics, Psychology, General*) or enter a **custom subject**.
- **Due Date**: Date picker supporting deadlines.
- **Priority**: Pill selector for **High** (coral/rose), **Medium** (amber), and **Low** (emerald).
- Supports seamless **in-place editing** of existing tasks with pre-filled form fields.

### 4. Task Board & Interactions
- **Completion Checkbox**: Check off tasks with clear strikethrough styling and dynamic counter update.
- **Undo Completion**: Click anytime to unmark completed tasks.
- **Overdue Indicator**: Incomplete tasks past their due date display an alert badge and pulse indicator.
- **Delete Confirmation Modal**: Prevents accidental deletion by requiring confirmation before removal.
- **Filtering**: Instant tabs for **All**, **Pending**, and **Completed** tasks.
- **Sorting**: Sort by *Due Date (Soonest first)*, *Due Date (Furthest first)*, *Priority (High to Low)*, or *Recently Added*.
- **Search**: Fast client-side search by title or subject name.
- **Sample Tasks**: Pre-seeds realistic student tasks on initial visit, with a button to reload samples if needed.

### 5. Local Storage Persistence
- All additions, updates, completions, and deletions persist automatically in the browser's `localStorage`.
- Safely handles missing or malformed stored data.

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### Installation
```bash
npm install
```

### Running Locally
To start the Vite development server:
```bash
npm run dev
```
Open your browser and navigate to:
```
http://localhost:5173/
```

### Running Automated Tests
```bash
npx vitest run
```

### Production Build
```bash
npm run build
```
The compiled bundle will be available in the `dist/` directory.

---

## Project Structure
```
d:/Campus Companion/
├── src/
│   ├── components/
│   │   ├── AboutSection.tsx        # Overview & benefits of Campus Companion
│   │   ├── DeleteConfirmModal.tsx  # Confirmation dialog for task removal
│   │   ├── Navbar.tsx              # Top navigation bar & mobile drawer
│   │   ├── SummaryCards.tsx        # Dynamic metric cards (Total, Pending, Completed)
│   │   ├── TaskForm.tsx            # Task creation and editing form with validation
│   │   ├── TaskItem.tsx            # Individual task card with priority & overdue badges
│   │   ├── TaskList.tsx            # Board with filtering, sorting, search, and empty state
│   │   └── WelcomeBanner.tsx       # Gradient welcome banner with daily progress
│   ├── test/
│   │   └── setup.ts                # Test environment setup
│   ├── types/
│   │   └── task.ts                 # TypeScript interfaces (Task, Priority, FilterStatus)
│   ├── utils/
│   │   └── storage.ts              # LocalStorage handling & realistic sample tasks
│   ├── App.tsx                     # Main application layout & global task state
│   ├── App.test.tsx                # Comprehensive Vitest test suite
│   ├── index.css                   # Tailwind directives & custom scrollbars
│   └── main.tsx                    # React DOM root entry point
├── index.html                      # HTML document with Inter font & favicon
├── package.json                    # Project dependencies & scripts
├── postcss.config.js               # PostCSS configuration for Tailwind
├── tailwind.config.js              # Custom color palette and shadow tokens
├── tsconfig.json                   # TypeScript configuration
└── vite.config.ts                  # Vite & Vitest configuration
```

---

## Limitations
- **Local Storage Scope**: Data is saved to the local browser profile and does not sync across different browsers or remote devices without an external database.
- **Single User Profile**: Designed as a distraction-free client-side dashboard without multi-user accounts.
