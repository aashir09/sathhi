import { NextFunction, Request, Response, query } from 'express';
import logging from "../../config/logging";
import config from "../../config/config";
import header from "../../middleware/apiHeader";
import { ResultSuccess } from '../../classes/response/resultsuccess';
import { ResultError } from '../../classes/response/resulterror';

const NAMESPACE = 'Currencies';

const getCurrencies = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logging.info(NAMESPACE, 'Getting Currencies');
        let authorizationResult = await header.validateAuthorization(req, res, next);
        if (authorizationResult.statusCode == 200) {
            let startIndex = req.body.startIndex ? req.body.startIndex : (req.body.startIndex === 0 ? 0 : null);
            let fetchRecord = req.body.fetchRecord ? req.body.fetchRecord : null;
            let countSql = "SELECT COUNT(c.id) as totalCount  FROM currencies c ";
            if (req.body.isDefaultCurrencyPaymentGateway) {
                let sql = `SELECT * FROM currencies WHERE isDefault = 1 AND isDelete = 0`;
                let result = await header.query(sql);
                if (result) {
                    let currencyId = result[0].id;
                    // let sql2 = `SELECT * from currencypaymentgateway where currencyId = ` + currencyId;
                    // let result2 = await header.query(sql);
                    for (let i = 0; i < result.length; i++) {
                        let paymentGateWaySql = `SELECT cpg.id,cpg.paymentGatewayId,pg.name as paymentGateway FROM currencypaymentgateway cpg INNER JOIN paymentgateway pg ON cpg.paymentGatewayId = pg.id  WHERE cpg.currencyId =` + result[i].id;
                        let paymentGatewayResult = await header.query(paymentGateWaySql);
                        result[i].paymentGateways = paymentGatewayResult;
                    }
                   
                      
                        let successResult = new ResultSuccess(200, true, 'Get Payment Gateway Successfully', result, 1, authorizationResult.token);
                        return res.status(200).send(successResult);
                    
                } else {
                        let errorResult = new ResultError(400, true, 'Data Not Available', new Error('Data Not Available'), '');
                        next(errorResult);
                    }
            }
            else {
                if (req.body.searchString) {
                    if (!countSql.includes(` WHERE `)) {
                        countSql += ` WHERE `;
                    } else {
                        countSql += ` AND `;
                    }
                    countSql += ` (LOWER(c.name) LIKE '%` + req.body.searchString.toString().toLowerCase() + `%' OR LOWER(c.code) LIKE '%` + req.body.searchString.toString().toLowerCase() + `%') `;
                }
                let countResult = await header.query(countSql);
                let sql = `SELECT c.* FROM currencies c WHERE c.isDelete = 0 `;
                if (req.body.searchString) {
                    if (!sql.includes(` WHERE `)) {
                        sql += ` WHERE `;
                    } else {
                        sql += ` AND `;
                    }
                    sql += ` (LOWER(c.name) LIKE '%` + req.body.searchString.toString().toLowerCase() + `%' OR LOWER(c.code) LIKE '%` + req.body.searchString.toString().toLowerCase() + `%') `;
                }
                sql += ` ORDER BY c.id DESC `;
                if (startIndex != null && fetchRecord != null) {
                    sql += " LIMIT " + fetchRecord + " OFFSET " + startIndex + "";
                }
                let result = await header.query(sql);
                if (result) {
                    for (let i = 0; i < result.length; i++) {
                        let paymentGateWaySql = `SELECT cpg.id,cpg.paymentGatewayId,pg.name as paymentGateway FROM currencypaymentgateway cpg INNER JOIN paymentgateway pg ON cpg.paymentGatewayId = pg.id  WHERE cpg.currencyId =` + result[i].id;
                        let paymentGatewayResult = await header.query(paymentGateWaySql);
                        result[i].paymentGateways = paymentGatewayResult;
                    }
                    let successResult = new ResultSuccess(200, true, 'Get Payment Gateway Successfully', result, countResult[0].totalCount, authorizationResult.token);
                    return res.status(200).send(successResult);
                } else {
                    let errorResult = new ResultError(400, true, 'Data Not Available', new Error('Data Not Available'), '');
                    next(errorResult);
                }
            }
        } else {
            let errorResult = new ResultError(401, true, "Unauthorized request", new Error(authorizationResult.message), '');
            next(errorResult);
        }
    } catch (error: any) {
        let errorResult = new ResultError(500, true, 'currencies.getCurrencies() Exception', error, '');
        next(errorResult);
    }
};

const activeInactiveCurrency = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logging.info(NAMESPACE, 'Active/Inactive Currency');
        let authorizationResult = await header.validateAuthorization(req, res, next);
        if (authorizationResult.statusCode == 200) {
            let sql = ` UPDATE currencypaymentgateway SET isActive = ` + req.body.isActive + ` WHERE currencyId = ` + req.body.id;
            let result = await header.query(sql);
            if (result) {
                let currencySql = await header.query(`UPDATE currencies SET isActive = ` + req.body.isActive + ` WHERE id = ` + req.body.id)
                let successResult = new ResultSuccess(200, true, 'Active / Inactive Currency Successfully', result, 1, authorizationResult.token);
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
        let errorResult = new ResultError(500, true, 'currencies.getCurrencies() Exception', error, '');
        next(errorResult);
    }
};

const setDefaultCurrency = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logging.info(NAMESPACE, 'Set Default Currency');
        let authorizationResult = await header.validateAuthorization(req, res, next);
        if (authorizationResult.statusCode == 200) {
            let sql = ` UPDATE currencies SET isDefault = !isDefault WHERE isDefault = 1`;
            let result = await header.query(sql);
            if (result) {
                let currencySql = await header.query(`UPDATE currencies SET isDefault = ` + req.body.isDefault + ` WHERE id = ` + req.body.id)
                let successResult = new ResultSuccess(200, true, 'Set Default Currency Successfully', result, 1, authorizationResult.token);
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
        let errorResult = new ResultError(500, true, 'currencies.setDefaultCurrency() Exception', error, '');
        next(errorResult);
    }
};
export default { getCurrencies, activeInactiveCurrency, setDefaultCurrency }