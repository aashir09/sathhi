import { NextFunction, Request, Response } from 'express';
import logging from "../../config/logging";
import config from "../../config/config";
import header from "../../middleware/apiHeader";
import { ResultSuccess } from '../../classes/response/resultsuccess';
import { ResultError } from '../../classes/response/resulterror';

const NAMESPACE = 'Payment Gateways';

const getPaymentgateways = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logging.info(NAMESPACE, 'Getting Payment Gateways');
        let requiredFields = [''];
        let validationResult = header.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = await header.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let sql = `SELECT pg.* FROM paymentgateway pg INNER JOIN currencypaymentgateway cpg ON pg.id = cpg.paymentGatewayId  INNER JOIN currencies c ON cpg.currencyId = c.id WHERE c.isDefault = 1 AND pg.isActive = 1 AND pg.useInWallet = 1`;
                // if (req.body.isWallet != null || req.body.isWallet == true || req.body.isWallet == false) {
                //     sql += " AND pg.useInWallet = " + req.body.isWallet;
                // }
                let result = await header.query(sql);
                console.log(result)
                if (result && result.length >= 0) {
                    let data = [];
                    for (let i = 0; i < result.length; i++) {
                        let obj = {
                            id: result[i].id,
                            name: result[i].name,
                            jsonData: JSON.parse(result[i].jsonData),
                            useInWallet: result[i].useInWallet,
                            useInCheckout: result[i].useInCheckout,
                            useInAndroid: result[i].useInAndroid,
                            useInApple: result[i].useInApple,
                            isActive: result[i].isActive,
                            isDelete: result[i].isDelete,
                            createdDate: result[i].createdDate,
                            modifiedDate: result[i].modifiedDate,
                            createdBy: result[i].createdBy,
                            modifiedBy: result[i].modifiedBy,
                        }

                        data.push(obj)
                    }
                    let successResult = new ResultSuccess(200, true, 'Get Payment Gateways', data, data.length, '');
                    return res.status(200).send(successResult);
                } else {
                    let errorResult = new ResultError(400, true, "paymentGateways.getPaymentgateways() Error", new Error('Error While Updating Data'), '');
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
        let errorResult = new ResultError(500, true, 'paymentGateways.getPaymentgateways() Exception', error, '');
        next(errorResult);
    }
}

const getPaymentgatewaysForPackage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logging.info(NAMESPACE, 'Getting Payment Gateways');
        let requiredFields = [''];
        // let validationResult = header.validateRequiredFields(req, requiredFields);
        // if (validationResult && validationResult.statusCode == 200) {
        //     let authorizationResult = await header.validateAuthorization(req, res, next);
        //     if (authorizationResult.statusCode == 200) {
        let sql = `SELECT pg.* FROM paymentgateway pg INNER JOIN currencypaymentgateway cpg ON pg.id = cpg.paymentGatewayId  INNER JOIN currencies c ON cpg.currencyId = c.id WHERE c.isDefault = 1 AND pg.isActive = 1`;
        // if (req.body.isWallet != null || req.body.isWallet == true || req.body.isWallet == false) {
        //     sql += " AND pg.useInWallet = " + req.body.isWallet;
        // }
        if (req.body != null && req.body.appPlatform == "iosApp") {
            sql += ` AND useInApple = 1`
        }
        else if (req.body != null && req.body.appPlatform == "androidApp") {
            sql += ` AND useInAndroid = 1`
        }
        let result = await header.query(sql);
        console.log(result)
        if (result && result.length >= 0) {
            let data = [];
            for (let i = 0; i < result.length; i++) {
                let obj = {
                    id: result[i].id,
                    name: result[i].name,
                    jsonData: JSON.parse(result[i].jsonData),
                    useInWallet: result[i].useInWallet,
                    useInCheckout: result[i].useInCheckout,
                    useInAndroid: result[i].useInAndroid,
                    useInApple: result[i].useInApple,
                    isActive: result[i].isActive,
                    isDelete: result[i].isDelete,
                    createdDate: result[i].createdDate,
                    modifiedDate: result[i].modifiedDate,
                    createdBy: result[i].createdBy,
                    modifiedBy: result[i].modifiedBy,
                }

                data.push(obj)
            }
            let successResult = new ResultSuccess(200, true, 'Get Payment Gateways For Package', data, data.length, '');
            return res.status(200).send(successResult);
        } else {
            let errorResult = new ResultError(400, true, "paymentGateways.getPaymentgatewaysForPackage() Error", new Error('Error While Updating Data'), '');
            next(errorResult);
        }
        // } else {
        //     let errorResult = new ResultError(401, true, "Unauthorized request", new Error(authorizationResult.message), '');
        //     next(errorResult);
        // }
        // } else {
        //     let errorResult = new ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
        //     next(errorResult);
        // }
    } catch (error: any) {
        let errorResult = new ResultError(500, true, 'paymentGateways.getPaymentgatewaysForPackage() Exception', error, '');
        next(errorResult);
    }
}

