import { NextFunction, Request, Response, query } from 'express';
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

const NAMESPACE = 'ManageCustomFields';

const getCustomfields = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logging.info(NAMESPACE, 'Getting Custom fields');
        let authorizationResult = await header.validateAuthorization(req, res, next);
        if (authorizationResult.statusCode == 200) {
            let startIndex = req.body.startIndex ? req.body.startIndex : (req.body.startIndex === 0 ? 0 : null);
            let fetchRecord = req.body.fetchRecord ? req.body.fetchRecord : null;
            let countSql = "SELECT COUNT(*) as totalCount  FROM customfields";
            if (req.body.name) {
                if (!countSql.includes(` WHERE `)) {
                    countSql += ` WHERE `;
                } else {
                    countSql += ` AND `;
                }
                countSql += ` name LIKE '%` + req.body.name + `%' `;
            }
            let countResult = await header.query(countSql);
            let sql = `SELECT * FROM customfields WHERE isDelete = 0 `;
            if (req.body.searchString) {
                if (!sql.includes(` WHERE `)) {
                    sql += ` WHERE `;
                } else {
                    sql += ` AND `;
                }
                sql += ` name LIKE '%` + req.body.searchString + `%' `;
            }
            sql += ` ORDER BY id DESC `;
            if (startIndex != null && fetchRecord != null) {
                sql += " LIMIT " + fetchRecord + " OFFSET " + startIndex + "";
            }
            let result = await header.query(sql);
            if (result) {
                for (let i = 0; i < result.length; i++) {
                    if (result[i].valueTypeId == 1) {
                        result[i].valueTypeName = 'Text'
                    } else if (result[i].valueTypeId == 2) {
                        result[i].valueTypeName = 'Number'
                    } else if (result[i].valueTypeId == 3) {
                        result[i].valueTypeName = 'DropDownList'
                    } else if (result[i].valueTypeId == 10) {
                        result[i].valueTypeName = 'MultipleDropDownList'
                    }

                    if (result[i].valueList && typeof result[i].valueList === 'string') {
                        const valueArray: string[] = result[i].valueList.includes(';') ? result[i].valueList.split(";") : [result[i].valueList];
                        result[i].valueList = valueArray;
                    }

                    if (result[i].defaultValue && typeof result[i].defaultValue === 'string' && result[i].valueTypeId === 10) {
                        const defaultValueArray: string[] = result[i].defaultValue.includes(';') ? result[i].defaultValue.split(';') : [result[i].defaultValue];
                        result[i].defaultValue = defaultValueArray;
                    }
                }
                let successResult = new ResultSuccess(200, true, 'Get CustomFields Successfully', result, countResult[0].totalCount, authorizationResult.token);
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
        let errorResult = new ResultError(500, true, 'customFields.getCustomFields() Exception', error, '');
        next(errorResult);
    }
};

