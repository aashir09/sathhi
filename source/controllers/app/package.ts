import { NextFunction, Request, Response } from 'express';
import logging from "../../config/logging";
import config from "../../config/config";
import header from "../../middleware/apiHeader";
import { ResultSuccess } from '../../classes/response/resultsuccess';
import { ResultError } from '../../classes/response/resulterror';
import notificationContainer from './../notifications';

const mysql = require('mysql');
const util = require('util');
const fs = require('fs');

// let connection = mysql.createConnection({
//     host: config.mysql.host,
//     user: config.mysql.user,
//     password: config.mysql.password,
//     database: config.mysql.database
// });

// const query = util.promisify(connection.query).bind(connection);

const NAMESPACE = 'Package';

const getpackage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logging.info(NAMESPACE, 'Getting Package');
        // let authorizationResult = await header.validateAuthorization(req, res, next);
        // if (authorizationResult.statusCode == 200) {
        let startIndex = req.body.startIndex ? req.body.startIndex : (req.body.startIndex === 0 ? 0 : null);
        let fetchRecord = req.body.fetchRecord ? req.body.fetchRecord : null;
        let result;
        let countSql = "SELECT COUNT(*) as totalCount  FROM timeduration";
        let countResult = await header.query(countSql);
        let sql = `SELECT * FROM timeduration WHERE isDelete = 0 ORDER BY value ASC`;
        result = await header.query(sql);
        if (result) {
            if (result && result.length > 0) {
                for (let y = 0; y < result.length; y++) {
                    sql = `SELECT p.* , pd.id as packageDurationId, pd.timeDurationId, td.value, pd.discount FROM package p
                        LEFT JOIN packageduration pd ON pd.packageId = p.id
                        LEFT JOIN timeduration td ON td.id = pd.timeDurationId
                        WHERE p.isActive = true AND p.isDelete = false AND pd.timeDurationId = ` + result[y].id;
                    if (startIndex != null && fetchRecord != null) {
                        sql += " LIMIT " + fetchRecord + " OFFSET " + startIndex + "";
                    }
                    result[y].package = await header.query(sql);
                    let packageData = result[y].package;
                    if (packageData) {
                        if (packageData && packageData.length > 0) {
                            for (let index = 0; index < packageData.length; index++) {
                                sql = `SELECT packagefacility.*, pf.name FROM packagefacility
                                    LEFT JOIN premiumfacility pf ON pf.id = packagefacility.premiumFacilityId
                                     WHERE packageId = ` + packageData[index].id;
                                result[y].package[index].facility = await header.query(sql);

                                // sql = `SELECT * FROM packageduration WHERE packageId = ` + result[index].id;
                                // result[index].duration = await query(sql);
                            }
                        }
                    }
                }
            }
            let successResult = new ResultSuccess(200, true, 'Get Package Successfully', result, countResult[0].totalCount, '');
            return res.status(200).send(successResult);
        } else {
            let errorResult = new ResultError(400, true, "package.getpackage() Error", new Error('Error While Getting Data'), '');
            next(errorResult);
        }
        // } else {
        //     let errorResult = new ResultError(401, true, "Unauthorized request", new Error(authorizationResult.message), '');
        //     next(errorResult);
        // }
    } catch (error: any) {
        let errorResult = new ResultError(500, true, 'package.getpackage() Exception', error, '');
        next(errorResult);
    }
};

