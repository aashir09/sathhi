import { NextFunction, Request, Response, query } from 'express';
import logging from "../../config/logging";
import config from "../../config/config";
import header from "../../middleware/apiHeader";
import { ResultSuccess } from '../../classes/response/resultsuccess';
import { ResultError } from '../../classes/response/resulterror';
import { head } from '../../routes/sampleRoutes';
const fs = require('fs');
// const sharp = require('sharp');
var Jimp = require("jimp");

// const mysql = require('mysql');
// const util = require('util');

// let connection = mysql.createConnection({
//     host: config.mysql.host,
//     user: config.mysql.user,
//     password: config.mysql.password,
//     database: config.mysql.database
// });

// const query = util.promisify(connection.query).bind(connection);

const NAMESPACE = 'System Flags';

const getAdminSystemFlag = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logging.info(NAMESPACE, 'Getting SystemFlags');
        let sql = `SELECT * FROM flaggroup WHERE parentFlagGroupId IS NULL AND isDelete = 0`;
        let result = await header.query(sql);
        if (result && result.length > 0) {
            for (let i = 0; i < result.length; i++) {
                result[i].group = [];
                let innerSql = `SELECT * FROM flaggroup WHERE parentFlagGroupId = ` + result[i].id + ` AND isDelete = 0`;
                let innerResult = await header.query(innerSql);
                if (innerResult && innerResult.length > 0) {
                    result[i].group = innerResult;
                    for (let j = 0; j < result[i].group.length; j++) {
                        result[i].group[j].systemFlag = [];
                        let sysSql = `SELECT * FROM systemflags WHERE isActive = 1 AND flagGroupId = ` + result[i].group[j].id;
                        let sysresult = await header.query(sysSql);
                        result[i].group[j].systemFlag = sysresult;

                    }
                }
                result[i].systemFlag = [];
                let sysSql = `SELECT * FROM systemflags WHERE  isActive = 1 AND flagGroupId = ` + result[i].id;
                let sysresult = await header.query(sysSql);
                if (result[i].id == 3) {
                    for (let j = 0; j < sysresult.length; j++) {
                        if (sysresult[j].name == "paymentType") {
                            sysresult[j].value = sysresult[j].value.split(";");
                        }
                    }
                }
                result[i].systemFlag = sysresult;

            }
        }
        if (result && result.length > 0) {
            let successResult = new ResultSuccess(200, true, 'Get System flag successfully', result, result.length, '');
            return res.status(200).send(successResult);
        } else {
            let errorResult = new ResultError(400, true, "systemflags.getAdminSystemFlag() Error", new Error('Error While Updating Data'), '');
            next(errorResult);
        }
    } catch (error: any) {
        let errorResult = new ResultError(500, true, 'systemflags.getAdminSystemFlag() Exception', error, '');
        next(errorResult);
    }
};

const getAdminSystemFlagSetting = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logging.info(NAMESPACE, 'Getting SystemFlags');
        let sql = `SELECT * FROM flaggroup WHERE parentFlagGroupId IS NULL AND isDelete = 0`;
        let result = await header.query(sql);
        if (result && result.length > 0) {
            for (let i = 0; i < result.length; i++) {
                result[i].group = [];
                let innerSql = `SELECT * FROM flaggroup WHERE parentFlagGroupId = ` + result[i].id + ` AND isDelete = 0`;
                let innerResult = await header.query(innerSql);
                if (innerResult && innerResult.length > 0) {
                    result[i].group = innerResult;
                    for (let j = 0; j < result[i].group.length; j++) {
                        result[i].group[j].systemFlag = [];
                        let sysSql = `SELECT * FROM systemflags WHERE isActive = 1 AND parentFlagId is null AND flagGroupId = ` + result[i].group[j].id;
                        let sysresult = await header.query(sysSql);
                        result[i].group[j].systemFlag = sysresult;

                        for (let k = 0; k < result[i].group[j].systemFlag.length; k++) {
                            result[i].group[j].systemFlag[k].childSystemFlag = [];
                            let childSysSql = `SELECT * FROM systemflags WHERE isActive = 1 AND parentFlagId = ` + result[i].group[j].systemFlag[k].id;
                            let childSysresult = await header.query(childSysSql);
                            result[i].group[j].systemFlag[k].childSystemFlag = childSysresult;
                        }
                    }
                }
                result[i].systemFlag = [];
                let sysSql = `SELECT * FROM systemflags WHERE  isActive = 1 AND parentFlagId is null AND flagGroupId = ` + result[i].id;
                let sysresult = await header.query(sysSql);
                for (let k = 0; k < sysresult.length; k++) {
                    sysresult[k].childSystemFlag = [];
                    let childSysSql = `SELECT * FROM systemflags WHERE isActive = 1 AND parentFlagId = ` + sysresult[k].id;
                    let childSysresult = await header.query(childSysSql);
                   sysresult[k].childSystemFlag = childSysresult;
                }

                if (result[i].id == 3) {
                    for (let j = 0; j < sysresult.length; j++) {
                        if (sysresult[j].name == "paymentType") {
                            sysresult[j].value = sysresult[j].value.split(";");
                        }
                    }
                }
                result[i].systemFlag = sysresult;

            }
        }
        if (result && result.length > 0) {
            let successResult = new ResultSuccess(200, true, 'Get System flag successfully', result, result.length, '');
            return res.status(200).send(successResult);
        } else {
            let errorResult = new ResultError(400, true, "systemflags.getAdminSystemFlag() Error", new Error('Error While Updating Data'), '');
            next(errorResult);
        }
    } catch (error: any) {
        let errorResult = new ResultError(500, true, 'systemflags.getAdminSystemFlag() Exception', error, '');
        next(errorResult);
    }
};

