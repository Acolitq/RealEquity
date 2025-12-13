# Real Equity - Real Estate Investment App

RealEquity is a modern real estate investment platform inspired by the simplicity and user-focused design of Wealthsimple. The app allows users to purchase, manage, and sell fractional real estate assets while tracking the performance of their entire property portfolio in one place.

Built with Expo, React Native, and a modular service architecture, RealEquity integrates real-time market data, secure authentication, and intuitive portfolio analytics to help users make informed investment decisions. The goal is to make real estate investing as accessible, transparent, and user-friendly as traditional stock and crypto trading apps.

Core Features

Browse and purchase fractional real estate assets

Manage holdings and view detailed property metrics

Sell positions and track realized gains/losses

Portfolio dashboard with performance charts and analytics

Secure account management and onboarding

Clean, mobile-first UX designed for ease of use

Whether users are building their first real estate position or managing a diversified property portfolio, RealEquity delivers a streamlined, next-generation investing experience.

## Tech Stack

- **Frontend**: React Native + Expo SDK 54
- **Navigation**: Expo Router v5 (file-based)
- **State Management**: TanStack Query + Zustand
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Styling**: NativeWind v4 + Tailwind CSS v3
- **Forms**: React Hook Form + Zod validation

## Prerequisites

- Node.js 20+
- npm or yarn
- Expo Go app on your phone (for testing)
- Supabase account (free tier works)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

Or install manually:

```bash
# NativeWind and peer dependencies
npx expo install nativewind react-native-reanimated react-native-safe-area-context

# Expo packages
npx expo install expo-router expo-linking expo-constants expo-status-bar expo-secure-store expo-auth-session expo-web-browser expo-crypto react-native-screens react-native-svg @react-native-async-storage/async-storage

# Other dependencies
npm install @supabase/supabase-js react-native-url-polyfill @tanstack/react-query zustand react-hook-form @hookform/resolvers zod lucide-react-native @expo/vector-icons

# Dev dependencies
npm install --dev tailwindcss
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once created, go to **Project Settings > API** and copy:

   - Project URL
   - anon/public key

3. Create `.env` file in project root:

```env
EXPO_PUBLIC_SUPABASE_URL=your_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

4. Run the database migrations:
   - Go to **SQL Editor** in Supabase dashboard
   - Copy and run each file from `supabase/migrations/` in order:
     1. `001_create_tables.sql`
     2. `002_row_level_security.sql`
     3. `003_functions_and_triggers.sql`
     4. `004_seed_data.sql`

### 3. Configure Authentication Providers

#### Email/Password

Enabled by default in Supabase.

#### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. In Supabase: **Authentication > Providers > Google**
4. Add your Client ID and Secret
5. Add redirect URL: `realequity://auth/callback`

#### Apple Sign-In

1. Set up in Apple Developer Console
2. In Supabase: **Authentication > Providers > Apple**
3. Add your Service ID and credentials

### 4. Run the App

```bash
# Start Expo development server (clear cache on first run)
npx expo start --clear
```

## Project Structure

```
real-equity/
├── app/                      # Expo Router screens
│   ├── auth/                 # Auth screens (login, signup, forgot-password)
│   ├── tabs/                 # Main app tabs (home, properties, search, etc.)
│   ├── property/[id].tsx     # Property detail page
│   ├── _layout.tsx           # Root layout
│   └── index.tsx             # Entry redirect
├── components/
│   ├── ui/                   # Base UI components (Button, Input, Card)
│   ├── portfolio/            # Portfolio-related components
│   └── property/             # Property-related components
├── lib/
│   ├── api/                  # API functions (auth, properties, portfolio)
│   ├── store/                # Zustand stores
│   └── supabase.ts           # Supabase client
├── types/
│   └── database.ts           # TypeScript types
├── constants/
│   └── theme.ts              # Theme constants
├── supabase/
│   └── migrations/           # SQL migration files
├── global.css                # Tailwind CSS entry
├── tailwind.config.js        # Tailwind configuration
├── app.json                  # Expo config
├── babel.config.js           # Babel config (with NativeWind)
├── metro.config.js           # Metro bundler config
└── tsconfig.json             # TypeScript config
```

## Features

### Implemented

- ✅ User authentication (Email, Google, Apple)
- ✅ Portfolio dashboard with total value
- ✅ Property listings with filters
- ✅ Property search by name, city, address
- ✅ Property detail view
- ✅ Buy/Sell shares (mock transactions)
- ✅ Notifications system
- ✅ Watchlist
- ✅ Account settings

### Future Features

- ⬜ Real payment integration (Stripe)
- ⬜ KYC verification
- ⬜ Push notifications
- ⬜ Real-time price updates
- ⬜ Dividend tracking
- ⬜ Document management
- ⬜ Portfolio analytics charts

## Environment Variables

| Variable                        | Description            |
| ------------------------------- | ---------------------- |
| `EXPO_PUBLIC_SUPABASE_URL`      | Supabase project URL   |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |

## Troubleshooting

### Common Issues

1. **Metro bundler cache issues**

   ```bash
   npx expo start --clear
   ```

2. **NativeWind styles not applying**

   - Ensure `global.css` is imported in `app/_layout.tsx`
   - Check `tailwind.config.js` has correct content paths
   - Check `babel.config.js` has NativeWind preset
   - Restart Metro bundler with `--clear`

3. **Supabase connection issues**

   - Verify `.env` file exists and has correct values
   - Check that variables start with `EXPO_PUBLIC_`

4. **TypeScript path alias errors**
   - Ensure `tsconfig.json` has the correct `paths` configuration
   - Restart TypeScript server in your editor

## Deployment

### Expo (EAS Build)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure
eas build:configure

# Build for stores
eas build --platform ios
eas build --platform android
```

## License

MIT
