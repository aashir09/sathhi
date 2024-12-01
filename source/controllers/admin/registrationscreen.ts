import { NextFunction, Request, Response, query } from 'express';
import logging from "../../config/logging";
import config from "../../config/config";
import header from "../../middleware/apiHeader";
import { ResultSuccess } from '../../classes/response/resultsuccess';
import { ResultError } from '../../classes/response/resulterror';
const fs = require('fs');

// const mysql = require('mysql');
// const util = require('util');

// let connection = mysql.createConnection({
//     host: config.mysql.host,
//     user: config.mysql.user,
//     password: config.mysql.password,
//     database: config.mysql.database
// });

// const query = util.promisify(connection.query).bind(connection);

const NAMESPACE = 'Registration Sceen';

const getRegistrationScreen = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logging.info(NAMESPACE, 'Getting Registration screen');
        let authorizationResult = await header.validateAuthorization(req, res, next);
        if (authorizationResult.statusCode == 200) {
            let startIndex = req.body.startIndex ? req.body.startIndex : (req.body.startIndex === 0 ? 0 : null);
            let fetchRecord = req.body.fetchRecord ? req.body.fetchRecord : null;
            let countSql = "SELECT COUNT(p.id) as totalCount  FROM registrationscreens p WHERE isDelete = 0";
            if (req.body.searchString) {
                if (!countSql.includes(` WHERE `)) {
                    countSql += ` WHERE `;
                } else {
                    countSql += ` AND `;
                }
                countSql += ` (LOWER(p.name) LIKE '%` + req.body.searchString.toString().toLowerCase() + `%'  `;
            }
            let countResult = await header.query(countSql);
            let sql = `SELECT p.* FROM registrationscreens p WHERE p.isDelete = 0 `;
            if (req.body.searchString) {
                if (!sql.includes(` WHERE `)) {
                    sql += ` WHERE `;
                } else {
                    sql += ` AND `;
                }
                sql += ` (LOWER(p.name) LIKE '%` + req.body.searchString.toString().toLowerCase() + `%'  `;
            }
            // sql += ` ORDER BY p.id DESC `;
            if (startIndex != null && fetchRecord != null) {
                sql += " LIMIT " + fetchRecord + " OFFSET " + startIndex + "";
            }
            let result = await header.query(sql);
            if (result && result.length > 0) {
                let successResult = new ResultSuccess(200, true, 'Get Registration Screen Successfully', result, countResult[0].totalCount, authorizationResult.token);
                return res.status(200).send(successResult);
            } else {
                let errorResult = new ResultError(400, true, "registrationScreen.getRegistrationScreen() Error", new Error('Error Getting Data'), '');
                next(errorResult);
            }
        } else {
            let errorResult = new ResultError(401, true, "Unauthorized request", new Error(authorizationResult.message), '');
            next(errorResult);
        }
    } catch (error: any) {
        let errorResult = new ResultError(500, true, 'registrationScreen.getRegistrationScreen() Exception', error, '');
        next(errorResult);
    }
};

const toggleDisableScreen = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logging.info(NAMESPACE, 'Toggle Disable Screen');
        let requiredFields = ['id'];
        let validationResult = header.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = await header.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let sql = `UPDATE registrationscreens SET isDisable = !isDisable WHERE id = ` + req.body.id + ``;
                let result = await header.query(sql);
                if (result && result.affectedRows > 0) {
                    let successResult = new ResultSuccess(200, true, 'Toggle Disable Screen successfully', result, result.length, '');
                    return res.status(200).send(successResult);
                } else {
                    let errorResult = new ResultError(400, true, "registrationScreen.toggleDisableScreen() Error", new Error('Error While Updating Data'), '');
                    next(errorResult);
                }
            } else {
                let errorResult = new ResultError(401, true, "Unauthorized request", new Error(authorizationResult.message), '');
                next(errorResult);
            }
        } else {
            let errorResult = new ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
            next(errorResult);
        }
    } catch (error: any) {
        let errorResult = new ResultError(500, true, 'registrationScreen.toggleDisableScreen() Exception', error, '');
        next(errorResult);
    }
};

const toggleSkipScreen = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logging.info(NAMESPACE, 'Toggle Skip Screen');
        let requiredFields = ['id'];
        let validationResult = header.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = await header.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let sql = `UPDATE registrationscreens SET isSkippable = !isSkippable WHERE id = ` + req.body.id + ``;
                let result = await header.query(sql);
                if (result && result.affectedRows > 0) {
                    let successResult = new ResultSuccess(200, true, 'Toggle Skip Screen successfully', result, result.length, '');
                    return res.status(200).send(successResult);
                } else {
                    let errorResult = new ResultError(400, true, "registrationScreen.toggleSkipScreen() Error", new Error('Error While Updating Data'), '');
                    next(errorResult);
                }
            } else {
                let errorResult = new ResultError(401, true, "Unauthorized request", new Error(authorizationResult.message), '');
                next(errorResult);
            }
        } else {
            let errorResult = new ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
            next(errorResult);
        }
    } catch (error: any) {
        let errorResult = new ResultError(500, true, 'registrationScreen.toggleSkipScreen() Exception', error, '');
        next(errorResult);
    }
};

export default { getRegistrationScreen, toggleDisableScreen, toggleSkipScreen }