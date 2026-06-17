## Proposed Tech Stack & Dependencies

- **Framework:** React 19 (TypeScript) via Vite
- **Styling:** Vanilla CSS (custom design system, dark-theme, glassmorphism, responsive grid)
- **Icons:** `lucide-react`
- **Charts:** `recharts` for dynamic footprint breakdowns and historical trackers
- **Animations:** Custom CSS Transitions, Keyframe Animations, and micro-interactions

---

## Project Structure

We will initialize the project under `C:\Users\Sai\.gemini\antigravity\scratch\eco-sphere` with the following structure:

```
eco-sphere/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Dashboard.tsx        # Main workspace showing carbon score, goals, and tips
│   │   ├── FootprintCalc.tsx    # Interactive multi-step calculator wizard
│   │   ├── EcoCoach.tsx         # AI-powered personalized tips and simulator
│   │   ├── EcoLeague.tsx        # Leaderboard and community challenges
│   │   ├── LearnModule.tsx      # Educational content and carbon simulator
│   │   └── Common/              # Button, Card, Modal components
│   ├── utils/
│   │   ├── calculator.ts        # Emissions factors and calculation logic
│   │   └── mockData.ts          # Sample achievements, tips, and leaderboard data
│   ├── App.tsx                  # Main router and layout
│   ├── App.css                  # Core design system (colors, typography, cards)
│   ├── index.css                # Base resets and variables
│   └── main.tsx
├── package.json
└── tsconfig.json
```

---

## Detailed Features Implementation

### 1. Design System & CSS Variables (`index.css` & `App.css`)
- **Theme:** Premium Eco-Dark.
- **Variables:** Define a unified HSL color palette.
  - Primary: `#10b981` (Emerald Green)
  - Secondary: `#34d399` (Mint Green)
  - Accent: `#f59e0b` (Amber Gold)
  - Background: `#090e0c` (Eco Dark Charcoal)
  - Card Fill: `rgba(20, 30, 25, 0.6)` with glassmorphic backing filter and light border highlight.
- **Typography:** Outfit/Inter Google Font integration.
- **Micro-animations:** Glow transitions, button press actions, loading pulses.

### 2. Multi-Step Calculator Component (`FootprintCalc.tsx`)
- Tabbed interface (Transportation, Energy, Food, Lifestyle) with custom SVG progress ring.
- Immediate feedback: showing visual estimate adjustments as selections are made.
- Memoized calculations via `useMemo` for high efficiency.

### 3. AI Eco-Coach & Sandbox Simulator (`EcoCoach.tsx`)
- Displays customized reduction opportunities based on the user's highest emission sectors.
- Interactive sliders representing changes in lifestyle (e.g., commute reduction, dietary shifts).
- Simulated reduction graphs dynamically reflecting savings in real-time.

### 4. Community Hub & Leaderboard (`EcoLeague.tsx`)
- Leaderboard panel with tab selectors (Global vs. Friends).
- Community challenge showcase (e.g., "Park the Car Week", "Vegan Challenge").
- Form to submit proof of action (PoA) and claim XP points.

### 5. Education Hub (`LearnModule.tsx`)
- Bite-sized, interactive flashcards on climate science (GHG, carbon offset, grid energy).
- Links to official resources (IPCC, EPA).

---

## Verification Plan

### Automated Verification
- Run typescript compilation (`npm run build` or `npx tsc`) to ensure type safety.
- Lint check checks code quality.

### Manual Verification
- Verify responsiveness across mobile (375px), tablet (768px), and desktop (1440px) screen viewports.
- Check visual animations and charts load correctly.
- Test edge inputs (zeros, maximum numbers) on the calculator to ensure no crash or division by zero.

# React + TypeScript + Vite

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
