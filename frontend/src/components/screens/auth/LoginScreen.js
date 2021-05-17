import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Form, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { login, loginSuccess } from '../../../redux/actions/userActions'
import FormContainer from '../../utils/FormContainer'
import Loader from '../../utils/Loader'
import Message from '../../utils/Message'
import { GoogleLogin } from 'react-google-login'
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import axios from 'axios'

import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from "react-hook-form"

const schema = yup.object().shape({
    email: yup.string()
        .email('Invalid email')
        .required('Email is required'),

    password: yup.string()
        .required('Password is required')

})

const LoginScreen = ({ history }) => {

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    })

    const [socialError, setSocialError] = useState(null)

    const [socialLoading, setSocialLoading] = useState(null)

    const dispatch = useDispatch()
    const { loading, error, userInfo } = useSelector(state => state.userLogin)

    useEffect(() => {
        if (userInfo) {
            history.push('/')
        }
    }, [dispatch, userInfo, history])

    const onSubmitHandler = (data) => {
        const { email, password } = data
        dispatch(login(email, password))
    }

    const responseGoogle = async (response) => {

        try {
            setSocialLoading(true)
            const { data } = await axios.post('/api/v1/users/google_login', { tokenId: response.tokenId })

            dispatch(loginSuccess(data)) //dispatching with object literal is not a good idea,hence use function

            localStorage.setItem('userInfo', JSON.stringify(data))

            setSocialLoading(false)
            history.push('/')

        } catch (error) {
            setSocialLoading(false)
            setSocialError(error.response.data.message || error.message)
        }
    }

    const responseFacebook = async (response) => {

        try {
            setSocialLoading(true)
            const { accessToken, userID } = response
            const { data } = await axios.post('/api/v1/users/facebook_login', { accessToken, userID })

            dispatch(loginSuccess(data)) //dispatching with object literal is not a good idea,hence use function

            localStorage.setItem('userInfo', JSON.stringify(data))

            setSocialLoading(false)
            history.push('/')

        } catch (error) {
            setSocialLoading(false)
            setSocialError(error.response.data.message || error.message)
        }
    }

    return (
        <FormContainer>
            {error && <Message variant='danger' >{error}</Message>}
            {socialError && <Message variant='danger' >{socialError}</Message>}
            {loading || socialLoading ? <Loader /> : (
                <Card className='mt-4 bg-light shadow' >
                    <Card.Body>
                        <h1 className='text-center'>Sign In</h1>
                        <Form onSubmit={handleSubmit((data) => onSubmitHandler(data))} >
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    {...register('email')}
                                    className={errors.email ? 'form-control is-invalid' : 'form-control'}
                                />
                                {errors.email && <p className='invalid-feedback form-text' >{errors.email.message}</p>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    {...register('password')}
                                    className={errors.password ? 'form-control is-invalid' : 'form-control'}
                                />
                                {errors.password && <p className='invalid-feedback form-text' >{errors.password.message}</p>}
                            </div>

                            <div className="d-flex justify-content-between align-items-center">
                                <Button className='' type='submit' variant='primary' >Sign In</Button>
                                <Link className='text-danger' to='/forgotpassword' >Forgot password?</Link>
                            </div>
                        </Form>

                        <div className="py-2">Or Login with</div>

                        <div className="d-flex ">
                            <GoogleLogin
                                className='flex-fill'
                                clientId='599483735678-irl6ias7ken3o9np9q5fs6q2md011lkc.apps.googleusercontent.com'
                                onSuccess={responseGoogle}
                                cookiePolicy={'single_host_origin'}
                                render={renderProps => (
                                    <button className='btn btn-danger px-2 mr-1  flex-fill' onClick={renderProps.onClick} disabled={renderProps.disabled}> <i className="fab fa-google"></i> Login with Google</button>
                                )}
                            />

                            <FacebookLogin

                                appId="827763221462163"
                                autoLoad={false}
                                fields="name,email,picture"
                                callback={responseFacebook}
                                render={renderProps => (
                                    <button className='btn btn-info px-2 ml-l flex-fill' onClick={renderProps.onClick}> <i className="fab fa-facebook"></i> Login with Facebook</button>
                                )}
                            />
                        </div>
                        <Row className='py-3'>
                            <Col>
                                Don't have an account? <Link to='/register' style={{ fontSize: '1.2rem' }}>
                                    Sign Up
                                </Link>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            )}
        </FormContainer>
    )
}


export default LoginScreen