/* eslint-disable no-unused-vars */
import React from 'react'
import { Form, Button } from 'react-bootstrap'
import { Formik, ErrorMessage } from 'formik'
import * as yup from 'yup'


import StoreNavbar from './StoreNavbar'
import './styles/Background.css'
import './styles/ForgotPassword.css'

function forgetEmail(userEmail){
    let fetchData = {
        method: 'PATCH',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify({
            email: userEmail
        })
    }

    fetch('http://localhost:3000/forgot-password', fetchData)
        .then(response => response.json())
        .then(data => console.log(data))
    
    window.location.href='/reset-password'
}

function Forgot(){

    // const formStyle = {
    //     border:'2px solid #ffffff',
    //     background: '#ffffff',
    //     borderRadius: '25px'
    // }

    const validationSchema = yup.object().shape({
        email: yup.string().email('Invalid Email Format').required('Required'),
        password: yup.string().required('Required')
    })

    return(
        <div id = "background">
            <StoreNavbar />
            <div id = "main-cont-forgot">
                <Formik 
                    initialValues={{email: '', password: ''}} 
                    onSubmit={(data, {setSubmitting}) => {
                        setSubmitting(true)
                        // make async call to DB eventually
                        console.log(data)
                        setSubmitting(false)
                    }}
                    validationSchema={validationSchema}
                >{({ handleSubmit,
                        handleChange,
                        handleBlur,
                        values,
                        touched,
                        errors,
                        setSubmitting
                    }) => (
                        <Form className="login-form" id = "form-style-forgot" onSubmit={handleSubmit}>
                            <h1> Forgot Password </h1>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control 
                                    name="email"
                                    placeholder="email@example.com"
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isValid={touched.email && !errors.email}
                                    isInvalid={touched.email && errors.email}
                                />
                                <Form.Text className="text-muted">
                                    If you have already submitted a request, please be patient.
                                </Form.Text>
                                <ErrorMessage name="email" />
                            </Form.Group>
                            <Button onClick={() => forgetEmail(values.email)} variant="primary" type="submit">
                                    Request Passsword Reset
                            </Button>   
                        </Form>
                    )}</Formik> 
            </div>
        </div>
    )
}

export default Forgot



/**
  <StoreNavbar />
            <div style={{display: 'flex', justifyContent: 'center', maxWidth: '100vw'}}>
                <Form className="login-form" style={formStyle}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="email@example.com" />
                        <Form.Text className="text-muted">
                        If you have already submitted a request, please be patient.
                        </Form.Text>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Request Password Reset
                    </Button>
                </Form>
            </div>
 */
