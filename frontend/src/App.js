import { BrowserRouter as Router, Route } from 'react-router-dom'
import Header from "./components/header/Header"
import { Container } from 'react-bootstrap'
import LoginScreen from './components/screens/auth/LoginScreen'
import HomeScreen from './components/screens/home/HomeScreen'
import Footer from './components/screens/footer/Footer'
import RegisterScreen from './components/screens/auth/RegisterScreen'
import ActivateEmailScreen from './components/screens/auth/ActivateEmailScreen'
import UserInfoScreen from './components/screens/users/UserInfoScreen'
import ForgotPassword from './components/screens/auth/ForgotPassword'
import ResetPassword from './components/screens/auth/ResetPassword'

function App() {
    return (
        <Router>
            <main className='bg-light'>
                <div id="content-wrap">
                    <Header />
                    <Container>
                        <Route exact path='/' component={HomeScreen} />
                        <Route exact path='/login' component={LoginScreen} />
                        <Route exact path='/register' component={RegisterScreen} />
                        <Route exact path='/user/activate/:activation_token' component={ActivateEmailScreen} />
                        <Route exact path='/profile' component={UserInfoScreen} />
                        <Route exact path='/forgotpassword' component={ForgotPassword} />
                        <Route exact path='/user/reset/:reset_token' component={ResetPassword} />
                    </Container>
                </div>
                <Footer />
            </main>
        </Router>
    )
}

export default App
