import os
import firebase_admin
from firebase_admin import credentials, auth, firestore
from typing import Dict, Any, Optional
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv()

class FirebaseService:
    """Firebase authentication and database service for StackStage"""
    
    def __init__(self):
        self.firebase_config = {
            "apiKey": os.getenv("FIREBASE_API_KEY", "AIzaSyCOVP0Tgy3Hs-v4ouBL8tOSq9F-UNmlqj0"),
            "projectId": os.getenv("FIREBASE_PROJECT_ID", "337176736332"),
            "authDomain": f"{os.getenv('FIREBASE_PROJECT_ID', '337176736332')}.firebaseapp.com",
            "databaseURL": f"https://{os.getenv('FIREBASE_PROJECT_ID', '337176736332')}-default-rtdb.firebaseio.com",
            "storageBucket": f"{os.getenv('FIREBASE_PROJECT_ID', '337176736332')}.appspot.com"
        }
        
        # Initialize Firebase Admin SDK
        if not firebase_admin._apps:
            try:
                # For production, use service account key
                service_account_path = os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH")
                if service_account_path and os.path.exists(service_account_path):
                    cred = credentials.Certificate(service_account_path)
                else:
                    # For development, use default credentials or create minimal config
                    cred = credentials.ApplicationDefault()
                
                firebase_admin.initialize_app(cred, {
                    'projectId': self.firebase_config["projectId"]
                })
            except Exception as e:
                print(f"Firebase initialization warning: {e}")
                # Continue without Firebase for development
                pass
    
    def verify_firebase_token(self, token: str) -> Optional[Dict[str, Any]]:
        """Verify Firebase authentication token"""
        try:
            decoded_token = auth.verify_id_token(token)
            return {
                'uid': decoded_token['uid'],
                'email': decoded_token.get('email'),
                'verified': decoded_token.get('email_verified', False)
            }
        except Exception as e:
            print(f"Token verification failed: {e}")
            return None
    
    def get_user_profile(self, uid: str) -> Optional[Dict[str, Any]]:
        """Get user profile from Firestore"""
        try:
            db = firestore.client()
            doc_ref = db.collection('users').document(uid)
            doc = doc_ref.get()
            if doc.exists:
                return doc.to_dict()
            return None
        except Exception as e:
            print(f"Failed to get user profile: {e}")
            return None
    
    def update_user_profile(self, uid: str, profile_data: Dict[str, Any]) -> bool:
        """Update user profile in Firestore"""
        try:
            db = firestore.client()
            doc_ref = db.collection('users').document(uid)
            doc_ref.set(profile_data, merge=True)
            return True
        except Exception as e:
            print(f"Failed to update user profile: {e}")
            return False
    
    def store_analysis_result(self, uid: str, analysis_data: Dict[str, Any]) -> str:
        """Store analysis result in Firestore"""
        try:
            db = firestore.client()
            doc_ref = db.collection('analyses').add({
                'user_id': uid,
                'timestamp': firestore.SERVER_TIMESTAMP,
                **analysis_data
            })
            return doc_ref[1].id
        except Exception as e:
            print(f"Failed to store analysis: {e}")
            return ""

# Global Firebase service instance
firebase_service = FirebaseService()
