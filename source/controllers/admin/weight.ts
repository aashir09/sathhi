import { NextFunction, Request, Response } from 'express';
import logging from "../../config/logging";
import config from "../../config/config";
import header from "../../middleware/apiHeader";
import { ResultSuccess } from '../../classes/response/resultsuccess';
import { ResultError } from '../../classes/response/resulterror';

// const mysql = require('mysql');
// const util = require('util');

// let connection = mysql.createConnection({
//     host: config.mysql.host,
//     user: config.mysql.user,
//     password: config.mysql.password,
//     database: config.mysql.database
// });

// const query = util.promisify(connection.query).bind(connection);

const NAMESPACE = 'Weight';

const getWeight = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logging.info(NAMESPACE, 'Getting Weight');
        let authorizationResult = await header.validateAuthorization(req, res, next);
        if (authorizationResult.statusCode == 200) {
            let startIndex = req.body.startIndex ? req.body.startIndex : (req.body.startIndex === 0 ? 0 : null);
            let fetchRecord = req.body.fetchRecord ? req.body.fetchRecord : null;
            let countSql = "SELECT COUNT(*) as totalCount  FROM weight";
            if (req.body.name) {
                if (!countSql.includes(` WHERE `)) {
                    countSql += ` WHERE `;
                } else {
                    countSql += ` AND `;
                }
                countSql += ` name LIKE '%` + req.body.name + `%' `;
            }
            let countResult = await header.query(countSql);
            let sql = `SELECT * FROM weight WHERE isDelete = 0 `;
            if (req.body.name) {
                if (!sql.includes(` WHERE `)) {
                    sql += ` WHERE `;
                } else {
                    sql += ` AND `;
                }
                sql += ` name LIKE '%` + req.body.name + `%' `;
            }
            sql += ` ORDER BY id DESC `;
            if (startIndex != null && fetchRecord != null) {
                sql += " LIMIT " + fetchRecord + " OFFSET " + startIndex + "";
            }
            let result = await header.query(sql);
            if (result) {
                let successResult = new ResultSuccess(200, true, 'Get Weight Successfully', result, countResult[0].totalCount, authorizationResult.token);
                return res.status(200).send(successResult);
            } else {
                let errorResult = new ResultError(400, true, 'Data Not Available', new Error('Data Not Available'), '');
                next(errorResult);
            }
        } else {
            let errorResult = new ResultError(401, true, "Unauthorized request", new Error(authorizationResult.message), '');
            next(errorResult);
        }
    } catch (error: any) {
        let errorResult = new ResultError(500, true, 'weight.getWeight() Exception', error, '');
        next(errorResult);
    }
};

const insertUpdateWeight = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logging.info(NAMESPACE, 'Inserting Weight');
        let requiredFields = ['name'];
        let validationResult = header.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = await header.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let currentUser = authorizationResult.currentUser;
                let userId = currentUser.id;
                req.body.name = (req.body.name).trim();
                let checkSql = `SELECT * FROM Weight WHERE name = ` + req.body.name + ``;
                if (req.body.id) {
                    checkSql += ' AND id != ' + req.body.id;
                }
                let checkResult = await header.query(checkSql);
                if (checkResult && checkResult.length > 0) {
                    let errorResult = new ResultError(203, true, "", new Error("Name Already Exist"), '');
                    next(errorResult);
                } else {
                    if (req.body.id) {
                        let sql = `UPDATE weight SET name = ` + req.body.name + ` where id = ` + req.body.id + ``;
                        let result = await header.query(sql);
                        if (result && result.affectedRows > 0) {
                            let successResult = new ResultSuccess(200, true, 'Update Weight', result, 1, authorizationResult.token);
                            return res.status(200).send(successResult);
                        }
                        else {
                            let errorResult = new ResultError(400, true, "weight.insertUpdateWeight() Error", new Error('Error While Updating Data'), '');
                            next(errorResult);
                        }
                    } else {
                        let sql = `INSERT INTO weight(name, createdBy, modifiedBy) VALUES(` + req.body.name + `,` + userId + `,` + userId + `)`;
                        let result = await header.query(sql);
                        if (result && result.affectedRows > 0) {
                            let successResult = new ResultSuccess(200, true, 'Insert Height', result, 1, authorizationResult.token);
                            return res.status(200).send(successResult);
                        }
                        else {
                            let errorResult = new ResultError(400, true, "weight.insertUpdateWeight() Error", new Error('Error While Inserting Data'), '');
                            next(errorResult);
                        }
                    }
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
        let errorResult = new ResultError(500, true, 'weight.insertUpdateWeight() Exception', error, '');
        next(errorResult);
    }
};

const activeInactiveWeight = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logging.info(NAMESPACE, 'Active Inactive Weight');
        let requiredFields = ['id'];
        let validationResult = header.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = await header.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let sql = `UPDATE weight set isActive = !isActive WHERE id = ` + req.body.id + ``;
                let result = await header.query(sql);
                if (result && result.affectedRows > 0) {
                    let successResult = new ResultSuccess(200, true, 'Change Weight Status', result, 1, authorizationResult.token);
                    return res.status(200).send(successResult);
                }
                else {
                    let errorResult = new ResultError(400, true, "weight.insertUpdateWeight() Error", new Error('Error While Change Weight Status'), '');
                    next(errorResult);
                }
            }
            else {
                let errorResult = new ResultError(401, true, "Unauthorized request", new Error(authorizationResult.message), '');
                next(errorResult);
            }
        } else {
            let errorResult = new ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
            next(errorResult);
        }
    } catch (error: any) {
        let errorResult = new ResultError(500, true, 'Weight.activeIanctiveWeight() Exception', error, '');
        next(errorResult);
    }
};

export default { getWeight, insertUpdateWeight, activeInactiveWeight }