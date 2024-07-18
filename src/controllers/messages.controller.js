import MessageDao from "../dao/mongodb/messages.dao.js";

const messageDao = new MessageDao();

export const renderChatPage  = (req, res) => {
    res.render('chat');
};


export const saveMessage = async (req, res) => {
    try{
        const {user, message} = req.body;
        await messageDao.saveMessage({user,message});
        res.status(201).send('Mensaje guardado');
    } catch (error) {
        res.status(500).send('Error al guardar el mensaje');
    }
};