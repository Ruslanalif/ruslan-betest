import express from 'express';
import path from 'path';
import _dirname from '../helper/__dirname.function.js';

import loginRouter from '../module/login/routes.js';
import accountloginRouter from '../module/accountlogin/routes.js';
import userinfoRouter from '../module/userinfo/routes.js';
import initResponseMiddleware from '../helper/response,middleware.js';
import bodyParser from 'body-parser';
import multer from 'multer';
import { verifyToken } from '../helper/VerifyToken.js';
import { refreshToken } from '../helper/RefreshToken.js';
import { logout } from '../module/login/controller.js';
import { index } from '../module/userinfo/controller.js';


export default function mainRoutes(app) {
    var router = express.Router({ "caseSensitive": true });
    initResponseMiddleware(app);

    // router.use(morgan('short'));

    // router.get("/update-connection", async function (request, response) {
    //     const result = await updateConnectionList();
    //     return res.json({ result });
    // });

    // router.get("/@/create-hmac", function (req, res) {
    //     const { i } = req.query || {};
    //     if (!i) {
    //         throw new Error("input is empty");
    //     }
    //     return res.json({ result: create_hmac(i) });
    // });

    // router.use(check_access_token); // kebawah ini aksesnya mesti pake akses token

    
    router.use(bodyParser.urlencoded({
        extended: false
    }));
    router.use(multer().any());
    router.use('/login', loginRouter);
    router.use('/frontuserinfo', index);
    // router.use('/userinfo', verifyToken, userinfoRouter);
    router.use('/userinfo', userinfoRouter);
    router.use('/accountlogin', accountloginRouter);
    // router.use('/token', refreshToken);
    router.get('/token', refreshToken);
    router.get('/logout', logout);
    router.use('/out', verifyToken, loginRouter);
    

    app.use('/', router);

    app.use(function (req, res, next) {
        res.status(404);
        // if (req.accepts('json')) {
        //     res.json({ error: 'Route Not found!', url: req.url, base_url: req.baseUrl, original_url: req.originalUrl });
        //     return;
        // }
        // res.type('txt').send(`route ${req.originalUrl} Not found`);
        return res.render(path.join(_dirname(import.meta.url), '../module/404.ejs'), { url: req.url });
    });

};
