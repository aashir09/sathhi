import { NextFunction, Request, Response } from 'express';
import logging from "../../config/logging";
import header from "../../middleware/apiHeader";
import { ResultSuccess } from '../../classes/response/resultsuccess';
import { ResultError } from '../../classes/response/resulterror';

const NAMESPACE = 'User Pages';

const getUserPages = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logging.info(NAMESPACE, 'Getting User Pages');
        let requiredFields = ['userId'];
        let validationResult = header.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = await header.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let sql = `SELECT * FROM pages WHERE isActive = 1 AND isDelete = 0`;
                let result = await header.query(sql);
                if (result) {
                    if (result.length > 0) {
                        let innerSql = `SELECT * FROM userpages WHERE userId = ` + req.body.userId;
                        let innerResult = await header.query(innerSql);
                        for (let i = 0; i < result.length; i++) {
                            result[i].userId = req.body.userId;
                            result[i].userPageId = null;
                            result[i].isReadPermission = false;
                            result[i].isSelected = false;
                            result[i].isAddPermission = false;
                            result[i].isDeletePermission = false;
                            result[i].isEditPermission = false;
                            if (innerResult && innerResult.length > 0) {
                                let ind = innerResult.findIndex((c: any) => c.pageId == result[i].id);
                                if (ind >= 0) {
                                    result[i].userPageId = innerResult[ind].id;
                                    result[i].isSelected = true;
                                    result[i].isReadPermission = innerResult[ind].isReadPermission == 1 ? true : false;
                                    result[i].isAddPermission = innerResult[ind].isAddPermission == 1 ? true : false;
                                    result[i].isDeletePermission = innerResult[ind].isDeletePermission == 1 ? true : false;
                                    result[i].isEditPermission = innerResult[ind].isEditPermission == 1 ? true : false;
                                }
                            }
                        }
                    }
                    let groups = result.filter((c: { parentId: any; }) => c.parentId == null)
                    for (let group of groups) {
                        let pages = result.filter((c: { parentId: any; }) => c.parentId == group.id);
                        group.pages = pages;
                    }
                    result = groups;
                    let successResult = new ResultSuccess(200, true, 'Get User Pages Successfully', result, result.length, authorizationResult.token);
                    return res.status(200).send(successResult);
                } else {
                    let errorResult = new ResultError(400, true, "userPages.getUserPages() Error", new Error('Error While Getting Data'), '');
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
        let errorResult = new ResultError(500, true, 'userPages.getUserPages() Exception', error, '');
        next(errorResult);
    }
};

