import {
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth"
import { setError, setIsAuthenticate, setUser } from "./userSlice"
import { auth } from "../../firebase/firebaseConfig"


export const createAnAccountAsync = (newUser) => async (dispatch) => {
  try {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      newUser.email,
      newUser.password
    )
    await updateProfile(auth.currentUser, {
      displayName: newUser.name,
      photoURL: newUser.photoURL,
    })
    console.log(user)
    dispatch(
      setUser({
        id: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        accessToken: user.accessToken,
      })
    )
    dispatch(setIsAuthenticate(true))
    dispatch(setError(false))
  } catch (error) {
    console.warn(error)
    dispatch(
      setError({ error: true, code: error.code, message: error.message })
    )
  }
}

export const loginGoogle = () => {
  const provider = new GoogleAuthProvider()
  return async (dispatch) => {
    try {
      const userCredencial = await signInWithPopup(auth, provider)
      console.log(userCredencial)
      dispatch(setIsAuthenticate(true))
      dispatch(setUser(userCredencial.user))
    } catch (error) {
      dispatch(setIsAuthenticate(false))
      dispatch(
        setError({ error: true, code: error.code, message: error.message })
      )
    }
  }
}

export const loginWithEmailAndPassword = ({ email, password }) => async ( dispatch ) => {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password)
    console.log(user)
    dispatch(setIsAuthenticate(true))
    dispatch(setUser({ email: user.email, id: user.uid, name: user.displayName, photoURL: user.photoURL, accessToken: user.accessToken }))
    dispatch(setError(false))
  } catch (error) {
    dispatch(setIsAuthenticate(false))
    dispatch(
      setError({ error: true, code: error.code, message: error.message })
    )
  }
}

export const logoutAsync = () => async ( dispatch ) => {
  try {
    await signOut(auth)
    dispatch(setIsAuthenticate(false))
    dispatch(setUser(null))
    dispatch(setError(null))
  } catch (error) {
    dispatch(
      setError({ error: true, code: error.code, message: error.message })
    )
  }
}

export const loginWithCodeAsync = ( code ) => async ( dispatch ) => {
  const confirmationResult = window.confirmationResult
  try {
    confirmationResult.confirm(code)
      .then(response => {
        const user = response.user.auth.currentUser
        console.log(user)
        dispatch(setUser({ email: user.email, id: user.uid, name: user.displayName, photoURL: user.photoURL, accessToken: user.accessToken }))
        dispatch(setError(false))
      })
  } catch (error) {
    dispatch(
      setError({ error: true, code: error.code, message: error.message })
    )
  }
}
