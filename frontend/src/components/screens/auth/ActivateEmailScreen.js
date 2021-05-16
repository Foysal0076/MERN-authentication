import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import FormContainer from '../../utils/FormContainer'
import Message from '../../utils/Message'


const ActivateEmailScreen = () => {
    const { activation_token } = useParams()
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    useEffect(() => {
        if (activation_token) {
            const activateEmail = async () => {
                try {
                    const { data } = await axios.post('/api/v1/users/activate', { activation_token })
                    setSuccess(data.message)
                } catch (error) {
                    error.response.data.message && setError(error.response.data.message)
                }
            }
            activateEmail()
        }
    }, [activation_token])

    return (
        <FormContainer>
            {error && <Message variant='danger'>{error}</Message>}
            {success && <Message variant='success'>{success}</Message>}
        </FormContainer>
    )
}


export default ActivateEmailScreen