const insertUpdateUserPages = async (req: Request, res: Response, next: NextFunction) => {
    await header.beginTransaction();
    try {
        let result;
        logging.info(NAMESPACE, 'Inserting User Pages');
        let requiredFields = ['userId', 'userPages'];
        let validationResult = header.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = await header.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let currentUser = authorizationResult.currentUser;
                let getUserPagePermissionSql = `SELECT * FROM userpages WHERE userId = ` + req.body.userId;
                let getUserPagePermissionResult = await header.query(getUserPagePermissionSql);
                if (req.body.userPages && req.body.userPages.length > 0) {
                    for (let i = 0; i < req.body.userPages.length; i++) {
                        if (req.body.userPages[i].userPageId) {
                            //update
                            let sql = `UPDATE userpages SET isReadPermission = ?, isAddPermission = ?, isEditPermission = ?, isDeletePermission = ?, modifiedDate = CURRENT_TIMESTAMP()
                            , modifiedBy = ` + currentUser.id + ` WHERE id = ` + req.body.userPages[i].userPageId;
                            result = await header.query(sql, [req.body.userPages[i].isReadPermission, req.body.userPages[i].isAddPermission
                                , req.body.userPages[i].isEditPermission, req.body.userPages[i].isDeletePermission])
                            if (result && result.affectedRows >= 0) {
                                getUserPagePermissionResult.splice(getUserPagePermissionResult.findIndex((c: any) => c.id == req.body.userPages[i].userPageId), 1);
                            } else {
                                await header.rollback();
                                let errorResult = new ResultError(400, true, "userPages.insertUpdateUserPages() Error", new Error('Error While Updating Permission'), '');
                                next(errorResult);
                            }
                        } else {
                            
                            //insert
                            let sql = `INSERT INTO userpages(userId, pageId, isReadPermission, isAddPermission, isEditPermission, isDeletePermission, createdBy) VALUES(` + req.body.userId + `, ` + req.body.userPages[i].id + `
                            , ?, ?, ?, ?, ` + currentUser.id + `)`;
                            result = await header.query(sql, [req.body.userPages[i].isReadPermission, req.body.userPages[i].isAddPermission
                                , req.body.userPages[i].isEditPermission, req.body.userPages[i].isDeletePermission])
                            if (result && result.insertId) {
                            } else {
                                await header.rollback();
                                let errorResult = new ResultError(400, true, "userPages.insertUpdateUserPages() Error", new Error('Error While Inserting Permission'), '');
                                next(errorResult);
                            }
                        }
                    }
                    if (getUserPagePermissionResult && getUserPagePermissionResult.length > 0) {
                        let removeIds: number[] = [];
                        removeIds = getUserPagePermissionResult.map((c: any) => c.id);
                        let deleteSql = `DELETE FROM userpages WHERE id IN(` + removeIds.toString() + `)`;
                        result = await header.query(deleteSql);
                        if (result && result.affectedRows >= 0) {
                        } else {
                            await header.rollback();
                            let errorResult = new ResultError(400, true, "userPages.insertUpdateUserPages() Error", new Error('Error While Delete Permission'), '');
                            next(errorResult);
                        }
                    }
                    await header.commit();
                    let getsql = `SELECT * FROM pages WHERE isActive = 1 AND isDelete = 0`;
                    let getresult = await header.query(getsql);
                    if (getresult) {
                        if (getresult.length > 0) {
                            let innerSql = `SELECT * FROM userpages WHERE userId = ` + req.body.userId;
                            let innerResult = await header.query(innerSql);
                            for (let i = 0; i < getresult.length; i++) {
                                getresult[i].userId = req.body.userId;
                                getresult[i].userPageId = null;
                                getresult[i].isReadPermission = false;
                                getresult[i].isSelected = false;
                                getresult[i].isAddPermission = false;
                                getresult[i].isDeletePermission = false;
                                getresult[i].isEditPermission = false;
                                if (innerResult && innerResult.length > 0) {
                                    let ind = innerResult.findIndex((c: any) => c.pageId == getresult[i].id);
                                    if (ind >= 0) {
                                        getresult[i].userPageId = innerResult[ind].id;
                                        getresult[i].isSelected = true;
                                        getresult[i].isReadPermission = innerResult[ind].isReadPermission = 1 ? true : false;
                                        getresult[i].isAddPermission = innerResult[ind].isAddPermission = 1 ? true : false;
                                        getresult[i].isDeletePermission = innerResult[ind].isDeletePermission = 1 ? true : false;
                                        getresult[i].isEditPermission = innerResult[ind].isEditPermission = 1 ? true : false;
                                    }
                                }
                            }
                        }
                        let successResult = new ResultSuccess(200, true, 'Get User Pages Successfully', getresult, getresult.length, authorizationResult.token);
                        return res.status(200).send(successResult);
                    } else {
                        await header.rollback();
                        let errorResult = new ResultError(400, true, "userPages.insertUpdateUserPages() Error", new Error('Error While Getting Data'), '');
                        next(errorResult);
                    }
                } else {
                    let sql = `DELETE FROM userpages WHERE userId = ` + req.body.userId;
                    result = await header.query(sql);
                    if (result && result.affectedRows >= 0) {
                        await header.commit();

                        let successResult = new ResultSuccess(200, true, 'Get User Pages Successfully', [], 0, authorizationResult.token);
                        return res.status(200).send(successResult);
                    } else {
                        await header.rollback();
                        let errorResult = new ResultError(400, true, "userPages.insertUpdateUserPages() Error", new Error('Error While Delete Permission'), '');
                        next(errorResult);
                    }
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
        let errorResult = new ResultError(500, true, 'userPages.insertUpdateUserPages() Exception', error, '');
        next(errorResult);
    }
};

export default { getUserPages, insertUpdateUserPages };