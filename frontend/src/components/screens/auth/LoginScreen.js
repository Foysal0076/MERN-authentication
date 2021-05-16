import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Form, FormControl, FormGroup, FormLabel, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { login } from '../../../redux/actions/userActions'
import FormContainer from '../../utils/FormContainer'
import Loader from '../../utils/Loader'
import Message from '../../utils/Message'


const LoginScreen = ({ history }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const dispatch = useDispatch()
    const { loading, error, userInfo } = useSelector(state => state.userLogin)

    useEffect(() => {
        if (userInfo) {
            history.push('/')
        }
    }, [dispatch, userInfo, history])

    const onSubmitHandler = (e) => {
        e.preventDefault()
        dispatch(login(email, password))
    }

    return (
        <FormContainer>
            {error && <Message variant='danger' >{error}</Message>}
            {loading ? <Loader /> : (
                <Card className='mt-4 bg-light shadow' >
                    <Card.Body>
                        <h1 className='text-center'>Sign In</h1>
                        <Form onSubmit={onSubmitHandler} >
                            <FormGroup controlId='email'>
                                <FormLabel>Email Address</FormLabel>
                                <FormControl
                                    type='email'
                                    placeholder='Enter email'
                                    value={email}
                                    required
                                    onChange={(e) => setEmail(e.target.value)}
                                ></FormControl>
                            </FormGroup>

                            <FormGroup controlId='password'>
                                <FormLabel>Password</FormLabel>
                                <FormControl
                                    type='password'
                                    placeholder='Enter password'
                                    value={password}
                                    required
                                    onChange={(e) => setPassword(e.target.value)}
                                >
                                </FormControl>
                            </FormGroup>
                            <div className="d-flex justify-content-between align-items-center">
                                <Button className='' type='submit' variant='primary' >Sign In</Button>
                                <Link className='text-danger' to='/forgotpassword' >Forgot password?</Link>
                            </div>
                        </Form>
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