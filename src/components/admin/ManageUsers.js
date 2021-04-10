import {React, useEffect, useState} from 'react'
import {Row, Col, Button} from 'react-bootstrap'

import StoreNavbar from '../StoreNavbar'
import './../styles/ManageUsers.css'

function ManagePromotions(){

    const [user, setUsers] = useState([])

    useEffect(() => {
        async function fetchUsers(){
            console.log('in fetchUsers')
            let usersGetData={
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
            const response = await fetch('http://localhost:3000/api/users', usersGetData)
            const data = await response.json()
            if(data.errors) {
                console.log(data.errors.split(';')) // TODO: Add a set erros hook (see Homepage.js)
            }
            setUsers(data)
        }
        fetchUsers()
    }, [])

    const userCol = user.map( users => (
        

        <Row className = "row-list-manusers" key = {users.email}>
            <Col className = "col-list-manusers"> {users.lastName} </Col>
            <Col className = "col-list-manusers"> {users.firstName} </Col>
            <Col id = "col-list-email-manusers"> {users.email} </Col>
            <Col className = "col-list-manusers"> {String(users.recievePromotions)}  </Col>
            {/* <Col className = "col-list-manusers"> {users.recievePromotions ? ('True') : ('False')}  </Col> */}
            <Col className = "col-list-manusers"> {users.dateJoined} </Col>
            <Col className = "col-list-manusers"> {users.status} </Col>
            <Col className = "col-list-manusers"> {users.userType} </Col>
            <Button className = "but-manusers"> Suspend/Unsuspend </Button>
            <Button className = "but-manusers"> Promote/Demote </Button>            
        </Row>
    ))


    return  (
        
        <div>
            <StoreNavbar/>
            <div id = "cont-manusers">
                <Row id = "row-title-manusers">
                    <Col className = "col-title-manusers"> Last Name </Col>
                    <Col className = "col-title-manusers"> First Name </Col>
                    <Col id = "col-title-email-manusers"> Email </Col>
                    <Col className = "col-title-manusers"> Recieving Promotions </Col>
                    <Col className = "col-title-manusers"> Date Joined </Col>
                    <Col className = "col-title-manusers"> Status </Col>
                    <Col className = "col-title-manusers"> User Type </Col>          
                </Row>
                {userCol}
            </div>
        </div>
    )

}

export default ManagePromotions