const getpackageV2 = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logging.info(NAMESPACE, 'Getting Package');
        // let authorizationResult = await header.validateAuthorization(req, res, next);
        // if (authorizationResult.statusCode == 200) {
        let startIndex = req.body.startIndex ? req.body.startIndex : (req.body.startIndex === 0 ? 0 : null);
        let fetchRecord = req.body.fetchRecord ? req.body.fetchRecord : null;
        let result: any;
        let countSql = "SELECT COUNT(*) as totalCount  FROM package WHERE isActive = true AND isDelete = false";
        let countResult = await header.query(countSql);

        let sql = `SELECT * FROM package WHERE isActive = true AND isDelete = false`;
        if (startIndex != null && fetchRecord != null) {
            sql += " LIMIT " + fetchRecord + " OFFSET " + startIndex + "";
        }

        sql += ` ORDER BY weightage DESC`
        result = await header.query(sql);
        // result[0].package = data;
        if (result) {
            if (result.length > 0) {
                for (let i = 0; i < result.length; i++) {
                    let durationSql = `SELECT pd.id , pd.timeDurationId, td.value, pd.discount,p.baseAmount, p.name FROM packageduration pd 
                                        LEFT JOIN package p ON p.id = pd.packageId
                                        LEFT JOIN timeduration td ON td.id = pd.timeDurationId WHERE pd.packageId = `+ result[i].id + ``;
                    result[i].duration = await header.query(durationSql);
                    for (let ind = 0; ind < result[i].duration.length; ind++) {
                        let duration = result[i].duration[ind]
                        duration.discountAmount = duration.baseAmount * duration.value - duration.baseAmount * duration.value * (duration.discount / 100);
                        duration.packageId = duration.name.toLowerCase() + '_' + duration.value;
                        duration.totalAmount = duration.baseAmount * duration.value;
                    }

                    sql = `SELECT packagefacility.*, pf.name FROM packagefacility
                    LEFT JOIN premiumfacility pf ON pf.id = packagefacility.premiumFacilityId
                     WHERE packageId = ` + result[i].id;
                    result[i].facility = await header.query(sql);
                }
            }
            let successResult = new ResultSuccess(200, true, 'Get Package Successfully', result, countResult[0].totalCount, '');
            return res.status(200).send(successResult);
        } else {
            let errorResult = new ResultError(400, true, "package.getpackage() Error", new Error('Error While Getting Data'), '');
            next(errorResult);
        }
        // } else {
        //     let errorResult = new ResultError(401, true, "Unauthorized request", new Error(authorizationResult.message), '');
        //     next(errorResult);
        // }
    } catch (error: any) {
        let errorResult = new ResultError(500, true, 'package.getpackage() Exception', error, '');
        next(errorResult);
    }
};

