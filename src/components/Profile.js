import React, {useEffect, useState} from 'react'
import { Form, Row, Col, Button, Container, Alert } from 'react-bootstrap'
import { Formik, ErrorMessage} from 'formik'
import * as yup from 'yup'

import StoreNavbar from './StoreNavbar'
import Reroute from './Reroute'
import StateList from './forms/StateList'
import './styles/Profile.css' 
import './styles/Background.css'


function Profile(){
    const [infoErrors, setInfoErrors] = useState([])
    const [paymentErrors, setPaymentErrors] = useState([])
    const [addressErrors, setAddressErrors] = useState([])
    const [passwordErrors, setPasswordErrors] = useState([])
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [promos, setPromos] = useState(false)
    const [payments, setPayments] = useState([])
    const [address1, setAddress1] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [zip, setZip] = useState('')

    const infoAlerts = infoErrors.map(error => 
        <Alert key={error} variant='danger'>
            {error}
        </Alert>
    )
    const paymentAlerts = paymentErrors.map(error => 
        <Alert key={error} variant='danger'>
            {error}
        </Alert>
    )
    const addressAlerts = addressErrors.map(error => 
        <Alert key={error} variant='danger'>
            {error}
        </Alert>
    )
    const passwordAlerts = passwordErrors.map(error => 
        <Alert key={error} variant='danger'>
            {error}
        </Alert>
    )

    useEffect(() => {
        async function fetchData(){

            const headers =  {
                method: 'GET',
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
            }

            const infoResponse = await (await fetch('http://localhost:3000/api/profile', headers)).json()
            const paymentResponse = await (await fetch('http://localhost:3000/api/payment', headers)).json()
            const addressResponse = await (await fetch('http://localhost:3000/api/address', headers)).json()
            if(infoResponse && infoResponse.errors) {
                setInfoErrors(infoResponse.errors.split(';'))
            } else if(infoResponse){
                setFirstName(infoResponse.firstName)
                setLastName(infoResponse.lastName)
                setEmail(infoResponse.email)
                setPromos(infoResponse.recievePromotions)
            }

            if(paymentResponse && paymentResponse.errors) {
                setPaymentErrors(paymentResponse.errors.split(';'))
            } else if(paymentResponse){
                setPayments(paymentResponse)
            }

            if(addressResponse && addressResponse.errors) {
                setInfoErrors(addressResponse.errors.split(';'))
            } else if(addressResponse){
                setAddress1(addressResponse.street)
                setCity(addressResponse.city)
                setState(addressResponse.state)
                setZip(addressResponse.zipcode)       
            }         
        }
        fetchData()

    }, [])

    const paymentRows = payments.map(payment => (
        <Row key={payments.id}> 
            <Col>
                {payment.type}
            </Col>
            <Col>
                {payment.expirationDate.slice(0,10)}
            </Col>
            <Col>
                <Button 
                    variant='outline-danger' 
                    size='sm'
                    onClick={async () => {await deletePayment(payment)}}
                >
                    Delete
                </Button>{' '}
            </Col>
        </Row>
    ))

    async function deletePayment(payment){
        let paymentData = {
            method: 'DELETE',
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
                'paymentId': payment._id
            })
        }

        let idToRemove = payment._id

        setPayments(payments.filter(function(payment) {
            return payment._id != idToRemove
        }))


        const paymentResponse = await (await fetch('http://localhost:3000/api/payment', paymentData)).json()
        console.log(paymentResponse)
        if(paymentResponse.errors) {
            console.log(paymentResponse.errors.split(';'))
            paymentErrors(paymentResponse.errors.split(';'))
        }
        else {
            console.log('no errors')
        }
    }

    function reloadPage(){
        window.location.reload()
    }


    const editNameSchema = yup.object().shape({
        firstName: yup.string()
            .min(1, 'First Name must be betwen 1 and 100 characters')
            .max(100, 'First Name must be betwen 1 and 100 characters')
            .required(),
        lastName: yup.string()
            .min(1, 'Last Name must be betwen 1 and 100 characters')
            .max(100, 'Last Name must be betwen 1 and 100 characters')
            .required(),
        email: yup.string().email('Invalid Email Format').required('Required'),
        recievePromos: yup.bool().notRequired()
    })

    // eslint-disable-next-line no-unused-vars
    const editPaymentSchema = yup.object().shape({
        cardNumber: yup.string().length(16, 'Must be 16 digits').matches('^[0-9]*$', 'Can only contain numbers').required(),
        expiration: yup.date().required(),
        cardType: yup.string().required()
    })

    // eslint-disable-next-line no-unused-vars
    const editAddressSchema = yup.object().shape({
        address1: yup.string().min(1, 'Minimum 1 Character').max(100,'Max 100 Characters').required('Address Line 1 is Required'),
        city:  yup.string().min(1, 'Minimum 1 Character').max(23,'Max 23 Characters').required('City is Required'),
        zip: yup.string().length(5, 'Must be length 5').matches('^[0-9]*$', 'Must contain only contain numbers').required(),
        state: yup.string().required()
    })

    const editPasswordSchema = yup.object().shape({
        oldPassword: yup.string().required(),
        newPassword: yup.string().required(),
        confirmPassword: yup.string()
            .oneOf([yup.ref('newPassword'), null], 'Passwords do not match')
            .required()
    })


    return(
        <>
            <Reroute errors={infoErrors}/>
            <Reroute errors={addressErrors}/>
            <Reroute errors={paymentErrors}/>
            <StoreNavbar/>
            <Container id = "background">
                <Row id = "row1-profile">
                    <Col>
                        <Formik 
                            enableReinitialize
                            initialValues={{
                                firstName: firstName,
                                lastName: lastName,
                                email: email,
                                promos: promos
                            }}
                            onSubmit={async (data) => {
                                let infoData = {
                                    method: 'PATCH',
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
                                        firstName: data.firstName,
                                        lastName: data.lastName,
                                        recievePromotions: data.promos
                                    })
                                }
                                const infoResponse = await (await fetch('http://localhost:3000/api/profile', infoData)).json()
                                if(infoResponse.errors) {
                                    console.log(infoResponse.errors.split(';'))
                                    setInfoErrors(infoResponse.errors.split(';'))
                                }
                                else {
                                    console.log('no errors')
                                }
                                console.log(infoResponse)
                            }}
                            validationSchema={editNameSchema}
                        >{({
                                handleSubmit,
                                handleChange, 
                                handleBlur,
                                values,
                                touched,
                                errors,
                                dirty,
                                isValid
                            }) => (
                                <Form id = "form-style-profile" onSubmit={handleSubmit}>
                                    <h1 id = "h1-style-profile">Profile Info</h1>
                                    {infoAlerts}
                                    <Form.Row>
                                        <Form.Group as={Col}>
                                            <Form.Label>First Name</Form.Label>
                                            <Form.Control id = "form-control-profile"
                                                name="firstName"
                                                value={values.firstName}
                                                type="text" 
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isValid={touched.firstName && !errors.firstName}
                                                isInvalid={touched.firstName && errors.firstName}
                                            />
                                        </Form.Group>
                                        <Form.Group as={Col}>
                                            <Form.Label>Last Name</Form.Label>
                                            <Form.Control id = "form-control-profile" 
                                                name="lastName"
                                                value={values.lastName}
                                                type="text" 
                                                placeholder={values.lastName}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isValid={touched.lastName && !errors.lastName}
                                                isInvalid={touched.lastName && errors.lastName} 
                                            />
                                        </Form.Group>
                                    </Form.Row>
                                    <Form.Group>
                                        <Form.Label>Email address</Form.Label>
                                        <Form.Control id = "form-control-profile"
                                            name="email"
                                            value={values.email}
                                            type="text" 
                                            placeholder={values.email} 
                                            readOnly
                                        />
                                    </Form.Group> 
                                    <Form.Group>
                                        <Form.Check 
                                            name='promos'
                                            label="Recieve Promo Codes via Email"
                                            value={values.promos}
                                            checked={values.promos}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isValid={touched.promos && !errors.promos}
                                            isInvalid={touched.promos && errors.promos} 
                                        />
                                    </Form.Group> 
                                    <Button id = "button1-profile" variant="primary" type="submit" disabled={!(dirty && isValid)}>
                                        Save Changes
                                    </Button>
                                </Form>
                            )}</Formik>
                    </Col>
                    <Col>
                        <Formik 
                            enableReinitialize
                            initialValues={{
                                cardType: '',
                                cardNumber: '',
                                expiration: '',
                            }}
                            onSubmit={async (data) => {
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

                                const paymentResponse = await (await fetch('http://localhost:3000/api/payment', paymentData)).json()
                                if(paymentResponse.errors) {
                                    console.log(paymentResponse.errors.split(';'))
                                    setPaymentErrors(paymentResponse.errors.split(';'))
                                }
                                else {
                                    console.log('no errors')
                                }
                                console.log(paymentResponse)

                            }}
                            validationSchema={editPaymentSchema}
                        >{({
                                handleSubmit,
                                handleChange, 
                                handleBlur,
                                values,
                                touched,
                                errors,
                                dirty,
                                isValid
                            }) => (
                                <Form className="edit-card-form" id = "form-style-profile" onSubmit={handleSubmit}>
                                    <h1 id = "h1-style-profile">
                                        Payment Info
                                    </h1>
                                    {paymentAlerts}
                                    <h2 className='h2-style-profile'>Current Payments</h2>
                                    {paymentRows}
                                    <h2 className='h2-style-profile'>Add New Payment</h2>
                                   
                                    <Form.Group>
                                        <Form.Label>Credit Card Number</Form.Label>
                                        <Form.Control id = "form-control-profile"
                                            name="cardNumber"
                                            value={values.cardNumber}
                                            type="text" 
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isValid={touched.cardNumber && !errors.cardNumber}
                                            isInvalid={touched.cardNumber && errors.cardNumber} 
                                        />
                                        <ErrorMessage name="cardNumber" />
                                    </Form.Group>
                                    <Form.Row>
                                        <Form.Group as={Col} >
                                            <Form.Label>Card Type</Form.Label>
                                            <Form.Control id ="form-control-profile"
                                                as="select" 
                                                name="cardType"
                                                value={values.cardType}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isValid={touched.cardType && !errors.cardType}
                                                isInvalid={touched.cardType && errors.cardType}
                                            >
                                                <option value=''>Choose...</option>
                                                <option value='Visa'>Visa</option>
                                                <option value='American Express'>American Express</option>
                                                <option value='MasterCard'>MasterCard</option>
                                            </Form.Control>
                                            <ErrorMessage name="cardType" />
                                        </Form.Group>
                                        <Form.Group as={Col}>
                                            <Form.Label>Expiration Date</Form.Label>
                                            <Form.Control id="form-control-profile"
                                                name="expiration"
                                                type="date"
                                                value={values.expiration}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isValid={touched.expiration && !errors.expiration}
                                                isInvalid={errors.expiration}
                                            />
                                            <ErrorMessage name="expiration" />
                                        </Form.Group>
                                    </Form.Row>
                                    <Button id = "button2-profile"  variant="primary" type="submit" disabled={!(dirty && isValid)}>
                                        Save Changes
                                    </Button>
                                </Form>
                            )}</Formik>
                    </Col>
                </Row>
                <Row id = "row2-profile">
                    <Col>   
                        <Formik 
                            enableReinitialize
                            initialValues={{
                                address1: address1,
                                city: city,
                                state: state,
                                zip: zip
                            }}
                            onSubmit={async (data) => {

                                let addressData = {
                                    method: 'PATCH',
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
                                if(address1 === '' && city === '' && state === '' && zip === ''){
                                    addressData.method = 'POST'
                                }
                                const addressResponse = await (await fetch('http://localhost:3000/api/address', addressData)).json()
                                if(addressResponse.errors) {
                                    console.log(addressResponse.errors.split(';'))
                                    setAddressErrors(addressResponse.errors.split(';'))
                                }
                                else {
                                    console.log('no errors')
                                }
                                console.log(addressResponse)
                            }}
                            validationSchema={editAddressSchema}
                        >{({
                                handleSubmit,
                                handleChange, 
                                handleBlur,
                                values,
                                touched,
                                errors,
                                dirty,
                                isValid
                            }) => (
                                <Form id="form-style-profile" onSubmit={handleSubmit}>
                                    <h1 id = "h1-style-profile">Update Address</h1>
                                    {addressAlerts}
                                    <Form.Group>
                                        <Form.Label>Address Line 1</Form.Label>
                                        <Form.Control id = "form-control-profile"
                                            name="address1"
                                            value={values.address1}
                                            type="text" 
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isValid={touched.address1 && !errors.address1}
                                            isInvalid={touched.address1 && errors.address1} 
                                        />
                                        <ErrorMessage name="address1" />
                                    </Form.Group>
                                    <Form.Row>
                                        <Form.Group as={Col}>
                                            <Form.Label>City</Form.Label>
                                            <Form.Control id = "form-control-profile"
                                                name="city"
                                                value={values.city}
                                                type="text" 
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isValid={touched.city && !errors.city}
                                                isInvalid={touched.city && errors.city} 
                                            />
                                            <ErrorMessage name="city" />
                                        </Form.Group>
                                    </Form.Row>
                                    <Form.Row>
                                        <Form.Group as={Col}>
                                            <Form.Label>State</Form.Label>
                                            <Form.Control id = "form-control-profile"
                                                as="select" 
                                                name="state"
                                                value={values.state}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isValid={touched.state && !errors.state}
                                                isInvalid={errors.state}
                                            >
                                                <StateList/>
                                            </Form.Control>
                                            <ErrorMessage name="state" />
                                        </Form.Group>
                                        <Form.Group as={Col}>
                                            <Form.Label>Zip</Form.Label>
                                            <Form.Control id = "form-control-profile"
                                                name="zip"
                                                value={values.zip}
                                                type="text" 
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isValid={touched.zip && !errors.zip}
                                                isInvalid={touched.zip && errors.zip} 
                                            />
                                            <ErrorMessage name="zip" />
                                        </Form.Group>
                                    </Form.Row>
                                    <Button id = "button3-profile" variant="primary" type="submit" disabled={!(dirty && isValid)}>
                                Save Changes
                                    </Button>
                                </Form>
                            )}</Formik>
                        <br/>
                        <Button id = "button4-profile" onClick={reloadPage}>Reload and View Changes</Button>
                    </Col>
                    <Col>
                        <Formik 
                            enableReinitialize
                            initialValues={{
                                oldPassword: '',
                                newPassword: '',
                                confirmPassword: ''
                            }}
                            onSubmit={async (data) => {
                                let passwordData = {
                                    method: 'PATCH',
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
                                        email: email,
                                        oldPassword: data.oldPassword,
                                        newPassword: data.newPassword
                                    })
                                }

                                const passwordResponse = await (await fetch('http://localhost:3000/reset-password', passwordData)).json()
                                if(passwordResponse.errors) {
                                    console.log(passwordResponse.errors.split(';'))
                                    setPasswordErrors(passwordResponse.errors.split(';'))
                                }
                                else {
                                    console.log('no errors')
                                }
                                console.log(passwordResponse)
                            }}
                            validationSchema={editPasswordSchema}
                        >{({
                                handleSubmit,
                                handleChange, 
                                handleBlur,
                                values,
                                touched,
                                errors,
                                dirty,
                                isValid
                            }) => (
                                <Form id = "form-style-profile" onSubmit={handleSubmit}>
                                    <h1 id = "h1-style-profile">Update Password</h1>
                                    {passwordAlerts}
                                    <Form.Group>
                                        <Form.Label>Old Password</Form.Label>
                                        <Form.Control id = "form-control-profile"
                                            type="password" 
                                            name="oldPassword"
                                            value={values.oldPassword}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isValid={touched.oldPassword && !errors.oldPassword}
                                            isInvalid={touched.oldPassword && errors.oldPassword} 
                                        />
                                        <ErrorMessage name="oldPassword" />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>New Password</Form.Label>
                                        <Form.Control id = "form-control-profile"
                                            type="password" 
                                            name="newPassword"
                                            value={values.newPassword}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isValid={touched.newPassword && !errors.newPassword}
                                            isInvalid={touched.newPassword && errors.newPassword} 
                                        />
                                        <ErrorMessage name="newPassword" />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Confirm Password</Form.Label>
                                        <Form.Control id = "form-control-profile"
                                            type="password" 
                                            name="confirmPassword"
                                            value={values.confirmPassword}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isValid={touched.confirmPassword && !errors.confirmPassword}
                                            isInvalid={touched.confirmPassword && errors.confirmPassword} 
                                        />
                                        <ErrorMessage name="confirmPassword" />
                                    </Form.Group>
                                    <Button id = "button4-profile" variant="primary" type="submit" disabled={!(dirty && isValid)}>
                    Save Changes
                                    </Button>
                                </Form>
                            )}</Formik>
                    </Col>
                </Row>
            </Container>
        </>
    )
}
export default Profile
