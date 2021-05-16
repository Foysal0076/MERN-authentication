import React from 'react'
import { Spinner } from "react-bootstrap"

const Loader = () => {
    return (
        <div className='d-flex align-items-center justify-content-center h-100' >
            <Spinner
                className='text-info p-4'
                animation='border'
                role='status'
                style={{
                    height: '40px',
                    width: '40px',
                    margin: 'auto',
                    display: 'block',
                }}
            >
                <span className='sr-only' >Loading...</span>
            </Spinner>
        </div>
    )
}

export default Loader