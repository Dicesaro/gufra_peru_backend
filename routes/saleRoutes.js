import express from 'express'
import {
  getSales,
  getSale,
  addSale,
  removeSale,
} from '../controllers/saleController.js'

const router = express.Router()

router.get('/', getSales)
router.get('/:id', getSale)
router.post('/', addSale)
router.delete('/:id', removeSale)

export default router
