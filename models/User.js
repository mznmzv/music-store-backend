import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    tel: {
        type: String,
        required: true,
    },
    adress: {
        type: String,
        required: true,
    },
})

export default mongoose.model('User', UserSchema)