const updateSystemFlagByName = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let requiredFields = ['valueList', 'nameList'];
        let validationResult = header.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = await header.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let result;
                for (let i = 0; i < req.body.nameList.length; i++) {
                    if (req.body.nameList[i] === "watermarkImage") {
                        let imagePath = "";
                        if (req.body.valueList[i]) {
                            let image = req.body.valueList[i];
                            let data = image.split(',');
                            if (data && data.length > 1) {
                                image = image.split(',')[1]
                            }

                            let dir = './content';
                            if (!fs.existsSync(dir)) {
                                fs.mkdirSync(dir);
                            }

                            let dir1 = './content/systemflag';
                            if (!fs.existsSync(dir1)) {
                                fs.mkdirSync(dir1);
                            }

                            let dir2 = './content/systemflag/' + req.body.nameList[i];
                            if (!fs.existsSync(dir2)) {
                                fs.mkdirSync(dir2);
                            }
                            const fileContentsUser = new Buffer(image, 'base64')
                            let imgPath = "./content/systemflag/" + req.body.nameList[i] + "/" + req.body.nameList[i] + "-realImg.jpeg";

                            fs.writeFileSync(imgPath, fileContentsUser, (err: any) => {
                                if (err)
                                    return console.error(err)
                                console.log('file saved imagePath')
                            });
                            imagePath = "./content/systemflag/" + req.body.nameList[i] + "/" + req.body.nameList[i] + ".jpeg";
                            // sharp(imgPath).resize({
                            //     height: 100,
                            //     width: 100
                            // }).toFile(imagePath)
                            //     .then(function (newFileInfo: any) {
                            //         console.log(newFileInfo);
                            //     });
                            await Jimp.read(imgPath)
                                .then((lenna: any) => {
                                    return lenna
                                        //.resize(100, 100) // resize
                                        // .quality(60) // set JPEG quality
                                        // .greyscale() // set greyscale
                                        // .write("lena-small-bw.jpg"); // save
                                        .write(imagePath);
                                })
                                .catch((err: any) => {
                                    console.error(err);
                                });
                        } else {
                            let getImageSql = `SELECT * FROM systemflags WHERE name = ?`;
                            let getImageResult = await header.query(getImageSql, [req.body.nameList[i]]);
                            if (getImageResult && getImageResult.length > 0) {
                                if (getImageResult[0].value) {
                                    let imagePath = "./" + getImageResult[0].value;
                                    if (fs.existsSync(imagePath)) {
                                        fs.unlink(imagePath, (err: any) => {
                                            if (err) throw err;
                                            console.log(imagePath + ' was deleted');
                                        });
                                    }
                                    let realImg = "./" + getImageResult[0].value.split(".")[0] + "-realImg." + getImageResult[0].value.split(".")[1];
                                    if (fs.existsSync(realImg)) {
                                        fs.unlink(realImg, (err: any) => {
                                            if (err) throw err;
                                            console.log(realImg + ' was deleted');
                                        });
                                    }
                                    //Delete URL
                                }
                            }
                        }
                        let sql = "UPDATE systemflags SET value = ? WHERE name = ?";
                        result = await header.query(sql, [imagePath.substring(2), req.body.nameList[i]]);
                    }
                    else {
                        if (req.body.nameList[i] === 'isEnableWallet') {
                            await header.query(`UPDATE paymentgateway SET isActive = ` + req.body.valueList[i] + ` WHERE name = 'Wallet'`);
                        }

                        // let idSql = await header.query(`SELECT id FROM systemflags WHERE name = '` + req.body.nameList[i] + `'`)
                        // let updateSql = `UPDATE systemflags SET autoRender = ` + req.body.autoRenderList[i] + ` WHERE id = ` + idSql[0].id + ``
                        // let updateResult = await header.query(updateSql);
                        // console.log(updateResult);

                        let sql = "UPDATE systemflags SET value = ?, autoRender = ?  WHERE name = ?";
                        result = await header.query(sql, [req.body.valueList[i], req.body.autoRenderList[i], req.body.nameList[i]]);


                    }
                }
                if (result.affectedRows > 0) {
                    let successResult = new ResultSuccess(200, true, 'Update System Flag', result, 1, authorizationResult.token);
                    return res.status(200).send(successResult);
                } else {
                    let errorResult = new ResultError(400, true, "systemflags.updateSystemFlagByName() Error", new Error('Error While Updating Data'), '');
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
        let errorResult = new ResultError(500, true, 'systemflags.updateSystemFlagByName() Exception', error, '');
        next(errorResult);
    }
};

export default { getAdminSystemFlag, updateSystemFlagByName, getAdminSystemFlagSetting }