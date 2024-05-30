import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    user: { type: String, required: true }, 
    message: { type: String, required: true } 
});

messageSchema.pre('save', async function (next) {
    try {
        const indexes = await this.collection.getIndexes();
        if (indexes.user_1) {
            await this.collection.dropIndex('user_1');
        }
        next();
    } catch (error) {
        console.error('Error al eliminar el índice:', error.message);
        next(error);
    }
});

export const MessageModel = mongoose.model('Message', messageSchema);
