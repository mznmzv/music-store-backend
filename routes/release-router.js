import { Router } from 'express'
import { checkAuth } from '../utils/auth-check.js'
import {
    addRelease,
    deleteRelease,
    editRelease,
} from '../controllers/release-controller.js'
import { getCollection } from '../controllers/release-controller.js'
import { getReleaseById } from '../controllers/release-controller.js'
import { getProducts } from '../controllers/release-controller.js'
import { check } from 'express-validator'

const router = new Router()

// Add release
router.post(
    '/new',
    checkAuth,
    [
        check('title', 'Введите название').notEmpty(),
        check('artist', 'Укажите исполнителя').notEmpty(),
        check('genres', 'Укажите жанры').notEmpty(),
        check('year', 'Укажите год').notEmpty(),
        check('year', 'Год:1900-2024')
            .isNumeric()
            .custom(value => {
                const year = parseInt(value, 10)
                return year >= 1900 && year <= 2024
            }),
        check('label', 'Укажите лейбл').notEmpty(),
        check('format', 'Укажите формат').notEmpty(),
    ],
    addRelease
)

// Edit release
router.post('/edit', checkAuth, editRelease)

// Delete release
router.post('/delete', checkAuth, deleteRelease)

// Get user's collection
router.get('/collection', checkAuth, getCollection)

// Get release by id
router.get('/id', checkAuth, getReleaseById)

// Get all releases on the market
router.get('/market', checkAuth, getProducts)

export default router
