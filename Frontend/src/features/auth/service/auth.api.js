import axios from 'axios'

const api = axios.create({
    baseURL:"http://localhost:3000",
    withCredentials:true
})

export const register= async ({email , password , username}) => {
    try {
        const response = await api.post('/api/auth/register', {email , password , username})
        return response.data
    } catch (error) {
        console.error('Registration error:', error)
        throw error
    }
}

export const login = async ({email , password}) => {
    try {
        const response = await api.post('/api/auth/login', {email , password})
        return response.data
    } catch (error) {
        console.error('Login error:', error)
        throw error
    }
}

export const getMe = async () => {
    try {
        const response = await api.get('/api/auth/me')         
        return response.data
    } catch (error) {
        console.error('Get me error:', error)
        throw error
    }
}
