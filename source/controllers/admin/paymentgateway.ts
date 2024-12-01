import { NextFunction, Request, Response, query } from 'express';
import logging from "../../config/logging";
import config from "../../config/config";
import header from "../../middleware/apiHeader";
import { ResultSuccess } from '../../classes/response/resultsuccess';
import { ResultError } from '../../classes/response/resulterror';

const NAMESPACE = 'Payment Gateways';

const getPaymentGateway = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logging.info(NAMESPACE, 'Getting PaymentGateway');
        let authorizationResult = await header.validateAuthorization(req, res, next);
        if (authorizationResult.statusCode == 200) {
            let startIndex = req.body.startIndex ? req.body.startIndex : (req.body.startIndex === 0 ? 0 : null);
            let fetchRecord = req.body.fetchRecord ? req.body.fetchRecord : null;
            let countSql = "SELECT COUNT(p.id) as totalCount  FROM paymentgateway p ";
            if (req.body.searchString) {
                if (!countSql.includes(` WHERE `)) {
                    countSql += ` WHERE `;
                } else {
                    countSql += ` AND `;
                }
                countSql += ` (LOWER(p.name) LIKE '%` + req.body.searchString.toString().toLowerCase() + `%'  `;
            }
            let countResult = await header.query(countSql);
            let sql = `SELECT p.* FROM paymentgateway p WHERE p.isDelete = 0 `;
            if (req.body.searchString) {
                if (!sql.includes(` WHERE `)) {
                    sql += ` WHERE `;
                } else {
                    sql += ` AND `;
                }
                sql += ` (LOWER(p.name) LIKE '%` + req.body.searchString.toString().toLowerCase() + `%'  `;
            }
            sql += ` ORDER BY p.id DESC `;
            if (startIndex != null && fetchRecord != null) {
                sql += " LIMIT " + fetchRecord + " OFFSET " + startIndex + "";
            }
            let result = await header.query(sql);
            if (result) {
                let successResult = new ResultSuccess(200, true, 'Get Payment Gateway Successfully', result, countResult[0].totalCount, authorizationResult.token);
                return res.status(200).send(successResult);
            }
            else {
                let errorResult = new ResultError(400, true, 'Data Not Available', new Error('Data Not Available'), '');
                next(errorResult);
            }
            // if (result) {
            //     for (let i = 0; i < result.length; i++) {
            //         let paymentGateWaySql = `SELECT cpg.id,cpg.paymentGatewayId,pg.name as paymentGateway FROM currencypaymentgateway cpg INNER JOIN paymentgateway pg ON cpg.paymentGatewayId = pg.id  WHERE cpg.currencyId =` + result[i].id;
            //         let paymentGatewayResult = await header.query(paymentGateWaySql);
            //         result[i].paymentGateways = paymentGatewayResult;
            //     }
            //     let successResult = new ResultSuccess(200, true, 'Get Payment Gateway Successfully', result, countResult[0].totalCount, authorizationResult.token);
            //     return res.status(200).send(successResult);
            // } else {
            //     let errorResult = new ResultError(400, true, 'Data Not Available', new Error('Data Not Available'), '');
            //     next(errorResult);
            // }
        } else {
            let errorResult = new ResultError(401, true, "Unauthorized request", new Error(authorizationResult.message), '');
            next(errorResult);
        }
    } catch (error: any) {
        let errorResult = new ResultError(500, true, 'paymentGateway.getPaymentGateway() Exception', error, '');
        next(errorResult);
    }
};

const activeInactivePaymentGateway = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logging.info(NAMESPACE, 'ActiveInactive PaymentGateway');
        let requiredFields = ['flag', 'isActive'];
        let validationResult = header.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = await header.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let sql = ` UPDATE paymentgateway SET `;
                if (req.body.flag == 'useInWallet')
                    sql += ` useInWallet =` + req.body.isActive;
                if (req.body.flag == 'useInCheckout')
                    sql += ` useInCheckout =` + req.body.isActive;
                if (req.body.flag == 'useInAndroid')
                    sql += ` useInAndroid =` + req.body.isActive;
                if (req.body.flag == 'useInApple')
                    sql += ` useInApple =` + req.body.isActive;
                if (req.body.flag == 'isActive')
                    sql += ` isActive =` + req.body.isActive;
                sql += ` WHERE id = ` + req.body.id;
                let result = await header.query(sql);
                if (result) {
                    let successResult = new ResultSuccess(200, true, 'ActiveInactive Payment Gateway Successfully', result, 1, authorizationResult.token);
                    return res.status(200).send(successResult);
                }
                else {
                    let errorResult = new ResultError(400, true, 'Data Not Available', new Error('Data Not Available'), '');
                    next(errorResult);
                }
            } else {
                let errorResult = new ResultError(401, true, "Unauthorized request", new Error(authorizationResult.message), '');
                next(errorResult);
            }
        } else {
            await header.rollback();
            let errorResult = new ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
            next(errorResult);
        }
    } catch (error: any) {
        let errorResult = new ResultError(500, true, 'paymentGateway.activeInactivePaymentGateway() Exception', error, '');
        next(errorResult);
    }
};

const updatePaymentGateway = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logging.info(NAMESPACE, 'Save PaymentGateway');
        let requiredFields = ['id'];
        let validationResult = header.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = await header.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let result;
                if (req.body.description) {
                    let sql = `UPDATE paymentgateway SET description ='` + req.body.description + `' WHERE id =` + req.body.id;
                    result = await header.query(sql);
                } else {
                    let sql = `UPDATE paymentgateway SET jsonData ='` + req.body.jsonData + `' WHERE id =` + req.body.id;
                    result = await header.query(sql);
                }

                if (result) {
                    let successResult = new ResultSuccess(200, true, 'Update Payment Gateway Successfully', result, 1, authorizationResult.token);
                    return res.status(200).send(successResult);
                }
                else {
                    let errorResult = new ResultError(400, true, 'Data Not Available', new Error('Data Not Available'), '');
                    next(errorResult);
                }
            } else {
                let errorResult = new ResultError(401, true, "Unauthorized request", new Error(authorizationResult.message), '');
                next(errorResult);
            }
        } else {
            await header.rollback();
            let errorResult = new ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
            next(errorResult);
        }
    } catch (error: any) {
        let errorResult = new ResultError(500, true, 'paymentGateway.updatePaymentGateway() Exception', error, '');
        next(errorResult);
    }
};


export default { getPaymentGateway, activeInactivePaymentGateway, updatePaymentGateway }