const Sequelize = require('sequelize');
const Contacts = require('../models/contacts');
const response = require('../utils/common')

class ContactDao {
    constructor() { }

    async getOr(filter) {
        return await Contacts.findAll({
            where: {
                [Sequelize.Op.or]: filter,
            },
        }).then((result) => {
            response["data"] = result
            return response
        }).catch((error) => {
            response["error"] = error
            return response
        });
    }

    async getAnd(filter) {
        return await Contacts.findAll({
            where: {
                [Sequelize.Op.and]: filter,
            },
        }).then((result) => {
            response["data"] = result
            return response
        }).catch((error) => {
            response["error"] = error
            return response
        });
    }

    async getAndOr(andFilter, orFiler) {
        return await Contacts.findAll({
            where: {
                [Sequelize.Op.or]: orFiler,
                [Sequelize.Op.and]: andFilter,
            },
        }).then((result) => {
            response["data"] = result
            return response
        }).catch((error) => {
            response["error"] = error
            return response
        });
    }

    async create(params) {
        return await Contacts.create({
            ...params
        }).then((result) => {
            response["data"] = result
            return response
        }).catch((error) => {
            response["error"] = error
            return response
        });
    }

    async update(filter, updatedData) {
        return await Contacts.update(updatedData, {where : filter}).then((result) => {
            response["data"] = result
            return response
        }).catch((error) => {
            response["error"] = error
            return response
        });
    }

}

const contactDao = new ContactDao()
module.exports = contactDao



// [
//     { phoneNumber: filter.phoneOrEmail },
//     { email: filter.phoneOrEmail },
//   ],