"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const logging_1 = __importDefault(require("../../config/logging"));
const config_1 = __importDefault(require("../../config/config"));
const apiHeader_1 = __importDefault(require("../../middleware/apiHeader"));
const signJTW_1 = __importDefault(require("../../function/signJTW"));
const resultsuccess_1 = require("../../classes/response/resultsuccess");
const resulterror_1 = require("../../classes/response/resulterror");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const refreshToken_1 = __importDefault(require("../../function/refreshToken"));
const hi_base32_1 = require("hi-base32");
const OTPAuth = __importStar(require("otpauth"));
// import config from '../../config/config';
const mysql = require('mysql');
const util = require('util');
const fs = require('fs');
// const path = require('path');
// const sharp = require('sharp');
var Jimp = require("jimp");
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotallySecretKey');
const nodemailer = require("nodemailer");
// delete require.cache[require.resolve('./variable.json')];
// let jsonData = require('./variable.json');
// delete require.cache[require.resolve(path.join('variable.json'))];
// let jsonData = require(path.join('variable.json'));
Object.keys(require.cache).forEach(function (key) {
    delete require.cache[key];
});
let rawData = fs.readFileSync('variable.json', 'utf8');
let jsonData = JSON.parse(rawData);
// let jsonData: any
fs.watchFile('variable.json', (curr, prev) => {
    if (curr.mtime !== prev.mtime) {
        fs.readFile('variable.json', 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading variable.json:', err);
                return;
            }
            jsonData = JSON.parse(data);
        });
    }
});
let connection = mysql.createConnection({
    host: jsonData.MYSQL_HOST,
    user: jsonData.MYSQL_USER,
    password: jsonData.MYSQL_PASSWORD,
    database: jsonData.MYSQL_DATABASE
});
const query = util.promisify(connection.query).bind(connection);
const beginTransaction = util.promisify(connection.beginTransaction).bind(connection);
const commit = util.promisify(connection.commit).bind(connection);
const rollback = util.promisify(connection.rollback).bind(connection);
// const databaseconfig = {
//     host: jsonData.MYSQL_HOST,
//     user: jsonData.MYSQL_USER,
//     password: jsonData.MYSQL_PASSWORD,
//     database: jsonData.MYSQL_DATABASE
// };
const NAMESPACE = 'Users';
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(jsonData);
        logging_1.default.info(NAMESPACE, 'Login');
        let requiredFields = ['email', 'password'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            yield beginTransaction();
            let userId;
            let insertRefTokenResult;
            let sql = `SELECT u.*, ur.roleId as roleId, roles.name as roleName, img.imageUrl as image FROM users u
                LEFT JOIN userroles ur ON ur.userId = u.id
                LEFT JOIN images img ON img.id =u.imageId
                LEFT jOIN roles ON roles.id = ur.roleId
                WHERE u.email = '` + req.body.email + `' AND u.isActive = true AND u.isDisable = false AND (ur.roleId = 1 OR ur.roleId = 3)`;
            let result = yield query(sql);
            let userResult = result;
            userId = result[0].id;
            if (result && result.length > 0) {
                yield bcryptjs_1.default.compare(req.body.password, result[0].password, (error, hashresult) => __awaiter(void 0, void 0, void 0, function* () {
                    if (hashresult == false) {
                        return res.status(401).json({
                            message: 'Password Mismatch'
                        });
                    }
                    else if (hashresult) {
                        let signJWTResult = yield (0, signJTW_1.default)(result[0]);
                        if (signJWTResult && signJWTResult.token) {
                            userResult[0].token = signJWTResult.token;
                            if (userResult[0].roleId == 3) {
                                let getUserPagesSql = `SELECT p.*, up.isReadPermission, up.isAddPermission, up.isDeletePermission, up.isEditPermission FROM pages p INNER JOIN userpages up ON up.pageId = p.id WHERE up.userId = ` + userResult[0].id;
                                let getUserPagesResult = yield query(getUserPagesSql);
                                userResult[0].pagePermissions = getUserPagesResult;
                            }
                            let refreshToken = yield (0, refreshToken_1.default)(userResult[0]);
                            let defaultCurrencySql = `SELECT * From currencies WHERE isDefault = 1`;
                            let defaultCurrency = yield query(defaultCurrencySql);
                            userResult[0].defaultCurrency = defaultCurrency;
                            //insert refresh token
                            let insertRefreshTokenSql = `INSERT INTO userrefreshtoken(userId, refreshToken, expireAt) VALUES(?,?,?)`;
                            insertRefTokenResult = yield query(insertRefreshTokenSql, [userResult[0].id, refreshToken.token, refreshToken.expireAt]);
                            if (insertRefTokenResult && insertRefTokenResult.affectedRows > 0) {
                                userResult[0].refreshToken = refreshToken.token;
                                yield commit();
                                let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Login User', userResult, 1, "");
                                return res.status(200).send(successResult);
                            }
                            else {
                                yield rollback();
                                let errorResult = new resulterror_1.ResultError(400, true, "users.signUp() Error", new Error('Error While Login'), '');
                                next(errorResult);
                                return res.status(400).send(errorResult);
                            }
                        }
                        else {
                            return res.status(401).json({
                                message: 'Unable to Sign JWT',
                                error: signJWTResult.error
                            });
                        }
                    }
                }));
            }
            else {
                yield rollback();
                let errorResult = new resulterror_1.ResultError(400, true, "users.login() Error", new Error('Error While Login'), '');
                next(errorResult);
            }
        }
        else {
            yield rollback();
            let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
            next(errorResult);
        }
    }
    catch (error) {
        // await rollback();
        let errorResult = new resulterror_1.ResultError(500, true, 'Users.login() Exception', error, '');
        next(errorResult);
    }
});
const addUserImageFiles = (req) => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    let imageId;
    try {
        let sql = `INSERT INTO images(createdBy, modifiedBy) VALUES (` + req.userId + `,` + req.userId + `)`;
        result = yield apiHeader_1.default.query(sql);
        if (result.affectedRows > 0) {
            imageId = result.insertId;
            let dir = './content';
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            let dir1 = './content/user';
            if (!fs.existsSync(dir1)) {
                fs.mkdirSync(dir1);
            }
            let dir2 = './content/user/' + req.userId;
            if (!fs.existsSync(dir2)) {
                fs.mkdirSync(dir2);
            }
            const fileContentsUser = new Buffer(req.imgData, 'base64');
            let imgPath = "./content/user/" + req.userId + "/" + result.insertId + "-realImg.jpeg";
            fs.writeFileSync(imgPath, fileContentsUser, (err) => {
                if (err)
                    return console.error(err);
                console.log('file saved imagePath');
            });
            let imagePath = "./content/user/" + req.userId + "/" + result.insertId + ".jpeg";
            // sharp(imgPath).resize({
            //     height: 100,
            //     width: 100
            // }).toFile(imagePath)
            //     .then(function (newFileInfo: any) {
            //         console.log(newFileInfo);
            //     });
            yield Jimp.read(imgPath)
                .then((lenna) => {
                return lenna
                    .resize(100, 100) // resize
                    // .quality(60) // set JPEG quality
                    // .greyscale() // set greyscale
                    // .write("lena-small-bw.jpg"); // save
                    .write(imagePath);
            })
                .catch((err) => {
                console.error(err);
            });
            let updateimagePathSql = `UPDATE images SET imageUrl='` + imagePath.substring(2) + `' WHERE id=` + result.insertId;
            let updateimagePathResult = yield apiHeader_1.default.query(updateimagePathSql);
            result = JSON.parse(JSON.stringify(result));
        }
        else {
            result = JSON.parse(JSON.stringify(result));
        }
    }
    catch (err) {
        let imagePath = "./content/user/" + req.userId + "/" + imageId + ".jpeg";
        if (fs.existsSync(imagePath)) {
            fs.unlink(imagePath, (err) => {
                if (err)
                    throw err;
                console.log(imagePath + ' was deleted');
            });
        }
        let dir = './content/user/' + req.userId;
        if (fs.existsSync(dir)) {
            fs.rmdir(dir, (err) => {
                if (err)
                    throw err;
                console.log(dir + ' was deleted');
            });
        }
        result = err;
    }
    return result;
});
const insertUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'SignUp');
        let requiredFields = ['firstName', 'lastName', 'email', 'password', 'contactNo', 'gender'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let result;
                req.body.middleName = req.body.middleName ? req.body.middleName : '';
                yield apiHeader_1.default.beginTransaction();
                bcryptjs_1.default.hash(req.body.password, 10, (hashError, hash) => __awaiter(void 0, void 0, void 0, function* () {
                    if (hashError) {
                        return res.status(401).json({
                            message: hashError.message,
                            error: hashError
                        });
                    }
                    let checkEmailSql = `SELECT * FROM users WHERE email = '` + req.body.email + `'`;
                    let checkEmailResult = yield apiHeader_1.default.query(checkEmailSql);
                    if (checkEmailResult && checkEmailResult.length > 0) {
                        yield apiHeader_1.default.rollback();
                        let errorResult = new resulterror_1.ResultError(400, true, "Email Already Inserted", new Error('Email Already Inserted'), '');
                        next(errorResult);
                        // let successResult = new ResultSuccess(200, true, 'Email Already Inserted', [], 1, "");
                        // return res.status(200).send(successResult);
                    }
                    else {
                        let sql = `INSERT INTO users(firstName, middlename, lastName, contactNo, email, gender, password, isDisable, isReceiveMail, isReceiveNotification) 
                        VALUES('` + req.body.firstName + `','` + req.body.middleName + `','` + req.body.lastName + `',` + req.body.contactNo + `,'` + req.body.email + `','` + req.body.gender + `'
                        ,'` + hash + `',0,` + (req.body.isReceiveMail ? true : false) + `,` + (req.body.isReceiveNotification ? true : false) + `)`;
                        result = yield apiHeader_1.default.query(sql);
                        if (result && result.insertId > 0) {
                            let userId = result.insertId;
                            if (req.body.image && req.body.image.indexOf('content') == -1) {
                                if (req.body.image) {
                                    let image = req.body.image;
                                    let data = image.split(',');
                                    if (data && data.length > 1) {
                                        image = image.split(',')[1];
                                    }
                                    let imageData = {
                                        imgPath: '',
                                        imgData: image,
                                        description: image,
                                        alt: image.alt,
                                        userId: userId
                                    };
                                    let imageResult = yield addUserImageFiles(imageData);
                                    req.body.imageId = imageResult.insertId;
                                    if (req.body.imageId) {
                                        let sql1 = "UPDATE users SET imageId = " + req.body.imageId + " WHERE id =" + userId + "";
                                        result = yield apiHeader_1.default.query(sql1);
                                    }
                                }
                                else {
                                    req.body.imageId = null;
                                }
                            }
                            let userRoleSql = `INSERT INTO userroles(userId, roleId) VALUES (` + userId + `, 3) `;
                            result = yield apiHeader_1.default.query(userRoleSql);
                            if (result && result.affectedRows > 0) {
                                // await login(req.body, res, next);
                                yield apiHeader_1.default.commit();
                                let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Insert User', result, 1, "");
                                return res.status(200).send(successResult);
                            }
                            else {
                                yield apiHeader_1.default.rollback();
                                let errorResult = new resulterror_1.ResultError(400, true, "users.insertUser() Error", new Error('Error While Inserting Data'), '');
                                next(errorResult);
                            }
                        }
                        else {
                            yield apiHeader_1.default.rollback();
                            let errorResult = new resulterror_1.ResultError(400, true, "users.insertUser() Error", new Error('Error While Inserting Data'), '');
                            next(errorResult);
                        }
                    }
                }));
            }
            else {
                let errorResult = new resulterror_1.ResultError(401, true, "Unauthorized request", new Error(authorizationResult.message), '');
                next(errorResult);
            }
        }
        else {
            yield apiHeader_1.default.rollback();
            let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
            next(errorResult);
        }
    }
    catch (error) {
        yield apiHeader_1.default.rollback();
        let errorResult = new resulterror_1.ResultError(500, true, 'users.insertUser() Exception', error, '');
        next(errorResult);
    }
});
const getAllUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Getting All Users');
        let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
        if (authorizationResult.statusCode == 200) {
            let currentUser = authorizationResult.currentUser;
            let userId = currentUser.id;
            let startIndex = req.body.startIndex ? req.body.startIndex : (req.body.startIndex === 0 ? 0 : null);
            let fetchRecord = req.body.fetchRecord ? req.body.fetchRecord : null;
            let countSql = `SELECT COUNT(*) as totalCount  FROM users
            LEFT JOIN userroles ur ON ur.userId = users.id
            WHERE users.isDelete = 0 AND (ur.roleId = 1 OR ur.roleId = 3) AND users.id != ` + userId;
            if (req.body.searchString) {
                if (!countSql.includes(` WHERE `)) {
                    countSql += ` WHERE `;
                }
                else {
                    countSql += ` AND `;
                }
                countSql += ` (users.firstName LIKE '%` + req.body.searchString + `%' OR users.lastName LIKE '%` + req.body.searchString + `%' OR users.email LIKE '%` + req.body.searchString + `%' OR users.contactNo LIKE '%` + req.body.searchString + `%' OR users.gender LIKE '%` + req.body.searchString + `%')`;
            }
            let countResult = yield apiHeader_1.default.query(countSql);
            let sql = `SELECT users.*, img.imageUrl as image, ur.roleId as roleId FROM users
            LEFT JOIN images img ON img.id = users.imageId
            LEFT JOIN userroles ur ON ur.userId = users.id
            WHERE users.isDelete = 0 AND (ur.roleId = 1 OR ur.roleId = 3)  AND users.id != ` + userId;
            if (req.body.searchString) {
                if (!sql.includes(` WHERE `)) {
                    sql += ` WHERE `;
                }
                else {
                    sql += ` AND `;
                }
                sql += ` (users.firstName LIKE '%` + req.body.searchString + `%' OR users.lastName LIKE '%` + req.body.searchString + `%' OR users.email LIKE '%` + req.body.searchString + `%' OR users.contactNo LIKE '%` + req.body.searchString + `%' OR users.gender LIKE '%` + req.body.searchString + `%')`;
            }
            sql += " ORDER BY users.id DESC";
            if (startIndex != null && fetchRecord != null) {
                sql += " LIMIT " + fetchRecord + " OFFSET " + startIndex + "";
            }
            let result = yield apiHeader_1.default.query(sql);
            if (result) {
                let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Get Users Successfully', result, countResult[0].totalCount, authorizationResult.token);
                console.log(successResult);
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
        let errorResult = new resulterror_1.ResultError(500, true, 'users.getAllUsers() Exception', error, '');
        next(errorResult);
    }
});
const getUserDetailById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Getting User Detail');
        let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
        if (authorizationResult.statusCode == 200) {
            let currentUser = authorizationResult.currentUser;
            let userId = currentUser.id;
            let startIndex = req.body.startIndex ? req.body.startIndex : (req.body.startIndex === 0 ? 0 : null);
            let fetchRecord = req.body.fetchRecord ? req.body.fetchRecord : null;
            let sql = `SELECT users.*, img.imageUrl as image, ur.roleId as roleId, , roles.name as roleName FROM users
            LEFT JOIN images img ON img.id = users.imageId
            LEFT JOIN userroles ur ON ur.userId = users.id
            LEFT jOIN roles ON roles.id = ur.roleId
        WHERE users.isDelete = 0 AND (ur.roleId = 1 OR ur.roleId = 3)  AND users.id = ` + userId;
            let result = yield apiHeader_1.default.query(sql);
            if (result && result.length > 0) {
                let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Get User Detail Successfully', result, result.totalCount, authorizationResult.token);
                console.log(successResult);
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
        let errorResult = new resulterror_1.ResultError(500, true, 'users.getUserDetailById() Exception', error, '');
        next(errorResult);
    }
});
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Updating Users');
        let requiredFields = ['id', 'firstName', 'lastName', 'email', 'contactNo', 'gender'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                yield apiHeader_1.default.beginTransaction();
                req.body.firstName = req.body.firstName ? req.body.firstName : '';
                req.body.middleName = req.body.middleName ? req.body.middleName : '';
                req.body.lastName = req.body.lastName ? req.body.lastName : '';
                req.body.contactNo = req.body.contactNo ? req.body.contactNo : '';
                req.body.email = req.body.email ? req.body.email : '';
                req.body.gender = req.body.gender ? req.body.gender : '';
                let oldImageId;
                let userId = req.body.id;
                let checkEmailSql = `SELECT * FROM users WHERE email = '` + req.body.email + `' AND id != ` + req.body.id + ` AND isDelete = 0`;
                let checkEmailResult = yield apiHeader_1.default.query(checkEmailSql);
                if (checkEmailResult && checkEmailResult.length > 0) {
                    yield apiHeader_1.default.rollback();
                    let errorResult = new resulterror_1.ResultError(400, true, "users.insertUser() Error", new Error('Email Already Inserted'), '');
                    next(errorResult);
                }
                else {
                    let getImageIdSql = `select users.id, users.imageId from users where id = ` + req.body.id + ``;
                    let usersResult = yield apiHeader_1.default.query(getImageIdSql);
                    if (usersResult && usersResult.length > 0) {
                        oldImageId = usersResult[0].imageId;
                    }
                    if (req.body.image && req.body.image.indexOf('content') == -1) {
                        if (req.body.image) {
                            let image = req.body.image;
                            let data = image.split(',');
                            if (data && data.length > 1) {
                                image = image.split(',')[1];
                            }
                            let imageData = {
                                imgPath: '',
                                imgData: image,
                                description: image,
                                alt: image.alt,
                                userId: userId
                            };
                            let imageResult = yield addUserImageFiles(imageData);
                            if (imageResult && imageResult.insertId > 0) {
                                req.body.imageId = imageResult.insertId;
                            }
                            else {
                                yield apiHeader_1.default.rollback();
                                return imageResult;
                            }
                        }
                        else if (req.body.image == undefined || req.body.image == '') {
                            req.body.imageId = null;
                        }
                    }
                    else if (!req.body.image || req.body.image == undefined) {
                        req.body.imageId = null;
                        let imageSql = `SELECT * FROM images WHERE id = ` + oldImageId;
                        let imageResult = yield apiHeader_1.default.query(imageSql);
                        if (imageResult && imageResult.length > 0) {
                            if (imageResult[0].imageUrl) {
                                let imagePath = "./" + imageResult[0].imageUrl;
                                if (fs.existsSync(imagePath)) {
                                    fs.unlink(imagePath, (err) => {
                                        if (err)
                                            throw err;
                                        console.log(imagePath + ' was deleted');
                                    });
                                }
                                //Delete URL
                            }
                        }
                    }
                    else if (req.body.image) {
                        req.body.imageId = oldImageId;
                    }
                    let sql = `UPDATE users SET firstName = '` + req.body.firstName + `', middleName = '` + req.body.middleName + `',lastName = '` + req.body.lastName + `'
                    ,contactNo = '` + req.body.contactNo + `',email = '` + req.body.email + `',gender = '` + req.body.gender + `',imageId = ` + req.body.imageId + ` 
                    ,isReceiveMail = ` + (req.body.isReceiveMail ? true : false) + `, isReceiveNotification =` + (req.body.isReceiveNotification ? true : false) + `
                    WHERE id = ` + req.body.id + ``;
                    // isPasswordSet = '` + req.body.isPasswordSet + `',isDisabled = '` + req.body.isDisabled + `',isVerified = '` + req.body.isVerified + `',imageId = ` + req.body.imageId + `
                    let result = yield apiHeader_1.default.query(sql);
                    if (result && result.affectedRows > 0) {
                        if (req.body.imageId && req.body.imageId != oldImageId) {
                            let delSql = `DELETE FROM images where Id = ` + oldImageId;
                            let delResult = yield apiHeader_1.default.query(delSql);
                            if (delResult && delResult.affectedRows > 0) {
                                if (fs.existsSync("./content/user/" + req.body.id + "/" + oldImageId + ".jpeg")) {
                                    fs.unlink("./content/user/" + req.body.id + "/" + oldImageId + ".jpeg", (err) => {
                                        if (err)
                                            throw err;
                                        console.log('Image was deleted');
                                    });
                                }
                                if (fs.existsSync("./content/user/" + req.body.id + "/" + oldImageId + "-realImg.jpeg")) {
                                    fs.unlink("./content/user/" + req.body.id + "/" + oldImageId + "-realImg.jpeg", (err) => {
                                        if (err)
                                            throw err;
                                        console.log('Image was deleted');
                                    });
                                }
                                let userSql = `SELECT u.*, img.imageUrl FROM users u
                            LEFT JOIN images img ON img.id = u.imageId
                            WHERE u.id = ` + req.body.id;
                                let userResult = yield apiHeader_1.default.query(userSql);
                                if (userResult && userResult.length > 0) {
                                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Update User Profile Pic', userResult, userResult.length, authorizationResult.token);
                                    return res.status(200).send(successResult);
                                }
                                else {
                                    let errorResult = new resulterror_1.ResultError(400, true, "users.updateUserProfilePic() Error", new Error('Error While Updating Profile Pic'), '');
                                    next(errorResult);
                                }
                            }
                        }
                        yield apiHeader_1.default.commit();
                        let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Update User Detail', result, 1, authorizationResult.token);
                        return res.status(200).send(successResult);
                    }
                    else {
                        yield apiHeader_1.default.rollback();
                        let errorResult = new resulterror_1.ResultError(203, true, "users.updateUSers() Error", new Error('Error While Updating Data'), '');
                        next(errorResult);
                    }
                }
            }
            else {
                yield apiHeader_1.default.rollback();
                let errorResult = new resulterror_1.ResultError(401, true, "Unauthorized request", new Error(authorizationResult.message), '');
                next(errorResult);
            }
        }
        else {
            yield apiHeader_1.default.rollback();
            let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
            next(errorResult);
        }
    }
    catch (error) {
        yield apiHeader_1.default.rollback();
        let errorResult = new resulterror_1.ResultError(500, true, 'users.updateUSers() Exception', error, '');
        next(errorResult);
    }
});
const validateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Checking Token');
        let statusCode = 200;
        let message = '';
        if (req.body.token) {
            yield jsonwebtoken_1.default.verify(req.body.token, config_1.default.server.token.secret, (error, decoded) => __awaiter(void 0, void 0, void 0, function* () {
                if (error) {
                    statusCode = 400;
                    message = "UnAuthorize";
                }
                else {
                    let decodeVal = decoded;
                    if ((new Date().getTime() / 1000) <= decodeVal.exp) {
                        // console.log("Valid Live Token");
                        return true;
                    }
                    else {
                        // console.log("Valid Expire Token");
                        return false;
                    }
                }
            }));
        }
        else {
            // console.log('error');
            let err = 'error';
            return err;
        }
    }
    catch (error) {
        let errorResult = new resulterror_1.ResultError(500, true, 'users.updateUSers() Exception', error, '');
        next(errorResult);
    }
});
const activeInactiveUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Active Inactive Users');
        let requiredFields = ['id'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let sql = `UPDATE users set isActive = !isActive WHERE id = ` + req.body.id + ``;
                let result = yield apiHeader_1.default.query(sql);
                let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Change User Status', result, 1, authorizationResult.token);
                return res.status(200).send(successResult);
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
        let errorResult = new resulterror_1.ResultError(500, true, 'users.activeInactiveUsers() Exception', error, '');
        next(errorResult);
    }
});
const resetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Reset Password');
        let requiredFields = ['id', 'password', 'token'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            bcryptjs_1.default.hash(req.body.password, 10, (hashError, hash) => __awaiter(void 0, void 0, void 0, function* () {
                if (hashError) {
                    return res.status(401).json({
                        message: hashError.message,
                        error: hashError
                    });
                }
                let sql = `UPDATE users SET password = '` + hash + `' where id = ` + req.body.id + ``;
                let result = yield apiHeader_1.default.query(sql);
                if (result && result.affectedRows > 0) {
                    if (req.body.token) {
                        let userTokenUpdateSql = `UPDATE usertokens SET isUsed = 1 WHERE token = '` + req.body.token + `' AND userId = ` + req.body.id + ``;
                        result = yield apiHeader_1.default.query(userTokenUpdateSql);
                    }
                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Password reset successfully!', result, 1, "null");
                    return res.status(200).send(successResult);
                }
                else {
                    yield apiHeader_1.default.rollback();
                    let errorResult = new resulterror_1.ResultError(400, true, "users.resetPassword() Error", new Error('Error While Reset Password'), '');
                    next(errorResult);
                }
            }));
        }
        else {
            yield apiHeader_1.default.rollback();
            let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
            next(errorResult);
        }
    }
    catch (error) {
        yield apiHeader_1.default.rollback();
        let errorResult = new resulterror_1.ResultError(500, true, 'users.resetPassword() Exception', error, '');
        next(errorResult);
    }
});
const forgotPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Reset Password');
        let requiredFields = ['email'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            yield apiHeader_1.default.beginTransaction();
            let result;
            let sql = `SELECT * FROM users WHERE email = '` + req.body.email + `'`;
            let userData = yield apiHeader_1.default.query(sql);
            if (userData && userData.length > 0) {
                let token = cryptr.encrypt(makeid(10)); //crypto.randomBytes(48).toString('hex');
                let expireAtDate = new Date(new Date().toUTCString());
                expireAtDate.setDate(expireAtDate.getDate() + 1);
                let data = {
                    userId: userData[0].id,
                    token: token,
                    isUsed: 0,
                    expireAt: expireAtDate,
                    isActive: true,
                    isDelete: false,
                    createdDate: new Date(new Date().toUTCString()),
                    modifiedDate: new Date(new Date().toUTCString())
                };
                let sql = "INSERT INTO usertokens SET ?";
                result = yield apiHeader_1.default.query(sql, data);
                if (result.insertId > 0) {
                    let resultEmail = yield sendEmail(config_1.default.emailMatrimonySetPassword.fromName + ' <' + config_1.default.emailMatrimonySetPassword.fromEmail + '>', userData[0].email, config_1.default.emailMatrimonySetPassword.subject, "", config_1.default.emailMatrimonySetPassword.html.replace("[VERIFICATION_TOKEN]", token).replace("[NAME]", userData[0].firstName + ' ' + userData[0].lastName), null, null);
                    yield apiHeader_1.default.commit();
                    result = resultEmail;
                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Send mail successfully!', result, 1, "");
                    return res.status(200).send(successResult);
                }
                else {
                    yield apiHeader_1.default.rollback();
                    result.length = 0;
                }
            }
            else {
                yield apiHeader_1.default.rollback();
                let errorResult = new resulterror_1.ResultError(400, true, 'User not found', new Error('Data Not Available'), '');
                next(errorResult);
            }
        }
        else {
            yield apiHeader_1.default.rollback();
            let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
            next(errorResult);
        }
    }
    catch (error) {
        yield apiHeader_1.default.rollback();
        let errorResult = new resulterror_1.ResultError(500, true, 'users.resetPassword() Exception', error, '');
        next(errorResult);
    }
});
const sendEmail = (from, to, subject, text, html, fileName, invoicePdf) => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    try {
        // create reusable transporter object using the default SMTP transport
        let systemFlags = `SELECT * FROM systemflags where flagGroupId = 2`;
        let _systemFlags = yield apiHeader_1.default.query(systemFlags);
        let _host;
        let _port;
        let _secure;
        let _user;
        let _password;
        for (let i = 0; i < _systemFlags.length; i++) {
            if (_systemFlags[i].id == 4) {
                _host = _systemFlags[i].value;
            }
            else if (_systemFlags[i].id == 5) {
                _port = parseInt(_systemFlags[i].value);
            }
            else if (_systemFlags[i].id == 6) {
                if (_systemFlags[i].value == '1') {
                    _secure = true;
                }
                else {
                    _secure = false;
                }
            }
            else if (_systemFlags[i].id == 1) {
                _user = _systemFlags[i].value;
            }
            else if (_systemFlags[i].id == 2) {
                _password = _systemFlags[i].value;
            }
        }
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: _host,
            port: _port,
            secure: _secure, // true for 465, false for other ports
            auth: {
                user: _user,
                pass: _password
            }
        });
        // setup email data with unicode symbols
        let mailOptions = {
            from: _user,
            to: to,
            subject: subject,
            html: html
        };
        // send mail with defined transport object
        result = yield transporter.sendMail(mailOptions);
        // console.log("Message sent: %s", result);
    }
    catch (error) {
        result = error;
    }
    return result;
});
const verifyforgotPasswordLink = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Verify Forgot Password Link');
        let requiredFields = ['token'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let result;
            let sql = `SELECT * FROM usertokens WHERE isDelete = 0 AND isUsed = 0  AND token = '` + req.body.token + `'`;
            result = yield apiHeader_1.default.query(sql);
            if (result && result.length > 0) {
                let expireDate = new Date(result[0].expireAt);
                let currentDate = new Date(new Date().toUTCString());
                let exTime = expireDate.getTime();
                let curTime = currentDate.getTime();
                if (exTime > curTime) {
                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Token is valid!', result, 1, "null");
                    return res.status(200).send(successResult);
                }
                else {
                    let successResult = 'Token is expired!';
                    return res.status(200).send(successResult);
                }
            }
            else {
                let successResult = 'You have already used this token';
                return res.status(200).send(successResult);
            }
        }
        else {
            yield apiHeader_1.default.rollback();
            let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
            next(errorResult);
        }
    }
    catch (error) {
        let errorResult = new resulterror_1.ResultError(500, true, 'users.verifyforgotPasswordLink() Exception', error, '');
        next(errorResult);
    }
});
const blockUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Block User');
        let requiredFields = ['id'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let sql = `UPDATE users set isDisable = !isDisable WHERE id = ` + req.body.id + ``;
                let result = yield apiHeader_1.default.query(sql);
                if (result && result.affectedRows > 0) {
                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'User Block Sucessfully', result, 1, authorizationResult.token);
                    return res.status(200).send(successResult);
                }
                else {
                    let errorResult = new resulterror_1.ResultError(400, true, "users.blockUser() Error", new Error('Error While Block User'), '');
                    next(errorResult);
                }
            }
            else {
                let errorResult = new resulterror_1.ResultError(401, true, "Unauthorized request", new Error(authorizationResult.message), '');
                next(errorResult);
            }
        }
        else {
            yield apiHeader_1.default.rollback();
            let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
            next(errorResult);
        }
    }
    catch (error) {
        let errorResult = new resulterror_1.ResultError(500, true, 'users.blockUser() Exception', error, '');
        next(errorResult);
    }
});
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Delete User');
        let requiredFields = ['id'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let sql = `DELETE FROM users WHERE id = ` + req.body.id + ``;
                let result = yield apiHeader_1.default.query(sql);
                if (result && result.affectedRows > 0) {
                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Delete User Sucessfully', result, 1, authorizationResult.token);
                    return res.status(200).send(successResult);
                }
                else {
                    let errorResult = new resulterror_1.ResultError(400, true, "users.deleteUser() Error", new Error('Error While Deleting Users'), '');
                    next(errorResult);
                }
            }
            else {
                let errorResult = new resulterror_1.ResultError(401, true, "Unauthorized request", new Error(authorizationResult.message), '');
                next(errorResult);
            }
        }
        else {
            yield apiHeader_1.default.rollback();
            let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
            next(errorResult);
        }
    }
    catch (error) {
        let errorResult = new resulterror_1.ResultError(500, true, 'users.deleteUser() Exception', error, '');
        next(errorResult);
    }
});
const updateFCMToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'updateFCMToken');
        let requiredFields = ['fcmToken'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let userId = authorizationResult.currentUser.id;
                let userDevice = authorizationResult.currentUserDevice;
                let appId;
                if (userDevice.app == 'MatrimonyAdmin') {
                    appId = 1;
                }
                else if (userDevice.app == 'MatrimonyAndroid') {
                    appId = 2;
                }
                else {
                    appId = 3;
                }
                let getUserDeviceDetailSql = `SELECT * FROM userdevicedetail WHERE userId = ` + userId;
                let getUserDeviceDetailResult = yield apiHeader_1.default.query(getUserDeviceDetailSql);
                if (getUserDeviceDetailResult && getUserDeviceDetailResult.length > 0) {
                    let updateSql = `UPDATE userdevicedetail SET fcmToken = '` + req.body.fcmToken + `', applicationId = ` + appId + ` WHERE id = ` + getUserDeviceDetailResult[0].id;
                    let updateResult = yield apiHeader_1.default.query(updateSql);
                    if (updateResult && updateResult.affectedRows >= 0) {
                        let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Update User Detail', updateResult, 1, authorizationResult.token);
                        return res.status(200).send(successResult);
                    }
                    else {
                        let errorResult = new resulterror_1.ResultError(400, true, "users.updateFCMToken() Error", new Error('Error While Updating FCM Token'), '');
                        next(errorResult);
                    }
                }
                else {
                    let insertSql = `INSERT INTO userdevicedetail(userId, applicationId, fcmToken, isActive, isDelete, createdBy, modifiedBy) 
                    VALUES(` + userId + `,` + appId + `,'` + req.body.fcmToken + `',1,0,` + userId + `,` + userId + `)`;
                    let insertResult = yield apiHeader_1.default.query(insertSql);
                    if (insertResult && insertResult.insertId >= 0) {
                        let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Update User Detail', insertResult, 1, authorizationResult.token);
                        return res.status(200).send(successResult);
                    }
                    else {
                        let errorResult = new resulterror_1.ResultError(400, true, "users.updateFCMToken() Error", new Error('Error While Updating FCM Token'), '');
                        next(errorResult);
                    }
                }
            }
            else {
                let errorResult = new resulterror_1.ResultError(401, true, "Unauthorized request", new Error(authorizationResult.message), '');
                next(errorResult);
            }
        }
        else {
            yield apiHeader_1.default.rollback();
            let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
            next(errorResult);
        }
    }
    catch (error) {
        yield apiHeader_1.default.rollback();
        let errorResult = new resulterror_1.ResultError(500, true, 'users.updateFCMToken() Exception', error, '');
        next(errorResult);
    }
});
const updateEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Update Email');
        let requiredFields = ['email'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let userId = authorizationResult.currentUser.id;
                let sql = "SELECT * FROM users WHERE id = " + userId;
                let result = yield apiHeader_1.default.query(sql);
                if (result && result.length > 0) {
                    let updateSql = `UPDATE users SET email = '` + req.body.email + `' WHERE id = ` + userId;
                    result = yield apiHeader_1.default.query(updateSql);
                    if (result && result.affectedRows > 0) {
                        let successResult = new resultsuccess_1.ResultSuccess(200, true, 'User Email Update Successfully', result, 1, authorizationResult.token);
                        return res.status(200).send(successResult);
                    }
                    else {
                        let errorResult = new resulterror_1.ResultError(400, true, "users.updateEmail() Error", new Error('Error While Update Email'), '');
                        next(errorResult);
                    }
                }
                else {
                    let errorResult = new resulterror_1.ResultError(400, true, "users.updateEmail() Error", new Error('Error While Update Email'), '');
                    next(errorResult);
                }
            }
            else {
                let errorResult = new resulterror_1.ResultError(401, true, "Unauthorized request", new Error(authorizationResult.message), '');
                next(errorResult);
            }
        }
        else {
            yield apiHeader_1.default.rollback();
            let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
            next(errorResult);
        }
    }
    catch (error) {
        yield apiHeader_1.default.rollback();
        let errorResult = new resulterror_1.ResultError(500, true, 'users.updateEmail() Exception', error, '');
        next(errorResult);
    }
});
const updatePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Update Password');
        let requiredFields = ['password'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let userId = authorizationResult.currentUser.id;
                let sql = "SELECT * FROM users WHERE id = " + userId;
                let result = yield apiHeader_1.default.query(sql);
                if (result && result.length > 0) {
                    bcryptjs_1.default.hash(req.body.password, 10, (hashError, hash) => __awaiter(void 0, void 0, void 0, function* () {
                        if (hashError) {
                            return res.status(401).json({
                                message: hashError.message,
                                error: hashError
                            });
                        }
                        let updateSql = `UPDATE users SET password = '` + hash + `' WHERE id = ` + userId;
                        result = yield apiHeader_1.default.query(updateSql);
                        if (result && result.affectedRows > 0) {
                            let successResult = new resultsuccess_1.ResultSuccess(200, true, 'User Password Update Successfully', result, 1, authorizationResult.token);
                            return res.status(200).send(successResult);
                        }
                        else {
                            let errorResult = new resulterror_1.ResultError(400, true, "users.updatePassword() Error", new Error('Error While Update Email'), '');
                            next(errorResult);
                        }
                    }));
                }
                else {
                    let errorResult = new resulterror_1.ResultError(400, true, "users.updatePassword() Error", new Error('Error While Update Email'), '');
                    next(errorResult);
                }
            }
            else {
                let errorResult = new resulterror_1.ResultError(401, true, "Unauthorized request", new Error(authorizationResult.message), '');
                next(errorResult);
            }
        }
        else {
            yield apiHeader_1.default.rollback();
            let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
            next(errorResult);
        }
    }
    catch (error) {
        yield apiHeader_1.default.rollback();
        let errorResult = new resulterror_1.ResultError(500, true, 'users.updatePassword() Exception', error, '');
        next(errorResult);
    }
});
// const sendAuthenticationCodeToEmail = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         logging.info(NAMESPACE, 'Update Password');
//         let requiredFields = [''];
//         let validationResult = header.validateRequiredFields(req, requiredFields);
//         if (validationResult && validationResult.statusCode == 200) {
//             let authorizationResult = await header.validateAuthorization(req, res, next);
//             if (authorizationResult.statusCode == 200) {
//                 let userId = authorizationResult.currentUser.id;
//                 let code = Math.floor(100000 + Math.random() * 900000);
//                 req.body.isTwoFactorEnable = req.body.isTwoFactorEnable ? req.body.isTwoFactorEnable : (req.body.isTwoFactorEnable == false ? false : null);
//                 let sql = `UPDATE users SET twoFactorCode = '` + code + `', isTwoFactorEnable = ` + req.body.isTwoFactorEnable + ` WHERE id = ` + userId;
//                 let result = await header.query(sql);
//                 if (result && result.affectedRows >= 0) {
//                     let sqlData = `SELECT * FROM users WHERE id = ` + userId;
//                     let resultData = await header.query(sqlData);
//                     let resultEmail = await sendEmail(config.emailMatrimonyTwoFactorAuthentication.fromName + ' <' + config.emailMatrimonyTwoFactorAuthentication.fromEmail + '>'
//                         , resultData[0].email
//                         , config.emailMatrimonyTwoFactorAuthentication.subject
//                         , ""
//                         , config.emailMatrimonyTwoFactorAuthentication.html
//                             .replace("[FullName]", resultData[0].firstName + " " + resultData[0].lastName)
//                             .replace("[VerificationCode]", code.toString())
//                         , null, null);
//                     let successResult = new ResultSuccess(200, true, 'Send Authentication Code Successfully', result, 1, authorizationResult.token);
//                     return res.status(200).send(successResult);
//                 } else {
//                     let errorResult = new ResultError(400, true, "users.sendAuthenticationCodeToEmail() Error", new Error('Error While Sending Email'), '');
//                     next(errorResult);
//                 }
//             } else {
//                 let errorResult = new ResultError(401, true, "Unauthorized request", new Error(authorizationResult.message), '');
//                 next(errorResult);
//             }
//         } else {
//             await header.rollback();
//             let errorResult = new ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
//             next(errorResult);
//         }
//     } catch (error: any) {
//         await header.rollback();
//         let errorResult = new ResultError(500, true, 'users.sendAuthenticationCodeToEmail() Exception', error, '');
//         next(errorResult);
//     }
// }
// const verifyAuthenticationCode = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         logging.info(NAMESPACE, 'Verify Authentication Code');
//         let requiredFields = ['twoFactorCode'];
//         let validationResult = header.validateRequiredFields(req, requiredFields);
//         if (validationResult && validationResult.statusCode == 200) {
//             let authorizationResult = await header.validateAuthorization(req, res, next);
//             if (authorizationResult.statusCode == 200) {
//                 let userId = authorizationResult.currentUser.id;
//                 let sql = `SELECT * FROM users WHERE twoFactorCode = '` + req.body.twoFactorCode + `'`;
//                 let result = await header.query(sql);
//                 if (result && result.length > 0) {
//                     let successResult = new ResultSuccess(200, true, 'Verify Authentication Code successfully', result, 1, authorizationResult.token);
//                     return res.status(200).send(successResult);
//                 } else {
//                     let errorResult = new ResultError(400, true, "users.verifyAuthenticationCode() Error", new Error('Error While update status'), '');
//                     next(errorResult);
//                 }
//             } else {
//                 let errorResult = new ResultError(401, true, "Unauthorized request", new Error(authorizationResult.message), '');
//                 next(errorResult);
//             }
//         } else {
//             await header.rollback();
//             let errorResult = new ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
//             next(errorResult);
//         }
//     } catch (error: any) {
//         await header.rollback();
//         let errorResult = new ResultError(500, true, 'users.verifyAuthenticationCode() Exception', error, '');
//         next(errorResult);
//     }
// }
const updateAuthenticationStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Update Password');
        let requiredFields = [''];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let userId = authorizationResult.currentUser.id;
                let checkSql = `SELECT * FROM users WHERE id = ` + userId;
                let checkResult = yield apiHeader_1.default.query(checkSql);
                let flag = true;
                if (checkResult && checkResult.length > 0) {
                    if (checkResult[0].otpAuthUrl && checkResult[0].baseSecret) {
                        flag = false;
                    }
                }
                if (flag && req.body.isTwoFactorEnable) {
                    let sysFalgSql = `SELECT * FROM systemflags WHERE flagGroupId = 10`;
                    let sysFalgResult = yield apiHeader_1.default.query(sysFalgSql);
                    let issuer = "";
                    let label = "";
                    if (sysFalgResult && sysFalgResult.length > 0) {
                        issuer = sysFalgResult[sysFalgResult.findIndex((c) => c.name == 'twoFactorIssuer')].value;
                        label = sysFalgResult[sysFalgResult.findIndex((c) => c.name == 'twoFactorLabel')].value;
                    }
                    const base32_secret = generateRandomBase32();
                    let totp = new OTPAuth.TOTP({
                        issuer: issuer, //"native.software",
                        label: label, //''"nativesoftware",
                        algorithm: "SHA1",
                        digits: 6,
                        secret: base32_secret,
                    });
                    let otpauth_url = totp.toString();
                    let sql = `UPDATE users SET otpAuthUrl = '` + otpauth_url + `', baseSecret='` + base32_secret + `', isTwoFactorEnable = true  WHERE id = ` + userId;
                    let result = yield apiHeader_1.default.query(sql);
                    if (result && result.affectedRows >= 0) {
                        let getSql = "SELECT * FROM users WHERE  id =" + userId;
                        let getResult = yield apiHeader_1.default.query(getSql);
                        let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Generate OTP Successfully', getResult, 1, authorizationResult.token);
                        return res.status(200).send(successResult);
                    }
                    else {
                        let errorResult = new resulterror_1.ResultError(400, true, "users.generateOTP() Error", new Error('Error While update status'), '');
                        next(errorResult);
                    }
                }
                else {
                    req.body.isTwoFactorEnable = req.body.isTwoFactorEnable ? req.body.isTwoFactorEnable : (req.body.isTwoFactorEnable == false ? false : null);
                    let sql = `UPDATE users SET isTwoFactorEnable = ` + req.body.isTwoFactorEnable + ` WHERE id = ` + userId;
                    let result = yield apiHeader_1.default.query(sql);
                    if (result && result.affectedRows >= 0) {
                        let getUserSql = `SELECT * FROM users where id = ` + userId;
                        let getUserResult = yield apiHeader_1.default.query(getUserSql);
                        let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Send Authentication Code Successfully', getUserResult, 1, authorizationResult.token);
                        return res.status(200).send(successResult);
                    }
                    else {
                        let errorResult = new resulterror_1.ResultError(400, true, "users.updateAuthenticationStatus() Error", new Error('Error While update status'), '');
                        next(errorResult);
                    }
                }
            }
            else {
                let errorResult = new resulterror_1.ResultError(401, true, "Unauthorized request", new Error(authorizationResult.message), '');
                next(errorResult);
            }
        }
        else {
            yield apiHeader_1.default.rollback();
            let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
            next(errorResult);
        }
    }
    catch (error) {
        yield apiHeader_1.default.rollback();
        let errorResult = new resulterror_1.ResultError(500, true, 'users.updateAuthenticationStatus() Exception', error, '');
        next(errorResult);
    }
});
const changeEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Reset Password');
        let requiredFields = ['oldEmail', 'newEmail'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let currentUser = authorizationResult.currentUser;
                let userId = currentUser.id;
                let result;
                let searchSql = `SELECT * FROM users WHERE email = '` + req.body.oldEmail + `' AND id = ` + userId;
                let searchResult = yield apiHeader_1.default.query(searchSql);
                if (searchResult && searchResult.length > 0) {
                    let checkSql = `SELECT * FROM users WHERE email = '` + req.body.newEmail + `' AND id != ` + userId + ``;
                    result = yield apiHeader_1.default.query(checkSql);
                    if (result && result.length > 0) {
                        let errorResult = new resulterror_1.ResultError(203, true, "users.changeEmail() Error", new Error('Email Already exists'), '');
                        next(errorResult);
                    }
                    else {
                        let sql = `UPDATE users SET email = '` + req.body.newEmail + `' where id = ` + userId + ``;
                        result = yield apiHeader_1.default.query(sql);
                        if (result && result.affectedRows > 0) {
                            let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Email Change successfully!', result, 1, "null");
                            return res.status(200).send(successResult);
                        }
                        else {
                            yield apiHeader_1.default.rollback();
                            let errorResult = new resulterror_1.ResultError(400, true, "users.changeEmail() Error", new Error('Error While Change Password'), '');
                            next(errorResult);
                        }
                    }
                }
                else {
                    let errorResult = "User Not Found";
                    next(errorResult);
                }
            }
            else {
                let errorResult = new resulterror_1.ResultError(401, true, "Unauthorized request", new Error(authorizationResult.message), '');
                next(errorResult);
            }
        }
        else {
            yield apiHeader_1.default.rollback();
            let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
            next(errorResult);
        }
    }
    catch (error) {
        yield apiHeader_1.default.rollback();
        let errorResult = new resulterror_1.ResultError(500, true, 'users.changeEmail() Exception', error, '');
        next(errorResult);
    }
});
const changePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Change Password');
        let requiredFields = ['oldPassword', 'newPassword'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let currentUser = authorizationResult.currentUser;
                let userId = currentUser.id;
                let result;
                let sql = `SELECT * FROM users WHERE id = ` + userId;
                result = yield apiHeader_1.default.query(sql);
                if (result && result.length > 0) {
                    bcryptjs_1.default.compare(req.body.oldPassword, result[0].password, (error, hashresult) => __awaiter(void 0, void 0, void 0, function* () {
                        if (hashresult == false) {
                            return res.status(203).json({
                                message: 'Your old password is not match'
                            });
                        }
                        else if (hashresult) {
                            bcryptjs_1.default.hash(req.body.newPassword, 10, (hashError, hash) => __awaiter(void 0, void 0, void 0, function* () {
                                if (hashError) {
                                    return res.status(401).json({
                                        message: hashError.message,
                                        error: hashError
                                    });
                                }
                                let sql = `UPDATE users SET password = '` + hash + `' where id = ` + userId + ``;
                                let result = yield apiHeader_1.default.query(sql);
                                if (result && result.affectedRows > 0) {
                                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Password Change successfully!', result, 1, "null");
                                    return res.status(200).send(successResult);
                                }
                                else {
                                    yield apiHeader_1.default.rollback();
                                    let errorResult = new resulterror_1.ResultError(400, true, "users.changePassword() Error", new Error('Error While Change Password'), '');
                                    next(errorResult);
                                }
                            }));
                        }
                    }));
                }
                else {
                    let errorResult = "User Not Found";
                    next(errorResult);
                }
            }
            else {
                let errorResult = new resulterror_1.ResultError(401, true, "Unauthorized request", new Error(authorizationResult.message), '');
                next(errorResult);
            }
        }
        else {
            yield apiHeader_1.default.rollback();
            let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
            next(errorResult);
        }
    }
    catch (error) {
        yield apiHeader_1.default.rollback();
        let errorResult = new resulterror_1.ResultError(500, true, 'users.changePassword() Exception', error, '');
        next(errorResult);
    }
});
function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}
const generateRandomBase32 = () => {
    const buffer = cryptr.encrypt(makeid(10));
    const base32 = (0, hi_base32_1.encode)(buffer).replace(/=/g, "").substring(0, 24);
    return base32;
};
const generateOTP = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Generate OTP');
        let requiredFields = [''];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let userId = authorizationResult.currentUser.id;
                const base32_secret = generateRandomBase32();
                let sysFalgSql = `SELECT * FROM systemflags WHERE flagGroupId = 10`;
                let sysFalgResult = yield apiHeader_1.default.query(sysFalgSql);
                let issuer = "";
                let label = "";
                if (sysFalgResult && sysFalgResult.length > 0) {
                    issuer = sysFalgResult[sysFalgResult.findIndex((c) => c.name == 'twoFactorIssuer')].value;
                    label = sysFalgResult[sysFalgResult.findIndex((c) => c.name == 'twoFactorLabel')].value;
                }
                let totp = new OTPAuth.TOTP({
                    issuer: issuer, //"native.software",
                    label: label, //"nativesoftware",
                    algorithm: "SHA1",
                    digits: 6,
                    secret: base32_secret,
                });
                let otpauth_url = totp.toString();
                let sql = `UPDATE users SET otpAuthUrl = '` + otpauth_url + `', baseSecret='` + base32_secret + `',isTwoFactorEnable = true  WHERE id = ` + userId;
                let result = yield apiHeader_1.default.query(sql);
                if (result && result.affectedRows >= 0) {
                    let getSql = "SELECT * FROM users WHERE  id =" + userId;
                    let getResult = yield apiHeader_1.default.query(getSql);
                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Generate OTP Successfully', getResult, 1, authorizationResult.token);
                    return res.status(200).send(successResult);
                }
                else {
                    let errorResult = new resulterror_1.ResultError(400, true, "users.generateOTP() Error", new Error('Error While update status'), '');
                    next(errorResult);
                }
            }
            else {
                let errorResult = new resulterror_1.ResultError(401, true, "Unauthorized request", new Error(authorizationResult.message), '');
                next(errorResult);
            }
        }
        else {
            yield apiHeader_1.default.rollback();
            let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
            next(errorResult);
        }
    }
    catch (error) {
        let errorResult = new resulterror_1.ResultError(500, true, 'users.generateOTP() Exception', error, '');
        next(errorResult);
    }
});
const validateOTP = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Generate OTP');
        let requiredFields = ['token'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let userId = authorizationResult.currentUser.id;
                let sql = `SELECT * FROM users WHERE id = ` + userId;
                let result = yield apiHeader_1.default.query(sql);
                if (result && result.length > 0) {
                    let sysFalgSql = `SELECT * FROM systemflags WHERE flagGroupId = 10`;
                    let sysFalgResult = yield apiHeader_1.default.query(sysFalgSql);
                    let issuer = "";
                    let label = "";
                    if (sysFalgResult && sysFalgResult.length > 0) {
                        issuer = sysFalgResult[sysFalgResult.findIndex((c) => c.name == 'twoFactorIssuer')].value;
                        label = sysFalgResult[sysFalgResult.findIndex((c) => c.name == 'twoFactorLabel')].value;
                    }
                    let totp = new OTPAuth.TOTP({
                        issuer: issuer, //"native.software",
                        label: label, //"nativesoftware",
                        algorithm: "SHA1",
                        digits: 6,
                        secret: result[0].baseSecret,
                    });
                    const { token } = req.body;
                    let delta = totp.validate({ token, window: 1 });
                    if (delta === null) {
                        let errorResult = new resulterror_1.ResultError(401, true, "Token Invalid", new Error("Token Invalid"), '');
                        next(errorResult);
                    }
                    else {
                        let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Token is Valid', result, 1, authorizationResult.token);
                        return res.status(200).send(successResult);
                    }
                }
                else {
                    let errorResult = new resulterror_1.ResultError(400, true, "User not available", new Error('User not available'), '');
                    next(errorResult);
                }
            }
            else {
                let errorResult = new resulterror_1.ResultError(401, true, "Unauthorized request", new Error(authorizationResult.message), '');
                next(errorResult);
            }
        }
        else {
            yield apiHeader_1.default.rollback();
            let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
            next(errorResult);
        }
    }
    catch (error) {
        let errorResult = new resulterror_1.ResultError(500, true, 'users.generateOTP() Exception', error, '');
        next(errorResult);
    }
});
const resetAuthenticationOTP = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Reset Authentiacation');
        let requiredFields = [''];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let userId = authorizationResult.currentUser.id;
                const base32_secret = generateRandomBase32();
                let sysFalgSql = `SELECT * FROM systemflags WHERE flagGroupId = 10`;
                let sysFalgResult = yield apiHeader_1.default.query(sysFalgSql);
                let issuer = "";
                let label = "";
                if (sysFalgResult && sysFalgResult.length > 0) {
                    issuer = sysFalgResult[sysFalgResult.findIndex((c) => c.name == 'twoFactorIssuer')].value;
                    label = sysFalgResult[sysFalgResult.findIndex((c) => c.name == 'twoFactorLabel')].value;
                }
                let totp = new OTPAuth.TOTP({
                    issuer: issuer, //"native.software",
                    label: label, //"nativesoftware",
                    algorithm: "SHA1",
                    digits: 6,
                    secret: base32_secret,
                });
                let otpauth_url = totp.toString();
                let sql = `UPDATE users SET otpAuthUrl = '` + otpauth_url + `', baseSecret='` + base32_secret + `',isTwoFactorEnable = true  WHERE id = ` + userId;
                let result = yield apiHeader_1.default.query(sql);
                if (result && result.affectedRows >= 0) {
                    let getSql = "SELECT * FROM users WHERE  id =" + userId;
                    let getResult = yield apiHeader_1.default.query(getSql);
                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Reset Authentiacation OTP Successfully', getResult, 1, authorizationResult.token);
                    return res.status(200).send(successResult);
                }
                else {
                    let errorResult = new resulterror_1.ResultError(400, true, "users.generateOTP() Error", new Error('Error While update status'), '');
                    next(errorResult);
                }
            }
            else {
                let errorResult = new resulterror_1.ResultError(401, true, "Unauthorized request", new Error(authorizationResult.message), '');
                next(errorResult);
            }
        }
        else {
            yield apiHeader_1.default.rollback();
            let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
            next(errorResult);
        }
    }
    catch (error) {
        let errorResult = new resulterror_1.ResultError(500, true, 'users.generateOTP() Exception', error, '');
        next(errorResult);
    }
});
const deleteAllUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield apiHeader_1.default.beginTransaction();
        logging_1.default.info(NAMESPACE, 'Reset Authentiacation');
        // let result: any;
        let adminUserIds = yield apiHeader_1.default.query(`SELECT users.id FROM users INNER JOIN userroles ur ON users.id = ur.userId WHERE ur.roleId IN (1,3)`);
        let userId = req.body.userIds;
        adminUserIds.forEach((item) => {
            userId.push(item.id);
        });
        userId.push(286);
        let userIds = userId.toString();
        let deleteQueries = [`DELETE FROM feedback WHERE createdBy NOT IN (` + userIds + `)`,
            `DELETE FROM successstories WHERE createdBy NOT IN (` + userIds + `)`,
            `DELETE FROM successstories WHERE userId NOT IN (` + userIds + `)`,
            `DELETE FROM successstories WHERE partnerUserId NOT IN (` + userIds + `)`,
            `DELETE FROM userauthdata WHERE userId NOT IN (` + userIds + `)`,
            `DELETE FROM userblock WHERE userId NOT IN (` + userIds + `)`,
            `DELETE FROM userblock WHERE userBlockId NOT IN (` + userIds + `)`,
            `DELETE FROM userblockrequest WHERE userId NOT IN (` + userIds + `)`,
            `DELETE FROM userblockrequest WHERE blockRequestUserId NOT IN (` + userIds + `)`,
            `DELETE FROM userchat WHERE userId NOT IN (` + userIds + `)`,
            `DELETE FROM userchat WHERE partnerId NOT IN (` + userIds + `)`,
            `DELETE FROM userdevicedetail WHERE userId NOT IN (` + userIds + `)`,
            `DELETE FROM userdocument WHERE userId NOT IN (` + userIds + `)`,
            `DELETE FROM userfavourites WHERE userId NOT IN (` + userIds + `)`,
            `DELETE FROM userfavourites WHERE favUserId NOT IN (` + userIds + `)`,
            `DELETE FROM userflagvalues WHERE userId NOT IN (` + userIds + `)`,
            `DELETE FROM usernotifications WHERE userId NOT IN (` + userIds + `)`,
            `DELETE FROM userpackage WHERE userId NOT IN (` + userIds + `)`,
            `DELETE FROM userpersonaldetail WHERE userId NOT IN (` + userIds + `)`,
            `DELETE FROM userproposals WHERE userId NOT IN (` + userIds + `)`,
            `DELETE FROM userproposals WHERE proposalUserId NOT IN (` + userIds + `)`,
            `DELETE FROM userrefreshtoken WHERE userId NOT IN (` + userIds + `)`,
            `DELETE FROM userroles WHERE userId NOT IN (` + userIds + `)`,
            `DELETE FROM usertokens WHERE userId NOT IN (` + userIds + `)`,
            `DELETE FROM userviewprofilehistories WHERE userId NOT IN (` + userIds + `)`,
            `DELETE FROM userviewprofilehistories WHERE viewProfileByUserId NOT IN (` + userIds + `)`,
            `DELETE FROM userwallethistory WHERE createdBy NOT IN (` + userIds + `)`,
            `DELETE FROM userwallets WHERE userId NOT IN (` + userIds + `)`,
            `DELETE FROM payment WHERE createdBy NOT IN (` + userIds + `)`,
            `DELETE FROM addresses WHERE createdBy NOT IN (` + userIds + `)`,
            `DELETE FROM userpersonaldetailcustomdata WHERE userId NOT IN (` + userIds + `)`,
            `DELETE FROM userpartnerpreferences WHERE userId NOT IN (` + userIds + `)`,
            `DELETE FROM userfamilydetail WHERE userId NOT IN (` + userIds + `)`,
            `DELETE FROM userastrologicdetail WHERE userId NOT IN (` + userIds + `)`,
            `CREATE TEMPORARY TABLE temp_ids (id INT)`,
            `INSERT INTO temp_ids(id) SELECT id FROM users WHERE id IN(SELECT id FROM users WHERE id NOT IN (` + userIds + `))`,
            `UPDATE users SET referalUserId = NULL WHERE referalUserId IN (SELECT id FROM temp_ids)`,
            `DROP TEMPORARY TABLE temp_ids`,
            `DELETE FROM users WHERE id NOT IN (` + userIds + `)`,
            `DELETE FROM images WHERE createdBy NOT IN (` + userIds + `)`
        ];
        let result;
        for (let index = 0; index < deleteQueries.length; index++) {
            result = yield apiHeader_1.default.query(deleteQueries[index]);
        }
        yield apiHeader_1.default.commit();
        let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Delete All User Successfully', result, 1, '');
        return res.status(200).send(successResult);
    }
    catch (error) {
        yield apiHeader_1.default.rollback();
        let errorResult = new resulterror_1.ResultError(500, true, 'users.deleteAllUser() Exception', error, '');
        next(errorResult);
    }
});
exports.default = {
    insertUser, login, getAllUsers, getUserDetailById, updateUser, validateToken, resetPassword, activeInactiveUsers, forgotPassword, verifyforgotPasswordLink, blockUser, deleteUser,
    updateFCMToken, updateEmail, updatePassword
    // , sendAuthenticationCodeToEmail, verifyAuthenticationCode
    ,
    updateAuthenticationStatus, changeEmail, changePassword, generateOTP, validateOTP, resetAuthenticationOTP, deleteAllUser
};
