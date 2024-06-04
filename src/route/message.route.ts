import express from 'express';
import { userMessage } from '../controller/message/message.controller';


const router = express.Router();


router.route('/user/messages').get(userMessage)


export default router