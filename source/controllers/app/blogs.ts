import { NextFunction, Request, Response, query } from 'express';
import logging from "../../config/logging";
import config from "../../config/config";
import header from "../../middleware/apiHeader";
import { ResultSuccess } from '../../classes/response/resultsuccess';
import { ResultError } from '../../classes/response/resulterror';
// import { JSDOM } from 'jsdom';
// import * as jsdom from 'jsdom';
const fs = require('fs');
import * as path from 'path';


// const mysql = require('mysql');
// const util = require('util');

// let connection = mysql.createConnection({
//     host: config.mysql.host,
//     user: config.mysql.user,
//     password: config.mysql.password,
//     database: config.mysql.database
// });

// const query = util.promisify(connection.query).bind(connection);

const NAMESPACE = 'Blog';

const getBlogs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logging.info(NAMESPACE, 'Get Blogs');
        // let authorizationResult;
        let userId = 0;
        let authorizationResult = await header.validateAuthorization(req, res, next);
        if (authorizationResult.statusCode == 200) {

            let startIndex = req.body.startIndex ? req.body.startIndex : (req.body.startIndex === 0 ? 0 : null);
            let fetchRecord = req.body.fetchRecord ? req.body.fetchRecord : null;
            let sql = `SELECT * FROM blogs WHERE isDelete = 0 `;
            let countSql = "SELECT COUNT(*) as totalCount  FROM blogs WHERE isDelete = 0 AND isActive = 1";

            if (req.body.searchString) {
                sql += ` AND description LIKE '%` + req.body.searchString + `%' `;
                countSql += ` AND description LIKE '%` + req.body.searchString + `%' `;
            }

            sql += ` ORDER BY id DESC `;

            if (startIndex != null && fetchRecord != null) {
                sql += " LIMIT " + fetchRecord + " OFFSET " + startIndex + "";
            }
            let countResult = await header.query(countSql);
            let result = await header.query(sql);
            if (result) {
                if (result.length > 0) {
                    for (const ele of result) {

                        if (ele.tags && typeof ele.tags === 'string') {
                            const valueArray: string[] = ele.tags.includes(';') ? ele.tags.split(";") : [ele.tags];
                            ele.tags = valueArray;

                            // ele.tagNames = ele.tags.join(",");
                        }
                    }
                }
                let successResult = new ResultSuccess(200, true, 'Get Blogs Successfully', result, countResult[0].totalCount, authorizationResult ? authorizationResult.token : '');
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
        let errorResult = new ResultError(500, true, 'blog.getBlogs() Exception', error, '');
        next(errorResult);
    }
};



const getBlogDetail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logging.info(NAMESPACE, 'Get Blog Detail');
        let requiredFields = ['id'];
        let validationResult = header.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = await header.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {

                let sql = `SELECT * FROM blogs WHERE id = ` + req.body.id + ` AND isDelete = 0 AND isActive = 1`;
                let result = await header.query(sql);
                if (result) {
                    
                        if (result.length > 0) {
                            const valueArray: string[] = result[0].tags.includes(';') ? result[0].tags.split(";") : [result[0].tags];
                            result[0].tags = valueArray;
                            // result[0].tagNames = result[0].tags.join(",");
                        }
                    
                    let successResult = new ResultSuccess(200, true, 'Get Blog Detail Successfully', result, 1, authorizationResult ? authorizationResult.token : '');
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
        let errorResult = new ResultError(500, true, 'blog.getBlogDetail() Exception', error, '');
        next(errorResult);
    }
};


export default { getBlogs,getBlogDetail }