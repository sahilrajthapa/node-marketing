const Validator = require('validator')
const isEmpty = require('./is-empty')

module.exports = function validateRegisterInput(data) {
    let errors = {}
    
    data.level = !isEmpty(data.level) ? data.level : ''
    data.commission = !isEmpty(data.commission) ? data.commission : ''

    if(Validator.isEmpty(data.level)) {
        errors.level = 'Level field is required'
    }

    if(Validator.isEmpty(data.commission)) {
        errors.commission = 'Commission field is required'
    }
 
    return {
        errors,
        isValid: isEmpty(errors)
    }
}