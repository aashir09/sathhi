import express from 'express';
import controller from '../../controllers/admin/districts';

const router = express.Router();

// #region /api/admin/districts/getDistricts apidoc
/**
 * @api {post} /api/admin/districts/getDistricts Get Districts
 * @apiVersion 1.0.0
 * @apiName Get Districts
 * @apiDescription Get Districts
 * @apiGroup Districts - Admin
 * @apiParam  {Number}          stateId                Requires stateId of Districts.
 * @apiParamExample {json} Request-Example:
 *      { 
 *           "stateId": 3
 *      }
 * @apiSuccess (200) {JSON} Result status, message, recordList, totalRecords.
 * @apiSuccessExample {json} Success-200-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "status": 200,
 *         "isDisplayMessage": true,
 *         "message": "Get Districts Succesfully",
 *         "recordList": [
 *             {
 *                 "id": 1,
 *                 "stateId": 1,
 *                 "name": "Ahmedabad",
 *                 "isActive": 1,
 *                 "isDelete": 0,
 *                 "createdDate": "2022-03-03T06:46:12.000Z",
 *                 "modifiedDate": "2022-03-03T06:46:12.000Z"
 *             },.......
 *         ],
 *         "totalRecords": 26,
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
router.post('/getDistricts', controller.getDistricts);

export = router;