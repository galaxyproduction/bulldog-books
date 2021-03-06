/* eslint-disable no-unused-vars */
import React, {useState} from 'react'
import { Form, Col, Button, Alert } from 'react-bootstrap'
import { Redirect } from 'react-router-dom'
import { Formik, ErrorMessage} from 'formik'
import * as yup from 'yup'

import StoreNavbar from './StoreNavbar'
import StateList from './forms/StateList'
import './styles/Background.css'
import './styles/Register.css'


function Register(){

    const [errors, setErrors] = useState([])
    const [noErrors, setNoErrors] = useState(false)

    const alerts = errors.map(error => 
        <Alert key={error} variant='danger'>
            {error}
        </Alert>
    )

    const validationSchema = yup.object().shape({
        firstName: yup.string()
            .min(1, 'First Name must be betwen 1 and 100 characters')
            .max(100, 'First Name must be betwen 1 and 100 characters')
            .required('Required'),
        lastName: yup.string()
            .min(1, 'Last Name must be betwen 1 and 100 characters')
            .max(100, 'Last Name must be betwen 1 and 100 characters')
            .required('Required'),
        email: yup.string().email('Invalid Email Format').required('Required'),
        password: yup.string().required('Required'),
        address1: yup.string()
            .when(['address2', 'city', 'state', 'zip'], {
                is: (address2, city, state, zip) => address2 === undefined && city === undefined && state === undefined && zip === undefined,
                then: yup.string().min(1, 'Minimum 1 Character').max(100,'Max 100 Characters').notRequired(),
                otherwise: yup.string().min(1, 'Minimum 1 Character').max(100,'Max 100 Characters').required('Address Line 1 is Required')
            }),
        address2: yup.string()
            .min(1, 'Address Line 2 must be betwen 1 and 100 characters')
            .max(100, 'Address Line 2 must be betwen 1 and 100 characters'),
        city: yup.string()
            .when(['address1', 'address2','state', 'zip'], {
                is: (address1, address2, state, zip) => address1 === undefined && address2 === undefined && state === undefined && zip === undefined,
                then: yup.string().min(1, 'Minimum 1 Character').max(23,'Max 23 Characters').notRequired(),
                otherwise: yup.string().min(1, 'Minimum 1 Character').max(23,'Max 23 Characters').required('City is Required')
            }),
        zip: yup.string()
            .when(['address1', 'address2','state', 'city'], {
                is: (address1, state, city, address2) => address1 === undefined && address2 === undefined && state === undefined && city === undefined,
                then: yup.string().length(5, 'Must be length 5').matches('^[0-9]*$', 'Must contain only contain numbers').notRequired(),
                otherwise: yup.string().length(5, 'Must be length 5').matches('^[0-9]*$', 'Must contain only contain numbers').required()
            }),
        state: yup.string()
            .when(['address1', 'address2','zip', 'city'], {
                is: (address1, address2, zip, city) => address1 === undefined && address2 === undefined && zip === undefined && city === undefined,
                then: yup.string().notRequired(),
                otherwise: yup.string().required()
            }),
        cardNumber: yup.string()
            .when(['expiration', 'cardType'], {
                is: (cardType, expiration) => cardType === undefined && expiration === undefined,
                then: yup.string().length(16, 'Must be 16 digits').matches('^[0-9]*$', 'Can only contain numbers').notRequired(),
                otherwise: yup.string().length(16, 'Must be 16 digits').matches('^[0-9]*$', 'Can only contain numbers').required()
            }),
        expiration: yup.date()
            .when(['cardNumber', 'cardType'], {
                is: (cardNumber, cardType) => cardNumber === undefined && cardType === undefined,
                then: yup.date().notRequired(),
                otherwise: yup.date().required()
            }),
        cardType: yup.string()
            .when(['cardNumber', 'expiration'], {
                is: (cardNumber, expiration) => cardNumber === undefined && expiration === undefined,
                then: yup.string().notRequired(),
                otherwise: yup.string().required()
            })
    }, [['address1', 'city'], 
        ['address1', 'zip'], 
        ['city', 'zip'], 
        ['address1', 'state'],
        ['city', 'state'], 
        ['zip', 'state'],
        ['address2', 'city'],
        ['address2', 'address1'],
        ['address2', 'zip'],
        ['address2', 'state'],
        ['cardNumber', 'expiration'],
        ['cardNumber', 'cardType'],
        ['expiration', 'cardType'],
        ['expiration', 'cardNumber']
    ])
    return(
        <div id = "background">
            <StoreNavbar/>
            <Formik
                initialValues={{
                    firstName: '',
                    lastName: '',
                    email: '',
                    password: '',
                    recievePromos: false,
                    address1:  '',
                    address2: '',
                    city: '',
                    zip: '',
                    state: '',
                    cardType: '',
                    cardNumber: '',
                    expiration: '',
                    stayLoggedIn: true
                }}
                onSubmit={ async (data) => {
                    let registerData = {
                        method: 'POST',
                        withCredentials: true,
                        credentials: 'include',
                        mode: 'cors',
                        cache: 'no-cache',
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': 'https://localhost:3000',
                            'Access-Control-Allow-Credentials': true,
                        },
                        redirect: 'follow',
                        referrerPolicy: 'no-referrer',
                        body: JSON.stringify({
                            'firstName': data.firstName,
                            'lastName': data.lastName,
                            'password': data.password,
                            'email': data.email,
                            'recievePromotions': data.recievePromos,
                            'stayLoggedIn': data.stayLoggedIn
                        })
                    }

                    let addressData = {
                        method: 'POST',
                        withCredentials: true,
                        credentials: 'include',
                        mode: 'cors',
                        cache: 'no-cache',
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': 'https://localhost:3000',
                            'Access-Control-Allow-Credentials': true,
                        },
                        redirect: 'follow',
                        referrerPolicy: 'no-referrer',
                        body: JSON.stringify({
                            'street': data.address1,
                            'city': data.city,
                            'state': data.state,
                            'zipcode': data.zip
                        })
                    }


                    let paymentData = {
                        method: 'POST',
                        withCredentials: true,
                        credentials: 'include',
                        mode: 'cors',
                        cache: 'no-cache',
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': 'https://localhost:3000',
                            'Access-Control-Allow-Credentials': true,
                        },
                        redirect: 'follow',
                        referrerPolicy: 'no-referrer',
                        body: JSON.stringify({
                            'cardNumber': data.cardNumber,
                            'type': data.cardType,
                            'expirationDate': data.expiration
                        })
                    }
                    const registerResponse = await (await fetch('http://localhost:3000/register', registerData)).json()
                    console.log(registerResponse)

                    let addressResponse, paymentResponse
                   
                    if(data.address1 && data.city && data.state && data.zip){
                        addressResponse = await (await fetch('http://localhost:3000/api/address', addressData)).json()
                        console.log(addressResponse)
                        
                    }

                    if(data.cardNumber && data.cardType && data.expiration){
                        paymentResponse = await (await fetch('http://localhost:3000/api/payment', paymentData)).json()
                        console.log(paymentResponse)
                    }

                    if(registerResponse.errors && addressResponse && addressResponse.errors && paymentResponse && paymentResponse.errors){
                        setErrors(registerResponse.errors.split(';').concat(addressResponse.errors.split(';')).concat(paymentResponse.errors.split(';')))
                        setNoErrors(false)
                    }
                    else if(registerResponse.errors && addressResponse && addressResponse.errors){
                        setErrors(registerResponse.errors.split(';').concat(addressResponse.errors.split(';')))
                        setNoErrors(false)
                    }
                    else if(registerResponse.errors && paymentResponse && paymentResponse.errors){
                        setErrors(registerResponse.errors.split(';').concat(paymentResponse.errors.split(';')))
                        setNoErrors(false)
                    }
                    else if(registerResponse.errors){
                        setErrors(registerResponse.errors.split(';'))
                        setNoErrors(false)
                    } 
                    else {
                        setNoErrors(true)
                    }

                }}
                validationSchema={validationSchema}
            >
                {({ handleSubmit,
                    handleChange,
                    handleBlur,
                    values,
                    touched,
                    errors,
                    setSubmitting,
                    dirty,
                    isValid,
                    submitForm
                }) => (
                    <div className = "mx-auto" id = "main-cont-register" >
                        {alerts}
                        <Form id="register-form" onSubmit={handleSubmit}> 
                            <Form.Row>
                                <Form.Group as={Col} controlId="formFirstName">
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control 
                                        name="firstName"
                                        placeholder="First Name"
                                        value={values.firstName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        isValid={touched.firstName && !errors.firstName}
                                        isInvalid={touched.firstName && errors.firstName}
                                    />
                                    <ErrorMessage name="firstName" />
                                </Form.Group>
                                <Form.Group as={Col} controlId="formLastName">
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control 
                                        name="lastName"
                                        placeholder="Last Name"
                                        value={values.lastName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        isValid={touched.lastName && !errors.lastName}
                                        isInvalid={touched.lastName && errors.lastName}
                                    />
                                    <ErrorMessage name="lastName" />
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col} controlId="formEmail">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control 
                                        name='email'
                                        type="email" 
                                        placeholder="Enter email" 
                                        value={values.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        isValid={touched.email && !errors.email}
                                        isInvalid={touched.email && errors.email}
                                    />
                                    <ErrorMessage name="email" />
                                </Form.Group>
                                <Form.Group as={Col} controlId="formPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control 
                                        name='password'
                                        type="password" 
                                        placeholder="Password" 
                                        value={values.password}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        isValid={touched.password && !errors.password}
                                        isInvalid={touched.password && errors.password}
                                    />
                                </Form.Group>
                            </Form.Row>
                            <Form.Group id="formCheckbox">
                                <Form.Check 
                                    type="switch"
                                    id="custom-switch"
                                    label="Recieve Promo Codes via Email"
                                    name="recievePromos"
                                    value={values.recievePromos}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                            </Form.Group>
                            <Form.Group controlId="formAddress1">
                                <Form.Label>Address Line 1</Form.Label>
                                <Form.Control 
                                    name="address1"
                                    placeholder="Address Line 1"
                                    value={values.address1}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isValid={touched.address1 && !errors.address1}
                                    isInvalid={errors.address1}
                                />
                                <ErrorMessage name="address1" />
                            </Form.Group>
                            <Form.Group controlId="formAddress2">
                                <Form.Label>Address Line 2</Form.Label>
                                <Form.Control 
                                    placeholder="Apartment, studio, or floor" 
                                    name="address2"
                                    value={values.address2}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isValid={touched.address2 && !errors.address2}
                                    isInvalid={touched.address2 && errors.addres2}
                                />
                                <ErrorMessage name="address2" />
                            </Form.Group>
                            <Form.Row>
                                <Form.Group as={Col} controlId="formCity">
                                    <Form.Label>City</Form.Label>
                                    <Form.Control 
                                        name="city"
                                        placeholder="City"
                                        value={values.city}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        isValid={touched.city && !errors.city}
                                        isInvalid={errors.city}
                                    />
                                    <ErrorMessage name="city" />
                                </Form.Group>
                                <Form.Group as={Col} controlId="formState">
                                    <Form.Label>State</Form.Label>
                                    <Form.Control 
                                        as="select" 
                                        defaultValue="Choose..."
                                        name="state"
                                        value={values.state}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        isValid={touched.state && !errors.state}
                                        isInvalid={errors.state}
                                    >
                                        <StateList/>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group as={Col} controlId="formZip">
                                    <Form.Label>Zip</Form.Label>
                                    <Form.Control
                                        name="zip"
                                        placeholder="Zip Code"
                                        value={values.zip}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        isValid={touched.zip && !errors.zip}
                                        isInvalid={errors.zip}
                                    />
                                </Form.Group>
                            </Form.Row>
                            <Form.Group controlId="formCardType">
                                <Form.Label>Card Type</Form.Label>
                                <Form.Control 
                                    as="select" 
                                    defaultValue="Choose..."
                                    name="cardType"
                                    value={values.cardType}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isValid={touched.cardType && !errors.cardType}
                                    isInvalid={errors.cardType}
                                >
                                    <option value = ''>Choose...</option>
                                    <option value='Visa'>Visa</option>
                                    <option value='American Express'>American Express</option>
                                    <option value='Mastercard'>MasterCard</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlID="formCardNumber">
                                <Form.Label>Credit Card Number</Form.Label>
                                <Form.Control 
                                    name="cardNumber"
                                    placeholder="Credit Card Number"
                                    value={values.cardNumber}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isValid={touched.cardNumber && !errors.cardNumber}
                                    isInvalid={errors.cardNumber}
                                />
                                <ErrorMessage name="cardNumber" />
                            </Form.Group>
                            <Form.Row>
                                <Form.Group as={Col} >
                                    <Form.Label>Expiration</Form.Label>
                                    <Form.Control 
                                        name="expiration"
                                        type="date"
                                        value={values.expiration}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        isValid={touched.expiration && !errors.expiration}
                                        isInvalid={errors.expiration}
                                    />
                                </Form.Group>
                            </Form.Row>
                            <Form.Group>
                                <Form.Check 
                                    name='stayLoggedIn'
                                    label="Stay Logged In"
                                    value={values.stayLoggedIn}
                                    checked={values.stayLoggedIn}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                            </Form.Group> 
                            <Button 
                                variant="primary" 
                                type="submit" 
                                disabled={!(dirty && isValid)}
                                onClick={submitForm}
                            >
                            Submit
                            </Button>
                        </Form>
                        {noErrors && <Redirect to='/confirmation'/>}
                    </div>
                )}</Formik>
        </div>
    )
}

export default Register
