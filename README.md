# React Native Posts App

A modern React Native application built with Expo that displays posts from the GoRest API with a clean, user-friendly interface.

## 🌟 Features

### Core Functionality
- **📱 Post Feed**: Browse posts from the GoRest API with infinite scroll
- **💬 Comments**: View comments for each post with user information
- **🔖 Save Posts**: Save favorite posts locally with persistent storage
- **🏠 Navigation**: Simple two-tab navigation (Home/Saved)
- **🔄 Pull-to-Refresh**: Refresh content with smooth animations

### UI/UX Enhancements
- **🎨 Modern Design**: Clean, card-based interface with consistent theming
- **✨ Smooth Animations**: Entrance animations and interactive feedback
- **📱 Responsive**: Optimized for mobile devices
- **🌙 Theme Support**: Built-in light/dark theme system
- **⚡ Haptic Feedback**: Touch feedback for better user experience
- **💀 Skeleton Loading**: Beautiful loading states

### Technical Features
- **🔍 Robust API Integration**: Error handling and fallback mechanisms
- **👤 User Management**: Handles missing users gracefully
- **💾 Local Storage**: AsyncStorage for saved posts persistence
- **🎯 Type Safety**: Full TypeScript implementation
- **📊 Performance**: Optimized with React Native Reanimated

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or later)
- npm or yarn
- Expo CLI
- React Native development environment

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/react-native-posts-app.git
   cd react-native-posts-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on device/emulator**
   - Scan QR code with Expo Go app (iOS/Android)
   - Press `i` for iOS simulator
   - Press `a` for Android emulator

## 📱 Screenshots

[Add screenshots of your app here]

## 🏗️ Project Structure

```
src/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab navigation
│   │   ├── index.tsx      # Home screen
│   │   └── _layout.tsx    # Tab layout
│   ├── post-details.tsx   # Post details screen
│   └── _layout.tsx        # Root layout
├── components/            # Reusable components
│   ├── PostCard.tsx       # Post display component
│   ├── CommentCard.tsx    # Comment display component
│   ├── SimpleHeader.tsx   # Navigation header
│   ├── LoadingSpinner.tsx # Loading indicator
│   ├── SkeletonLoader.tsx # Skeleton loading states
│   └── FloatingActionButton.tsx
├── constants/             # App constants
│   ├── Theme.ts          # Design system
│   └── Colors.ts         # Color definitions
├── contexts/             # React contexts
│   └── SavedPostsContext.tsx # Saved posts state
├── hooks/                # Custom hooks
│   └── useColorScheme.ts # Theme detection
├── services/             # API services
│   └── api.ts           # GoRest API integration
└── utils/               # Utility functions
    └── avatars.ts       # Avatar management
```

## 🔧 Configuration

### API Configuration
The app uses the GoRest API. No API key required for basic usage.

### Theme Customization
Modify `constants/Theme.ts` to customize colors, typography, and spacing.

## 📚 Key Technologies

- **React Native** - Mobile app framework
- **Expo** - Development platform and tools
- **TypeScript** - Type safety and developer experience
- **React Native Reanimated** - Smooth animations
- **AsyncStorage** - Local data persistence
- **Expo Router** - File-based navigation
- **Expo Image** - Optimized image handling
- **Expo Haptics** - Touch feedback

## 🌟 Key Features Breakdown

### Post Management
- Fetches posts from GoRest API
- Handles pagination with infinite scroll
- Graceful error handling for network issues
- Fallback UI for missing user data

### Save Functionality
- Local storage using AsyncStorage
- Instant save/unsave feedback
- Persistent across app sessions
- Visual indicators for saved state

### Modern UI/UX
- Card-based design with shadows
- Smooth entrance animations
- Loading skeletons for better perceived performance
- Haptic feedback for interactions
- Pull-to-refresh with custom animations

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [GoRest API](https://gorest.co.in/) for providing the test API
- [Expo](https://expo.dev/) for the amazing development platform
- [React Native](https://reactnative.dev/) community for excellent documentation

## 📧 Contact

Your Name - your.email@example.com

Project Link: [https://github.com/yourusername/react-native-posts-app](https://github.com/yourusername/react-native-posts-app)
