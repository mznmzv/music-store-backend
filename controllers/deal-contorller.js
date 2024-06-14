import Deal from '../models/Deal.js'
import Release from '../models/Release.js'
import { validationResult } from 'express-validator'

export const createSellDeal = async (req, res) => {
    try {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            return res.json({ message: result.errors[0].msg })
        }
        const {
            idSeller,
            idProduct,
            price,
            sellerTel,
            sellerAdress,
            seller,
            buyer,
        } = req.body
        const newDeal = new Deal({
            seller,
            buyer,
            idSeller,
            idProduct,
            price,
            sellerTel,
            sellerAdress,
        })
        const release = await Release.findByIdAndUpdate(
            idProduct,
            { $set: { price: price } },
            { new: true }
        )
        await newDeal.save()
        return res.json({
            newDeal,
            message: 'Релиз выставлен на продажу',
        })
    } catch (error) {
        res.json({ message: 'Ошибка при выставлении товара на продажу' })
    }
}
export const createBuyDeal = async (req, res) => {
    try {
        const { idBuyer, buyer, buyerTel, buyerAdress, idProduct } = req.body
        const deal = await Deal.findOneAndUpdate(
            { idProduct: idProduct },
            {
                $set: {
                    idBuyer: idBuyer,
                    buyer: buyer,
                    buyerTel: buyerTel,
                    buyerAdress: buyerAdress,
                },
            },
            { new: true }
        )
        const release = await Release.findByIdAndUpdate(
            idProduct,
            { $set: { buyer: buyer } },
            { new: true }
        )
        if (!deal) return res.json({ message: 'Сделка не найдена' })
        return res.json({ message: 'Заказ сформирован', deal })
    } catch (error) {
        res.json({ message: 'Ошибка при покупке' })
    }
}

export const deleteDeal = async (req, res) => {
    try {
        const { releaseId } = req.body
        const deal = await Deal.findOneAndDelete({ idProduct: releaseId })
        const release = await Release.findByIdAndUpdate(releaseId, {
            $set: {
                price: '',
            },
        })
        if (!deal) return json.message('Сделка не найдена')
        return res.json({ message: 'Объявление о продаже удалено ', deal })
    } catch (error) {
        res.json({ message: 'Ошибка снятия с продажи' })
    }
}

export const getUserDeals = async (req, res) => {
    try {
        const { userId } = req
        const deals = await Deal.find({
            $or: [{ idBuyer: userId }, { idSeller: userId }],
            buyer: { $ne: '' },
        }).sort('-createdAt')
        return res.json(deals)
    } catch (error) {
        res.json('Ошибка при получении сделок')
    }
}
