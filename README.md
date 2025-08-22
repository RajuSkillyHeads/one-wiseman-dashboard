# One Wiseman Admin Dashboard - React Version

A modern React-based admin dashboard for the One Wiseman educational platform, featuring real-time data from Firebase.

## Features

- **Real-time Firebase Integration**: Fetches data directly from Firestore
- **Interactive Charts**: Built with Chart.js and react-chartjs-2
- **Responsive Design**: Modern glass-morphism UI with purple theme
- **Client Filtering**: Filter data by specific clients
- **Comprehensive Analytics**: KPIs, charts, and detailed tables
- **User Management**: View users and their submission history
- **Multi-page Navigation**: Dashboard, Users, Clients, Batches, Assignments, Assessments, Questions

## Pages

1. **Dashboard**: Overview with KPIs, charts, and recent submissions
2. **Users**: User management with links to individual user details
3. **Clients**: Client information and statistics
4. **Batches**: Batch management and details
5. **Assignments**: Assignment tracking and management
6. **Assessments**: Assessment management and statistics
7. **Questions**: Question bank and categorization
8. **User Detail**: Individual user profile with submission history

## Technology Stack

- **React 18**: Modern React with hooks
- **React Router**: Client-side routing
- **Firebase**: Real-time data from Firestore
- **Chart.js**: Interactive data visualization
- **CSS3**: Modern styling with CSS variables and glass-morphism effects

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Data Structure

The dashboard connects to Firebase collections:
- `clients`: Client information
- `users`: User profiles and settings
- `batches`: Student batch management
- `assignments`: Assignment definitions
- `assessments`: Assessment configurations
- `questions`: Question bank
- `submissions`: Student submissions and results

## Features

- **Anonymous Authentication**: Secure access to Firebase data
- **Real-time Updates**: Live data from Firestore
- **Client Filtering**: Filter all data by specific clients
- **Interactive Charts**: 
  - Submissions over time
  - Average scores comparison
  - Submission type distribution
  - Question type distribution
- **Responsive Tables**: Sortable and filterable data tables
- **User Profiles**: Detailed user information and submission history

## Styling

The dashboard uses a modern glass-morphism design with:
- Purple color scheme
- Glass-like panels with backdrop blur
- Subtle dot grid background
- Responsive grid layouts
- Smooth animations and transitions

## Firebase Configuration

The app is configured to connect to the One Wiseman Firebase project with anonymous authentication enabled for secure data access.
