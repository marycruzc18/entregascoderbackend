import { MessageModel } from './models/messages.model.js';

class MessageDao {
    async saveMessage(message) {
        try {
            const newMessage = new MessageModel(message);
            return await newMessage.save();
        } catch (error) {
            console.error('Error al guardar el mensaje:', error.message);
            throw error;
        }
    }

    async getAll() {
        try {
            return await MessageModel.find();
        } catch (error) {
            console.error('Error al obtener los mensajes:', error.message);
            throw error;
        }
    }
}

export default MessageDao;
