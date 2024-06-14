import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { validationResult } from 'express-validator'

// Registration
export const register = async (req, res) => {
    try {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            return res.json({ message: result.errors[0].msg })
        }
        const { username, password, tel, adress } = req.body
        const haveUser = await User.findOne({ username })
        if (haveUser) {
            return res.json({
                message: 'Логин занят',
            })
        }

        const hash = bcrypt.hashSync(password, 7)
        const newUser = new User({ username, password: hash, tel, adress })
        await newUser.save()
        return res.json({
            newUser,
            message: 'Регистрация прошла успешно',
        })
    } catch (error) {
        res.json({ message: 'Ошибка при регистрации' })
    }
}

// Login
export const login = async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await User.findOne({ username })
        if (!user) {
            return res.json({ message: 'Неправильный логин или пароль' })
        }

        const validPassword = await bcrypt.compare(password, user.password)

        if (!validPassword) {
            return res.json({ message: 'Неправильный логин или пароль' })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, {
            expiresIn: '2d',
        })
        return res.json({ token, user, message: 'Авторизация прошла успешно' })
    } catch (error) {
        res.json({ message: 'Ошибка авторизации' })
    }
}

// Get me
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId)

        if (!user) {
            return res.json({ message: 'Пользователь не найден' })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, {
            expiresIn: '2d',
        })

        res.json({ user, token })
    } catch (error) {
        res.json({ message: 'Нет доступа' })
    }
}
