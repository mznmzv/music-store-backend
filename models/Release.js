import mongoose from 'mongoose'

const ReleaseSchema = new mongoose.Schema(
    {
        cover: {
            type: String,
            default: '',
        },
        title: {
            type: String,
            required: true,
        },
        artist: {
            type: String,
            required: true,
        },
        genres: {
            type: String,
            required: true,
        },
        year: {
            type: String,
            required: true,
        },
        label: { type: String, required: true },
        format: { type: String, required: true },
        username: String,
        price: { type: String, default: '' },
        buyer: { type: String, default: '' },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    { timestamps: true }
)

export default mongoose.model('Release', ReleaseSchema)
