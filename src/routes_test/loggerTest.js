import express from 'express'
import logger from '../logs/logger.js'

const router = express.Router();

router.get('/', (req,res) =>{
    logger.silly('log silly')
    logger.debug('log debug')
    logger.verbose('log verbose')
    logger.info('log info')
    logger.http('log http')
    logger.warn('log warn')
    logger.error('log error')
    res.send('La prueba de los logs ya fue realizada')

});

export default router;