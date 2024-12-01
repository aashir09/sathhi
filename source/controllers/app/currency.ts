import { NextFunction, Request, Response } from 'express';
import logging from "../../config/logging";
import config from "../../config/config";
import header from "../../middleware/apiHeader";
import { ResultSuccess } from '../../classes/response/resultsuccess';
import { ResultError } from '../../classes/response/resulterror';

const NAMESPACE = 'Payment Gateways';

const getDefaultCurrency = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logging.info(NAMESPACE, 'Getting Payment Gateways');
        let requiredFields = [''];
        let validationResult = header.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            // let authorizationResult = await header.validateAuthorization(req, res, next);
            // if (authorizationResult.statusCode == 200) {
                let sql = `SELECT c.* FROM currencies c WHERE c.isDefault = 1`;
                let result = await header.query(sql);
                console.log(result)
                if (result && result.length >= 0) {
                    let successResult = new ResultSuccess(200, true, 'Get Default Currency', result[0], result.length,'');
                    return res.status(200).send(successResult);
                } else {
                    let errorResult = new ResultError(400, true, "currency.getDefaultCurrency() Error", new Error('Error While Updating Data'), '');
                    next(errorResult);
                }
            // } else {
            //     let errorResult = new ResultError(401, true, "Unauthorized request", new Error(authorizationResult.message), '');
            //     next(errorResult);
            // }
        } else {
            let errorResult = new ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
            next(errorResult);
        }
    } catch (error: any) {
        let errorResult = new ResultError(500, true, 'currency.getDefaultCurrency() Exception', error, '');
        next(errorResult);
    }
}

export default { getDefaultCurrency };