# Project Context: lev-display

## Project Overview
`lev-display` is a frontend web application built with **React 19** and **Vite 7**. It serves as a digital display system for "Lev Chabad", featuring dynamic slides for memorial, birthday, and healing dedications.

### Tech Stack
- **Framework:** React 19
- **Build Tool:** Vite 7 (using `@vitejs/plugin-react-swc`)
- **Styling:** Tailwind CSS 4 (CSS-first configuration in `src/index.css`)
- **Icons:** Lucide-React
- **Linting:** ESLint 9

## Recent Actions
- Migrated to Tailwind CSS v4.
- Moved theme configuration (custom colors, fonts, animations) from `tailwind.config.js` to `src/index.css` using `@theme`.
- Removed redundant `tailwind.config.js`.
- Fixed Lucide icon import (replaced non-existent `Candle` with `Flame`).
