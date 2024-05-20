import path from 'path';
import _dirname from '../../helper/__dirname.function.js';
import crypto from 'crypto';
import moment from 'moment';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongodb from 'mongodb';

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
    var account_login = await w.find().toArray(function (err, docs) {});

    const x = request.db_conn.db.collection("user_info");
    var user_info = await x.find().toArray(function (err, docs) {});
    // return response.send(account_login);
    // console.log(await w.find());

    const authHeader = request.headers['authorization'];
    // return response.render(path.join(_dirname(import.meta.url), 'views/form.ejs'), { uid:"Ruslan" });
    return response.render(path.join(_dirname(import.meta.url), 'views/form.ejs'), { uid:"Ruslan", account_login, authHeader, user_info, moment});
}



/**
 * @param {{ db_conn: import("knex").Knex }} req
 * @param {import('express').Response} res 
 * @returns {import('express').Response}
 */
export async function store_data(req, res) {
    try {
        const {prmmode, prmid, prmaccountId, prmuserName, prmpassword, prmuserId} = req.body || {};
        // const { x_uid } = req.headers;
        console.log(req.headers);
        console.log(req.query);
        // const q = req.db_conn.from("MsFacilityCondition");
        req.db_conn.open();
        const account_login = req.db_conn.db.collection("account_login");
        var result;
        let code = 403, message = 'Forbidden';
        if(prmmode == 'ADD'){
            const salt = 10;
            const hashedPassword = await bcrypt.hash(prmpassword, salt);
            result = await account_login.insertOne({
                accountId : prmaccountId,
                userName : prmuserName,
                password : hashedPassword,
                userId : prmuserId
            });
            code = 200;
            message = 'Success Insert';
        }else if(prmmode == 'EDIT'){
            const ObjectId = mongodb.ObjectId;
            result = await account_login.updateOne({_id : new ObjectId(prmid)}, {$set: { 
                accountId : prmaccountId,
                userName : prmuserName,
                password : prmpassword,
                userId : prmuserId
             }}, { upsert: true });
            code = 200;
            message = 'Success Update';
        }else if(prmmode == 'DEL'){
            const ObjectId = mongodb.ObjectId;
            result = await account_login.deleteOne({_id : new ObjectId(prmid)});
            code = 200;
            message = 'Success Delete';
        }
        // return res.json({ "data": result, prmststus: 1 });
        return res.success({ result, code, message});
    } catch (error) {
        console.log("ERROR STORE invoice TMP", error);
        return res.badreq(error);
    }
}


