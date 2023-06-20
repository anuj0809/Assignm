const contactDao = require('../../dao/contact')
const { response } = require('../../utils/common')
const contactsResponseGenerator = require('./conv')
const { contactVariable } = require('../../utils/variable')
const e = require('express')

class ContactService {
    constructor() { }

    async getUserContactsHistory(id) {
        const orFilter = [
            { id: id },
            { linkedId: id },
        ]

        return await contactDao.getOr(orFilter)
    }

    async createPrimaryContact(email, phoneNumber) {
        return await contactDao.create({
            phoneNumber: phoneNumber,
            email: email,
            linkPrecedence: contactVariable.LINKPRECEDENCE_PRIMARY
        })
    }

    async createSecondaryContact(email, phoneNumber, id) {
        return await contactDao.create({
            phoneNumber: phoneNumber,
            email: email,
            linkedId: id,
            linkPrecedence: contactVariable.LINKPRECEDENCE_SECONDARY
        })
    }

    async updatePrimaryContact(target_primary_id, primary_id) {
        const filter = {
            id: target_primary_id
        }

        const updates = {
            linkedId: primary_id,
            linkPrecedence: contactVariable.LINKPRECEDENCE_SECONDARY
        }

        return await contactDao.update(filter, updates)
    }

    async getContactHistoryById(id) {
        const out = await this.getUserContactsHistory(id)
        if (out.error) {
            response['error'] = out.error
            return response
        }

        return contactsResponseGenerator(out.data)
    }

    getPrimaryId(contactData) {
        let element = contactData[0]
        if (element.linkPrecedence == contactVariable.LINKPRECEDENCE_PRIMARY) {
            return element.id
        }

        return element.linkedId
    }

    async handlemultipleContactData(email, phoneNumber, contacts, primaryId) {
        const primaryContacts = contacts.filter(x => x.linkPrecedence == contactVariable.LINKPRECEDENCE_PRIMARY).map(x => x)
        if (primaryContacts.length == 0 || primaryContacts.length == 1) {
            await this.createSecondaryContact(email, phoneNumber, primaryId)
        } else {
            // When #primaryContacts > 1
            // Get the latest One and update it to the link it with oldest one 
            const sortByUpdatedAt = (a, b) => {
                const dateA = new Date(a.updatedAt);
                const dateB = new Date(b.updatedAt);

                return dateA - dateB; // Ascending order, use `dateB - dateA` for descending order
            };

            const sortedPrimaryContacts = primaryContacts.sort(sortByUpdatedAt)

            let primaryContactToBeUpdated = sortedPrimaryContacts[sortedPrimaryContacts.length - 1]
            let primaryContactSelected = sortedPrimaryContacts[0]
            await this.updatePrimaryContact(primaryContactToBeUpdated.id, primaryContactSelected.id)

            primaryId = primaryContactSelected.id
        }

        return primaryId
    }

    async userContactLinkService(email, phoneNumber) {

        let filter = []
        if(email){
            filter.push({ "email": email })
        }
        if(phoneNumber){
            filter.push({"phoneNumber": phoneNumber})
        }

        // If same entry exist, then return back the response 
        const contactDataValidaiton = await contactDao.getAnd(filter)
        if (contactDataValidaiton.error) {
            response['error'] = contactDataValidaiton.error
            return response
        }

        if (contactDataValidaiton.data.length > 0) {
            const primaryKey = this.getPrimaryId(contactDataValidaiton.data)
            return await this.getContactHistoryById(primaryKey)
        }

        // else, create a new entry
        const contactData = await contactDao.getOr(filter)
        if (contactData.error) {
            response['error'] = contactData.error
            return response
        }

        // create or modify data
        let primaryId = 0
        if (contactData.data.length == 0) {
            // Create a new Primary 
            const primaryContact = await this.createPrimaryContact(email, phoneNumber)
            primaryId = primaryContact.data.id
        } else {
            primaryId = this.getPrimaryId(contactData.data)

            // First check if multiple Contact Id 
            if (contactData.data.length > 1) {
                primaryId = await this.handlemultipleContactData(email, phoneNumber, contactData.data, primaryId)
            } else if (contactData.data?.length == 1) {
                await this.createSecondaryContact(email, phoneNumber, primaryId)
            }
        }

        // Generate Final Response
        const out = await this.getUserContactsHistory(primaryId)
        if (out.error) {
            response['error'] = out.error
            return response
        }

        return contactsResponseGenerator(out.data)
    }
}

const contactService = new ContactService()
module.exports = contactService