"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const dashboard_1 = __importDefault(require("../../controllers/admin/dashboard"));
const router = express_1.default.Router();
// #region /api/admin/dashboard/getDashboardData apidoc
/**
 * @api {post} /api/admin/dashboard/getDashboardData Get Dashboard Data
 * @apiVersion 1.0.0
 * @apiName Get Dashboard Data
 * @apiDescription Get Dashboard Data
 * @apiGroup Dashboard - Admin
 * @apiParam {Date}       fromDate            Optional From Date
 * @apiParam {Boolean}    toDate              Optional To Date
 * @apiSuccess (200) {JSON} Result status, message, recordList, totalRecords.
 * @apiSuccessExample {json} Success-200-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "status": 200,
 *         "isDisplayMessage": true,
 *         "message": "Get Users Successfully",
 *         "recordList": [
 *             {
 *                 "todayRegistration": 0,
 *                 "monthlyRegistration": 13,
 *                 "todayProposal": 0,
 *                 "monthlyProposal": 8,
 *                 "recentUserResult": [
 *                     {
 *                         "id": 1,
 *                         "firstName": "Ankita",
 *                         "middleName": "Sanjay",
 *                         "lastName": "Tripathi",
 *                         "contactNo": "9662737261",
 *                         "email": "ankita@gmail.com",
 *                         "gender": "Female",
 *                         "password": "$2a$10$jJ3Yw5x6VGheDZE5lr.MkeedMuYvm/kcHoa8YVbY0KwfYv.L45/o6",
 *                         "imageId": null,
 *                         "isPasswordSet": 1,
 *                         "isDisable": 1,
 *                         "isVerified": 1,
 *                         "isActive": 1,
 *                         "isDelete": 0,
 *                         "createdDate": "2022-10-10T04:37:44.000Z",
 *                         "modifiedDate": "2022-10-10T04:37:44.000Z"
 *                     },...
 *                 ]
 *             }
 *         ],
 *         "totalRecords": 1,
 *         "token": ""
 *     }
 * @apiError (500) {JSON} Result message, apiName, apiType, fileName, functionName, lineNumber, typeName, stack.
 * @apiErrorExample {json} Error-500-Response:
 *     HTTP/1.1 500 ERROR
 *     {
 *          status: <error status code>,
 *          isDisplayMessage: <true/false>, // if the value is true then display message on screen
 *          message: <error message>,
 *          error: {
 *              apiName: <api name>,
 *              apiType: <api type>,
 *              fileName: <file name>,
 *              functionName: <function name>,
 *              lineNumber: <line number>,
 *              typeName: <type name>,
 *              stack: <stack>
 *          },
 *          value: <value if any>
 *     }
 * @apiError (401) {JSON} Result message, apiName, apiType, fileName, functionName, lineNumber, typeName, stack.
 * @apiErrorExample {json} Error-401-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *          status: 401,
 *          isDisplayMessage: <true/false>, // if the value is true then display message on screen
 *          message: "Unauthorized request",
 *          error: {
 *              apiName: <api name>,
 *              apiType: <api type>,
 *              fileName: <file name>,
 *              functionName: <function name>,
 *              lineNumber: <line number>,
 *              typeName: <type name>,
 *              stack: <stack>
 *          },
 *          value: <value if any>
 *     }
 * @apiError (400) {JSON} Result message, apiName, apiType, fileName, functionName, lineNumber, typeName, stack.
 * @apiErrorExample {json} Error-400-Response:
 *     HTTP/1.1 400 Data not found
 *     {
 *          status: 400,
 *          isDisplayMessage: <true/false>, // if the value is true then display message on screen
 *          message: "Data Not Available",
 *          error: {
 *              apiName: <api name>,
 *              apiType: <api type>,
 *              fileName: <file name>,
 *              functionName: <function name>,
 *              lineNumber: <line number>,
 *              typeName: <type name>,
 *              stack: <stack>
 *          },
 *          value: <value if any>
 *     }
 */
// #endregion
router.post('/getDashboardData', dashboard_1.default.getDashboardData);
module.exports = router;
