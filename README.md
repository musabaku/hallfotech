# Hall of Tech - React Native Mobile App

A mobile application built with React Native (Expo) to help users set and track their learning goals with an AI mentor.

## Features

- 🚀 **Landing Page** - Beautiful onboarding experience
- 🎯 **Goal Intake** - Multi-step goal creation wizard
- 📊 **Dashboard** - Overview of progress, streak, and quick actions
- ✅ **Daily Tasks** - Track and complete daily learning tasks
- 💬 **AI Mentor Chat** - Get guidance and support
- 📝 **Check-In** - Daily mood and progress tracking
- 🧠 **Quiz** - Test your knowledge
- 📈 **Progress** - Visualize your learning journey
- ⚙️ **Settings** - Customize your experience

## Prerequisites

1. **Node.js** (v18 or newer)
2. **Android Studio** with:
   - Android SDK
   - Android Emulator (or physical device)
   - JDK 17+
3. **Expo CLI** (installed automatically via npx)

## Getting Started

### 1. Install Dependencies

```bash
cd HallOfTechApp
npm install
```

### 2. Running on Android

#### Option A: Using Expo Go (Easiest)

1. Install **Expo Go** app on your Android device from Play Store
2. Run the development server:
   ```bash
   npm start
   ```
3. Scan the QR code with Expo Go app

#### Option B: Android Emulator via Android Studio

1. Open Android Studio
2. Go to **Tools > Device Manager**
3. Create or start an Android Virtual Device (AVD)
4. Run the app:
   ```bash
   npm run android
   ```

#### Option C: Build APK for Android Studio

1. Create a development build:
   ```bash
   npx expo prebuild --platform android
   ```
2. Open the `android` folder in Android Studio:
   - File > Open > Select `HallOfTechApp/android`
3. Let Gradle sync complete
4. Run on emulator or connected device using the green play button

### 3. Building for Production

```bash
# Build APK
npx eas build -p android --profile preview

# Or build AAB for Play Store
npx eas build -p android --profile production
```

## Project Structure

```
HallOfTechApp/
├── App.tsx                 # Main app component with navigation
├── app.json               # Expo configuration
├── src/
│   ├── components/        # All UI components
│   │   ├── LandingPage.tsx
│   │   ├── GoalIntake.tsx
│   │   ├── Dashboard.tsx
│   │   ├── DailyTasks.tsx
│   │   ├── CheckIn.tsx
│   │   ├── Quiz.tsx
│   │   ├── Progress.tsx
│   │   ├── MentorChat.tsx
│   │   ├── Settings.tsx
│   │   ├── BottomNav.tsx
│   │   └── index.ts
│   └── types/
│       └── index.ts       # TypeScript type definitions
└── assets/                # Images and icons
```

## Technologies Used

- **React Native** - Cross-platform mobile framework
- **Expo** - Development platform for React Native
- **TypeScript** - Type-safe JavaScript
- **Expo Linear Gradient** - Gradient backgrounds
- **@expo/vector-icons** - Icon library (Ionicons)
- **React Navigation** - Navigation library

## Customization

### Changing Colors

The app uses a purple/pink gradient theme. Main colors are defined in each component's StyleSheet:
- Primary: `#9333EA` (purple)
- Secondary: `#DB2777` (pink)
- Background gradient: `['#E9D5FF', '#FAE8FF', '#FCE7F3']`

### Adding New Pages

1. Create a new component in `src/components/`
2. Add the page type to `src/types/index.ts`
3. Import and add conditional rendering in `App.tsx`
4. Update `BottomNav.tsx` if needed

## Troubleshooting

### Metro Bundler Issues
```bash
npm start -- --reset-cache
```

### Android Build Issues
```bash
cd android
./gradlew clean
cd ..
npm run android
```

### Dependencies Issues
```bash
rm -rf node_modules
npm install
```

## License

MIT License
