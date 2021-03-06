const express = require('express')
const User = require('../models/User.model')
const Cart = require('../models/Cart.model')
const auth = require('../../auth')
const mailer = require('../../email')
const genPass = require('generate-password')

const router = express.Router()

router.post('/register', async (req, res, next) => {
    try {
        const {
            firstName,
            lastName,
            password,
            email,
            recievePromotions,
            stayLoggedIn
        } = req.body

        const user = await User.create({
            firstName,
            lastName,
            password,
            email,
            recievePromotions
        })

        await Cart.create({ user: user._id })

        await mailer.sendMail(user.email, 'Active you Bulldawg Books account', `Thanks for registering for Bulldawg Books. Here is your confirmation code: ${user.confirmationCode}`)

        const token = auth.createToken(user._id, user.status, user.userType)
        const cookieOptions = { 
            path: '/', 
            domain: 'localhost', 
        }

        if(stayLoggedIn) {
            cookieOptions.maxAge = auth.maxAge * 1000
        }
        
        res.cookie('jwt', token, cookieOptions)
        res.cookie('userType', user.userType, cookieOptions)

        res.status(201).json( { user: user._id } )
    } catch (error) {
        res.status(400)

        // Checks if email is unique
        if(error.code === 11000) {
            next(new Error('Email already registered'))
        } else {
            next(error)
        }
    }
})

router.post('/login', async (req, res, next) => {
    try {
        const { email, password, stayLoggedIn } = req.body

        const user = await User.login(email, password)

        if(user.status === 'suspended') {
            throw Error('User\'s account is suspended')
        }

        const token = auth.createToken(user._id, user.status, user.userType)

        const cookieOptions = { 
            path: '/', 
            domain: 'localhost', 
        }

        if(stayLoggedIn) {
            cookieOptions.maxAge = auth.maxAge * 1000
        }

        res.cookie('jwt', token, cookieOptions)
        res.cookie('userType', user.userType, cookieOptions)

        res.status(200).json( { user: user._id })
    } catch(error) {
        res.status(401)

        next(error)
    }
})

router.patch('/forgot-password', async (req, res, next) => {
    try {
        // generate new password
        let newPassword = genPass.generate({ length: 8, numbers: true })
        // change user password to this new password
        const userEmail = req.body.email
        await User.findOne({ email : userEmail }, function (err, doc) {
            if(err) return false
            doc.password = newPassword
            doc.save()
        })

        await mailer.sendMail(userEmail, 'New Password', `Your password for Bulldawg Books has been reset to ${newPassword}`)

        res.status(200).json({ message: 'Password was sent to your email' })

    } catch(error) {
        res.status(401)

        next(error)
    }
})

router.patch('/reset-password', async (req, res, next) => {
    try {
        const { email, oldPassword, newPassword } = req.body

        if(newPassword.length < 6) throw Error('Password must be at least 6 characters long')

        const user = await User.login(email, oldPassword)

        await User.findOne({ email : email }, function (err, doc) {
            if(err) throw Error(err)
            doc.password = newPassword
            doc.save()
        })

        await mailer.sendMail(user.email, 'Bulldawg Books password reset', 'Your password has been reset.')

        const token = auth.createToken(user._id, user.status, user.userType)
        const cookieOptions = { 
            path: '/', 
            domain: 'localhost', 
        }
        
        res.cookie('jwt', token, cookieOptions)
        res.cookie('userType', user.userType, cookieOptions)

        res.status(200).json( { user: user._id })
    } catch (error) {
        res.status(401)
        next(error)
    }
})

router.post('/confirmation', async (req, res, next) => {
    try {
        const id = auth.getId(req.cookies.jwt)
        const { confirmationCode } = req.body

        const user = await User.findById(id)

        if(user.confirmationCode == confirmationCode) {
            const activeUser = await User.findOneAndUpdate( { _id: id}, { status: 'active' }, { new: true })

            const token = auth.createToken(activeUser._id, activeUser.status, activeUser.userType)

            const cookieOptions = { 
                path: '/', 
                domain: 'localhost', 
            }
    
            res.cookie('jwt', token, cookieOptions)
            res.cookie('userType', user.userType, cookieOptions)

            res.status(200).json( { message: 'Confirmation successful'})
        } else {
            throw Error('Incorrect confirmation code')
        }
    } catch (error) {
        next(error)
    }   
})

router.get('/resend-confirmation', async (req, res, next) => {
    try {
        const id = auth.getId(req.cookies.jwt)
        const user = await User.findById(id)

        await mailer.sendMail(user.email, 'Active you Bulldawg Books account', `Thanks for registering for Bulldawg Books. Here is your confirmation code: ${user.confirmationCode}`)

        res.status(200).json({ message: 'Password was sent to your email' })

    } catch (error) {
        next(error)
    }
})

module.exports = router
