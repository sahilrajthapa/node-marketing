const express = require('express')
const router = express.Router()
const passport = require('passport')

// Load Input Validation
const validateSalesmanInput =  require('../../validation/salesman')

// Load Salesman Model
const Salesman = require('../../models/Salesman')


// @route  GET api/salesmen
// @desc   Get all salesmen
// @access Public
router.get('/', (req, res) => {
    Salesman.find()
        .populate('saleLevel', ['level', 'commission'])
        .sort({ date: -1})
        .then(salesMan => res.json(salesMan))
        .catch(() => res.status(400).json({nosalesmanfound: 'No salesman found'}))
})

// @route  GET api/salesmen/:id
// @desc   Get salesmen by id
// @access Public
router.get('/:id', (req, res) => {
    Salesman.findById(req.params.id)
        .then(salesMan => res.json(salesMan))
        .catch(()=> res.status(400).json({nosalesmanfound: 'No salesman found with that ID'}))
})


// @route  POST  api/salesmen
// @desc   Add salesman
// @access Private 
router.post('/', passport.authenticate('jwt', { session: false}), (req, res) => {
    const { errors, isValid } = validateSalesmanInput(req.body)

    if (!isValid) {
        return res.status(400).json(errors)
    }

    Salesman.findOne({ salesManId: req.body.salesManId })
        .then(salesMan => {
            if(salesMan) {
                errors.name = 'Salesman Id already exists'
                return res.status(400).json(errors)
            } else {
                const newSalesman = new Salesman({
                    salesManId: req.body.salesManId,
                    name: req.body.name,
                    phone: req.body.phone,
                    address: req.body.address,
                    saleLevel: req.body.saleLevel
                })

                newSalesman.save()
                    .then(salesMan => res.json(salesMan))
                    // eslint-disable-next-line no-console
                    .catch(err => console.log(err))

            }
        })
})

// @route  PUT  api/salesmen/:id
// @desc   Edit salesman
// @access Private 
router.put('/:id', passport.authenticate('jwt', { session: false}), (req, res) => {
    const { errors, isValid } = validateSalesmanInput(req.body)

    if (!isValid) {
        return res.status(400).json(errors)
    }

    Salesman.findOne({ _id: req.params.id })
        .then(salesMan => {
            salesMan.salesManId = req.body.salesManId,
            salesMan.name = req.body.name,
            salesMan.phone = req.body.phone,
            salesMan.address = req.body.address,
            salesMan.saleLevel = req.body.saleLevel

            salesMan.save()
                .then(newSalesMan => res.json(newSalesMan))
                // eslint-disable-next-line no-console
                .catch(err => console.log(err))

        })
})


// @route  DELETE  api/salesmen/:id
// @desc   Delete salesman
// @access Private 
router.delete('/:id', passport.authenticate('jwt', { session: false}), (req, res) => {

    Salesman.findOne({ _id: req.params.id })
        .then(salesMan => {
            salesMan.remove()
                .then(() => res.json({ success: true }))
                // eslint-disable-next-line no-console
                .catch(err => console.log(err))

        })
})


module.exports = router