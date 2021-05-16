import React, { useState } from 'react'
import FormContainer from '../../utils/FormContainer'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Card } from 'react-bootstrap'
import axios from 'axios'
import Message from '../../utils/Message'

const schema = yup.object().shape({
    email: yup.string()
        .email('Invalid email format')
        .required('Email is requires'),
})

const ForgotPassword = () => {

    const [message, setMessage] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(null)

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    })

    const submitHandler = async (data) => {

        const { email } = data
        try {
            const { data: { message } } = await axios.post('/api/v1/users/forgotpassword', { email })
            setMessage(message)

        } catch (error) {
            setError(error.response.data.message || error.message)
        }
    }

    return (
        <FormContainer>
            <h3>Forgot password? Enter your email. A link will be sent to reset your password</h3>
            {message && <Message variant='success'>{message}</Message>}
            {error && <Message variant='danger'>{error}</Message>}
            <Card className='mt-4 bg-light shadow'>
                <Card.Body>
                    <form noValidate onSubmit={handleSubmit((data) => submitHandler(data))} >
                        <div className="form-group">
                            <label htmlFor="email">Email address</label>
                            <input
                                type="email"
                                {...register('email')}
                                className={errors.email ? 'form-control is-invalid' : 'form-control'}
                            />
                            {errors.email && <p className='invalid-feedback form-text' >{errors.email.message}</p>}
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Submit</button>
                    </form>
                </Card.Body>
            </Card>
        </FormContainer>
    )
}


export default ForgotPassword