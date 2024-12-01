import { NextFunction, Request, Response, query } from 'express';
import logging from "../../config/logging";
import config from "../../config/config";
import header from "../../middleware/apiHeader";
import { ResultSuccess } from '../../classes/response/resultsuccess';
import { ResultError } from '../../classes/response/resulterror';

const NAMESPACE = 'Coupons';

const getCoupons = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logging.info(NAMESPACE, 'Getting Coupons');
        let requiredFields = ['packageId'];
        let validationResult = header.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = await header.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let packageSql = `SELECT c.* FROM packagecoupons pc 
                INNER JOIN coupons c ON pc.couponId = c.id 
                WHERE c.isActive = true AND c.isDelete = false AND pc.packageId = ` + req.body.packageId;
                let packageResult = await header.query(packageSql);
                if (packageResult && packageResult.length > 0) {
                    let validCoupon = true;
                    if (packageResult[0].maxUsage) {
                        //Check With userPAckages
                        let userPackageSql = `SELECT COUNT(id) as totalCount FROM userpackage WHERE couponId = ` + packageResult[0].id;
                        let userPackageResult = await header.query(userPackageSql);
                        if (userPackageResult && userPackageResult.length > 0) {
                            if (userPackageResult[0].totalCount >= packageResult[0].maxUsage) {
                                validCoupon = false;
                                let successResult = new ResultSuccess(200, true, 'Limit maximum usage', [], 1, authorizationResult.token);
                                return res.status(200).send(successResult);
                            }
                        }
                    }
                    if (packageResult[0].userUsage) {
                        //Check With userPAckages
                        let userPackageSql = `SELECT COUNT(id) as totalCount FROM userpackage WHERE userId = ` + authorizationResult.currentUser.id + ` AND couponId = ` + packageResult[0].id;
                        let userPackageResult = await header.query(userPackageSql);
                        if (userPackageResult && userPackageResult.length > 0) {
                            if (userPackageResult[0].totalCount >= packageResult[0].maxUsage) {
                                validCoupon = false;
                                let successResult = new ResultSuccess(200, true, 'You already used this coupon', [], 1, authorizationResult.token);
                                return res.status(200).send(successResult);
                            }
                        }
                    }

                    if (packageResult[0].validFrom || packageResult[0].validTo) {
                        //Check With coupon
                        if (new Date(packageResult[0].validFrom).getTime() <= new Date().getTime()) {
                            if (new Date(packageResult[0].validTo).getTime() >= new Date().getTime()) {

                            } else {
                                validCoupon = false;
                                let successResult = new ResultSuccess(200, true, 'Coupon Expire', [], 1, authorizationResult.token);
                                return res.status(200).send(successResult);
                            }
                        } else {
                            if (new Date(packageResult[0].validTo).getTime() >= new Date().getTime()) {

                            } else {
                                validCoupon = false;
                                let successResult = new ResultSuccess(200, true, 'Coupon Expire', [], 1, authorizationResult.token);
                                return res.status(200).send(successResult);
                            }
                        }
                    }

                    if (validCoupon) {
                        let successResult = new ResultSuccess(200, true, 'Get Coupon Successfully', [packageResult[0]], 1, authorizationResult.token);
                        return res.status(200).send(successResult);
                    }

                } else {
                    let successResult = new ResultSuccess(200, true, 'Coupon Not Available', [], 1, authorizationResult.token);
                    return res.status(200).send(successResult);
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
        let errorResult = new ResultError(500, true, 'coupon.applyCoponCode() Exception', error, '');
        next(errorResult);
    }
}

const applyCouponCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logging.info(NAMESPACE, 'Getting Coupons');
        let requiredFields = ['code', 'packageId'];
        let validationResult = header.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = await header.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let packageSql = `SELECT c.* FROM packagecoupons pc 
                INNER JOIN coupons c ON pc.couponId = c.id 
                WHERE c.code = '` + req.body.code + `' AND c.isActive = true AND c.isDelete = false AND pc.packageId = ` + req.body.packageId;
                let packageResult = await header.query(packageSql);
                if (packageResult && packageResult.length > 0) {
                    let validCoupon = true;
                    if (packageResult[0].maxUsage) {
                        //Check With userPAckages
                        let userPackageSql = `SELECT COUNT(id) as totalCount FROM userpackage WHERE couponId = ` + packageResult[0].id;
                        let userPackageResult = await header.query(userPackageSql);
                        if (userPackageResult && userPackageResult.length > 0) {
                            if (userPackageResult[0].totalCount >= packageResult[0].maxUsage) {
                                validCoupon = false;
                                let successResult = new ResultSuccess(200, true, 'Limit maximum usage', [], 1, authorizationResult.token);
                                return res.status(200).send(successResult);
                            }
                        }
                    }
                    if (packageResult[0].userUsage) {
                        //Check With userPAckages
                        let userPackageSql = `SELECT COUNT(id) as totalCount FROM userpackage WHERE userId = ` + authorizationResult.currentUser.id + ` AND couponId = ` + packageResult[0].id;
                        let userPackageResult = await header.query(userPackageSql);
                        if (userPackageResult && userPackageResult.length > 0) {
                            if (userPackageResult[0].totalCount >= packageResult[0].maxUsage) {
                                validCoupon = false;
                                let successResult = new ResultSuccess(200, true, 'You already used this coupon', [], 1, authorizationResult.token);
                                return res.status(200).send(successResult);
                            }
                        }
                    }

                    if (packageResult[0].validFrom || packageResult[0].validTo) {
                        //Check With coupon
                        if (new Date(packageResult[0].validFrom).getTime() <= new Date().getTime()) {
                            if (new Date(packageResult[0].validTo).getTime() >= new Date().getTime()) {

                            } else {
                                validCoupon = false;
                                let successResult = new ResultSuccess(200, true, 'Coupon Expire', [], 1, authorizationResult.token);
                                return res.status(200).send(successResult);
                            }
                        } else {
                            if (new Date(packageResult[0].validTo).getTime() >= new Date().getTime()) {

                            } else {
                                validCoupon = false;
                                let successResult = new ResultSuccess(200, true, 'Coupon Expire', [], 1, authorizationResult.token);
                                return res.status(200).send(successResult);
                            }
                        }
                    }

                    if (validCoupon) {
                        let successResult = new ResultSuccess(200, true, 'Get Coupon Successfully', [packageResult[0]], 1, authorizationResult.token);
                        return res.status(200).send(successResult);
                    }

                } else {
                    let successResult = new ResultSuccess(200, true, 'Coupon Not Available', [], 1, authorizationResult.token);
                    return res.status(200).send(successResult);
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
        let errorResult = new ResultError(500, true, 'coupon.applyCoponCode() Exception', error, '');
        next(errorResult);
    }
}

export default { getCoupons, applyCouponCode };