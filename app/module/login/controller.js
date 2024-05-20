import path from 'path';
import _dirname from '../../helper/__dirname.function.js';
import crypto from 'crypto';
import moment from 'moment';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
// import MongoConnection from '../../config/mongo_connection.js';
/**
 * @param {{ db_conn: import("knex").Knex }} request
 * @param {import('express').Response} response 
 * @returns {import('express').Response}
 */
export async function index(request, response) {
    // await MongoConnection.open();
    request.db_conn.open();
    console.log("mongo connected");
    const w = request.db_conn.db.collection("account_login");
    console.log(await w.findOne({userName : 'PGRI'}));
    // return response.render(path.join(_dirname(import.meta.url), 'views/form.ejs'), { uid:"Ruslan" });
    return response.render(path.join(_dirname(import.meta.url), 'views/test.ejs'), { uid:"Ruslan" });
}



/**
 * @param {{ db_conn: import("knex").Knex }} req
 * @param {import('express').Response} res 
 * @returns {import('express').Response}
 */
export async function store_data(req, res) {
    try {
        const {prmusername, prmpassword} = req.body || {};
        // const { x_uid } = req.headers;
        console.log(req.headers);
        console.log(req.query);
        // const q = req.db_conn.from("MsFacilityCondition");
        req.db_conn.open();
        const account_login = req.db_conn.db.collection("account_login");
        var result = await account_login.findOne({userName : prmusername});
        let code = 406, message = 'User Not Found';
        console.log(result);
        if(result){
            if(!(await bcrypt.compare(prmpassword, result.password))){
            // if(result.userName == 'PGRI'){
                code = 406;
                message = 'Invalid Password for User '+ prmusername;
                result = [];
                return res.success({ result, code, message});

            }
            const lastLogin =  moment().format('YYYY/MM/DD HH:mm');
            delete result['password'];
            const accessToken = jwt.sign({prmusername, lastLogin}, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '60s'
                // expiresIn: '20s'
            });
            const refreshToken = jwt.sign({prmusername, lastLogin}, process.env.REFRESH_TOKEN_SECRET, {
                expiresIn: '1d'
            });
            
            var upd = await account_login.updateOne({_id : result._id},{$set: { session_id: refreshToken, 'lastLogin': lastLogin }}, { upsert: true });
            result.session_id = accessToken;
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000
            });
            code = 200;
            message = 'Login Success user ' + prmusername;
            
        }
        console.log("prm" + prmusername);        

        // return res.json({ "data": result, prmststus: 1 });
        return res.success({ result, code, message});
    } catch (error) {
        console.log("ERROR STORE invoice TMP", error);
        return res.badreq(error);
    }
}

export async function logout(req, res) {
    try {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return res.sendStatus(204);
        req.db_conn.open();
        // console.log("mongo connected");
        const account_login = req.db_conn.db.collection("account_login");
        const w = await account_login.findOne({session_id : refreshToken});
        if(!w) return res.sendStatus(204);

        const prmusername = w.userName;
            var upd = await account_login.updateOne({userName : prmusername},{$set: { session_id: null }}, { upsert: true });
            res.clearCookie('refreshToken');
            
            // code = 200;
            // message = 'Logout Success user ' + prmusername;
            
        console.log("prm" + prmusername);        

        // return res.json({ "data": result, prmststus: 1 });
        // return res.success({ result, code, message});
        return res.sendStatus(200);
    } catch (error) {
        console.log("ERROR STORE invoice TMP", error);
        return res.badreq(error);
    }
}


export async function generate_admin(req, res) {
    try {
        const {prmusername, prmpassword} = req.body || {};
        // const { x_uid } = req.headers;
        console.log(req.headers);
        console.log(req.query);
        // const q = req.db_conn.from("MsFacilityCondition");
        req.db_conn.open();

        const salt = 10;
        const hashedPassword = await bcrypt.hash('123', salt);
        const account_login = req.db_conn.db.collection("account_login");
        var result = await account_login.insertOne({
            accountId : '001',
            userName : 'admin',
            password : hashedPassword
        });
        let code, message;
        if(result){
            code = 200;
            message = 'generate admin success, UserName : admin, pssword : 123';
            
        }
        // console.log("prm" + prmusername);        

        // return res.json({ "data": result, prmststus: 1 });
        return res.success({ result, code, message});
    } catch (error) {
        console.log("ERROR STORE invoice TMP", error);
        return res.badreq(error);
    }
}