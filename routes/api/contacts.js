const express = require('express')
const router = express.Router()

const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact
} = require('../../services/contactService')

const {
  addValidationContact,
  updateValidationContact,
  shemaUpdateContactFavoriteStatus
} = require('../../src/middlewares/validatorContact')

router.get('/', async (req, res, next) => {
  try {
    const contacts = await listContacts()
    res.status(200).json(contacts)
  } catch (e) {
    next(e)
  }
})

router.get('/:contactId', async (req, res, next) => {
  try {
    const contact = await getContactById(req.params.contactId)
    if (contact) {
      return res.json({ status: 'success', code: '200', data: { contact } })
    }
    return res.json({ status: 'error', code: '404', message: 'Not found' })
  } catch (e) {
    next(e)
  }
})

router.post('/', addValidationContact, async (req, res, next) => {
  const newContact = await addContact(req.body)
  return res.status('201').json({ status: 'success', code: '200', data: { newContact } })
})

router.delete('/:contactId', async (req, res, next) => {
  try {
    const contact = await getContactById(req.params.contactId)
    if (contact) {
      await removeContact(req.params.contactId)
      return res.json({ status: 'success', code: '200', message: 'contact deleted' })
    }
    return res.json({ status: 'error', code: '404', message: 'Not found' })
  } catch (e) {
    next(e)
  }
})

router.put('/:contactId', updateValidationContact, async (req, res, next) => {
  try {
    const contact = await updateContact(req.params.contactId, req.body)
    if (contact) {
      return res.json({ status: 'success', code: '200', data: { contact } })
    }
    return res.json({ status: 'error', code: '404', message: 'Not found' })
  } catch (e) {
    next(e)
  }
})

router.patch('/:contactId', shemaUpdateContactFavoriteStatus, async (req, res, next) => {
  try {
    const contact = await updateStatusContact(req.params.contactId, req.body)
    if (contact) {
      return res.json({
        status: 'success',
        code: 201,
        data: { contact },
      })
    } else {
      return res.status(404).json({
        status: 'error',
        code: 404,
        data: 'Not found',
      })
    }
  } catch (err) {
    next(err)
  }
}
)

module.exports = router
