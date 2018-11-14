const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const keys = require('../../config/keys')
const passport = require('passport')


// Load Input Validation
const validateRegisterInput =  require('../../validation/register')
const validateLoginInput =  require('../../validation/Login')

// Load User Model
const User = require('../../models/User')

// @route  GET  api/users/test
// @desc   Tests users route
// @access Public 
router.get('/test', (req, res) => res.json({ msg: 'Users Works'}))

// @route  POST  api/users/register
// @desc   Register user
// @access Public 
router.post('/register', (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body)

    if (!isValid) {
        return res.status(400).json(errors)
    }

    User.findOne({ name: req.body.name })
        .then(user => {
            if(user) {
                errors.name = 'User already exists'
                return res.status(400).json(errors)
            } else {
                const newUser = new User({
                    name: req.body.name,
                    password: req.body.password
                })
                
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err
                        newUser.password = hash
                        newUser.save()
                            .then(user => res.json(user))
                            // eslint-disable-next-line no-console
                            .catch(err => console.log(err))
                    })
                })
            }
        })
})

// @route  POST  api/users/login
// @desc   Login User / Returning JWT Token
// @access Public 
router.post('/login', (req, res) => {

    const { errors, isValid } = validateLoginInput(req.body)

    if (!isValid) {
        return res.status(400).json(errors)
    }

    const name = req.body.name
    const password = req.body.password

    User.findOne({ name})
        .then(user => {
            if (!user) {
                errors.name = 'User not found'
                res.status(404).json(errors)
            }         
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if(isMatch) {
                        const payload = { id: user.id, name: user.name } 
                        jwt.sign(
                            payload,
                            keys.secretOrKey,
                            { expiresIn: 3600 },
                            (err, token) => {
                                res.json({
                                    success: true,
                                    token: 'Bearer ' + token
                                })
                            }
                        )
                    }  else {
                        errors.password = 'Password Incorrect'
                        res.status(400).json(errors)
                    }              
                })
        })
        // eslint-disable-next-line no-console
        .catch(err => console.log(err ))
})


// @route  GET  api/users/current
// @desc  Return current user
// @access Private
router.get('/current', passport.authenticate('jwt', { session: false}), (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name
    })
})

module.exports = router