const generateRazorPayOrderId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logging.info(NAMESPACE, 'Save PaymentGateway');
        let requiredFields = ['amount', 'currency'];
        let validationResult = header.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = await header.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let result;
                let param = {
                    "amount": req.body.amount,
                    "currency": req.body.currency,
                    "notes": req.body.notes
                };
                const Razorpay = require('razorpay');
                let keyJson = await header.query(`SELECT jsonData FROM paymentgateway WHERE name = 'Razorpay'`)
                keyJson = JSON.parse(keyJson[0].jsonData);

                const razorpay = new Razorpay({
                    key_id: keyJson.apiKey,
                    key_secret: keyJson.secretKey,
                });

                result = await razorpay.orders.create(param);

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

const stripePayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logging.info(NAMESPACE, 'Save PaymentGateway');
        let requiredFields = ['amount', 'currency'];
        let validationResult = header.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = await header.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let result;
                let currentUser = authorizationResult.currentUser;
                let userId = currentUser.id;

                let userData = await header.query(`SELECT u.firstName,u.stripeCustomerId,u.email, a.addressLine1,a.cityName, a.stateName,a.countryName ,a.pincode from users u 
                    LEFT JOIN userpersonaldetail upd ON upd.userId = u.id
                    LEFT JOIN addresses a ON upd.addressId = a.id WHERE u.id = ` + userId + ``)
                let stripeCustomerId;
                let keyJson = await header.query(`SELECT jsonData FROM paymentgateway WHERE name = 'Stripe'`);
                keyJson = JSON.parse(keyJson[0].jsonData);
                let secretKey = keyJson.secretKey;

                const Stripe = require('stripe');
                const stripe = Stripe(secretKey);
                let customer;

                if (!userData[0].stripeCustomerId) {
                    customer = await stripe.customers.create({
                        name: currentUser.name,
                        address: {
                            line1: userData[0].addressLine1 ?? "",
                            postal_code: userData[0].postalCode ?? "",
                            city: userData[0].cityName ?? "",
                            state: userData[0].stateName ?? "",
                            country: userData[0].countryName ?? "",
                        }
                    })
                    if (customer.id) {
                        let updateId = await header.query(`UPDATE users set stripeCustomerId = '` + customer.id + `' WHERE id = ` + userId + ``)
                    }
                }
                stripeCustomerId = userData[0].stripeCustomerId ? userData[0].stripeCustomerId : customer.id;

                if (stripeCustomerId) {
                    const paymentIntent = await stripe.paymentIntents.create({
                        amount: req.body.amount,
                        currency: req.body.currency,
                        receipt_email: userData[0].email,
                        customer: stripeCustomerId,
                        description: 'matrimony',
                    });

                    console.log(paymentIntent)
                    let successResult = new ResultSuccess(200, true, 'Update Payment Gateway Successfully', paymentIntent, 1, authorizationResult.token);
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

export default { getPaymentgateways, getPaymentgatewaysForPackage, generateRazorPayOrderId, stripePayment };