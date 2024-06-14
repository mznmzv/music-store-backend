import { Router } from 'express'
import { register, login, getMe } from '../controllers/auth-controller.js'
import { checkAuth } from '../utils/auth-check.js'
import { check } from 'express-validator'

const router = new Router()

// Registration
router.post(
    '/register',
    [
        check('username', 'Введите логин').notEmpty(),
        check('username', 'Логин: 4-10 символов').isLength({
            min: 4,
            max: 10,
        }),
        check('password', 'Пароль: 4-10 символов').isLength({
            min: 4,
            max: 10,
        }),
        check('tel', 'Телефон: 11 цифр')
            .isNumeric()
            .isLength({ min: 11, max: 11 }),
        check('adress', 'Введите адрес').notEmpty(),
    ],
    register
)
// Login
router.post('/login', login)
// Get me
router.get('/me', checkAuth, getMe)

export default router
