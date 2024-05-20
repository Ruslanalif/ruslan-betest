
import express from 'express';
import { index, store_data } from './controller.js';
const userinfoRouter = express.Router();

userinfoRouter.get('/', index);
userinfoRouter.post("/submit", store_data);

export default userinfoRouter;