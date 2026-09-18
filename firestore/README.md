# ScholeOS Firestore Layer

Please refer to the primary architecture document at [../FIRESTORE_README.md](../FIRESTORE_README.md) and security rules at [../firestore.rules](../firestore.rules).

### Summary Checklist:
- **Project ID:** `scholesos`
- **Security Rules:** `firestore.rules` (Strict zero-client write lockdown, `schoolId` claim-based reads)
- **App Check:** Enforced in Firebase Console on Cloud Firestore API
- **Worker Writes Only:** All mutations occur through Cloudflare Workers via Firebase Admin SDK after validating PostgreSQL `assignments`
