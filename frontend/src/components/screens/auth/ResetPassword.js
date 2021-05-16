import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Message from '../../utils/Message'
import FormContainer from '../../utils/FormContainer'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Card } from 'react-bootstrap'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'

const schema = yup.object().shape({
    password: yup.string()
        .min(6, 'Password must be at least 6 character long')
        .max(15, 'Password cannot be more that 15 characters')
        .required(),
    confirmPassword: yup.string().oneOf([yup.ref('password'), null]),
})

const ResetPassword = () => {

    const { reset_token } = useParams()

    const [message, setMessage] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(null)

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    })

    const submitHandler = async (data) => {

        const { password } = data

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${reset_token}`
            }
        }

        try {
            const { data: { message } } = await axios.post('/api/v1/users/resetpassword', { password }, config)
            setMessage(message)

        } catch (error) {
            setError(error.response.data.message || error.message)
        }
    }

    return (
        <FormContainer>
            <h3 className='py-2' >Reset Password</h3>
            {error && <Message variant='danger'>{error}</Message>}
            {message ? (
                <>
                    <Message variant='success'>{message}</Message>
                    <h3>Please <Link to='/login' >Sign in</Link>  </h3>
                </>
            ) : (

                <Card className='mt-4 shadow bg-light'>
                    <Card.Body>
                        <form noValidate onSubmit={handleSubmit((data) => submitHandler(data))} >
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
            )}
        </FormContainer>
    )
}


export default ResetPassword