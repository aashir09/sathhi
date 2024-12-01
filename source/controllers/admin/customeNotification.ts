import { NextFunction, Request, Response } from 'express';
import logging from "../../config/logging";
import config from "../../config/config";
import header from "../../middleware/apiHeader";
import { ResultSuccess } from '../../classes/response/resultsuccess';
import { ResultError } from '../../classes/response/resulterror';
import notificationContainer from './../notifications';
const fs = require('fs');
var Jimp = require("jimp");

const NAMESPACE = 'Custom Notification';

const getCustomNotification = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logging.info(NAMESPACE, 'Get Custom Notification');
        let requiredFields = [''];
        let validationResult = header.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = await header.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let startIndex = req.body.startIndex ? req.body.startIndex : (req.body.startIndex === 0 ? 0 : null);
                let fetchRecord = req.body.fetchRecord ? req.body.fetchRecord : null;
                let countSql = "SELECT COUNT(c.id) as totalCount  FROM customnotification c ";
                if (req.body.searchString) {
                    if (!countSql.includes(` WHERE `)) {
                        countSql += ` WHERE `;
                    } else {
                        countSql += ` AND `;
                    }
                    countSql += ` (LOWER(c.name) LIKE '%` + req.body.searchString.toString().toLowerCase() + `%' OR LOWER(c.title) LIKE '%` + req.body.searchString.toString().toLowerCase() + `%' OR LOWER(c.description) LIKE '%` + req.body.searchString.toString().toLowerCase() + `%') `;
                }
                if (req.body.isActive === true || req.body.isActive === false) {
                    if (!countSql.includes(` WHERE `)) {
                        countSql += ` WHERE `;
                    } else {
                        countSql += ` AND `;
                    }
                    countSql += ` c.isActive = ` + req.body.isActive;
                }

                let countResult = await header.query(countSql);
                let sql = `SELECT c.* FROM customnotification c WHERE c.isDelete = 0 `;
                if (req.body.searchString) {
                    if (!sql.includes(` WHERE `)) {
                        sql += ` WHERE `;
                    } else {
                        sql += ` AND `;
                    }
                    sql += ` (LOWER(c.name) LIKE '%` + req.body.searchString.toString().toLowerCase() + `%' OR LOWER(c.title) LIKE '%` + req.body.searchString.toString().toLowerCase() + `%' OR LOWER(c.description) LIKE '%` + req.body.searchString.toString().toLowerCase() + `%') `;
                }
                if (req.body.isActive === true || req.body.isActive === false) {
                    if (!sql.includes(` WHERE `)) {
                        sql += ` WHERE `;
                    } else {
                        sql += ` AND `;
                    }
                    sql += ` c.isActive = ` + req.body.isActive;
                }
                sql += ` ORDER BY id DESC `;
                if (startIndex != null && fetchRecord != null) {
                    sql += " LIMIT " + fetchRecord + " OFFSET " + startIndex + "";
                }
                let result = await header.query(sql);
                if (result) {
                    let successResult = new ResultSuccess(200, true, 'Get Custom Notification', result, countResult[0].totalCount, authorizationResult.token);
                    return res.status(200).send(successResult);
                } else {
                    let errorResult = new ResultError(400, true, 'Data Not Available', new Error('Data Not Available'), '');
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
        let errorResult = new ResultError(500, true, 'customNotification.getCustomNotification() Exception', error, '');
        next(errorResult);
    }
}

