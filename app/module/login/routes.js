
import express from 'express';
import { generate_admin, index, logout, store_data } from './controller.js';
const loginRouter = express.Router();

loginRouter.get('/', index);
loginRouter.post("/submit", store_data);
loginRouter.post("/logout", logout);
loginRouter.get("/generateuser", generate_admin);

export default loginRouter;