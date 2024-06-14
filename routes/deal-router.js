import { Router } from 'express'
import { checkAuth } from '../utils/auth-check.js'
import {
    createSellDeal,
    createBuyDeal,
    getUserDeals,
    deleteDeal,
} from '../controllers/deal-contorller.js'
import { check } from 'express-validator'

const router = new Router()

// Add product to the market
router.post(
    '/new',
    [check('price', 'Введите число').isNumeric()],
    checkAuth,
    createSellDeal
)

// Buy product
router.post('/buy', checkAuth, createBuyDeal)
// Buy product
router.post('/delete', checkAuth, deleteDeal)

// Get user's deals
router.get('/', checkAuth, getUserDeals)

export default router
