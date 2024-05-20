
import express from 'express';
import { index, store_data } from './controller.js';
const accountloginRouter = express.Router();

accountloginRouter.get('/', index);
accountloginRouter.post("/submit", store_data);

export default accountloginRouter;