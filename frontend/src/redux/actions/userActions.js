import axios from 'axios'
import { USER_INFO_FAIL, USER_INFO_REQUEST, USER_INFO_SUCCESS, USER_LOGIN_FAIL, USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS, USER_LOGOUT } from './types'

export const login = (email, password) => async (dispatch) => {

    try {
        dispatch({ type: USER_LOGIN_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.post('/api/v1/users/login', { email, password }, config)

        dispatch(loginSuccess(data))

        localStorage.setItem('userInfo', JSON.stringify(data))

    } catch (error) {
        dispatch({
            type: USER_LOGIN_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}

export const logout = () => dispatch => {

    localStorage.removeItem('userInfo')

    dispatch({ type: USER_LOGOUT })

    document.location.href = '/'
}

export const getUserInfo = () => async (dispatch, getState) => {

    try {
        dispatch({ type: USER_INFO_REQUEST })

        const { userLogin: { userInfo } } = getState()
        const config = {
            headers: {
                'Authorization': `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.get('/api/v1/users/userinfo', config)

        dispatch({
            type: USER_INFO_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: USER_INFO_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}

export const loginSuccess = (data) => {
    return {
        type: USER_LOGIN_SUCCESS,
        payload: data
    }
}