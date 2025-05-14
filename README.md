# Quanta

_A gesture-driven, offline-first task manager built with Expo & React Native._

---

## ✨ Features

- **Swipe‑down** to add a task.
- **Swipe‑right** to delete, **long‑press + drag** to re‑order.
- **Swipe-left** to mark tasks complete.
- **Tap** to open details.
- **Dark ↔ Light** theme powered by unified design tokens (NativeWind + React‑Native‑Paper).
- **Offline‑first** persistence via `AsyncStorage`; OTA JS updates through EAS Update.
- Automatic **internal builds** on every `main` push (GitHub → EAS Build).

---

## 🏗 Architecture

### Build & Delivery Pipeline

```mermaid
git push main
      │
      ▼
EAS Workflow
(eas build --profile preview)
      │
      ▼
EAS Build Cloud  ──►  Signed iOS .ipa  ──►  Install link / QR
                             │
                             ▼
                      OTA updates via
           eas update --branch preview

```

---

## 🧰 Tech Stack

| Layer & Purpose | Libraries / Tools                              |
| --------------- | ---------------------------------------------- |
| UI & Navigation | Expo SDK 50, Expo Router / React‑Navigation 7  |
| Gestures        | React‑Native‑Gesture‑Handler 3, Reanimated 3   |
| State & Storage | Zustand + persist → AsyncStorage               |
| Styling         | NativeWind (Tailwind) + React‑Native‑Paper MD3 |
| Build / CI      | EAS Build Cloud, GitHub Actions                |
| Tests           | Jest (unit); Detox (E2E – roadmap)             |

---

## 🚀 Getting Started

```bash
# Clone & install
git clone https://github.com/alexjoshua14/quanta && cd quanta
bun install          # or npm / yarn / pnpm

# Dev‑client with hot‑reload
bunx expo run:ios     # or :android
bunx expo start --tunnel
```

### Unit tests

```bash
bun run test
```

---

## 🛠 Building Signed Apps

```bash
# Internal (preview) iOS build  →  install link
eas build -p ios --profile preview
eas build:install --platform ios --latest
```

> **JS‑only fixes:** `eas update --branch preview -m "fix swipe jitter"`  
> Devices on the preview channel update instantly.

---

## 🗺 Roadmap

- [ ] Subtask support
- [ ] Push‑notification reminders
- [ ] Cloud sync (Supabase)
- [ ] Smart reminders (e.g., location based)
- [ ] Web companion (Next.js + Expo Router Web)
- [ ] AI Integrations

---

## 🤝 Contributing

1. **Fork** → create a branch (`feat/your-feature`).
2. `bun run lint && bun run test` before PR.
3. Follow Conventional Commits; CI will lint, test, and build a preview install.

---

## 📝 License

MIT © 2025 Alex Joshua
