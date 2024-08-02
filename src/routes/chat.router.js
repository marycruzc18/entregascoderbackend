import { Router } from 'express';
import { renderChatPage, saveMessage } from '../controllers/messages.controller.js';
import { authenticate } from '../middlewares/authenticate.js';
import { authorize } from '../middlewares/authorize.js';

const router = Router();

router.get('/', renderChatPage);
router.post('/messages', authenticate, authorize(['user']), saveMessage);

export default router;