const insertUpdateCustomNotification = async (req: Request, res: Response, next: NextFunction) => {
    await header.beginTransaction();
    try {
        logging.info(NAMESPACE, 'Insert Update Notification');
        let requiredFields = ['name', 'title', 'description', 'isSend'];
        let validationResult = header.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = await header.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let currentUser = authorizationResult.currentUser;
                let userId = currentUser.id;
                if (req.body.id) {
                    let oldUrl = "";
                    let imgUrl = "";
                    let getSql = `SELECT * FROM customnotification WHERE id = ` + req.body.id;
                    let getResult = await header.query(getSql);
                    if (getResult && getResult.length > 0) {
                        oldUrl = getResult[0].imageUrl;
                    }
                    if (req.body.imageUrl) {
                        if (req.body.imageUrl && req.body.imageUrl.indexOf("content") == -1) {
                            let notificationId = req.body.id;
                            let image = req.body.imageUrl;
                            let data = image.split(',');
                            if (data && data.length > 1) {
                                image = image.split(',')[1]
                            }

                            let dir = './content';
                            if (!fs.existsSync(dir)) {
                                fs.mkdirSync(dir);
                            }

                            let dir1 = './content/notification';
                            if (!fs.existsSync(dir1)) {
                                fs.mkdirSync(dir1);
                            }

                            let dir2 = './content/notification/' + notificationId;
                            if (!fs.existsSync(dir2)) {
                                fs.mkdirSync(dir2);
                            }

                            const fileContentsUser = new Buffer(image, 'base64')
                            let imgPath = "./content/notification/" + notificationId + "/" + notificationId + "-realImg.jpeg";
                            if (oldUrl) {
                                let imagePath = "./" + oldUrl;
                                if (fs.existsSync(imagePath)) {
                                    fs.unlink(imagePath, (err: any) => {
                                        if (err) throw err;
                                        console.log(imagePath + ' was deleted');
                                    });
                                }
                                //Delete URL
                                imgUrl = "";

                                let realImg = "./" + oldUrl.split(".")[0] + "-realImg." + oldUrl.split(".")[1];
                                if (fs.existsSync(realImg)) {
                                    fs.unlink(realImg, (err: any) => {
                                        if (err) throw err;
                                        console.log(realImg + ' was deleted');
                                    });
                                }
                            }
                            fs.writeFileSync(imgPath, fileContentsUser, (err: any) => {
                                if (err)
                                    return console.error(err)
                                console.log('file saved imagePath')
                            });
                            let imagePath = "./content/notification/" + notificationId + "/" + notificationId + ".jpeg";
                            await Jimp.read(imgPath)
                                .then(async (lenna: any) => {
                                    let data = lenna
                                        //.resize(100, 100) // resize
                                        // .quality(60) // set JPEG quality
                                        // .greyscale() // set greyscale
                                        // .write("lena-small-bw.jpg"); // save
                                        .write(imagePath);

                                    const image_act = await Jimp.read(imagePath);
                                    const watermark = await Jimp.read('./content/systemflag/watermarkImage/watermarkImage.jpeg');
                                    watermark.resize(image_act.getWidth() / 2, Jimp.AUTO);
                                    const x = (image_act.getWidth() - watermark.getWidth()) / 2;
                                    const y = (image_act.getHeight() - (watermark.getHeight() * 2));

                                    image_act.composite(watermark, x, y, {
                                        mode: Jimp.BLEND_SOURCE_OVER,
                                        opacitySource: 0.4, // Adjust the opacity of the watermark
                                    });
                                    //imagePath = "./content/notification/" + notificationId + ".jpeg";
                                    await image_act.writeAsync(imagePath);

                                    return data;
                                })
                                .catch((err: any) => {
                                    console.error(err);
                                });

                            // if (oldUrl) {
                            //     let imagePath = "./" + oldUrl;
                            //     if (fs.existsSync(imagePath)) {
                            //         fs.unlink(imagePath, (err: any) => {
                            //             if (err) throw err;
                            //             console.log(imagePath + ' was deleted');
                            //         });
                            //     }
                            //     //Delete URL
                            //     imgUrl = "";

                            //     let realImg = "./" + oldUrl.split(".")[0] + "-realImg." + oldUrl.split(".")[1];
                            //     if (fs.existsSync(realImg)) {
                            //         fs.unlink(realImg, (err: any) => {
                            //             if (err) throw err;
                            //             console.log(realImg + ' was deleted');
                            //         });
                            //     }
                            // }
                            

                            imgUrl = imagePath.substring(2);
                        } else {
                            imgUrl = oldUrl;
                        }
                    } else {
                        if (oldUrl) {
                            let imagePath = "./" + oldUrl;
                            if (fs.existsSync(imagePath)) {
                                fs.unlink(imagePath, (err: any) => {
                                    if (err) throw err;
                                    console.log(imagePath + ' was deleted');
                                });
                            }
                            //Delete URL
                            imgUrl = "";

                            let realImg = "./" + oldUrl.split(".")[0] + "-realImg." + oldUrl.split(".")[1];
                            if (fs.existsSync(realImg)) {
                                fs.unlink(realImg, (err: any) => {
                                    if (err) throw err;
                                    console.log(realImg + ' was deleted');
                                });
                            }
                        }
                    }
                    let sql = `UPDATE customnotification SET name = '` + req.body.name + `', title = '` + req.body.title + `', description = '` + req.body.description + `', imageUrl = '` + imgUrl + `', modifiedBy = ` + userId + `
                    , modifiedDate = CURRENT_TIMESTAMP() WHERE id = ` + req.body.id;
                    let result = await header.query(sql);
                    if (result && result.affectedRows >= 0) {
                        if (req.body.isSend) {
                            let customerFcmSql = "SELECT u.id, udd.fcmToken FROM userdevicedetail udd INNER JOIN users u ON u.id = udd.userId WHERE u.isActive = true AND udd.fcmToken IS NOT NULL  ORDER BY id DESC";
                            let customerFcmResult = await header.query(customerFcmSql);
                            if (customerFcmResult && customerFcmResult.length > 0) {
                                let fcmTokens = [];
                                for (let i = 0; i < customerFcmResult.length; i++) {
                                    let check = `SELECT uf.id as userflagId , ufv.userId FROM userflags uf
                                    LEFT JOIN userflagvalues ufv ON ufv.userId = `+ customerFcmResult[i].id + `
                                    WHERE uf.flagName = 'pushNotification' AND ufv.userFlagValue = 1`;
                                    let checkResult = await header.query(check);
                                    if (checkResult && checkResult.length > 0) {
                                        if (customerFcmResult[i].fcmToken) {
                                            fcmTokens.push(customerFcmResult[i].fcmToken);
                                            let img = imgUrl;
                                            let notificationSql = `INSERT INTO usernotifications(userId, title, message, bodyJson, imageUrl, createdBy, modifiedBy) 
                                        VALUES(` + customerFcmResult[i].id + `,'` + req.body.title + `', '` + req.body.description + `', null, '` + img + `', ` + userId + `, ` + userId + `)`
                                            let notificationResult = await header.query(notificationSql);
                                        }
                                    }
                                }
                                if (fcmTokens && fcmTokens.length > 0) {

                                    //let img = imgUrl;
                                    const proxyHost = req.headers["x-forwarded-host"];
                                    const host = proxyHost ? proxyHost : req.headers.host;
                                    let img = "http://" + host + "/" + imgUrl
                                    await notificationContainer.sendMultipleNotification(fcmTokens, null, req.body.title, req.body.description, '', null, img, 0);
                                    let updateimagePathSql = `UPDATE customnotification SET sendCount = sendCount+1 WHERE id=` + req.body.id;
                                    let updateimagePathResult = await header.query(updateimagePathSql);
                                    if (updateimagePathResult && updateimagePathResult.affectedRows > 0) {
                                        await header.commit();
                                        let successResult = new ResultSuccess(200, true, 'Custom Notification added successfully', updateimagePathResult, 1, authorizationResult.token);
                                        return res.status(200).send(successResult);
                                    } else {
                                        await header.rollback();
                                        let errorResult = new ResultError(400, true, "customNotification.insertUpdateCustomNotification() Error", new Error('Error While Updating Notification'), '');
                                        next(errorResult);
                                    }
                                } else {
                                    await header.commit();
                                    let successResult = new ResultSuccess(200, true, 'Custom Notification added successfully', result, 1, authorizationResult.token);
                                    return res.status(200).send(successResult);
                                }
                            } else {
                                await header.commit();
                                let successResult = new ResultSuccess(200, true, 'Custom Notification added successfully', result, 1, authorizationResult.token);
                                return res.status(200).send(successResult);
                            }
                        } else {
                            await header.commit();
                            let successResult = new ResultSuccess(200, true, 'Custom Notification added successfully', result, 1, authorizationResult.token);
                            return res.status(200).send(successResult);
                        }
                    }
                } else {
                    let sql = `INSERT INTO customnotification(name, title, description, imageUrl, sendCount, createdBy, modifiedBy) 
                    VALUES('` + req.body.name + `','` + req.body.title + `','` + req.body.description + `','',0,` + userId + `,` + userId + `)`;
                    let result = await header.query(sql);
                    if (result && result.insertId > 0) {
                        let notificationId = result.insertId;
                        if (req.body.imageUrl) {
                            let image = req.body.imageUrl;
                            let data = image.split(',');
                            if (data && data.length > 1) {
                                image = image.split(',')[1]
                            }

                            let dir = './content';
                            if (!fs.existsSync(dir)) {
                                fs.mkdirSync(dir);
                            }

                            let dir1 = './content/notification';
                            if (!fs.existsSync(dir1)) {
                                fs.mkdirSync(dir1);
                            }

                            let dir2 = './content/notification/' + notificationId;
                            if (!fs.existsSync(dir2)) {
                                fs.mkdirSync(dir2);
                            }

                            const fileContentsUser = new Buffer(image, 'base64')
                            let imgPath = "./content/notification/" + notificationId + "/" + notificationId + "-realImg.jpeg";

                            fs.writeFileSync(imgPath, fileContentsUser, (err: any) => {
                                if (err)
                                    return console.error(err)
                                console.log('file saved imagePath')
                            });
                            let imagePath = "./content/notification/" + notificationId + "/" + notificationId + ".jpeg";
                            await Jimp.read(imgPath)
                                .then(async (lenna: any) => {
                                    let data = lenna
                                        //.resize(100, 100) // resize
                                        // .quality(60) // set JPEG quality
                                        // .greyscale() // set greyscale
                                        // .write("lena-small-bw.jpg"); // save
                                        .write(imagePath);


                                    const image_act = await Jimp.read(imagePath);
                                    const watermark = await Jimp.read('./content/systemflag/watermarkImage/watermarkImage.jpeg');
                                    watermark.resize(image_act.getWidth() / 2, Jimp.AUTO);
                                    const x = (image_act.getWidth() - watermark.getWidth()) / 2;
                                    const y = (image_act.getHeight() - (watermark.getHeight() * 2));

                                    image_act.composite(watermark, x, y, {
                                        mode: Jimp.BLEND_SOURCE_OVER,
                                        opacitySource: 0.5, // Adjust the opacity of the watermark
                                    });
                                    //imagePath = "./content/notification/" + notificationId + ".jpeg";
                                    await image_act.writeAsync(imagePath);
                                    return data;
                                })
                                .catch((err: any) => {
                                    console.error(err);
                                });

                            // const image_act = await Jimp.read(imagePath);
                            // const watermark = await Jimp.read('/content/systemflag/watermarkImage/watermarkImage.jpeg');
                            // watermark.resize(image_act.getWidth() / 2, Jimp.AUTO);
                            // const x = (image_act.getWidth() - watermark.getWidth()) / 2;
                            // const y = (image_act.getHeight() - watermark.getHeight()) / 2;

                            // image_act.composite(watermark, x, y, {
                            //     mode: Jimp.BLEND_SOURCE_OVER,
                            //     opacitySource: 0.5, // Adjust the opacity of the watermark
                            // });
                            // //imagePath = "./content/notification/" + notificationId + ".jpeg";
                            // await image_act.writeAsync(imagePath);

                            let updateimagePathSql = `UPDATE customnotification SET imageUrl='` + imagePath.substring(2) + `' WHERE id=` + notificationId;
                            let updateimagePathResult = await header.query(updateimagePathSql);
                            if (updateimagePathResult && updateimagePathResult.affectedRows > 0) {
                                if (req.body.isSend) {
                                    let customerFcmSql = "SELECT u.id, udd.fcmToken FROM userdevicedetail udd INNER JOIN users u ON u.id = udd.userId WHERE u.isActive = true AND udd.fcmToken IS NOT NULL  ORDER BY id DESC";
                                    let customerFcmResult = await header.query(customerFcmSql);
                                    if (customerFcmResult && customerFcmResult.length > 0) {
                                        let fcmTokens = [];
                                        for (let i = 0; i < customerFcmResult.length; i++) {
                                            let check = `SELECT uf.id as userflagId , ufv.userId FROM userflags uf
                                            LEFT JOIN userflagvalues ufv ON ufv.userId = `+ customerFcmResult[i].id + `
                                            WHERE uf.flagName = 'pushNotification' AND ufv.userFlagValue = 1`;
                                            let checkResult = await header.query(check);
                                            if (checkResult && checkResult.length > 0) {
                                                if (customerFcmResult[i].fcmToken) {
                                                    fcmTokens.push(customerFcmResult[i].fcmToken);
                                                    let img = imagePath.substring(2);
                                                    let notificationSql = `INSERT INTO usernotifications(userId, title, message, bodyJson, imageUrl, createdBy, modifiedBy) 
                                                VALUES(` + customerFcmResult[i].id + `,'` + req.body.title + `', '` + req.body.description + `', null, '` + img + `', ` + userId + `, ` + userId + `)`
                                                    let notificationResult = await header.query(notificationSql);
                                                }
                                            }
                                        }
                                        if (fcmTokens && fcmTokens.length > 0) {
                                            const proxyHost = req.headers["x-forwarded-host"];
                                            const host = proxyHost ? proxyHost : req.headers.host;
                                            let img = "http://" + host + "/" + imagePath.substring(2);
                                            //let img = imagePath.substring(2);
                                            await notificationContainer.sendMultipleNotification(fcmTokens, null, req.body.title, req.body.description, '', null, img, 0);
                                            let updateimagePathSql = `UPDATE customnotification SET sendCount = sendCount+1 WHERE id=` + notificationId;
                                            let updateimagePathResult = await header.query(updateimagePathSql);
                                            if (updateimagePathResult && updateimagePathResult.affectedRows > 0) {
                                                await header.commit();
                                                let successResult = new ResultSuccess(200, true, 'Custom Notification added successfully', updateimagePathResult, 1, authorizationResult.token);
                                                return res.status(200).send(successResult);
                                            } else {
                                                await header.rollback();
                                                let errorResult = new ResultError(400, true, "customNotification.insertUpdateCustomNotification() Error", new Error('Error While Updating Notification'), '');
                                                next(errorResult);
                                            }
                                        } else {
                                            await header.commit();
                                            let successResult = new ResultSuccess(200, true, 'Custom Notification added successfully', updateimagePathResult, 1, authorizationResult.token);
                                            return res.status(200).send(successResult);
                                        }
                                    } else {
                                        await header.commit();
                                        let successResult = new ResultSuccess(200, true, 'Custom Notification added successfully', updateimagePathResult, 1, authorizationResult.token);
                                        return res.status(200).send(successResult);
                                    }
                                } else {
                                    await header.commit();
                                    let successResult = new ResultSuccess(200, true, 'Custom Notification added successfully', updateimagePathResult, 1, authorizationResult.token);
                                    return res.status(200).send(successResult);
                                }
                            } else {
                                await header.rollback();
                                let errorResult = new ResultError(400, true, "customNotification.insertUpdateCustomNotification() Error", new Error('Error While Updating Pic'), '');
                                next(errorResult);
                            }
                        } else {
                            if (req.body.isSend) {
                                let customerFcmSql = "SELECT u.id, udd.fcmToken FROM userdevicedetail udd INNER JOIN users u ON u.id = udd.userId WHERE u.isActive = true AND udd.fcmToken IS NOT NULL  ORDER BY id DESC";
                                let customerFcmResult = await header.query(customerFcmSql);
                                if (customerFcmResult && customerFcmResult.length > 0) {
                                    let fcmTokens = [];
                                    for (let i = 0; i < customerFcmResult.length; i++) {
                                        let check = `SELECT uf.id as userflagId , ufv.userId FROM userflags uf
                                        LEFT JOIN userflagvalues ufv ON ufv.userId = `+ customerFcmResult[i].id + `
                                        WHERE uf.flagName = 'pushNotification' AND ufv.userFlagValue = 1`;
                                        let checkResult = await header.query(check);
                                        if (checkResult && checkResult.length > 0) {
                                            if (customerFcmResult[i].fcmToken) {
                                                fcmTokens.push(customerFcmResult[i].fcmToken);
                                                let notificationSql = `INSERT INTO usernotifications(userId, title, message, bodyJson, imageUrl, createdBy, modifiedBy) 
                                                VALUES(` + customerFcmResult[i].id + `,'` + req.body.title + `', '` + req.body.description + `', null, '', ` + userId + `, ` + userId + `)`
                                                let notificationResult = await header.query(notificationSql);
                                            }
                                        }
                                    }
                                    if (fcmTokens && fcmTokens.length > 0) {
                                        await notificationContainer.sendMultipleNotification(fcmTokens, null, req.body.title, req.body.description, '', null, null, 0);
                                        let updateimagePathSql = `UPDATE customnotification SET sendCount = sendCount+1 WHERE id=` + notificationId;
                                        let updateimagePathResult = await header.query(updateimagePathSql);
                                        if (updateimagePathResult && updateimagePathResult.affectedRows > 0) {
                                            await header.commit();
                                            let successResult = new ResultSuccess(200, true, 'Custom Notification added successfully', updateimagePathResult, 1, authorizationResult.token);
                                            return res.status(200).send(successResult);
                                        } else {
                                            await header.rollback();
                                            let errorResult = new ResultError(400, true, "customNotification.insertUpdateCustomNotification() Error", new Error('Error While Updating Notification'), '');
                                            next(errorResult);
                                        }
                                    } else {
                                        await header.commit();
                                        let successResult = new ResultSuccess(200, true, 'Custom Notification added successfully', result, 1, authorizationResult.token);
                                        return res.status(200).send(successResult);
                                    }
                                } else {
                                    await header.commit();
                                    let successResult = new ResultSuccess(200, true, 'Custom Notification added successfully', result, 1, authorizationResult.token);
                                    return res.status(200).send(successResult);
                                }
                            } else {
                                await header.commit();
                                let successResult = new ResultSuccess(200, true, 'Custom Notification added successfully', result, 1, authorizationResult.token);
                                return res.status(200).send(successResult);
                            }
                        }
                    } else {
                        await header.rollback();
                        let errorResult = new ResultError(400, true, "customNotification.insertUpdateCustomNotification() Error", new Error('Error While Inserting'), '');
                        next(errorResult);
                    }
                }
            }
            else {
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
        let errorResult = new ResultError(500, true, 'customNotification.insertUpdateCustomNotification() Exception', error, '');
        next(errorResult);
    }
}

