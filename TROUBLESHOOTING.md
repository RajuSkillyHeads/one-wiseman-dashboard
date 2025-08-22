# Troubleshooting Firebase Connection Issues

If you're experiencing "Cannot reach Firestore (ping failed)" errors, here are some steps to diagnose and fix the issue:

## Quick Diagnosis

1. **Visit the Firebase Test Page**: Go to `http://localhost:3000/test` to run automated diagnostics
2. **Check Browser Console**: Open Developer Tools (F12) and look for error messages
3. **Check Network Tab**: Look for failed requests to Firebase

## Common Issues and Solutions

### 1. Firebase Project Configuration

**Issue**: Firebase project doesn't exist or is misconfigured
**Solution**: 
- Verify the Firebase project "one-wiseman" exists
- Check that the API key and project ID are correct
- Ensure the project is in the correct region

### 2. Firestore Rules

**Issue**: Firestore security rules are blocking access
**Solution**:
- Go to Firebase Console > Firestore Database > Rules
- Ensure anonymous users can read data:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    allow read: if request.auth != null || true;
  }
}
```

### 3. Anonymous Authentication

**Issue**: Anonymous authentication is disabled
**Solution**:
- Go to Firebase Console > Authentication > Sign-in method
- Enable "Anonymous" authentication

### 4. Network/Firewall Issues

**Issue**: Network blocking Firebase connections
**Solution**:
- Check if you're behind a corporate firewall
- Try using a different network
- Check if Firebase domains are blocked

### 5. Browser Issues

**Issue**: Browser blocking Firebase requests
**Solution**:
- Try a different browser
- Clear browser cache and cookies
- Disable browser extensions temporarily

## Fallback Data

The app includes a fallback mechanism that loads sample data from `/data.json` if Firebase fails. This ensures the dashboard works even without Firebase connectivity.

## Testing Steps

1. **Start the app**: `npm start`
2. **Visit test page**: `http://localhost:3000/test`
3. **Check results**: Look for ✅ or ❌ indicators
4. **Review console**: Check browser console for detailed error messages

## Firebase Console Setup

If you need to set up Firebase from scratch:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing "one-wiseman" project
3. Enable Firestore Database
4. Enable Anonymous Authentication
5. Set up Firestore rules to allow read access
6. Add some test data to the collections

## Contact Support

If the issue persists:
1. Check the Firebase Console for any service status issues
2. Review the Firebase documentation for your specific error
3. Check if your Firebase project has billing issues (if applicable)

## Sample Data

The app includes sample data in `/public/data.json` that demonstrates the expected data structure. You can use this to test the dashboard functionality even without Firebase connectivity.
