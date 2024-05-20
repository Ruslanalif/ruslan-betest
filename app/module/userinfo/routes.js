
import express from 'express';
import { index, store_data } from './controller.js';
const loginRouter = express.Router();

loginRouter.get('/', index);
loginRouter.post("/submit", store_data);

export default loginRouter;