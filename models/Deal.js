import mongoose from 'mongoose'

export const DealSchema = new mongoose.Schema({
    idSeller: { type: String, required: true },
    idBuyer: { type: String, default: '' },
    seller: { type: String, required: true },
    buyer: { type: String, default: '' },
    idProduct: { type: String, required: true },
    sellerTel: { type: String, required: true },
    sellerAdress: { type: String, required: true },
    buyerTel: { type: String, default: '' },
    buyerAdress: { type: String, default: '' },
    price: { type: String, required: true },
})

export default mongoose.model('Deal', DealSchema)
