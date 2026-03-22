import {useDispatch} from 'react-redux'
import {setUser, setLoading, setError} from '../auth.slice'
import {register, login , getMe, resendVerification} from '../service/auth.api.js'

 export const useAuth = () => {
    const dispatch = useDispatch()
    async function handleRegister({email , password , username}){
        dispatch(setLoading(true))
        try {
            const response = await register({email , password , username})
            return {
                success: true,
                data: response
            }
        } catch (error) {
            dispatch(setError(error.message))
            return {
                success: false,
                message: error?.response?.data?.message || error.message
            }
        }
        finally {
            dispatch(setLoading(false))
        }
    }

    async function handleLogin({email , password}){
        dispatch(setLoading(true))
        try {
            const response = await login({email , password})
            dispatch(setUser(response.user))
            return true
        }
        catch (error) {
            dispatch(setError(error.message))
            return false
        }
        finally {
            dispatch(setLoading(false))
        }
    }

    async function fetchMe(){
        dispatch(setLoading(true))
        try {
            const response = await getMe()
            dispatch(setUser(response.user))
        }
        catch (error) {
            dispatch(setError(error.message))
        }
        finally {
            dispatch(setLoading(false))
        }
    }

    async function handleResendVerification(email) {
        try {
            const response = await resendVerification(email)
            return {
                success: true,
                data: response
            }
        } catch (error) {
            const message = error?.response?.data?.message || error.message
            return {
                success: false,
                message: message
            }
        }
    }

    async function handleLogout() {
        dispatch(setLoading(true))
        try {
            dispatch(setUser(null))
            return true
        } catch (error) {
            dispatch(setError(error.message))
            return false
        } finally {
            dispatch(setLoading(false))
        }
    }

    return {handleRegister , handleLogin , fetchMe, handleResendVerification, handleLogout}
    
}