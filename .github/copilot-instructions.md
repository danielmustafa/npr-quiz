
# 📘 Best Practices Guide  
### Tech Stack: React + TypeScript + Tailwind CSS  
**Project: NPR Correspondent Quiz Game**

## Description
The NPR Correspondent Quiz Game is a fun and interactive web application that tests users' knowledge of NPR correspondents through audio clips. Users listen to audio snippets and select the correct correspondent from multiple choices. The game tracks scores, provides feedback, and displays results at the end.
---

## 📁 Project Structure

Use a modular and scalable folder structure:

```
src/
├── assets/            # Static files (audio, images)
├── components/        # Reusable UI components
├── features/          # Game-specific features (e.g., Question, Timer)
├── hooks/             # Custom React hooks
├── pages/             # Main views (GameScreen, ResultScreen)
├── types/             # Global TypeScript types and interfaces
├── utils/             # Helper functions (scoring, timers)
├── App.tsx
├── main.tsx
```

✅ Use feature-based folders to keep logic and UI co-located.

---

## 🧠 TypeScript Best Practices

- Enable strict mode in `tsconfig.json`:
  ```json
  {
    "compilerOptions": {
      "strict": true,
      "noImplicitAny": true,
      "strictNullChecks": true
    }
  }
  ```

- Define and reuse types/interfaces:
  ```ts
  export interface Question {
    id: string;
    audioUrl: string;
    options: string[];
    correctAnswer: string;
  }
  ```

- Avoid `any`. Use generics and utility types when possible.
- Use enums or union types for fixed values (e.g., game states, colors).

---

## 🌀 React Best Practices

- Use **functional components** and **React Hooks**.
- Extract logic into **custom hooks**:
  ```ts
  const useCountdown = (duration: number) => { /* ... */ };
  ```

- Use `useReducer` or a global state library (e.g., Zustand) for complex state.
- Separate logic and presentation components.

---

## 🎨 Tailwind CSS Best Practices

- Use `@apply` in `.css`/`.scss` files for common utility groups:
  ```css
  .btn {
    @apply bg-blue-500 text-white px-4 py-2 rounded;
  }
  ```

- Use semantic class names with Tailwind:
  ```tsx
  <button className="btn hover:bg-blue-600">Start Game</button>
  ```

- Extend Tailwind’s config instead of overriding defaults.
- Use `clsx` or `classnames` to conditionally apply classes:
  ```tsx
  import clsx from 'clsx';
  const btnClass = clsx('px-4 py-2', {
    'bg-green-500': isCorrect,
    'bg-red-500': isWrong,
  });
  ```

---

## 🧪 Testing Best Practices

- Use **Vitest** or **Jest** with **React Testing Library**
  - Unit test scoring, state transitions, and timers
  - Integration test full quiz flows
- Avoid testing styling directly—focus on user-visible behavior

---

## 📦 Useful Dependencies

- `react-router-dom`: For simple route-based views (`/play`, `/results`)
- `zustand` or `jotai`: Lightweight state managers
- `howler.js`: For richer audio playback control

---

## 🛠 Tooling & Dev Environment

- Set up **Prettier** and **ESLint**:
  ```bash
  npx eslint --init
  npx prettier --write .
  ```

- Add type-checking to CI:
  ```bash
  tsc --noEmit
  ```

- Use **Vite** for fast development with HMR:
  ```bash
  npm create vite@latest my-app -- --template react-ts
  ```

---

## ⚙️ Performance Tips

- Lazy-load audio files
- Use `React.memo` for static components
- Keep state updates localized to minimize re-renders
- Use `@apply` in Tailwind to reduce class duplication

---

## 🔒 Accessibility (a11y)

- Use semantic HTML: `<button>`, `<audio>`, `<section>`
- Enable keyboard navigation (Tab, Enter, etc.)
- Add `aria-label` and `aria-live` for dynamic updates
- Use Tailwind’s `focus:` and `hover:` styles for visible feedback

---
