/* eslint-disable no-unused-vars */
import React, {useState, useEffect} from 'react'
import { Row, Col, Container, Button, Form } from 'react-bootstrap'
import { Formik } from 'formik'
import { Link } from 'react-router-dom'
import { Redirect } from 'react-router-dom'
import * as yup from 'yup'


import StoreNavbar from './StoreNavbar'
import './styles/Cart.css' 
import './styles/Background.css'

function Cart(){

    const [carts, setCart] = useState([])
    const [errors, setErrors] = useState([])

    async function fetchCart(){
        let cartGetData={
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
        const response = await fetch('http://localhost:3000/api/cart', cartGetData)
        const data = await response.json()
        if(data.errors) {
            setErrors(data.errors)
        }
        await setCart(data)
        // console.log(data)
    }

    useEffect(() => {
        fetchCart()
    }, [])

    async function deleteCart (event) {

        let cartIndex = event.target.value
        let bookID = carts[cartIndex].book._id
        let quantity = carts[cartIndex].bookQuantity

        console.log(cartIndex)
        console.log(bookID)
        console.log(quantity)

        let bookData={
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
                'bookID': bookID,
                'quantity': quantity
            })
        }

        let userResponse = await (await fetch('http://localhost:3000/api/cart', bookData)).json()

        if(userResponse.errors) {
            console.log(userResponse.errors.split(';'))
        }
        else {
            console.log('no errors')
        } 

        await fetchCart()

        window.location.reload()

    }

    console.log(carts)

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    })

    const validationSchema = yup.object().shape({
        quantity: yup.number()
            .min(1, 'Minimum 1')
            .max(99, 'Max 99')
            .required('Required'),
    })

    const cartRows = carts.map((cartItem, cartIndex) => (
        <Row className = "row-list-cart" key = {cartItem.book}>
            <Col className = "col-cover-cart"> 
                <img id = "img-cart" src={cartItem.book.cover} alt={cartItem.title} /> 
            </Col>
            <Col className = "col-list-cart"> 
                <Row> <h3>{cartItem.book.title}</h3></Row>
                <Row> {cartItem.book.author}</Row>
            </Col>
            <Col className = "col-quantity-cart">
                <Formik 
                    validationSchema={validationSchema}
                    initialValues={{
                        quantity: cartItem.bookQuantity,
                    }} 
                    onSubmit={async (data, {setSubmitting}) => {
                        console.log(data)

                        let cartQuantData={
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
                                'bookID': cartItem.book._id,
                                'quantity': data.quantity,
                            })
                        }

                        console.log(cartItem.book._id)
                        console.log(data.quantity)

                        setSubmitting(false)

                        window.location.reload()

                        const cartQuantResponse = await (await fetch('http://localhost:3000/api/cart', cartQuantData)).json()
                        if(cartQuantResponse.errors) {
                            console.log(cartQuantResponse.errors.split(';'))
                        }
                        else {
                            console.log('no errors')
                        } 
                    }}
                >{({ handleSubmit,
                        handleChange,
                        handleBlur,
                        values,
                        touched,
                        errors, 
                        setSubmitting
                    }) => (
                        <Form id = "num-form-cart" onSubmit={handleSubmit}>
                            <div id = "formcontrol-div-cart">
                                <Form.Control
                                    id="quant-select-cart"
                                    name="quantity"
                                    value={values.quantity}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isValid={touched.quantity && !errors.quantity}
                                    isInvalid={touched.quantity && errors.quantity}
                                />
                            </div>

                            <div>
                                <Button 
                                    id="update-but-cart" 
                                    disabled={setSubmitting} 
                                    variant="primary" 
                                    type="submit"
                                >
                                Update Quantity
                                </Button> 
                            </div>

                        </Form>
                    )}</Formik>
            </Col>
            <Col className = "col-price-cart"> 
                Price: {formatter.format(cartItem.book.sellPrice * cartItem.bookQuantity)}
            </Col>
            <Col className = "col-delete-cart">
                <div>
                    <Button 
                        id="delete-but-cart"
                        variant="danger" 
                        value = {cartIndex}
                        onClick = {async (event) => {await deleteCart(event)}}

                    >
                        X
                    </Button>
                </div>
            </Col>
        </Row>
    ))
        

    let sum = 0
    carts.forEach(cartItem => {
        sum = sum + (cartItem.book.sellPrice * cartItem.bookQuantity)
    })
    // console.log(sum)


    return(
        <div id = "background">
            <StoreNavbar/> 
            <h1 id = "h1-style-cart">Cart</h1>
            <Container className = "main-cont-cart">
                <div>
                    {cartRows}
                </div>
                <div>
                    <Row id = "row-subtotal-cart">
                        <div id = "subtotal-title-cart"> Subtotal </div>
                        <div id = "subtotal-price-cart"> {formatter.format(sum)}</div>
                    </Row>
                </div>
                <div>
                    <Row id = "row-but-cart">
                        <Link to='/user/checkout'>
                            <Button variant="primary" type="submit" id = "button-style-cart">
                            Proceed to Checkout
                            </Button>
                        </Link>
                    </Row>
                </div>
            </Container>
        </div>      
    )
}

export default Cart