import { applyMiddleware, combineReducers, createStore } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { userInfoReducer, userLoginReducer } from './redux/reducers/userReducers'

const userInfoFromLocalStorage = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null

const initialState = {
    userLogin: {
        userInfo: userInfoFromLocalStorage
    }
}

const middleware = [thunk]

const devtools = process.env.NODE_ENV === 'production'
    ? applyMiddleware(...middleware)
    : composeWithDevTools(applyMiddleware(...middleware))

const reducers = combineReducers({
    userLogin: userLoginReducer,
    userInfo: userInfoReducer,
})

const store = createStore(
    reducers,
    initialState,
    devtools
)
export default store