const insertUpdateCustomField = async (req: Request, res: Response, next: NextFunction) => {

    try {
        logging.info(NAMESPACE, 'Insert Update Custom field');
        let requiredFields = ['mappedFieldName'];
        let validationResult = header.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = await header.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                await header.beginTransaction();
                let currentUser = authorizationResult.currentUser;
                let userId = currentUser.id;
                req.body.mappedFieldName = (req.body.mappedFieldName).trim();
                req.body.textLength = req.body.textLength ? req.body.textLength : null

                let checkSql = `SELECT * FROM customfields WHERE mappedFieldName = '` + req.body.mappedFieldName + `'`;
                // if (req.body.id) {
                //     checkSql += ' AND id != ' + req.body.id;
                // }
                let checkResult = await header.query(checkSql);
                if (checkResult && checkResult.length > 0 && !req.body.id) {
                    let errorResult = new ResultError(203, true, "", new Error("Name Already Exist"), '');
                    next(errorResult);
                } else {
                    if (req.body.id) {
                        if (req.body.valueList && Array.isArray(req.body.valueList)) {
                            const semicolonSeparatedString = req.body.valueList.join(';');
                            req.body.valueList = semicolonSeparatedString;
                            console.log(req.body.valueList)
                        }
                        if (req.body.defaultValue && Array.isArray(req.body.defaultValue)) {
                            const semicolonSeparatedString = req.body.defaultValue.join(';');
                            req.body.defaultValue = semicolonSeparatedString;
                            console.log(req.body.defaultValue)
                        }
                        let sql = `UPDATE customfields SET displayName = '` + req.body.displayName + `',description = ` + (req.body.description ? `'` + req.body.description + `'` : null) + `,allowInSearch = ` + req.body.allowInSearch + `,allowInFilter = ` + req.body.allowInFilter + `, allowIncompleteProfile = ` + req.body.allowIncompleteProfile + `,allowInPreferences =` + req.body.allowInPreferences + `,defaultValue = ` + (req.body.defaultValue ? `'` + req.body.defaultValue + `'` : null) + `,valueList= ` + (req.body.valueList ? `'` + req.body.valueList + `'` : null) + `,completeprofilesectioname = ` + (req.body.completeprofilesectioname ? `'` + req.body.completeprofilesectioname + `'` : null) + ` ,modifiedBy = ` + userId + `, modifiedDate = CURRENT_TIMESTAMP  where id = ` + req.body.id + ``;
                        let result = await header.query(sql);
                        if (result && result.affectedRows > 0) {
                            let successResult = new ResultSuccess(200, true, 'Update Height', result, 1, authorizationResult.token);
                            return res.status(200).send(successResult);
                        }
                        else {
                            let errorResult = new ResultError(400, true, "height.insertUpdateCustomFields() Error", new Error('Error While Updating Data'), '');
                            next(errorResult);
                        }
                    } else {
                        if (req.body.valueList && Array.isArray(req.body.valueList)) {
                            const semicolonSeparatedString = req.body.valueList.join(';');
                            req.body.valueList = semicolonSeparatedString;
                            console.log(req.body.valueList)
                        }
                        // req.body.mappedFieldName = req.body.mappedFieldName.replace(/\s/g, "");
                        let sql = `INSERT INTO customfields(name,displayName,mappedFieldName,description,valueTypeId,textLength,isRequired,allowInSearch,allowInFilter,allowIncompleteProfile,allowInPreferences,defaultValue,valueList,completeprofilesectioname, createdBy, modifiedBy) VALUES('` + req.body.name + `','` + req.body.displayName + `','` + req.body.mappedFieldName + `',` + (req.body.description ? `'` + req.body.description + `'` : null) + `,` + req.body.valueTypeId + `,` + (req.body.textLength ? req.body.textLength : null) + `,` + req.body.isRequired + `,` + req.body.allowInSearch + `,` + req.body.allowInFilter + `,` + req.body.allowIncompleteProfile + `,` + req.body.allowInPreferences + `,` + (req.body.defaultValue ? `'` + req.body.defaultValue + `'` : null) + `,` + (req.body.valueList ? `'` + req.body.valueList + `'` : null) + `,` + (req.body.completeprofilesectioname ? `'` + req.body.completeprofilesectioname + `'` : null) + `,` + userId + `,` + userId + `)`;
                        let result = await header.query(sql);

                        if (result && result.affectedRows > 0) {
                            // let valueTypeSql = `SELECT * FROM valuetypes WHERE id = ` + req.body.valueTypeId;
                            // let valueTypeSqlResult = await header.query(valueTypeSql);

                            // let valueType = valueTypeSqlResult[0].valueTypeName;
                            // let valueTypeId = valueTypeSqlResult[0].valueTypeId
                            req.body.defaultValue = req.body.defaultValue != '' ? req.body.defaultValue : null;
                            let dataType;
                            if (req.body.valueTypeId == 1) {
                                dataType = 'VARCHAR(' + req.body.textLength + ')';
                            } else if (req.body.valueTypeId == 2) {
                                dataType = 'INT';
                            } else if (req.body.valueTypeId == 3 || req.body.valueTypeId == 10) {
                                dataType = 'LONGTEXT';
                            }

                            let addColumnSql = `ALTER TABLE userpersonaldetailcustomdata ADD COLUMN ` + req.body.mappedFieldName + ` ` + dataType + ` NULL DEFAULT null AFTER modifiedBy ;`
                            let addColumnSqlResult = await header.query(addColumnSql);
                            if (result && result.affectedRows > 0) {
                                // let successResult = new ResultSuccess(200, true, 'Insert Custom Field', addColumnSqlResult, 1, authorizationResult.token);
                                // return res.status(200).send(successResult);
                            }
                            else {
                                await header.rollback();
                                let errorResult = new ResultError(400, true, "customField.insertUpdateCustomField() Error", new Error('Error While Inserting Data'), '');
                                next(errorResult);
                            }
                            await header.commit();
                            let successResult = new ResultSuccess(200, true, 'Insert Custom Field', result, 1, authorizationResult.token);
                            return res.status(200).send(successResult);
                        }
                        else {
                            await header.rollback();
                            let errorResult = new ResultError(400, true, "customField.insertUpdateCustomField() Error", new Error('Error While Inserting Data'), '');
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
        await header.rollback();
        let errorResult = new ResultError(500, true, 'Customfield.insertUpdateCustomField() Exception', error, '');
        next(errorResult);
    }
};

const toggleActiveCustomField = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logging.info(NAMESPACE, 'Active Inactive Height');
        let requiredFields = ['id'];
        let validationResult = header.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = await header.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let sql = `UPDATE customfields set isActive = !isActive WHERE id = ` + req.body.id + ``;
                let result = await header.query(sql);
                if (result && result.affectedRows > 0) {
                    let successResult = new ResultSuccess(200, true, 'Change Custom Fields Status', result, 1, authorizationResult.token);
                    return res.status(200).send(successResult);
                }
                else {
                    let errorResult = new ResultError(400, true, "customFields.toggleActiveCustomField() Error", new Error('Error While Change Height Status'), '');
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
        let errorResult = new ResultError(500, true, 'customFields.toggleActiveCustomField() Exception', error, '');
        next(errorResult);
    }
};

const getCustomfieldValueType = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logging.info(NAMESPACE, 'Getting Custom field Value Type');
        let authorizationResult = await header.validateAuthorization(req, res, next);
        if (authorizationResult.statusCode == 200) {
            // let startIndex = req.body.startIndex ? req.body.startIndex : (req.body.startIndex === 0 ? 0 : null);
            // let fetchRecord = req.body.fetchRecord ? req.body.fetchRecord : null;
            let countSql = "SELECT COUNT(*) as totalCount  FROM valuetypes";
            // if (req.body.name) {
            //     if (!countSql.includes(` WHERE `)) {
            //         countSql += ` WHERE `;
            //     } else {
            //         countSql += ` AND `;
            //     }
            //     countSql += ` name LIKE '%` + req.body.name + `%' `;
            // }
            let countResult = await header.query(countSql);
            let sql = `SELECT * FROM valuetypes WHERE isDelete = 0 AND isShowInCustomField = 1`;
            // if (req.body.name) {
            //     if (!sql.includes(` WHERE `)) {
            //         sql += ` WHERE `;
            //     } else {
            //         sql += ` AND `;
            //     }
            //     sql += ` name LIKE '%` + req.body.name + `%' `;
            // }
            // sql += ` ORDER BY id DESC `;
            // if (startIndex != null && fetchRecord != null) {
            //     sql += " LIMIT " + fetchRecord + " OFFSET " + startIndex + "";
            // }
            let result = await header.query(sql);
            if (result) {
                let successResult = new ResultSuccess(200, true, 'Get CustomFields Successfully', result, countResult[0].totalCount, authorizationResult.token);
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
        let errorResult = new ResultError(500, true, 'customFields.getCustomFields() Exception', error, '');
        next(errorResult);
    }
};

const removeCustomfields = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logging.info(NAMESPACE, 'Remove Custom fields');
        let requiredFields = ['id'];
        let validationResult = header.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = await header.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                await header.beginTransaction();
                let mappedFieldName = await header.query(`SELECT mappedFieldName FROM  customfields WHERE id = ` + req.body.id);
                let sql = `ALTER TABLE userpersonaldetailcustomdata DROP COLUMN ` + mappedFieldName[0].mappedFieldName;
                let result = await header.query(sql);
                if (result) {
                    await header.query(`DELETE FROM customfields WHERE id =` + req.body.id);
                    await header.commit();
                    let successResult = new ResultSuccess(200, true, 'Remove CustomFields Successfully', result, 1, authorizationResult.token);
                    return res.status(200).send(successResult);
                } else {
                    await header.rollback();
                    let errorResult = new ResultError(400, true, 'Data Not Available', new Error('Data Not Available'), '');
                    next(errorResult);
                }
            } else {
                let errorResult = new ResultError(401, true, "Unauthorized request", new Error(authorizationResult.message), '');
                next(errorResult);
            }
        }
        else {
            let errorResult = new ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
            next(errorResult);
        }
    } catch (error: any) {
        let errorResult = new ResultError(500, true, 'customFields.removeCustomfields() Exception', error, '');
        next(errorResult);
    }
};

