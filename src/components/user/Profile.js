import React from 'react'
import { Form, Row, Col, Button, Container } from 'react-bootstrap'
import { Formik, ErrorMessage} from 'formik'
import * as yup from 'yup'

import UserNav from './UserNav'
import '../../styles.css'

function Profile(){

    const mockProfile = {
        firstName: 'Gary',
        lastName: 'Barnes',
        email: 'gary.barnes@uga.edu',
        recievePromos: true,
        address1: '260 North Church Streeet',
        address2: '',
        city: 'Athens',
        state: 'GA',
        zip: '30601',
        cardType: 'Visa',
        cardNumber: '1234123412341234',
        expiration: '2021-05-06',
        security: '123',
    }

    const formStyle = {
        border:'0.5px solid #ffffff',
        background: '#ffffff',
        borderRadius: '20px',
        padding: '15px',
        margin: '2%',
        height: '95%',
    }

    const h1Style = {
        fontSize: '1.5em'
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
        security: yup.string().min(3, 'Minimum length of 3').max(4, 'Maximum length of 4').matches('^[0-9]*$', 'card number can only contain numbers').required(),
        expiration: yup.date().required(),
        cardType: yup.string().required()
    })

    // eslint-disable-next-line no-unused-vars
    const editAddressSchema = yup.object().shape({
        address1: yup.string().min(1, 'Minimum 1 Character').max(100,'Max 100 Characters').required('Address Line 1 is Required'),
        address2: yup.string().min(1, 'Address Line 2 must be betwen 1 and 100 characters').max(100, 'Address Line 2 must be betwen 1 and 100 characters'),
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
            <UserNav/>
            <Container>
                <Row>
                    <Col>
                        <Formik 
                            initialValues={{
                                firstName: mockProfile.firstName,
                                lastName: mockProfile.lastName,
                                email: mockProfile.email,
                                receivePromos: mockProfile.recievePromos
                            }}
                            onSubmit={async (data, {setSubmitting}) => {
                                setSubmitting(true)
                                console.log(data)
                                setSubmitting(false)
                            }}
                            validationSchema={editNameSchema}
                        >{({
                                handleChange, 
                                handleBlur,
                                values,
                                touched,
                                errors,
                                dirty,
                                isValid,
                            }) => (
                                <Form style={formStyle}>
                                    <h1 style={h1Style}>Update Info</h1>
                                    <Form.Row>
                                        <Form.Group as={Col} controlId="formFirstName">
                                            <Form.Label>First Name</Form.Label>
                                            <Form.Control 
                                                name="firstName"
                                                value={values.firstName}
                                                type="text" 
                                                placeholder="First Name" 
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isValid={touched.firstName && !errors.firstName}
                                                isInvalid={touched.firstName && errors.firstName}
                                            />
                                        </Form.Group>
                                        <Form.Group as={Col} controlId="formLastName">
                                            <Form.Label>Last Name</Form.Label>
                                            <Form.Control 
                                                name="lastName"
                                                value={values.lastName}
                                                type="text" 
                                                placeholder="Last Name" 
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isValid={touched.lastName && !errors.lastName}
                                                isInvalid={touched.lastName && errors.lastName} 
                                            />
                                        </Form.Group>
                                    </Form.Row>
                                    <Form.Group controlId="formBasicEmail">
                                        <Form.Label>Email address</Form.Label>
                                        <Form.Control 
                                            name="email"
                                            value={values.email}
                                            type="text" 
                                            placeholder={values.email} 
                                            readOnly
                                        />
                                    </Form.Group> 
                                    <Form.Group controlId="formPromoCheckbox">
                                        <Form.Check 
                                            name='recievePromos'
                                            type="switch"
                                            label="Recieve Promo Codes via Email"
                                            value={values.receivePromos}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isValid={touched.receivePromos && !errors.receivePromos}
                                            isInvalid={touched.receivePromos && errors.receivePromos} 
                                        /></Form.Group>
                                    <Button variant="primary" type="submit" disabled={!(dirty && isValid)}>
                                Save Changes
                                    </Button>
                                </Form>
                            )}</Formik>
                    </Col>
                    <Col>
                        <Formik 
                            initialValues={{
                                cardType: mockProfile.cardType,
                                cardNumber: mockProfile.cardNumber,
                                expiration: mockProfile.expiration,
                                security: mockProfile.security
                            }}
                            onSubmit={async (data, {setSubmitting}) => {
                                setSubmitting(true)
                                console.log(data)
                                setSubmitting(false)
                            }}
                            validationSchema={editPaymentSchema}
                        >{({
                                handleChange, 
                                handleBlur,
                                values,
                                touched,
                                errors,
                                dirty,
                                isValid,
                            }) => (
                                <Form className="edit-card-form" style={formStyle}>
                                    <h1 style={h1Style}>Update Payment</h1>
                                    <Form.Group controlId="formCardType">
                                        <Form.Label>Card Type</Form.Label>
                                        <Form.Control 
                                            as="select" 
                                            defaultValue={mockProfile.cardType}
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
                                            <option value='Mastercard'>MasterCard</option>
                                        </Form.Control>
                                        <ErrorMessage name="cardType" />
                                    </Form.Group>
                                    <Form.Group controlID="formCardNumber">
                                        <Form.Label>Credit Card Number</Form.Label>
                                        <Form.Control 
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
                                        <Form.Group as={Col} controlId="formCardExpiration">
                                            <Form.Label>Expiration Date</Form.Label>
                                            <Form.Control 
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
                                        <Form.Group as={Col} controlId="formCardCode">
                                            <Form.Label>Security Code</Form.Label>
                                            <Form.Control 
                                                name="security"
                                                value={values.security}
                                                type="text" 
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isValid={touched.security && !errors.security}
                                                isInvalid={touched.security && errors.security} 
                                            />
                                            <ErrorMessage name="security" />
                                        </Form.Group>
                                    </Form.Row>
                                    <Button variant="primary" type="submit" disabled={!(dirty && isValid)}>
                                Save Changes
                                    </Button>
                                </Form>
                            )}</Formik>
                    </Col>
                </Row>
                <Row>
                    <Col>   
                        <Formik 
                            initialValues={{
                                address1: mockProfile.address1,
                                address2: mockProfile.address2,
                                city: mockProfile.city,
                                state: mockProfile.state,
                                zip: mockProfile.zip
                            }}
                            onSubmit={async (data, {setSubmitting}) => {
                                setSubmitting(true)
                                console.log(data)
                                setSubmitting(false)
                            }}
                            validationSchema={editAddressSchema}
                        >{({
                                handleChange, 
                                handleBlur,
                                values,
                                touched,
                                errors,
                                dirty,
                                isValid,
                            }) => (
                                <Form classname="edit-address-form" style={formStyle}>
                                    <h1 style={h1Style}>Update Address</h1>
                                    <Form.Group controlId="formAddress1">
                                        <Form.Label>Address Line 1</Form.Label>
                                        <Form.Control 
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
                                    <Form.Group controlId="formAddress2">
                                        <Form.Label>Address Line 2</Form.Label>
                                        <Form.Control
                                            name="address2"
                                            value={values.address2}
                                            type="text" 
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isValid={touched.address2 && !errors.address2}
                                            isInvalid={touched.address2 && errors.address2} 
                                        />
                                        <ErrorMessage name="address2" />
                                    </Form.Group>
                                    <Form.Row>
                                        <Form.Group as={Col} controlId="formCity">
                                            <Form.Label>City</Form.Label>
                                            <Form.Control 
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
                                        <Form.Group as={Col} controlId="formState">
                                            <Form.Label>State</Form.Label>
                                            <Form.Control
                                                as="select" 
                                                defaultValue={mockProfile.state}
                                                name="state"
                                                value={values.state}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isValid={touched.state && !errors.state}
                                                isInvalid={errors.state}
                                            >
                                                <option value="">Choose...</option>
                                                <option value="AL">Alabama</option>
                                                <option value="AK">Alaska</option>
                                                <option value="AZ">Arizona</option>
                                                <option value="AR">Arkansas</option>
                                                <option value="CA">California</option>
                                                <option value="CO">Colorado</option>
                                                <option value="CT">Connecticut</option>
                                                <option value="DE">Delaware</option>
                                                <option value="DC">District Of Columbia</option>
                                                <option value="FL">Florida</option>
                                                <option value="GA">Georgia</option>
                                                <option value="HI">Hawaii</option>
                                                <option value="ID">Idaho</option>
                                                <option value="IL">Illinois</option>
                                                <option value="IN">Indiana</option>
                                                <option value="IA">Iowa</option>
                                                <option value="KS">Kansas</option>
                                                <option value="KY">Kentucky</option>
                                                <option value="LA">Louisiana</option>
                                                <option value="ME">Maine</option>
                                                <option value="MD">Maryland</option>
                                                <option value="MA">Massachusetts</option>
                                                <option value="MI">Michigan</option>
                                                <option value="MN">Minnesota</option>
                                                <option value="MS">Mississippi</option>
                                                <option value="MO">Missouri</option>
                                                <option value="MT">Montana</option>
                                                <option value="NE">Nebraska</option>
                                                <option value="NV">Nevada</option>
                                                <option value="NH">New Hampshire</option>
                                                <option value="NJ">New Jersey</option>
                                                <option value="NM">New Mexico</option>
                                                <option value="NY">New York</option>
                                                <option value="NC">North Carolina</option>
                                                <option value="ND">North Dakota</option>
                                                <option value="OH">Ohio</option>
                                                <option value="OK">Oklahoma</option>
                                                <option value="OR">Oregon</option>
                                                <option value="PA">Pennsylvania</option>
                                                <option value="RI">Rhode Island</option>
                                                <option value="SC">South Carolina</option>
                                                <option value="SD">South Dakota</option>
                                                <option value="TN">Tennessee</option>
                                                <option value="TX">Texas</option>
                                                <option value="UT">Utah</option>
                                                <option value="VT">Vermont</option>
                                                <option value="VA">Virginia</option>
                                                <option value="WA">Washington</option>
                                                <option value="WV">West Virginia</option>
                                                <option value="WI">Wisconsin</option>
                                                <option value="WY">Wyoming</option>
                                            </Form.Control>
                                            <ErrorMessage name="state" />
                                        </Form.Group>
                                        <Form.Group as={Col} controlId="formZip">
                                            <Form.Label>Zip</Form.Label>
                                            <Form.Control 
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
                                    <Button variant="primary" type="submit" disabled={!(dirty && isValid)}>
                                Save Changes
                                    </Button>
                                </Form>
                            )}</Formik>
                    </Col>
                    <Col>
                        <Formik 
                            initialValues={{
                                oldPassword: '',
                                newPassword: '',
                                confirmPassword: ''
                            }}
                            onSubmit={async (data, {setSubmitting}) => {
                                setSubmitting(true)
                                console.log(data)
                                setSubmitting(false)
                            }}
                            validationSchema={editPasswordSchema}
                        >{({
                                handleChange, 
                                handleBlur,
                                values,
                                touched,
                                errors,
                                dirty,
                                isValid,
                            }) => (
                                <Form classname="edit-password-form" style={formStyle}>
                                    <h1 style={h1Style}>Update Password</h1>
                                    <Form.Group controlId="formOldPassword">
                                        <Form.Label>Old Password</Form.Label>
                                        <Form.Control 
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
                                    <Form.Group controlId="formNewPassword">
                                        <Form.Label>New Password</Form.Label>
                                        <Form.Control 
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
                                    <Form.Group controlId="formConfirmPassword">
                                        <Form.Label>Confirm Password</Form.Label>
                                        <Form.Control 
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
                                    <Button variant="primary" type="submit" disabled={!(dirty && isValid)}>
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