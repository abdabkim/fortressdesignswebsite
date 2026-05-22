import { initializeApp, getApps } from 'firebase/app'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth'
import { useAuthStore } from '~/stores/auth'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey,
    authDomain: config.public.firebaseAuthDomain,
    projectId: config.public.firebaseProjectId,
    storageBucket: config.public.firebaseStorageBucket,
    messagingSenderId: config.public.firebaseMessagingSenderId,
    appId: config.public.firebaseAppId,
  }

  // Initialize Firebase only once
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
  const auth = getAuth(app)
  const googleProvider = new GoogleAuthProvider()

  // Watch auth state changes globally
  const authStore = useAuthStore()
  onAuthStateChanged(auth, (user) => {
    authStore.setUser(user)
  })

  const firebaseAuth = {
    signIn: (email: string, password: string) => signInWithEmailAndPassword(auth, email, password),
    signUp: async (email: string, password: string, displayName: string) => {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(result.user, { displayName })
      return result
    },
    signInWithGoogle: () => signInWithPopup(auth, googleProvider),
    logout: () => signOut(auth),
    updateDisplayName: async (displayName: string) => {
      if (!auth.currentUser) throw new Error('Not authenticated')
      await updateProfile(auth.currentUser, { displayName })
    },
    sendPasswordReset: (email: string) => sendPasswordResetEmail(auth, email),
  }

  return {
    provide: {
      firebaseAuth,
    },
  }
})
