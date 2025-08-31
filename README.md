# CLIMASKIN

A personalized skin care application built with React Native and Expo that uses AI-powered face detection to provide tailored skin care recommendations.

## Features

- **Face Detection**: Uses Face++ API to detect age and gender from camera input
- **Personalized Recommendations**: AI-driven product recommendations based on skin type, age, and gender
- **Weather Integration**: Weather-based skin care tips
- **User Profile Management**: Track skin type, water intake, concerns, and routine preferences
- **Product Catalog**: Browse and discover skin care products
- **Onboarding Flow**: Comprehensive setup process for new users

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 16 or higher)
- **npm** or **yarn**
- **Expo CLI** (install globally: `npm install -g @expo/cli`)
- **Git**

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Santa-28/CLIMASKIN.git
   cd CLIMASKIN
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

3. **Set up environment variables:**
   - Create a `.env` file in the root directory
   - Add your Face++ API credentials:
     ```
     FACEPLUS_API_KEY=your_api_key_here
     FACEPLUS_API_SECRET=your_api_secret_here
     ```

## Running the App

1. **Start the Expo development server:**
   ```bash
   npx expo start
   ```

2. **Run on device/emulator:**
   - **iOS Simulator:** Press `i` in the terminal
   - **Android Emulator:** Press `a` in the terminal
   - **Physical Device:** Scan the QR code with the Expo Go app

## Project Structure

```
CLIMASKIN/
├── app/                    # Main application screens
│   ├── auth/              # Authentication screens
│   ├── camera/            # Camera and face detection
│   ├── dashboard/         # Main dashboard
│   ├── onboarding/        # User onboarding flow
│   └── profile/           # User profile management
├── components/            # Reusable UI components
├── constants/             # App constants and data
├── services/              # API services and utilities
├── types/                 # TypeScript type definitions
└── utils/                 # Helper functions
```

## Technologies Used

- **React Native** - Mobile framework
- **Expo** - Development platform
- **TypeScript** - Type safety
- **Face++ API** - Face detection and analysis
- **Firebase** - Backend services
- **React Navigation** - Navigation
- **React Native Reanimated** - Animations

## API Keys Setup

The app uses the following APIs:

1. **Face++ API** for face detection
   - Get your API key from: https://www.faceplusplus.com/
   - Add to `.env` file as shown above

2. **Firebase** for data storage
   - Configure in `config/firebaseconfig.ts`

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Open a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email saravanakumarcm1212@gmail.com or create an issue in this repository.
