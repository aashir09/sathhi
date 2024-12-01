import { NextFunction, query, request, Request, Response } from 'express';
import logging from "../../config/logging";
import config from "../../config/config";
import header from "../../middleware/apiHeader";
import { ResultSuccess } from '../../classes/response/resultsuccess';
import { ResultError } from '../../classes/response/resulterror';

const NAMESPACE = 'User Wallet';

const insertUserWallet = async (req: Request, res: Response, next: NextFunction) => {
    await header.beginTransaction();
    try {
        logging.info(NAMESPACE, 'Inserting User Wallet');
        let requiredFields = ['paymentMode', 'paymentRefrence', 'amount', 'paymentStatus'];
        let validationResult = header.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = await header.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let currentUser = authorizationResult.currentUser;
                let sql = `INSERT INTO payment (paymentMode,paymentRefrence,amount,userId,paymentStatus,signature,orderId,createdBy, modifiedBy) 
                VALUES('`+ req.body.paymentMode + `','` + req.body.paymentRefrence + `',` + req.body.amount + `,` + currentUser.id + `,'` + req.body.paymentStatus + `'
                ,` + (req.body.signature ? `'` + req.body.signature + `'` : null) + `,` + (req.body.orderId ? `'` + req.body.orderId + `'` : null) + `,` + currentUser.id + `,` + currentUser.id + `)`
                let result = await header.query(sql);
                if (result && result.insertId > 0) {
                    let flagError = false;
                    let paymentId = result.insertId;
                    let checkUserWalletSql = `SELECT * FROM userwallets WHERE userId = ` + currentUser.id;
                    let checkUserWalletResult = await header.query(checkUserWalletSql);
                    if (checkUserWalletResult && checkUserWalletResult.length > 0) {
                        let lAmt = 0;
                        if (req.body.paymentStatus == "Success")
                            lAmt = checkUserWalletResult[0].amount + req.body.amount;
                        else
                            lAmt = checkUserWalletResult[0].amount;

                        let userWalletSql = `UPDATE userwallets SET amount = ` + lAmt + `, modifiedBy = ` + currentUser.id + `, modifiedDate = CURRENT_TIMESTAMP() WHERE id = ` + checkUserWalletResult[0].id;
                        let result = await header.query(userWalletSql);
                        if (result && result.affectedRows >= 0) {
                            let userWalletId = checkUserWalletResult[0].id;
                            let userWalletHistorySql = `INSERT INTO userwallethistory(userWalletId, amount, isCredit, transactionDate, remark, paymentId, createdBy, modifiedBy) 
                            VALUES(`+ userWalletId + `,` + req.body.amount + `, 1, ?, 'Wallet amount added in account', ` + paymentId + `,` + currentUser.id + `,` + currentUser.id + ` )`;
                            result = await header.query(userWalletHistorySql, [new Date()]);
                            if (result && result.insertId > 0) {
                                await header.commit();

                                let getSql = `SELECT * FROM userwallets WHERE userId = ` + currentUser.id;
                                let getResult = await header.query(getSql);
                                let successResult = new ResultSuccess(200, true, 'Insert User Wallet Detail', getResult, 1, authorizationResult.token);
                                return res.status(200).send(successResult);
                            } else {
                                flagError = true;
                                await header.rollback();
                                let errorResult = new ResultError(400, true, "users.updateUserProfileDetail() Error", new Error('Error While Inserting Data'), '');
                                next(errorResult);
                            }
                        } else {
                            flagError = true;
                            await header.rollback();
                            let errorResult = new ResultError(400, true, "users.updateUserProfileDetail() Error", new Error('Error While Inserting Data'), '');
                            next(errorResult);
                        }

                    } else {
                        let lAmt = 0;
                        if (req.body.paymentStatus == "Success")
                            lAmt = req.body.amount;
                        else
                            lAmt = 0;

                        let userWalletSql = `INSERT INTO userwallets(userId, amount, createdBy, modifiedBy) VALUES(` + currentUser.id + `,` + lAmt + `,` + currentUser.id + `,` + currentUser.id + `)`;
                        result = await header.query(userWalletSql);
                        if (result && result.insertId > 0) {
                            let userWalletId = result.insertId;
                            let userWalletHistorySql = `INSERT INTO userwallethistory(userWalletId, amount, isCredit, transactionDate, remark, paymentId, createdBy, modifiedBy) 
                                                    VALUES(`+ userWalletId + `,` + req.body.amount + `, 1, ?, 'Wallet amount added in account', ` + paymentId + `,` + currentUser.id + `,` + currentUser.id + ` )`;
                            result = await header.query(userWalletHistorySql, [new Date()]);
                            if (result && result.insertId > 0) {
                                await header.commit();

                                let getSql = `SELECT * FROM userwallets WHERE userId = ` + currentUser.id;
                                let getResult = await header.query(getSql);
                                let successResult = new ResultSuccess(200, true, 'Insert User Personal Detail', getResult[0], 1, authorizationResult.token);
                                return res.status(200).send(successResult);
                            } else {
                                flagError = true;
                                await header.rollback();
                                let errorResult = new ResultError(400, true, "users.updateUserProfileDetail() Error", new Error('Error While Inserting Data'), '');
                                next(errorResult);
                            }
                        } else {
                            flagError = true;
                            await header.rollback();
                            let errorResult = new ResultError(400, true, "users.updateUserProfileDetail() Error", new Error('Error While Inserting Data'), '');
                            next(errorResult);
                        }
                    }
                } else {
                    await header.rollback();
                    let errorResult = new ResultError(400, true, "UserWallet.insertUserWallet() Error", new Error('Error While Inserting Data'), '');
                    next(errorResult);
                }
            } else {
                await header.rollback();
                let errorResult = new ResultError(401, true, "Unauthorized request", new Error(authorizationResult.message), '');
                next(errorResult);
            }
        } else {
            await header.rollback();
            let errorResult = new ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
            next(errorResult);
        }
    } catch (error: any) {
        await header.rollback();
        let errorResult = new ResultError(500, true, 'UserWallet.insertUserWallet() Exception', error, '');
        next(errorResult);
    }
}

const getUserWalletHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logging.info(NAMESPACE, 'Getting User Wallet');
        let requiredFields = ['isHistory'];
        let validationResult = header.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = await header.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let currentUser = authorizationResult.currentUser;
                let startIndex = req.body.startIndex ? req.body.startIndex : (req.body.startIndex === 0 ? 0 : null);
                let fetchRecord = req.body.fetchRecord ? req.body.fetchRecord : null;
                let countSql = `SELECT COUNT(uwh.id) as totalCount  FROM userwallethistory uwh 
                LEFT JOIN payment p ON uwh.paymentId = p.id 
                LEFT JOIN userwallets uw ON uwh.userWalletId = uw.id  
                WHERE uw.userId = `+ currentUser.id;

                let sql = `SELECT uwh.*, p.paymentMode, p.paymentStatus FROM userwallethistory uwh 
                LEFT JOIN payment p ON uwh.paymentId = p.id 
                LEFT JOIN userwallets uw ON uwh.userWalletId = uw.id  
                WHERE uw.userId = `+ currentUser.id;

                if (req.body.isHistory == true) {
                    countSql += ` AND uwh.isCredit = 1 `;
                    sql += ` AND uwh.isCredit = 1 `;
                } else {
                    countSql += ` AND uwh.isCredit = 0 `;
                    sql += ` AND uwh.isCredit = 0 `;
                }
                sql += ` ORDER BY uwh.createdDate DESC`
                if (startIndex != null && fetchRecord != null) {
                    sql += " LIMIT " + fetchRecord + " OFFSET " + startIndex + "";
                }
                let countResult = await header.query(countSql);
                let result = await header.query(sql);
                let successResult = new ResultSuccess(200, true, 'Get User Wallet History', result, countResult[0].totalCount, authorizationResult.token);
                return res.status(200).send(successResult);
            } else {
                await header.rollback();
                let errorResult = new ResultError(401, true, "Unauthorized request", new Error(authorizationResult.message), '');
                next(errorResult);
            }
        } else {
            await header.rollback();
            let errorResult = new ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
            next(errorResult);
        }
    } catch (error: any) {
        let errorResult = new ResultError(500, true, 'UserWallet.getUserWalletHistory() Exception', error, '');
        next(errorResult);
    }
}

export default {
    insertUserWallet, getUserWalletHistory
}