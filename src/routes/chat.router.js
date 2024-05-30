import { Router } from 'express';
import MessageDao from '../dao/mongodb/messages.dao.js';

const router = Router();
const messageDao = new MessageDao();

router.get('/', (req, res) => {
    res.render('chat');
});

router.post('/messages', async (req, res) => {
    try {
        const { user, message } = req.body;
        await messageDao.saveMessage({ user, message });
        res.status(201).send('Mensaje guardado');
    } catch (error) {
        res.status(500).send('Error al guardar el mensaje');
    }
});

export default router;