const sendCustomNotification = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logging.info(NAMESPACE, 'Send Custom Notification');
        let requiredFields = ['id'];
        let validationResult = header.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = await header.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let currentUser = authorizationResult.currentUser;
                let userId = currentUser.id;
                let sql = `SELECT * FROM customnotification WHERE id = ` + req.body.id;
                let result = await header.query(sql);
                if (result && result.length > 0) {
                    let customerFcmSql = "SELECT u.id, udd.fcmToken FROM userdevicedetail udd INNER JOIN users u ON u.id = udd.userId WHERE u.isActive = true AND udd.fcmToken IS NOT NULL  ORDER BY id DESC";
                    let customerFcmResult = await header.query(customerFcmSql);
                    if (customerFcmResult && customerFcmResult.length > 0) {
                        let fcmTokens = [];
                        for (let i = 0; i < customerFcmResult.length; i++) {
                            let check = `SELECT uf.id as userflagId , ufv.userId FROM userflags uf
                                            LEFT JOIN userflagvalues ufv ON ufv.userId = `+ customerFcmResult[i].id + `
                                            WHERE uf.flagName = 'pushNotification' AND ufv.userFlagValue = 1`;
                            let checkResult = await header.query(check);
                            if (checkResult && checkResult.length > 0) {
                                if (customerFcmResult[i].fcmToken) {
                                    fcmTokens.push(customerFcmResult[i].fcmToken);
                                    let img = "";
                                    if (result[0].imageUrl)
                                        img = result[0].imageUrl;
                                    let notificationSql = `INSERT INTO usernotifications(userId, title, message, bodyJson, imageUrl, createdBy, modifiedBy) 
                                                VALUES(` + customerFcmResult[i].id + `,'` + result[0].title + `', '` + result[0].description + `', null, '` + img + `', ` + userId + `, ` + userId + `)`
                                    let notificationResult = await header.query(notificationSql);
                                }
                            }
                        }
                        if (fcmTokens && fcmTokens.length > 0) {
                            let img = "";
                            if (result[0].imageUrl) {
                                const proxyHost = req.headers["x-forwarded-host"];
                                const host = proxyHost ? proxyHost : req.headers.host;
                                img = "http://" + host + "/" + result[0].imageUrl;
                            }
                            await notificationContainer.sendMultipleNotification(fcmTokens, null, result[0].title, result[0].description, '', null, img, 0);
                            let updateimagePathSql = `UPDATE customnotification SET sendCount = sendCount+1 WHERE id=` + req.body.id;
                            let updateimagePathResult = await header.query(updateimagePathSql);
                            if (updateimagePathResult && updateimagePathResult.affectedRows > 0) {
                                let successResult = new ResultSuccess(200, true, 'Send Notification successfully', updateimagePathResult, 1, authorizationResult.token);
                                return res.status(200).send(successResult);
                            } else {
                                let errorResult = new ResultError(400, true, "customNotification.insertUpdateCustomNotification() Error", new Error('Error While Updating Notification'), '');
                                next(errorResult);
                            }
                        } else {
                            let successResult = new ResultSuccess(200, true, 'Send Notification successfully', result, 1, authorizationResult.token);
                            return res.status(200).send(successResult);
                        }
                    } else {
                        let successResult = new ResultSuccess(200, true, 'Send Notification successfully', result, 1, authorizationResult.token);
                        return res.status(200).send(successResult);
                    }
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
        let errorResult = new ResultError(500, true, 'customNotification.sendCustomNotification() Exception', error, '');
        next(errorResult);
    }
}

const activeInactiveCustomNotification = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logging.info(NAMESPACE, 'Active Inactive Custom Notification');
        let requiredFields = ['id'];
        let validationResult = header.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = await header.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let sql = `UPDATE customnotification set isActive = !isActive WHERE id = ` + req.body.id + ``;
                let result = await header.query(sql);
                if (result && result.affectedRows > 0) {
                    let successResult = new ResultSuccess(200, true, 'Change Custom Notification Status', result, 1, authorizationResult.token);
                    return res.status(200).send(successResult);
                }
                else {
                    let errorResult = new ResultError(400, true, "customNotification.activeInactiveCustomNotification() Error", new Error('Error While Change Custom Notification Status'), '');
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
        let errorResult = new ResultError(500, true, 'customNotification.activeInactiveCustomNotification() Exception', error, '');
        next(errorResult);
    }
};

export default { getCustomNotification, insertUpdateCustomNotification, sendCustomNotification, activeInactiveCustomNotification }