import { USER_INFO_FAIL, USER_INFO_REQUEST, USER_INFO_SUCCESS, USER_LOGIN_FAIL, USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS, USER_LOGOUT } from "../actions/types"


export const userLoginReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_LOGIN_REQUEST:
            return {
                loading: true
            }

        case USER_LOGIN_SUCCESS:
            return {
                loading: false,
                userInfo: action.payload
            }

        case USER_LOGIN_FAIL:
            return {
                loading: false,
                error: action.payload
            }

        case USER_LOGOUT:
            return {}

        default:
            return state
    }
}

export const userInfoReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_INFO_REQUEST:
            return {
                loading: true
            }

        case USER_INFO_SUCCESS:
            return {
                loading: false,
                userInfo: action.payload.data
            }

        case USER_INFO_FAIL:
            return {
                loading: false,
                error: action.payload
            }

        default:
            return state
    }
}

