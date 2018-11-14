const express = require('express')
const router = express.Router()
const passport = require('passport')

// Load Input Validation
const validateSalesInput =  require('../../validation/sales')

// Load Sales Model
const Sales = require('../../models/Sales')


// @route  GET api/sales
// @desc   Get all sales
// @access Public
router.get('/', (req, res) => {
    Sales.find()
        .then(sales => res.json(sales))
        .catch(() => res.status(400).json({nosalesfound: 'No sales found'}))
})

// @route  GET api/sales/:id
// @desc   Get sales by id
// @access Public
router.get('/:id', (req, res) => {
    Sales.findById(req.params.id)
        .then(sales => res.json(sales))
        .catch(()=> res.status(400).json({nosalesfound: 'No sales found with that ID'}))
})


// @route  POST  api/sales
// @desc   Add sales
// @access Private 
router.post('/', passport.authenticate('jwt', { session: false}), (req, res) => {
    const { errors, isValid } = validateSalesInput(req.body)

    if (!isValid) {
        return res.status(400).json(errors)
    }

    Sales.findOne({ salesId: req.body.salesId })
        .then(sales => {
            if(sales) {
                errors.name = 'Sales Id already exists'
                return res.status(400).json(errors)
            } else {
                const newSales = new Sales({
                    level: req.body.level,
                    commission: req.body.commission
                })

                newSales.save()
                    .then(sales => res.json(sales))
                    // eslint-disable-next-line no-console
                    .catch(err => console.log(err))

            }
        })
})

// @route  PUT  api/sales/:id
// @desc   Edit sales
// @access Private 
router.put('/:id', passport.authenticate('jwt', { session: false}), (req, res) => {
    const { errors, isValid } = validateSalesInput(req.body)

    if (!isValid) {
        return res.status(400).json(errors)
    }

    Sales.findOne({ _id: req.params.id })
        .then(sales => {
            sales.level = req.body.level,
            sales.commission = req.body.commission

            sales.save()
                .then(newSales => res.json(newSales))
                // eslint-disable-next-line no-console
                .catch(err => console.log(err))

        })
})


// @route  DELETE  api/sales/:id
// @desc   Delete sales
// @access Private 
router.delete('/:id', passport.authenticate('jwt', { session: false}), (req, res) => {

    Sales.findOne({ _id: req.params.id })
        .then(sales => {
            sales.remove()
                .then(() => res.json({ success: true }))
                // eslint-disable-next-line no-console
                .catch(err => console.log(err))

        })
})


module.exports = router