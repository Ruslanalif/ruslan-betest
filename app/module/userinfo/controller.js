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
    const w = request.db_conn.db.collection("user_info");
    var user_info = await w.find().toArray(function (err, docs) {});
    // return response.send(user_info);
    // console.log(await w.find());

    const authHeader = request.headers['authorization'];
    // return response.render(path.join(_dirname(import.meta.url), 'views/form.ejs'), { uid:"Ruslan" });
    return response.render(path.join(_dirname(import.meta.url), 'views/form.ejs'), { uid:"Ruslan", user_info, authHeader});
}



/**
 * @param {{ db_conn: import("knex").Knex }} req
 * @param {import('express').Response} res 
 * @returns {import('express').Response}
 */
export async function store_data(req, res) {
    try {
        const {prmmode, prmid, prmuserId, prmfullName, prmaccountNumber, prmemailAddress, prmregistrationNumber} = req.body || {};
        // const { x_uid } = req.headers;
        console.log(req.headers);
        console.log(req.query);
        // const q = req.db_conn.from("MsFacilityCondition");
        req.db_conn.open();
        const user_info = req.db_conn.db.collection("user_info");
        var result;
        let code = 403, message = 'Forbidden';
        if(prmmode == 'ADD'){
            result = await user_info.insertOne({
                userId : prmuserId,
                fullName : prmfullName,
                accountNumber : prmaccountNumber,
                emailAddress : prmemailAddress,
                registrationNumber : prmregistrationNumber
            });
            code = 200;
            message = 'Success Insert';
        }else if(prmmode == 'EDIT'){
            const ObjectId = mongodb.ObjectId;
            result = await user_info.updateOne({_id : new ObjectId(prmid)}, {$set: { 
                userId : prmuserId,
                fullName : prmfullName,
                accountNumber : prmaccountNumber,
                emailAddress : prmemailAddress,
                registrationNumber : prmregistrationNumber
             }}, { upsert: true });
            code = 200;
            message = 'Success Update';
        }else if(prmmode == 'DEL'){
            const ObjectId = mongodb.ObjectId;
            result = await user_info.deleteOne({_id : new ObjectId(prmid)});
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


