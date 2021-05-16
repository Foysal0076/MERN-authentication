import React, { useEffect, useState } from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import axios from 'axios'
import { getUserInfo } from '../../../redux/actions/userActions'
import Loader from '../../utils/Loader'
import Message from '../../utils/Message'

const schema = yup.object().shape({
    name: yup.string().required('Name is required'),

    // password: yup.string()
    //     .min(6, 'Password must be at least 6 character long')
    //     .max(15, 'Password cannot be more that 15 characters'),

    // confirmPassword: yup.string().oneOf([yup.ref('password'), null]),
})

const UserInfoScreen = () => {

    const [message, setMessage] = useState(null)
    const [error, setError] = useState(null)

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [avatar, setAvatar] = useState('')

    const [avatarError, setAvatarError] = useState(null)
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)

    const dispatch = useDispatch()

    const { loading: userInfoLoading, error: userInfoError, userInfo } = useSelector(state => state.userInfo)

    const { userInfo: { token } } = useSelector(state => state.userLogin)

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    })

    useEffect(() => {
        if (!userInfo) {
            dispatch(getUserInfo())
        }
        if (userInfo) {
            setName(userInfo.name)
            setEmail(userInfo.email)
            setAvatar(userInfo.avatar)
        }
    }, [userInfo, dispatch, message])

    const submitHandler = async (data) => {

        const { name } = data

        const config = {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userInfo.token}`,
            },
          }

        try {
            console.log(name)
            const { data: { message } } = await axios.put('/api/v1/users/update', { name }, config)
            console.log(message)
            setMessage(message)

        } catch (error) {
            error.response.data.message && setError(error.response.data.message)
        }
    }

    const changeAvatar = async (e) => {
        e.preventDefault()

        const file = e.target.files[0]
        console.log(file)

        if (!file) return setAvatarError('No file Uploaded')

        if (file.size > 1024 * 1024)
            return setAvatarError('File size is too large')

        // if (file.type !== 'image/jpeg' && file.type !== 'image/png')
        //     return setAvatarError('File format is incorrect')

        const formData = new FormData()
        formData.append('file', file)

        console.log(formData)

        setLoading(true)

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`
            }
        }

        const config1 = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        }

        try {
            const { data: { url } } = await axios.post('/api/v1/upload_avatar', formData, config)
            await axios.put('/api/v1/users/update', { avatar: url }, config1)
            setLoading(false)
            setAvatar(url)

        } catch (error) {
            setLoading(false)
            setAvatarError(error.response.data.message || error.message)
        }

    }

    return (
        <>
            <Row>
                <Col md={4}>
                    <h2>User Profile</h2>
                    {message && <Message variant='success'>{message}</Message>}
                    {error && <Message variant='danger'>{error}</Message>}
                    <Card className='mt-4 bg-light shadow'>
                        <Card.Body className='d-flex flex-column' >
                            <div className="avatar mx-auto">
                                {loading ? <Loader /> : (
                                    <>
                                        <img src={avatar ? avatar : userInfo && userInfo.avatar} alt="avatar" />
                                        <span >
                                            <i className="fas fa-camera"></i>
                                            <p>Change</p>
                                            <input type="file"
                                                name="file"
                                                id="file_up"
                                                accept='image/jpeg, image/png'
                                                onChange={changeAvatar} />
                                        </span>
                                    </>
                                )}
                            </div>

                            <form noValidate onSubmit={handleSubmit((data) => submitHandler(data))} >

                                <div className="form-group">
                                    <label htmlFor="name">Name</label>
                                    <input
                                        type="text"
                                        {...register('name')}
                                        className={errors.name ? 'form-control is-invalid' : 'form-control'}
                                        defaultValue={name}
                                    />
                                    {errors.name && <p className='invalid-feedback form-text' >{errors.name.message}</p>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">Email address</label>
                                    <input
                                        type="email"
                                        {...register('email')}
                                        className={errors.email ? 'form-control is-invalid' : 'form-control'}
                                        defaultValue={email}
                                        disabled
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
                </Col>
            </Row>
        </>
    )
}


export default UserInfoScreen