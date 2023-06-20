function getEmails(bulkResponse){
    return bulkResponse.map(x => x.email)
}

function getPhoneNumbers(bulkResponse) {
    return bulkResponse.map(x => x.phoneNumber)
}

function getSecondaryContactIds(bulkResponse, id) {
    return bulkResponse.filter(x => x.id!= id).map(x => x.id)
}


function contactsResponseGenerator(bulkResponse) {
    const bulkSortedResponse = bulkResponse.map(x => x.dataValues).sort((a, b) => a.linkPrecedence.localeCompare(b.linkPrecedence));
    const primary_key = bulkSortedResponse[0].id

    return JSON.stringify({contact : {
        primaryContatctId : primary_key, 
        emails: getEmails(bulkSortedResponse), // first element being email of primary contact 
        phoneNumbers: getPhoneNumbers(bulkSortedResponse), // first element being phoneNumber of primary contact
        secondaryContactIds: getSecondaryContactIds(bulkSortedResponse, primary_key), // Array of all Contact IDs that are "secondary" to the primary contact
    }})
}

module.exports = contactsResponseGenerator