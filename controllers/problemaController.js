import {
  getAllProblemas,
  getProblemaById,
  createProblema,
  updateProblema,
  deleteProblema,
} from '../models/problemaModel.js'

// Obtener todos los problemas
export const getProblemas = async (req, res) => {
  try {
    const problemas = await getAllProblemas()
    res.json(problemas)
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error al obtener problemas', error })
  }
}

// Obtener un problema por ID
export const getProblema = async (req, res) => {
  try {
    const { id } = req.params
    const problema = await getProblemaById(id)
    if (!problema) {
      return res
        .status(404)
        .json({ message: 'Problema no encontrado' })
    }
    res.json(problema)
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error al obtener problema', error })
  }
}

// Crear un nuevo problema
export const addProblema = async (req, res) => {
  try {
    const newProblema = await createProblema(req.body)
    res.status(201).json(newProblema)
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error al agregar problema', error })
  }
}

// Actualizar un problema
export const editProblema = async (req, res) => {
  try {
    const { id } = req.params
    const updatedProblema = await updateProblema(id, req.body)
    res.json(updatedProblema)
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error al actualizar problema', error })
  }
}

// Eliminar un problema
export const removeProblema = async (req, res) => {
  try {
    const { id } = req.params
    await deleteProblema(id)
    res.json({ message: 'Problema eliminado correctamente' })
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error al eliminar problema', error })
  }
}
