"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logging_1 = __importDefault(require("../../config/logging"));
const apiHeader_1 = __importDefault(require("../../middleware/apiHeader"));
const resultsuccess_1 = require("../../classes/response/resultsuccess");
const resulterror_1 = require("../../classes/response/resulterror");
const NAMESPACE = 'Profile For';
const getProfileFor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Getting Document Type');
        let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
        if (authorizationResult.statusCode == 200) {
            let startIndex = req.body.startIndex ? req.body.startIndex : (req.body.startIndex === 0 ? 0 : null);
            let fetchRecord = req.body.fetchRecord ? req.body.fetchRecord : null;
            let countSql = "SELECT COUNT(*) as totalCount FROM profilefor";
            if (req.body.name) {
                if (!countSql.includes(` WHERE `)) {
                    countSql += ` WHERE `;
                }
                else {
                    countSql += ` AND `;
                }
                countSql += ` name LIKE '%` + req.body.name + `%' `;
            }
            if (req.body.isActive == true || req.body.isActive == false) {
                if (!countSql.includes(` WHERE `)) {
                    countSql += ` WHERE `;
                }
                else {
                    countSql += ` AND `;
                }
                countSql += ` isActive=` + req.body.isActive;
            }
            let countResult = yield apiHeader_1.default.query(countSql);
            let sql = `SELECT * FROM profilefor WHERE isDelete = 0 `;
            if (req.body.name) {
                if (!sql.includes(` WHERE `)) {
                    sql += ` WHERE `;
                }
                else {
                    sql += ` AND `;
                }
                sql += ` name LIKE '%` + req.body.name + `%' `;
            }
            if (req.body.isActive == true || req.body.isActive == false) {
                if (!sql.includes(` WHERE `)) {
                    sql += ` WHERE `;
                }
                else {
                    sql += ` AND `;
                }
                sql += ` isActive=` + req.body.isActive;
            }
            sql += ` ORDER BY id DESC `;
            if (startIndex != null && fetchRecord != null) {
                sql += " LIMIT " + fetchRecord + " OFFSET " + startIndex + "";
            }
            let result = yield apiHeader_1.default.query(sql);
            if (result) {
                let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Get Profile For Successfully', result, countResult[0].totalCount, authorizationResult.token);
                return res.status(200).send(successResult);
            }
            else {
                let errorResult = new resulterror_1.ResultError(400, true, 'Data Not Available', new Error('Data Not Available'), '');
                next(errorResult);
            }
        }
        else {
            let errorResult = new resulterror_1.ResultError(401, true, "Unauthorized request", new Error(authorizationResult.message), '');
            next(errorResult);
        }
    }
    catch (error) {
        let errorResult = new resulterror_1.ResultError(500, true, 'profileFor.getProfileFor() Exception', error, '');
        next(errorResult);
    }
});
const insertUpdateProfileFor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Inserting Profile For');
        let requiredFields = ['name'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                req.body.gender = req.body.gender ? req.body.gender : null;
                let currentUser = authorizationResult.currentUser;
                let userId = currentUser.id;
                let checkSql = `SELECT * FROM profilefor WHERE name = '` + req.body.name + `'`;
                if (req.body.id) {
                    checkSql += ' AND id != ' + req.body.id;
                }
                let checkResult = yield apiHeader_1.default.query(checkSql);
                if (checkResult && checkResult.length > 0) {
                    let errorResult = new resulterror_1.ResultError(203, true, "", new Error("Profile For Already Exist"), '');
                    next(errorResult);
                }
                else {
                    if (req.body.id) {
                        let sql = `UPDATE profilefor SET name = '` + req.body.name + `', gender = ` + (req.body.gender ? "'" + req.body.gender + "'" : null) + ` where id = ` + req.body.id + ``;
                        let result = yield apiHeader_1.default.query(sql);
                        if (result && result.affectedRows > 0) {
                            let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Update Profile For', result, 1, authorizationResult.token);
                            return res.status(200).send(successResult);
                        }
                        else {
                            let errorResult = new resulterror_1.ResultError(400, true, "profileFor.insertUpdateProfileFor() Error", new Error('Error While Updating Data'), '');
                            next(errorResult);
                        }
                    }
                    else {
                        let sql = `INSERT INTO profilefor (name, gender, createdBy, modifiedBy) 
                                   VALUES ('` + req.body.name + `', ` + (req.body.gender ? "'" + req.body.gender + "'" : null) + ` ,` + userId + `,` + userId + ` )`;
                        let result = yield apiHeader_1.default.query(sql);
                        if (result && result.affectedRows > 0) {
                            let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Insert Profile For', result, 1, authorizationResult.token);
                            return res.status(200).send(successResult);
                        }
                        else {
                            let errorResult = new resulterror_1.ResultError(400, true, "profileFor.insertUpdateProfileFor() Error", new Error('Error While Updating Data'), '');
                            next(errorResult);
                        }
                    }
                }
            }
            else {
                let errorResult = new resulterror_1.ResultError(401, true, "Unauthorized request", new Error(authorizationResult.message), '');
                next(errorResult);
            }
        }
        else {
            let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
            next(errorResult);
        }
    }
    catch (error) {
        let errorResult = new resulterror_1.ResultError(500, true, 'documenttype.insertUpdateDocumentTypes() Exception', error, '');
        next(errorResult);
    }
});
const activeInactiveProfileFor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Active Inactive Profile For');
        let requiredFields = ['id'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let sql = `UPDATE profilefor set isActive = !isActive WHERE id = ` + req.body.id + ``;
                let result = yield apiHeader_1.default.query(sql);
                if (result && result.affectedRows > 0) {
                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Change Profile For Status', result, 1, authorizationResult.token);
                    return res.status(200).send(successResult);
                }
                else {
                    let errorResult = new resulterror_1.ResultError(400, true, "profileFor.insertUpdateProfileFor() Error", new Error('Error While Change Profile For Status'), '');
                    next(errorResult);
                }
            }
            else {
                let errorResult = new resulterror_1.ResultError(401, true, "Unauthorized request", new Error(authorizationResult.message), '');
                next(errorResult);
            }
        }
        else {
            let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
            next(errorResult);
        }
    }
    catch (error) {
        let errorResult = new resulterror_1.ResultError(500, true, 'documentType.activeIanctiveDocumentTypes() Exception', error, '');
        next(errorResult);
    }
});
exports.default = { getProfileFor, activeInactiveProfileFor, insertUpdateProfileFor };