const savePremiumAccount = async (req: Request, res: Response, next: NextFunction) => {
    await header.beginTransaction();
    try {
        logging.info(NAMESPACE, 'Inserting Premium Account');
        let requiredFields = ['packageId', 'packageDurationId'];
        let validationResult = header.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = await header.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let currentUser = authorizationResult.currentUser;
                let userId = currentUser.id;
                let checkPaymentStatusSql = `SELECT * FROM payment WHERE id = ` + (req.body.paymentId ? req.body.paymentId : 0) + ` AND LOWER(paymentStatus) = 'pending'`;
                let checkPaymentStatusResult = await header.query(checkPaymentStatusSql);
                if (checkPaymentStatusResult && checkPaymentStatusResult.length > 0) {
                    if (checkPaymentStatusResult[0].paymentMode == 'Wallet') {
                        let walletSql = ` UPDATE userwallets SET amount = amount - ` + checkPaymentStatusResult[0].amount + ` WHERE userId = ` + userId;
                        let walletResult = await header.query(walletSql);
                        let userWalletIdResult = await header.query(`SELECT id FROM userwallets WHERE userId =` + userId);
                        let walletHistorySql = ` INSERT INTO userwallethistory (userWalletId,amount,isCredit,transactionDate,remark,paymentId,createdBy,modifiedBy) 
                        VALUES (` + userWalletIdResult[0].id + `,` + checkPaymentStatusResult[0].amount + `,false,CURRENT_DATE(),'Purchase Package',` + checkPaymentStatusResult[0].id + `,` + userId + `,` + userId + `)`;
                        let walletHistoryResult = await header.query(walletHistorySql);
                    }
                    let sql = `INSERT INTO userpackage(packageId, packageDurationId, startDate, endDate, netAmount, purchaseDate, userId, paymentId, signature, originalJson, purchaseToken, createdBy, modifiedBy, couponId)
                        VALUES(` + req.body.packageId + `, ` + req.body.packageDurationId + `, ?, ?, ` + req.body.netAmount + `, ?, ` + userId + `
                            , ` + (req.body.paymentId ? req.body.paymentId : null) + `, ` + (req.body.signature ? "'" + req.body.signature + "'" : null) + `
                            , ` + (req.body.originalJson ? "'" + req.body.originalJson + "'" : null) + `, ` + (req.body.purchaseToken ? "'" + req.body.purchaseToken + "'" : null) + `, ` + userId + `, ` + userId + `, ` + (req.body.couponId ? "'" + req.body.couponId + "'" : null) + `)`
                    let result = await header.query(sql, [null, null, (req.body.purchaseDate ? new Date(req.body.purchaseDate) : null)]);
                    if (result && result.insertId > 0) {
                        let id = result.insertId;
                        let userPackages = `SELECT up.*, p.name as packageName, td.id as timeDurationId, td.value, p.weightage FROM userpackage up
                                                LEFT JOIN package p ON p.id = up.packageId
                                                LEFT JOIN packageduration pd ON pd.id = up.packageDurationId
                                                LEFT JOIN timeduration td ON td.id = pd.timeDurationId
                                                WHERE up.isActive = 1 AND up.isDelete = 0 AND up.userId = ` + userId + ` AND DATE(up.startDate) <= DATE(CURRENT_TIMESTAMP()) AND DATE(up.endDate) >= DATE(CURRENT_TIMESTAMP())
                                                order by p.weightage DESC`;
                        let userPackage = await header.query(userPackages);
                        if (userPackage && userPackage.length > 0) {
                            for (let k = 0; k < userPackage.length; k++) {
                                let packageFacility = await header.query(`SELECT pf.*, pff.name FROM packagefacility pf
                                                        LEFT JOIN premiumfacility pff ON pff.id = pf.premiumFacilityId
                                                         WHERE pf.packageId = ` + userPackage[k].packageId);
                                userPackage[k].packageFacility = packageFacility;
                            }
                        }
                        result[0] = userPackage[0];

                        let adminUserSql = `SELECT * FROM users where id IN(select userId from userroles where(roleId = 1 OR roleId = 3)) AND isActive = true AND isDelete = false`;
                        let adminUserResult = await header.query(adminUserSql);
                        if (adminUserResult && adminUserResult.length > 0) {
                            for (let a = 0; a < adminUserResult.length; a++) {
                                if (adminUserResult[a].isReceiveNotification) {
                                    let deviceDetailSql = `SELECT * FROM userdevicedetail WHERE userId = ` + adminUserResult[a].id + ` AND fcmToken IS NOT NULL`;
                                    let deviceDetailResult = await header.query(deviceDetailSql);
                                    if (deviceDetailResult && deviceDetailResult.length > 0) {
                                        let title = "Package Purchase";
                                        let userSql = `SELECT u.firstName, u.lastName, p.name from userpackage up INNER JOIN package p ON p.id = up.packageId INNER JOIN users u ON u.id = up.userId WHERE up.id = ` + id;
                                        let userResult = await header.query(userSql);
                                        let description = "User " + ((userResult && userResult.length > 0) ? userResult[0].firstName : '') + " " + ((userResult && userResult.length > 0) ? userResult[0].lastName : '') + "  purchase new package. Please verify and approve";
                                        let notificationSql = `INSERT INTO usernotifications(userId, title, message, bodyJson, imageUrl, createdBy, modifiedBy)
                        VALUES(` + adminUserResult[a].id + `, '` + title + `', '` + description + `', null, null, ` + authorizationResult.currentUser.id + `, ` + authorizationResult.currentUser.id + `)`
                                        let notificationResult = await header.query(notificationSql);

                                        await notificationContainer.sendMultipleNotification([deviceDetailResult[0].fcmToken], null, title, description, '', null, null, 0);
                                        console.log("Send" + deviceDetailResult[0].fcmToken);
                                    }
                                }
                            }
                        }
                        await header.commit();


                        let successResult = new ResultSuccess(200, true, 'Save Premium Account', result[0], 1, authorizationResult.token);
                        return res.status(200).send(successResult);
                    } else {
                        await header.rollback();
                        let errorResult = new ResultError(400, true, "package.savePremiumAccount() Error", new Error('Error While Updating Data'), '');
                        next(errorResult);
                    }
                } else {
                    let getUserPackageSql = `SELECT up.*, p.weightage FROM userpackage up INNER JOIN package p ON p.id = up.packageId WHERE up.isActive = 1 AND up.isDelete = 0 AND DATE(up.endDate) >= DATE(CURRENT_TIMESTAMP()) 
                    AND up.userId = ` + userId + ` ORDER BY up.endDate`;
                    let getUserPackageResult = await header.query(getUserPackageSql);
                    let currentPackageSql = `SELECT p.*, t.value as month FROM package p INNER JOIN packageduration pd ON pd.packageId = p.id INNER JOIN timeduration t on t.id = pd.timeDurationId WHERE pd.id = ` + req.body.packageDurationId;
                    let currentPackageResult = await header.query(currentPackageSql);
                    if (getUserPackageResult && getUserPackageResult.length > 0 && currentPackageResult && currentPackageResult.length > 0) {
                        let filterData = getUserPackageResult.filter((c: any) => c.weightage >= currentPackageResult[0].weightage);
                        if (filterData && filterData.length > 0) {
                            //extend
                            let startDate = new Date(filterData[filterData.length - 1].endDate).getFullYear() + "-" + (new Date(filterData[filterData.length - 1].endDate).getMonth() + 1) + "-" + (new Date(filterData[filterData.length - 1].endDate).getDate() + 1) + " 00:00:00";
                            let eDt = new Date(new Date(startDate).setMonth(new Date(startDate).getMonth() + currentPackageResult[0].month));
                            let endDate = new Date(eDt).getFullYear() + "-" + (new Date(eDt).getMonth() + 1) + "-" + (new Date(eDt).getDate()) + " 23:59:59";
                            let checkPaymentStatusSql = `SELECT * FROM payment WHERE id = ` + (req.body.paymentId ? req.body.paymentId : 0);
                            let checkPaymentStatusResult = await header.query(checkPaymentStatusSql);
                            if (checkPaymentStatusResult && checkPaymentStatusResult.length > 0 && checkPaymentStatusResult[0].paymentMode == 'Wallet') {
                                let walletSql = ` UPDATE userwallets SET amount = amount - ` + req.body.netAmount + ` WHERE userId = ` + userId;
                                let walletResult = await header.query(walletSql);
                                let userWalletIdResult = await header.query(`SELECT id FROM userwallets WHERE userId =` + userId);
                                let walletHistorySql = ` INSERT INTO userwallethistory (userWalletId,amount,isCredit,transactionDate,remark,paymentId,createdBy,modifiedBy) 
                        VALUES (` + userWalletIdResult[0].id + `,` + req.body.netAmount + `,false,CURRENT_DATE(),'Purchase Package', ` + (req.body.paymentId ? req.body.paymentId : null) + `,` + userId + `,` + userId + `)`;
                                let walletHistoryResult = await header.query(walletHistorySql);
                            }
                            let sql = `INSERT INTO userpackage(packageId, packageDurationId, startDate, endDate, netAmount, purchaseDate, userId, paymentId, signature, originalJson, purchaseToken, createdBy, modifiedBy, couponId)
                        VALUES(` + req.body.packageId + `, ` + req.body.packageDurationId + `, ?, ?, ` + req.body.netAmount + `, ?, ` + userId + `
                            , ` + (req.body.paymentId ? req.body.paymentId : null) + `, ` + (req.body.signature ? "'" + req.body.signature + "'" : null) + `
                            , ` + (req.body.originalJson ? "'" + req.body.originalJson + "'" : null) + `, ` + (req.body.purchaseToken ? "'" + req.body.purchaseToken + "'" : null) + `, ` + userId + `, ` + userId + `,` + (req.body.couponId ? "'" + req.body.couponId + "'" : null) + `)`
                            let result = await header.query(sql, [new Date(startDate), new Date(endDate), (req.body.purchaseDate ? new Date(req.body.purchaseDate) : null)]);
                            if (result && result.insertId > 0) {
                                let id = result.insertId;
                                let userPackages = `SELECT up.*, p.name as packageName, td.id as timeDurationId, td.value, p.weightage FROM userpackage up
                                                    LEFT JOIN package p ON p.id = up.packageId
                                                    LEFT JOIN packageduration pd ON pd.id = up.packageDurationId
                                                    LEFT JOIN timeduration td ON td.id = pd.timeDurationId
                                                    WHERE up.isActive = 1 AND up.isDelete = 0 AND up.userId = ` + userId + ` AND DATE(up.startDate) <= DATE(CURRENT_TIMESTAMP()) AND DATE(up.endDate) >= DATE(CURRENT_TIMESTAMP())
                                                    order by p.weightage DESC`;
                                let userPackage = await header.query(userPackages);
                                if (userPackage && userPackage.length > 0) {
                                    for (let k = 0; k < userPackage.length; k++) {
                                        let packageFacility = await header.query(`SELECT pf.*, pff.name FROM packagefacility pf
                                                            LEFT JOIN premiumfacility pff ON pff.id = pf.premiumFacilityId
                                                             WHERE pf.packageId = ` + userPackage[k].packageId);
                                        userPackage[k].packageFacility = packageFacility;
                                    }
                                }
                                result[0] = userPackage[0]
                                await header.commit();
                                let successResult = new ResultSuccess(200, true, 'Save Premium Account', result[0], 1, authorizationResult.token);
                                return res.status(200).send(successResult);
                            } else {
                                await header.rollback();
                                let errorResult = new ResultError(400, true, "package.savePremiumAccount() Error", new Error('Error While Updating Data'), '');
                                next(errorResult);
                            }
                        } else {
                            //overright
                            let startDate = new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate() + " 00:00:00";
                            let eDt = new Date(new Date(startDate).setMonth(new Date(startDate).getMonth() + currentPackageResult[0].month));
                            let endDate = new Date(eDt).getFullYear() + "-" + (new Date(eDt).getMonth() + 1) + "-" + (new Date(eDt).getDate()) + " 23:59:59";
                            let checkPaymentStatusSql = `SELECT * FROM payment WHERE id = ` + (req.body.paymentId ? req.body.paymentId : 0);
                            let checkPaymentStatusResult = await header.query(checkPaymentStatusSql);
                            if (checkPaymentStatusResult && checkPaymentStatusResult.length > 0 && checkPaymentStatusResult[0].paymentMode == 'Wallet') {
                                let walletSql = ` UPDATE userwallets SET amount = amount - ` + req.body.netAmount + ` WHERE userId = ` + userId;
                                let walletResult = await header.query(walletSql);
                                let userWalletIdResult = await header.query(`SELECT id FROM userwallets WHERE userId =` + userId);
                                let walletHistorySql = ` INSERT INTO userwallethistory (userWalletId,amount,isCredit,transactionDate,remark,paymentId,createdBy,modifiedBy) 
                        VALUES (` + userWalletIdResult[0].id + `,` + req.body.netAmount + `,false,CURRENT_DATE(),'Purchase Package', ` + (req.body.paymentId ? req.body.paymentId : null) + `,` + userId + `,` + userId + `)`;
                                let walletHistoryResult = await header.query(walletHistorySql);
                            }
                            let sql = `INSERT INTO userpackage(packageId, packageDurationId, startDate, endDate, netAmount, purchaseDate, userId, paymentId, signature, originalJson, purchaseToken, createdBy, modifiedBy, couponId)
                        VALUES(` + req.body.packageId + `, ` + req.body.packageDurationId + `, ?, ?, ` + req.body.netAmount + `, ?, ` + userId + `
                            , ` + (req.body.paymentId ? req.body.paymentId : null) + `, ` + (req.body.signature ? "'" + req.body.signature + "'" : null) + `
                            , ` + (req.body.originalJson ? "'" + req.body.originalJson + "'" : null) + `, ` + (req.body.purchaseToken ? "'" + req.body.purchaseToken + "'" : null) + `, ` + userId + `, ` + userId + `,` + (req.body.couponId ? "'" + req.body.couponId + "'" : null) + `)`
                            let result = await header.query(sql, [new Date(startDate), new Date(endDate), (req.body.purchaseDate ? new Date(req.body.purchaseDate) : null)]);
                            if (result && result.insertId > 0) {
                                let id = result.insertId;
                                let insertedPackageDurationSql = `SELECT t.* FROM timeduration t INNER JOIN packageduration pd ON pd.timeDurationId = t.id WHERE pd.id = ` + req.body.packageDurationId;
                                let insertedPackageDurationResult = await header.query(insertedPackageDurationSql);
                                let getFuturePackageSql = `SELECT up.*, t.value as month FROM userpackage up INNER JOIN packageduration pd ON pd.id = up.packageDurationId 
                            INNER JOIN timeduration t on t.id = pd.timeDurationId WHERE up.isActive = 1 AND up.isDelete = 0 AND DATE(up.startDate) > DATE(CURRENT_TIMESTAMP()) AND up.id != ` + id;
                                let getFuturePackageResult = await header.query(getFuturePackageSql);
                                if (getFuturePackageResult && getFuturePackageResult.length > 0 && insertedPackageDurationResult && insertedPackageDurationResult.length > 0) {
                                    for (let i = 0; i < getFuturePackageResult.length; i++) {
                                        let sDt = new Date(endDate);
                                        let startDate = new Date(sDt).getFullYear() + "-" + (new Date(sDt).getMonth() + 1) + "-" + (new Date(sDt).getDate() + 1) + " 00:00:00";
                                        let eDt = new Date(new Date(startDate).setMonth(new Date(startDate).getMonth() + getFuturePackageResult[i].month));
                                        let endnDate = new Date(eDt).getFullYear() + "-" + (new Date(eDt).getMonth() + 1) + "-" + (new Date(eDt).getDate()) + " 23:59:59";
                                        let updateUserPackageSql = `UPDATE userpackage SET startDate = ?, endDate = ? WHERE id = ` + getFuturePackageResult[i].id;
                                        let updateUserPackageResult = await header.query(updateUserPackageSql, [startDate, endnDate]);
                                        if (updateUserPackageResult && updateUserPackageResult.affectedRows >= 0) {
                                        } else {
                                            await header.rollback();

                                            let errorResult = new ResultError(400, true, "package.savePremiumAccount() Error", new Error('Error While Updating Data'), '');
                                            next(errorResult);
                                        }
                                    }
                                }

                                let userPackages = `SELECT up.*, p.name as packageName, td.id as timeDurationId, td.value, p.weightage FROM userpackage up
                            LEFT JOIN package p ON p.id = up.packageId
                            LEFT JOIN packageduration pd ON pd.id = up.packageDurationId
                            LEFT JOIN timeduration td ON td.id = pd.timeDurationId
                            WHERE up.isActive = 1 AND up.isDelete = 0 AND up.userId = ` + userId + ` AND DATE(up.startDate) <= DATE(CURRENT_TIMESTAMP()) AND DATE(up.endDate) >= DATE(CURRENT_TIMESTAMP())
                            order by p.weightage DESC`;
                                let userPackage = await header.query(userPackages);
                                if (userPackage && userPackage.length > 0) {
                                    for (let k = 0; k < userPackage.length; k++) {
                                        let packageFacility = await header.query(`SELECT pf.*, pff.name FROM packagefacility pf
                                    LEFT JOIN premiumfacility pff ON pff.id = pf.premiumFacilityId
                                     WHERE pf.packageId = ` + userPackage[k].packageId);
                                        userPackage[k].packageFacility = packageFacility;
                                    }
                                }
                                result[0] = userPackage[0]
                                await header.commit();

                                let successResult = new ResultSuccess(200, true, 'Save Premium Account', result[0], 1, authorizationResult.token);
                                return res.status(200).send(successResult);
                            } else {
                                await header.rollback();

                                let errorResult = new ResultError(400, true, "package.savePremiumAccount() Error", new Error('Error While Updating Data'), '');
                                next(errorResult);
                            }
                        }
                    } else {
                        //insert
                        let startDate = new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate() + " 00:00:00";
                        let eDt = new Date(new Date(startDate).setMonth(new Date(startDate).getMonth() + currentPackageResult[0].month));
                        let endDate = new Date(eDt).getFullYear() + "-" + (new Date(eDt).getMonth() + 1) + "-" + (new Date(eDt).getDate()) + " 23:59:59";
                        let checkPaymentStatusSql = `SELECT * FROM payment WHERE id = ` + (req.body.paymentId ? req.body.paymentId : 0);
                        let checkPaymentStatusResult = await header.query(checkPaymentStatusSql);
                        if (checkPaymentStatusResult && checkPaymentStatusResult.length > 0 && checkPaymentStatusResult[0].paymentMode == 'Wallet') {
                            let walletSql = ` UPDATE userwallets SET amount = amount - ` + req.body.netAmount + ` WHERE userId = ` + userId;
                            let walletResult = await header.query(walletSql);
                            let userWalletIdResult = await header.query(`SELECT id FROM userwallets WHERE userId =` + userId);
                            let walletHistorySql = ` INSERT INTO userwallethistory (userWalletId,amount,isCredit,transactionDate,remark,paymentId,createdBy,modifiedBy) 
                    VALUES (` + userWalletIdResult[0].id + `,` + req.body.netAmount + `,false,CURRENT_DATE(),'Purchase Package', ` + (req.body.paymentId ? req.body.paymentId : null) + `,` + userId + `,` + userId + `)`;
                            let walletHistoryResult = await header.query(walletHistorySql);
                        }
                        let sql = `INSERT INTO userpackage(packageId, packageDurationId, startDate, endDate, netAmount, purchaseDate, userId, paymentId, signature, originalJson, purchaseToken, createdBy, modifiedBy, couponId)
                        VALUES(` + req.body.packageId + `, ` + req.body.packageDurationId + `, ?, ?, ` + req.body.netAmount + `,? , ` + userId + `, ` + (req.body.paymentId ? req.body.paymentId : null) + `
                            , ` + (req.body.signature ? "'" + req.body.signature + "'" : null) + `
                            , ` + (req.body.originalJson ? "'" + req.body.originalJson + "'" : null) + `, ` + (req.body.purchaseToken ? "'" + req.body.purchaseToken + "'" : null) + `, ` + userId + `, ` + userId + `,` + (req.body.couponId ? "'" + req.body.couponId + "'" : null) + `)`
                        let result = await header.query(sql, [new Date(startDate), new Date(endDate), (req.body.purchaseDate ? new Date(req.body.purchaseDate) : null)]);
                        if (result && result.insertId > 0) {
                            let id = result.insertId;
                            let userPackages = `SELECT up.*, p.name as packageName, td.id as timeDurationId, td.value, p.weightage FROM userpackage up
                        LEFT JOIN package p ON p.id = up.packageId
                        LEFT JOIN packageduration pd ON pd.id = up.packageDurationId
                        LEFT JOIN timeduration td ON td.id = pd.timeDurationId
                        WHERE up.isActive = 1 AND up.isDelete = 0 AND up.userId = ` + userId + ` AND DATE(up.startDate) <= DATE(CURRENT_TIMESTAMP()) AND DATE(up.endDate) >= DATE(CURRENT_TIMESTAMP())
                        order by p.weightage DESC`;
                            let userPackage = await header.query(userPackages);
                            if (userPackage && userPackage.length > 0) {
                                for (let k = 0; k < userPackage.length; k++) {
                                    let packageFacility = await header.query(`SELECT pf.*, pff.name FROM packagefacility pf
                                LEFT JOIN premiumfacility pff ON pff.id = pf.premiumFacilityId
                                 WHERE pf.packageId = ` + userPackage[k].packageId);
                                    userPackage[k].packageFacility = packageFacility;
                                }
                            }
                            result[0] = userPackage[0];
                            await header.commit();

                            let successResult = new ResultSuccess(200, true, 'Save Premium Account', result[0], 1, authorizationResult.token);
                            return res.status(200).send(successResult);
                        } else {
                            await header.rollback();

                            let errorResult = new ResultError(400, true, "package.savePremiumAccount() Error", new Error('Error While Updating Data'), '');
                            next(errorResult);
                        }
                    }
                }
            } else {
                await header.rollback();

                let errorResult = new ResultError(401, true, "Unauthorized request", new Error(authorizationResult.message), '');
                next(errorResult);
            }
        }
        else {
            await header.rollback();

            let errorResult = new ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
            next(errorResult);
        }
    }
    catch (error: any) {
        await header.rollback();

        let errorResult = new ResultError(500, true, 'package.savePremiumAccount() Exception', error, '');
        next(errorResult);
    }
};

const getPackageByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logging.info(NAMESPACE, 'Inserting Proposals');
        let requiredFields = ['userId'];
        let validationResult = header.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = await header.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let currentUser = authorizationResult.currentUser;
                let userId = currentUser.id;
                let sql = `SELECT up.id, up.packageId, p.name as packageName, up.packageDurationId, up.startDate, up.endDate, up.netAmount, pay.paymentMode, pay.paymentStatus
                            , t.value   FROM  userpackage up
                LEFT JOIN package p on p.id = up.packageId
                LEFT join payment pay on pay.id = up.paymentId
                left join packageduration pd on pd.id = up.packageDurationId
                left join timeduration t on t.id = pd.timeDurationId
                WHERE up.isActive = 1 AND up.isDelete = 0 AND up.userId = `+ req.body.userId + ` order by up.createdDate desc`
                let result = await header.query(sql);
                if (result && result.length >= 0) {
                    // let id = result.insertId;
                    //  sql = `SELECT * From userpackage WHERE id = ` + id;
                    //  result = await query(sql);
                    for (let i = 0; i < result.length; i++) {
                        result[i].status = "";
                        if (result[i].paymentStatus == "Pending") {
                            result[i].status = "Pending"
                        } else {
                            let userPackages = `SELECT up.*, p.name as packageName, td.id as timeDurationId, td.value, p.weightage FROM userpackage up
                        LEFT JOIN package p ON p.id = up.packageId
                        LEFT JOIN packageduration pd ON pd.id = up.packageDurationId
                        LEFT JOIN timeduration td ON td.id = pd.timeDurationId
                        WHERE up.isActive = 1 AND up.isDelete = 0 AND up.userId = ` + req.body.userId + ` AND DATE(up.startDate) <= DATE(CURRENT_TIMESTAMP()) AND DATE(up.endDate) >= DATE(CURRENT_TIMESTAMP())
                        order by p.weightage DESC`;
                            let userPackage = await header.query(userPackages);
                            if (userPackage && userPackage.length > 0) {
                                for (let j = 0; j < userPackage.length; j++) {
                                    if (userPackage[0].id == result[i].id) {
                                        result[i].status = "Active";
                                    } else {
                                        result[i].status = "Override";
                                    }
                                }
                            }
                            //if (result[i].endDate || result[i].startDate) {
                            if (new Date(result[i].endDate).getTime() < new Date().getTime()) {
                                result[i].status = "Expired";
                            } else if (new Date(result[i].startDate).getTime() > new Date().getTime()) {
                                result[i].status = "Upcomming";
                            }
                            //} else {
                            //    result[i].status = "Pending";
                            //}
                        }

                    }
                    let successResult = new ResultSuccess(200, true, 'Get Package of Users', result, 1, authorizationResult.token);

                    return res.status(200).send(successResult);
                } else {
                    let errorResult = new ResultError(400, true, "package.getPackageByUserId() Error", new Error('Error While Updating Data'), '');
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
        let errorResult = new ResultError(500, true, 'package.getPackageByUserId() Exception', error, '');
        next(errorResult);
    }
};

export default { getpackage, savePremiumAccount, getPackageByUserId, getpackageV2 };