# City Issue Reporting System

A React-based web application for citizens to report city issues and administrators to manage them.

## Features

- **Citizen Registration & Login**: Users can register and login to report issues
- **Admin Login**: Administrators can login to manage reported issues
- **Issue Reporting**: Citizens can report various types of issues (potholes, garbage, streetlights, etc.)
- **Issue Management**: Admins can view, filter, and update issue statuses
- **Interactive Map**: Visual representation of reported issues on a map
- **Local Data Storage**: All data is stored locally using JSON files and localStorage

## Data Storage

The application uses local JSON files for data persistence:

- `src/data/users.json` - Stores citizen user accounts
- `src/data/admins.json` - Stores admin accounts (default: admin@city.gov / admin123)
- `src/data/issues.json` - Stores reported issues

## Default Admin Credentials

- **Email**: admin@city.gov
- **Password**: admin123

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to the provided local URL

## Project Structure

- `src/components/` - Reusable React components
- `src/contexts/` - React context providers (authentication)
- `src/lib/` - Utility functions and local storage service
- `src/pages/` - Main application pages
- `src/data/` - JSON data files for local storage

## Technologies Used

- React 18
- TypeScript
- Tailwind CSS
- Google Maps API
- Lucide React (icons)
- Vite (build tool)

## Data Persistence

The application uses a combination of:
- JSON files for initial data structure
- localStorage for runtime data persistence
- Base64 encoding for image storage

All data persists between browser sessions and is stored locally on the user's device.
