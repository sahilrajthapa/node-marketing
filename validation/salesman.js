const Validator = require('validator')
const isEmpty = require('./is-empty')

module.exports = function validateRegisterInput(data) {
    let errors = {}
    
    data.salesManId = !isEmpty(data.salesManId) ? data.salesManId : ''
    data.name = !isEmpty(data.name) ? data.name : ''
    data.phone = !isEmpty(data.phone) ? data.phone : ''
    data.address = !isEmpty(data.address) ? data.address : ''
    
    if(!Validator.isLength(data.salesManId, { min: 4, max: 30})) {
        errors.name = 'Salesman Id must be between 4 and 30 characters'
    }
    
    if(Validator.isEmpty(data.salesManId)) {
        errors.name = 'Salesman Id field is required'
    }

    if(!Validator.isLength(data.name, { min: 2, max: 30})) {
        errors.name = 'Name must be between 2 and 30 characters'
    }

    if(Validator.isEmpty(data.name)) {
        errors.name = 'Name field is required'
    }

    if(!Validator.isMobilePhone(data.phone)) {
        errors.phone = 'Phone field must be a mobile number'
    }

    if(Validator.isEmpty(data.phone)) {
        errors.password = 'Phone field is required'
    }

    if(Validator.isEmpty(data.address)) {
        errors.address = 'Address field is required'
    }
   
    return {
        errors,
        isValid: isEmpty(errors)
    }
}