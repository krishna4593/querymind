import {useDispatch} from 'react-redux'
import {setUser, setLoading, setError} from '../auth.slice'
import {register, login , getMe} from '../service/auth.api.js'

 export const useAuth = () => {
    const dispatch = useDispatch()
    async function handleRegister({email , password , username}){
        dispatch(setLoading(true))
        try {
            const response = await register({email , password , username})
            console.log(response)
            
            
        } catch (error) {
            dispatch(setError(error.message))
            dispatch(setLoading(false))
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
        }
        catch (error) {
            dispatch(setError(error.message))
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

        return {handleRegister , handleLogin , fetchMe}
    
}