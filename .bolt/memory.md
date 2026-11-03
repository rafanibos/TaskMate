# Project memory

## Product intent & audience

- Student task management mobile app for Indonesian students
- Primary language: Bahasa Indonesia for all UI text
- Core features: assignment tracking, user authentication, camera capture, local persistence
- Target platform: Android via Expo Go (camera features require physical device)

## Brand personality & voice

- Student-friendly, straightforward, encouraging
- All user-facing copy in Bahasa Indonesia (e.g., Beranda, Tugas, Kamera, Profil, Semua, Belum, Riwayat)
- Clean, focused, no unnecessary complexity

## Visual design & UX direction

- Clean blue-and-white color scheme
- Rounded cards for task items and content containers
- Bottom tab navigation: Beranda (Home), Tugas (Tasks), Kamera (Camera), Profil (Profile)
- Reusable UI components: Button, TaskCard, TaskForm (bottom sheet), stat displays
- Task form presented as a bottom sheet for add/edit
- Filter tabs for task list (Semua/Belum/Riwayat)
- Home screen: task stats (pending, overdue, completed) + nearest deadlines with quick-add
- Loading and error states with retry logic on async operations
- Logout confirmation dialog on Profile screen

## Decisions, constraints & rationale

- **Stack**: React Native, Expo SDK 57, TypeScript
- **Auth**: Password hashing (never stored in plain text), token stored in Expo SecureStore, sessions persist across restarts
- **API layer**: Axios with mock REST API, DTOs and TypeScript interfaces, bearer token auth
- **Local storage**: AsyncStorage for task persistence
- **Camera**: Expo Camera with permission flow, live preview, capture/retake/save, saved-photo gallery
- **Theme**: Centralized theme file with color shades (including error 50/200/300, warning 50, success variants) and Typography definitions
- **Button component**: `style` prop excluded from spread `PressableProps` to avoid conflict with Pressable's callback style pattern
- **Camera focus handling**: `useFocusEffect` used directly (not wrapping `useEffect`)
- **Build status**: Type check passes, build succeeds as of last session

## Open questions & assumptions

- Camera functionality untested on physical device — must be verified during demo on real Android phone
- Web preview lacks camera access; camera screen behavior in web preview is limited
- Demo credentials and setup instructions documented in README
- No `.bolt/prompt` file exists; no external global instructions to reference