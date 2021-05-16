import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Row, Col, Card } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import axios from 'axios'
import Message from '../../utils/Message'
import FormContainer from '../../utils/FormContainer'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

const schema = yup.object().shape({
    name: yup.string().required('Name is required'),
    email: yup.string()
        .email('Invalid email format')
        .required('Email is requires'),
    password: yup.string()
        .min(6, 'Password must be at least 6 character long')
        .max(15, 'Password cannot be more that 15 characters')
        .required(),
    confirmPassword: yup.string().oneOf([yup.ref('password'), null]),
})

const RegisterScreen = ({ history }) => {
    const [message, setMessage] = useState(null)
    const [error, setError] = useState(null)

    const { userInfo } = useSelector(state => state.userLogin)

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    })

    useEffect(() => {
        if (userInfo) {
            history.push('/')
        }
    }, [history, userInfo])

    const submitHandler = async (data) => {
        const { name, email, password } = data
        console.log(data)
        try {
            const { data: { message } } = await axios.post('/api/v1/users/register', { name, email, password })
            setMessage(message)
        } catch (error) {
            error.response.data.message && setError(error.response.data.message)
        }
    }

    return (
        <FormContainer>
            <h1>Sign Up</h1>
            {message && <Message variant='success'>{message}</Message>}
            {error && <Message variant='danger'>{error}</Message>}
            <Card className='mt-4 bg-light shadow'>
                <Card.Body>
                    <form noValidate onSubmit={handleSubmit((data) => submitHandler(data))} >
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                {...register('name')}
                                className={errors.name ? 'form-control is-invalid' : 'form-control'}
                            />
                            {errors.name && <p className='invalid-feedback form-text' >{errors.name.message}</p>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email address</label>
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

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                type="password"
                                {...register('confirmPassword')}
                                className={errors.confirmPassword ? 'form-control is-invalid' : 'form-control'}
                            />
                            {errors.confirmPassword && <p className='invalid-feedback form-text' >Password must match</p>}
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Submit</button>
                    </form>
                </Card.Body>
            </Card>

            <Row className='py-3'>
                <Col>
                    Have an Account?{' '}
                    <Link to='/login'>
                        Login
          </Link>
                </Col>
            </Row>
        </FormContainer>
    )
}

export default RegisterScreen
