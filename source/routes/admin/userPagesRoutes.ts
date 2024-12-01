import express from 'express';
import controller from '../../controllers/admin/userPages';

const router = express.Router();

// #region /api/admin/userPages/getUserPages apidoc
/**
 * @api {post} /api/admin/userPages/getUserPages Get User Page
 * @apiVersion 1.0.0
 * @apiName Get User Page
 * @apiDescription Get User Page
 * @apiGroup User Pages - Admin
 * @apiSuccess (200) {JSON} Result status, message, recordList, totalRecords.
 * @apiSuccessExample {json} Success-200-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "status": 200,
 *         "isDisplayMessage": true,
 *         "message": "Get User Pages Successfully",
 *         "recordList": [
 *             {
 *                 "id": 1,
 *                 "path": "/admin",
 *                 "title": "Dashboard",
 *                 "type": "link",
 *                 "active": "1",
 *                 "group": null,
 *                 "parentId": null,
 *                 "displayOrder": 1,
 *                 "userPageId": null/Id,
 *                 "isReadPermission": 1,
 *                 "isAddPermission": 1,
 *                 "isDeletePermission": 1,
 *                 "isEditPermission": 1,
 *                 "isActive": 1,
 *                 "isDelete": 0,
 *                 "createdDate": "2022-10-10T04:37:44.000Z",
 *                 "modifiedDate": "2022-10-10T04:37:44.000Z"
 *             },.....
 *         ],
 *         "totalRecords": 8,
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
router.post('/getUserPages', controller.getUserPages);


// #region /api/admin/userPages/insertUpdateUserPages apidoc
/**
 * @api {post} /api/admin/userPages/insertUpdateUserPages Insert/Update User Page Permission
 * @apiVersion 1.0.0
 * @apiName Insert/Update User Page Permission
 * @apiDescription Insert/Update User Page Permission
 * @apiGroup User Pages - Admin
 * @apiSuccess (200) {JSON} Result status, message, recordList, totalRecords.
 * @apiSuccessExample {json} Success-200-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "status": 200,
 *         "isDisplayMessage": true,
 *         "message": "Insert/Update User Pages Permission Successfully",
 *         "recordList": [
 *             {
 *                 "id": 1,
 *                 "path": "/admin",
 *                 "title": "Dashboard",
 *                 "type": "link",
 *                 "active": "1",
 *                 "group": null,
 *                 "parentId": null,
 *                 "displayOrder": 1,
 *                 "userPageId": null/Id,
 *                 "isReadPermission": 1,
 *                 "isAddPermission": 1,
 *                 "isDeletePermission": 1,
 *                 "isEditPermission": 1,
 *                 "isActive": 1,
 *                 "isDelete": 0,
 *                 "createdDate": "2022-10-10T04:37:44.000Z",
 *                 "modifiedDate": "2022-10-10T04:37:44.000Z"
 *             },.....
 *         ],
 *         "totalRecords": 8,
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
 *     HTTP/1.1 400 Error While Inserting/Updating Data
 *     {
 *          status: 400,
 *          isDisplayMessage: <true/false>, // if the value is true then display message on screen
 *          message: "Error While Inserting/Updating Data",
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
router.post('/insertUpdateUserPages', controller.insertUpdateUserPages);

export = router;