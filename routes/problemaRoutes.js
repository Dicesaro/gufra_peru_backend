import express from 'express'
import {
  getProblemas,
  getProblema,
  addProblema,
  editProblema,
  removeProblema,
} from '../controllers/problemaController.js'

const router = express.Router()

router.get('/', getProblemas)
router.get('/:id', getProblema)
router.post('/', addProblema)
router.put('/:id', editProblema)
router.delete('/:id', removeProblema)

export default router
