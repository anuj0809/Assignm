const contactValidator = require('../middleware/validator/contacts')
const contctService = require('../services/contacts/contacts')
const {ERROR_PHONE_NUMBER_EMAIL_MISSING} = require('../utils/errors')

class ContactController {
    async linkUserPurchase(req, res) {
        const { error, value } = contactValidator.validate(req.body);
        if (error) {
            // Handle validation error
            return res.status(400).json({ error: error.details[0].message });
        }

        const reqBodyKeys = Object.keys(req.body)
        if(!reqBodyKeys.includes('email') && (!reqBodyKeys.includes('phoneNumber'))) {
            return res.status(400).json({ error: ERROR_PHONE_NUMBER_EMAIL_MISSING})
        }

        const email = value.email
        const phoneNumber = value.phoneNumber

        const out = await contctService.userContactLinkService(email, phoneNumber)

        // Handle success case
        return res.status(200).
                set('Content-Type', 'application/json').
                send(out);
    }
}

const contactController = new ContactController()
module.exports = contactController