const getCustomfieldDetail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logging.info(NAMESPACE, 'Getting Custom fields');
        let requiredFields = ['id'];
        let validationResult = header.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = await header.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let sql = `SELECT * FROM customfields WHERE isDelete = 0 AND id=` + req.body.id;
                let result = await header.query(sql);
                if (result && result.length > 0) {
                    for (let i = 0; i < result.length; i++) {
                        if (result[i].valueTypeId == 1) {
                            result[i].valueTypeName = 'Text'
                        } else if (result[i].valueTypeId == 2) {
                            result[i].valueTypeName = 'Number'
                        } else if (result[i].valueTypeId == 3) {
                            result[i].valueTypeName = 'DropDownList'
                        } else if (result[i].valueTypeId == 10) {
                            result[i].valueTypeName = 'MultipleDropDownList'
                        }

                        if (result[i].valueList && typeof result[i].valueList === 'string') {
                            const valueArray: string[] = result[i].valueList.includes(';') ? result[i].valueList.split(";") : [result[i].valueList];
                            result[i].valueList = valueArray;
                        }
                        // if (result[i].defaultValue && typeof result[i].defaultValue === 'string' && result[i].valueTypeId == 10) {
                        //     const defaultValueArray: string[] = result[i].defaultValue.includes(';') ? result[i].defaultValue.split(";") : [result[i].valueList];
                        //     result[i].defaultValue = defaultValueArray;
                        // }
                    }
                    let successResult = new ResultSuccess(200, true, 'Get CustomFields Successfully', result, 1, authorizationResult.token);
                    return res.status(200).send(successResult);
                } else {
                    let errorResult = new ResultError(400, true, 'Data Not Available', new Error('Data Not Available'), '');
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
        let errorResult = new ResultError(500, true, 'customFields.getCustomFields() Exception', error, '');
        next(errorResult);
    }
};



export default { getCustomfields, toggleActiveCustomField, getCustomfieldValueType, removeCustomfields, insertUpdateCustomField, getCustomfieldDetail }
