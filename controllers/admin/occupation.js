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
const logging_1 = __importDefault(require("../../config/logging"));
const apiHeader_1 = __importDefault(require("../../middleware/apiHeader"));
const resultsuccess_1 = require("../../classes/response/resultsuccess");
const resulterror_1 = require("../../classes/response/resulterror");
const path = __importStar(require("path"));
const mysql = require('mysql');
const util = require('util');
const fs = require('fs');
// const sharp = require('sharp');
var Jimp = require("jimp");
// let connection = mysql.createConnection({
//     host: config.mysql.host,
//     user: config.mysql.user,
//     password: config.mysql.password,
//     database: config.mysql.database
// });
// const query = util.promisify(connection.query).bind(connection);
const NAMESPACE = 'Occupation';
const getOccupation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Getting Occupation');
        let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
        if (authorizationResult.statusCode == 200) {
            let startIndex = req.body.startIndex ? req.body.startIndex : (req.body.startIndex === 0 ? 0 : null);
            let fetchRecord = req.body.fetchRecord ? req.body.fetchRecord : null;
            let countSql = "SELECT COUNT(*) as totalCount  FROM occupation";
            if (req.body.name) {
                if (!countSql.includes(` WHERE `)) {
                    countSql += ` WHERE `;
                }
                else {
                    countSql += ` AND `;
                }
                countSql += ` name LIKE '%` + req.body.name + `%' `;
            }
            let countResult = yield apiHeader_1.default.query(countSql);
            let sql = `SELECT * FROM occupation WHERE isDelete = 0 `;
            if (req.body.name) {
                if (!sql.includes(` WHERE `)) {
                    sql += ` WHERE `;
                }
                else {
                    sql += ` AND `;
                }
                sql += ` name LIKE '%` + req.body.name + `%' `;
            }
            sql += ` ORDER BY id DESC `;
            if (startIndex != null && fetchRecord != null) {
                sql += " LIMIT " + fetchRecord + " OFFSET " + startIndex + "";
            }
            let result = yield apiHeader_1.default.query(sql);
            if (result) {
                let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Get Occupation Successfully', result, countResult[0].totalCount, authorizationResult.token);
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
        let errorResult = new resulterror_1.ResultError(500, true, 'occupation.getOccupation() Exception', error, '');
        next(errorResult);
    }
});
const insertUpdateOccupation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Inserting Occupation');
        let requiredFields = ['name'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let currentUser = authorizationResult.currentUser;
                let userId = currentUser.id;
                let checkSql = `SELECT * FROM occupation WHERE name = '` + req.body.name + `'`;
                if (req.body.id) {
                    checkSql += ' AND id != ' + req.body.id;
                }
                let checkResult = yield apiHeader_1.default.query(checkSql);
                if (checkResult && checkResult.length > 0) {
                    let errorResult = new resulterror_1.ResultError(203, true, "", new Error("Name Already Exist"), '');
                    next(errorResult);
                }
                else {
                    if (req.body.id) {
                        let sql = `UPDATE occupation SET name = '` + req.body.name + `' where id = ` + req.body.id + ``;
                        let result = yield apiHeader_1.default.query(sql);
                        if (result && result.affectedRows > 0) {
                            let occupationId = req.body.id;
                            if (req.body.imageUrl != '' || req.body.imageUrl != null || req.body.imageUrl != undefined) {
                                if (req.body.imageUrl && req.body.imageUrl.indexOf('content') == -1) {
                                    let image = req.body.imageUrl;
                                    let data = image.split(',');
                                    if (data && data.length > 1) {
                                        image = image.split(',')[1];
                                    }
                                    let dir = './content';
                                    if (!fs.existsSync(dir)) {
                                        fs.mkdirSync(dir);
                                    }
                                    let dir1 = './content/occupation';
                                    if (!fs.existsSync(dir1)) {
                                        fs.mkdirSync(dir1);
                                    }
                                    let dir2 = './content/occupation/' + occupationId;
                                    if (!fs.existsSync(dir2)) {
                                        fs.mkdirSync(dir2);
                                    }
                                    const fileContentsUser = new Buffer(image, 'base64');
                                    if (fs.existsSync("./content/occupation/" + occupationId + "/" + occupationId + "-realImg.jpeg")) {
                                        console.log("./content/occupation/" + occupationId + "/" + occupationId + "-realImg.jpeg");
                                        fs.unlink("./content/occupation/" + occupationId + "/" + occupationId + "-realImg.jpeg", (err) => {
                                            if (err)
                                                throw err;
                                            console.log(imagePath + ' was deleted');
                                        });
                                    }
                                    let imgPath = "./content/occupation/" + occupationId + "/" + occupationId + "-realImg.jpeg";
                                    // let imgPath = "./content/occupation/" + occupationId + "/" + occupationId + "-" + new Date().getTime() + "-realImg.jpeg";
                                    fs.writeFileSync(imgPath, fileContentsUser, (err) => {
                                        if (err)
                                            return console.error(err);
                                        console.log('file saved imagePath');
                                    });
                                    let imagePath = "./content/occupation/" + occupationId + "/" + occupationId + "-" + new Date().getTime() + ".jpeg";
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
                                    let oldImgSql = `select imageUrl from occupation where id = ` + req.body.id + ``;
                                    let oldImgResult = yield apiHeader_1.default.query(oldImgSql);
                                    let updateimagePathSql = `UPDATE occupation SET imageUrl='` + imagePath.substring(2) + `' WHERE id=` + occupationId;
                                    let updateimagePathResult = yield apiHeader_1.default.query(updateimagePathSql);
                                    if (updateimagePathResult && updateimagePathResult.affectedRows > 0) {
                                        if (oldImgResult && oldImgResult.length > 0) {
                                            let oldImagePath = path.parse(oldImgResult[0].imageUrl);
                                            let oldImage = oldImagePath.dir + '/' + oldImagePath.name;
                                            if (fs.existsSync('./' + oldImage + ".jpeg")) {
                                                fs.unlink('./' + oldImage + ".jpeg", (err) => {
                                                    if (err)
                                                        throw err;
                                                    console.log(imagePath + ' was deleted');
                                                });
                                            }
                                            // if (fs.existsSync('./' + oldImage + "-realImg.jpeg")) {
                                            //     console.log('./' + oldImage + "-realImg.jpeg")
                                            //     fs.unlink('./' + oldImage + "-realImg.jpeg", (err: any) => {
                                            //         if (err) throw err;
                                            //         console.log(imagePath + ' was deleted');
                                            //     });
                                            // }
                                        }
                                        let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Insert Occupation', result, 1, authorizationResult.token);
                                        return res.status(200).send(successResult);
                                    }
                                    else {
                                        let errorResult = new resulterror_1.ResultError(400, true, "users.updateUserProfilePic() Error", new Error('Error While Updating Profile Pic'), '');
                                        next(errorResult);
                                    }
                                }
                                else {
                                    let updateimagePathSql = `UPDATE occupation SET imageUrl='` + req.body.imageUrl + `' WHERE id=` + occupationId;
                                    result = yield apiHeader_1.default.query(updateimagePathSql);
                                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Update Occupation', result, 1, authorizationResult.token);
                                    return res.status(200).send(successResult);
                                }
                            }
                            else {
                                let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Update Occupation', result, 1, authorizationResult.token);
                                return res.status(200).send(successResult);
                            }
                        }
                        else {
                            let errorResult = new resulterror_1.ResultError(400, true, "occupation.insertUpdateOccupation() Error", new Error('Error While Updating Data'), '');
                            next(errorResult);
                        }
                    }
                    else {
                        let sql = `INSERT INTO occupation(name, createdBy, modifiedBy) VALUES('` + req.body.name + `',` + userId + `,` + userId + `);`;
                        let result = yield apiHeader_1.default.query(sql);
                        if (result && result.affectedRows > 0) {
                            let occupationId = result.insertId;
                            if (req.body.imageUrl != '' || req.body.imageUrl != null || req.body.imageUrl != undefined) {
                                if (req.body.imageUrl && req.body.imageUrl.indexOf('content') == -1) {
                                    let image = req.body.imageUrl;
                                    let data = image.split(',');
                                    if (data && data.length > 1) {
                                        image = image.split(',')[1];
                                    }
                                    let dir = './content';
                                    if (!fs.existsSync(dir)) {
                                        fs.mkdirSync(dir);
                                    }
                                    let dir1 = './content/occupation';
                                    if (!fs.existsSync(dir1)) {
                                        fs.mkdirSync(dir1);
                                    }
                                    let dir2 = './content/occupation/' + occupationId;
                                    if (!fs.existsSync(dir2)) {
                                        fs.mkdirSync(dir2);
                                    }
                                    const fileContentsUser = new Buffer(image, 'base64');
                                    let imgPath = "./content/occupation/" + occupationId + "/" + occupationId + "-realImg.jpeg";
                                    // let imgPath = "./content/occupation/" + occupationId + "/" + occupationId + "-" + new Date().getTime() + "-realImg.jpeg";
                                    fs.writeFileSync(imgPath, fileContentsUser, (err) => {
                                        if (err)
                                            return console.error(err);
                                        console.log('file saved imagePath');
                                    });
                                    let imagePath = "./content/occupation/" + occupationId + "/" + occupationId + "-" + new Date().getTime() + ".jpeg";
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
                                    let updateimagePathSql = `UPDATE occupation SET imageUrl='` + imagePath.substring(2) + `' WHERE id=` + occupationId;
                                    let updateimagePathResult = yield apiHeader_1.default.query(updateimagePathSql);
                                    if (updateimagePathResult && updateimagePathResult.affectedRows > 0) {
                                        let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Insert Occupation', result, 1, authorizationResult.token);
                                        return res.status(200).send(successResult);
                                    }
                                    else {
                                        let errorResult = new resulterror_1.ResultError(400, true, "users.updateUserProfilePic() Error", new Error('Error While Updating Profile Pic'), '');
                                        next(errorResult);
                                    }
                                }
                                else {
                                    let errorResult = new resulterror_1.ResultError(400, true, "users.updateUserProfilePic() Error", new Error('Image Not Found'), '');
                                    next(errorResult);
                                }
                            }
                            else {
                                let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Insert Occupation', result, 1, authorizationResult.token);
                                return res.status(200).send(successResult);
                            }
                        }
                        else {
                            let errorResult = new resulterror_1.ResultError(400, true, "occupation.insertUpdateOccupation() Error", new Error('Error While Inserting Data'), '');
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
        let errorResult = new resulterror_1.ResultError(500, true, 'occupation.insertUpdateOccupation() Exception', error, '');
        next(errorResult);
    }
});
const activeInactiveOccupation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Active Inactive Occupation');
        let requiredFields = ['id'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let sql = `UPDATE occupation set isActive = !isActive WHERE id = ` + req.body.id + ``;
                let result = yield apiHeader_1.default.query(sql);
                if (result && result.affectedRows > 0) {
                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Change Occupation Status', result, 1, authorizationResult.token);
                    return res.status(200).send(successResult);
                }
                else {
                    let errorResult = new resulterror_1.ResultError(400, true, "occupation.insertUpdateOccupation() Error", new Error('Error While Change Occupation Status'), '');
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
        let errorResult = new resulterror_1.ResultError(500, true, 'occupation.activeIanctiveOccupation() Exception', error, '');
        next(errorResult);
    }
});
exports.default = { getOccupation, insertUpdateOccupation, activeInactiveOccupation };