const { Contact } = require('../db/contactsModel')

const listContacts = async () => {
  return await Contact.find({})
}

const getContactById = async (contactId) => {
  return await Contact.findById(contactId)
}

const removeContact = async (contactId) => {
  return await Contact.findOneAndRemove(contactId)
}

const addContact = async ({ name, email, phone }) => {
  const newContact = new Contact({
    name,
    email,
    phone,
  })
  await newContact.save()
  return newContact
}

const updateContact = async (contactId, body) => {
  const result = await Contact.Model.findByIdAndUpdate(
    contactId,
    ...body,
    { new: true },
  )
  return result
}

const updateStatusContact = async (contactId, newStatus) => {
  const contact = await getContactById(contactId)
  await Contact.findByIdAndUpdate(contactId, {
    $set: (contact.favorite = newStatus),
  })
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact
}
