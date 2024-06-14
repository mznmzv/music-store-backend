import Release from '../models/Release.js'
import User from '../models/User.js'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import { validationResult } from 'express-validator'

// Add release to user's collection
export const addRelease = async (req, res) => {
    try {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            return res.json({ message: result.errors[0].msg })
        }
        const { title, artist, genres, year, label, format } = req.body
        const user = await User.findById(req.userId)

        if (req.files) {
            let fileName = Date.now().toString() + req.files.cover.name
            const __dirname = dirname(fileURLToPath(import.meta.url))
            req.files.cover.mv(path.join(__dirname, '..', 'uploads', fileName))
            const newRelease = new Release({
                cover: fileName,
                title,
                artist,
                genres,
                year,
                label,
                format,
                username: user.username,
                owner: req.userId,
            })
            await newRelease.save()
            return res.json({
                newRelease,
                message: 'Музыкальный релиз добавлен',
            })
        } else {
            res.json({ message: 'Добавьте обложку' })
        }
    } catch (error) {
        res.json({ message: 'Ошибка при добавлении.' })
    }
}

// Edit release
export const editRelease = async (req, res) => {
    try {
        const editData = req.body
        let { releaseId, ...editInfo } = editData
        if (req.files) {
            let fileName = Date.now().toString() + req.files.cover.name
            editInfo = { ...editInfo, cover: fileName }
            const __dirname = dirname(fileURLToPath(import.meta.url))
            req.files.cover.mv(path.join(__dirname, '..', 'uploads', fileName))
        }
        const editedRelease = await Release.findByIdAndUpdate(
            editData.releaseId,
            { $set: editInfo },
            { new: true }
        )
        return res.json({ message: 'Данные обновлены', editedRelease })
    } catch (error) {
        res.json('Ошибка редактирования')
    }
}

//Delete release
export const deleteRelease = async (req, res) => {
    try {
        const { releaseId } = req.body
        const release = await Release.findByIdAndDelete(releaseId)
        if (!release) return json.message('Релиз не найден')
        return res.json({ release, message: 'Релиз удален из коллекции' })
    } catch (error) {
        return res.json({ message: 'Ошибка при удалении' })
    }
}

//Get user's collection
export const getCollection = async (req, res) => {
    try {
        const userCollection = await Release.find({ owner: req.userId }).sort(
            '-createdAt'
        )
        if (!userCollection) {
            return res.json({ message: 'Релизов нет' })
        }
        return res.json(userCollection)
    } catch (error) {
        res.json({ message: 'Ошибка коллекции' })
    }
}

// Get release by id
export const getReleaseById = async (req, res) => {
    try {
        const release = await Release.find({
            owner: req.userId,
            _id: req.params.id,
        })
        if (!release) {
            return res.json({ message: 'Релиз не найден' })
        }
        return res.json(release)
    } catch (error) {
        res.json({ message: 'Ошибка отдельного релиза' })
    }
}

// Get all releases on the market
export const getProducts = async (req, res) => {
    try {
        const products = await Release.find({
            price: { $ne: '' },
            buyer: '',
        }).sort('-createdAt')
        if (!products)
            return res.json({
                message: 'Релизов нет в продаже. Выставите первым!',
            })
        return res.json(products)
    } catch (error) {
        res.json({ message: 'Ошибка маркета' })
    }
}
