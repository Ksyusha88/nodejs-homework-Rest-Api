const fs = require('fs/promises')
const path = require('path')
const contactsPath = path.resolve('./model/contacts.json')
console.log(contactsPath)

const { nanoid } = require('nanoid')

const listContacts = async () => {
  try {
    return JSON.parse(await fs.readFile(contactsPath))
  } catch (error) {
    console.log(error.messege)
  }
}

// const listContacts = async () => {
//   try {
//     const contacts = await fs.readFile(contactsPath)
//     return JSON.parse(contacts)
//   } catch (error) {}
// }

const getContactById = async (contactId) => {
  try {
    const data = await fs.readFile(contactsPath)
    const result = JSON.parse(data.toString())
    const receiveContact = result.find(
      ({ id }) => id.toString() === contactId)
    return receiveContact
  } catch (error) {
    console.log(error.messege)
  }
}

const removeContact = async (contactId) => {
  try {
    const data = await fs.readFile(contactsPath)
    const contacts = JSON.parse(data)
    const newContacts = contacts.filter(({ id }) => id.toString() === contactId,
    )
    fs.writeFile(contactsPath, JSON.stringify(newContacts))
  } catch (error) {
    console.log(error.messege)
  }
}

const addContact = async ({ name, email, phone }) => {
  try {
    const data = await fs.readFile(contactsPath)
    const contacts = JSON.parse(data)
    const newContact = {
      id: nanoid(),
      name,
      email,
      phone,
    }

    contacts.push(newContact)

    await fs.writeFile(contactsPath, JSON.stringify([...data, newContact]))

    return newContact
  } catch (error) {
    console.log(error.messege)
  }
}

const updateContact = async (contactId, body) => {
  try {
    const data = await fs.readFile(contactsPath)
    const contacts = JSON.parse(data)

    const receiveContact = contacts.find(
      contact => contact.id.toString() === contactId
    )

    if (!receiveContact) {
      return null
    }

    const changeContact = {
      ...receiveContact,
      ...body,
    }

    const newContact = contacts.map(contact => {
      if (contact.id === contactId) {
        return changeContact
      }
      return contact
    })
    await fs.writeFile(contactsPath, JSON.stringify(newContact, null, 2))

    return changeContact
  } catch (error) {
    console.log(error.messege)
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact
}
