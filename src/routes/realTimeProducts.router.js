import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
    res.render('realTimeProducts',{ products: [] });
});

export default router;
