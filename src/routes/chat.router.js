import { Router } from 'express';
import { renderChatPage, saveMessage } from '../controllers/messages.controller.js';

const router = Router();

router.get('/', renderChatPage);
router.post('/messages', saveMessage);

export default router;


