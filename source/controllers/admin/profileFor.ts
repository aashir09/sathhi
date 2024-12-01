import { NextFunction, Request, Response } from 'express';
import logging from "../../config/logging";
import config from "../../config/config";
import header from "../../middleware/apiHeader";
import { ResultSuccess } from '../../classes/response/resultsuccess';
import { ResultError } from '../../classes/response/resulterror';

const NAMESPACE = 'Profile For';

const getProfileFor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logging.info(NAMESPACE, 'Getting Document Type');
        let authorizationResult = await header.validateAuthorization(req, res, next);
        if (authorizationResult.statusCode == 200) {
            let startIndex = req.body.startIndex ? req.body.startIndex : (req.body.startIndex === 0 ? 0 : null);
            let fetchRecord = req.body.fetchRecord ? req.body.fetchRecord : null;
            let countSql = "SELECT COUNT(*) as totalCount FROM profilefor";
            if (req.body.name) {
                if (!countSql.includes(` WHERE `)) {
                    countSql += ` WHERE `;
                } else {
                    countSql += ` AND `;
                }
                countSql += ` name LIKE '%` + req.body.name + `%' `;
            }
            if (req.body.isActive == true || req.body.isActive == false) {
                if (!countSql.includes(` WHERE `)) {
                    countSql += ` WHERE `;
                } else {
                    countSql += ` AND `;
                }
                countSql += ` isActive=` + req.body.isActive;
            }
            let countResult = await header.query(countSql);
            let sql = `SELECT * FROM profilefor WHERE isDelete = 0 `;
            if (req.body.name) {
                if (!sql.includes(` WHERE `)) {
                    sql += ` WHERE `;
                } else {
                    sql += ` AND `;
                }
                sql += ` name LIKE '%` + req.body.name + `%' `;
            }
            if (req.body.isActive == true || req.body.isActive == false) {
                if (!sql.includes(` WHERE `)) {
                    sql += ` WHERE `;
                } else {
                    sql += ` AND `;
                }
                sql += ` isActive=` + req.body.isActive;
            }
            sql += ` ORDER BY id DESC `;
            if (startIndex != null && fetchRecord != null) {
                sql += " LIMIT " + fetchRecord + " OFFSET " + startIndex + "";
            }
            let result = await header.query(sql);
            if (result) {
                let successResult = new ResultSuccess(200, true, 'Get Profile For Successfully', result, countResult[0].totalCount, authorizationResult.token);
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
        let errorResult = new ResultError(500, true, 'profileFor.getProfileFor() Exception', error, '');
        next(errorResult);
    }
};

const insertUpdateProfileFor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logging.info(NAMESPACE, 'Inserting Profile For');
        let requiredFields = ['name'];
        let validationResult = header.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = await header.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                req.body.gender = req.body.gender ? req.body.gender : null;
                let currentUser = authorizationResult.currentUser
                let userId = currentUser.id
                let checkSql = `SELECT * FROM profilefor WHERE name = '` + req.body.name + `'`;
                if (req.body.id) {
                    checkSql += ' AND id != ' + req.body.id;
                }
                let checkResult = await header.query(checkSql);
                if (checkResult && checkResult.length > 0) {
                    let errorResult = new ResultError(203, true, "", new Error("Profile For Already Exist"), '');
                    next(errorResult);
                }
                else {
                    if (req.body.id) {
                        let sql = `UPDATE profilefor SET name = '` + req.body.name + `', gender = ` + (req.body.gender ? "'" + req.body.gender + "'" : null) + ` where id = ` + req.body.id + ``;
                        let result = await header.query(sql);
                        if (result && result.affectedRows > 0) {
                            let successResult = new ResultSuccess(200, true, 'Update Profile For', result, 1, authorizationResult.token);
                            return res.status(200).send(successResult);
                        } else {
                            let errorResult = new ResultError(400, true, "profileFor.insertUpdateProfileFor() Error", new Error('Error While Updating Data'), '');
                            next(errorResult);
                        }
                    } else {
                        let sql = `INSERT INTO profilefor (name, gender, createdBy, modifiedBy) 
                                   VALUES ('` + req.body.name + `', ` + (req.body.gender ? "'" + req.body.gender + "'" : null) + ` ,` + userId + `,` + userId + ` )`
                        let result = await header.query(sql);
                        if (result && result.affectedRows > 0) {
                            let successResult = new ResultSuccess(200, true, 'Insert Profile For', result, 1, authorizationResult.token);
                            return res.status(200).send(successResult);
                        } else {
                            let errorResult = new ResultError(400, true, "profileFor.insertUpdateProfileFor() Error", new Error('Error While Updating Data'), '');
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
        let errorResult = new ResultError(500, true, 'documenttype.insertUpdateDocumentTypes() Exception', error, '');
        next(errorResult);
    }
};

const activeInactiveProfileFor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logging.info(NAMESPACE, 'Active Inactive Profile For');
        let requiredFields = ['id'];
        let validationResult = header.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = await header.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let sql = `UPDATE profilefor set isActive = !isActive WHERE id = ` + req.body.id + ``;
                let result = await header.query(sql);
                if (result && result.affectedRows > 0) {
                    let successResult = new ResultSuccess(200, true, 'Change Profile For Status', result, 1, authorizationResult.token);
                    return res.status(200).send(successResult);
                }
                else {
                    let errorResult = new ResultError(400, true, "profileFor.insertUpdateProfileFor() Error", new Error('Error While Change Profile For Status'), '');
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
        let errorResult = new ResultError(500, true, 'documentType.activeIanctiveDocumentTypes() Exception', error, '');
        next(errorResult);
    }
};

export default { getProfileFor, activeInactiveProfileFor, insertUpdateProfileFor }