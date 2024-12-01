import { NextFunction, Request, Response } from 'express';
import logging from "../../config/logging";
import config from "../../config/config";
import header from "../../middleware/apiHeader";
import { ResultSuccess } from '../../classes/response/resultsuccess';
import { ResultError } from '../../classes/response/resulterror';
import controller from '../../controllers/app/customFields';

// const mysql = require('mysql');
// const util = require('util');

// let connection = mysql.createConnection({
//     host: config.mysql.host,
//     user: config.mysql.user,
//     password: config.mysql.password,
//     database: config.mysql.database
// });

// const query = util.promisify(connection.query).bind(connection);

const NAMESPACE = 'Visitors';

const getVisitors = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logging.info(NAMESPACE, 'Getting Visitors');
        const isCustomFieldEnabled = await controller.isCustomFieldEnable();
        console.log(isCustomFieldEnabled);
        let authorizationResult = await header.validateAuthorization(req, res, next);
        if (authorizationResult.statusCode == 200) {
            let currentUser = authorizationResult.currentUser;
            let userId = currentUser.id;
            let startIndex = req.body.startIndex ? req.body.startIndex : (req.body.startIndex === 0 ? 0 : null);
            let fetchRecord = req.body.fetchRecord ? req.body.fetchRecord : null
            // let newSql = `select  up.id , up.userId  as visitorId, up.status, u.firstName, u.lastName, u.gender, u.email, u.contactNo, img.imageUrl as image, o.name as occupation, upd.birthDate, 
            // addr.cityName, DATE_FORMAT(FROM_DAYS(DATEDIFF(NOW(), upd.birthDate)), '%Y') + 0 AS age FROM userproposals up 
            // LEFT JOIN users u ON u.id = up.proposalUserId
            // LEFT JOIN images img ON img.id = u.imageId
            // LEFT JOIN userpersonaldetail upd ON upd.userId = u.id
            // LEFT JOIN occupation o ON o.id = upd.occupationId where up.userId = ` + userId + ` AND `

            let countSql = `select COUNT(*) as totalCount from (SELECT up.id , up.proposalUserId  as visitorId, up.status, u.firstName, u.lastName, u.gender, u.email, u.contactNo, img.imageUrl as image, o.name as occupation, upd.birthDate, u.isVerifyProfilePic, upd.memberid, 
                addr.cityName, DATE_FORMAT(FROM_DAYS(DATEDIFF(NOW(), upd.birthDate)), '%Y') + 0 AS age, 
                up.proposalUserId IN (select userBlockId from userblock where userId =` + userId + `)  as isBlockByMe , 
                up.proposalUserId IN (select userId from userblock where userBlockId = ` + userId + `)  as isBlockByOther
                , IF((select COUNT(id) from userproposals where (userId = ` + userId + ` AND proposalUserId = u.id) OR (proposalUserId = ` + userId + ` AND userId = u.id)) > 0,true,false) as isProposed
, IF((select COUNT(id) from userproposals where (userId = ` + userId + ` AND proposalUserId = u.id) ) > 0,true,false) as isProposalReceived
, IF((select COUNT(id) from userproposals where (proposalUserId = ` + userId + ` AND userId = u.id)) > 0,true,false) as isProposalSent
,  IF((select COUNT(id) from userproposals where (proposalUserId = u.id) AND hascancelled = 1) > 0,true,false) as hascancelled
, (select status from userproposals where ((proposalUserId = u.id AND userId = ` + userId + `) OR (userId = u.id AND proposalUserId = ` + userId + `)) AND hascancelled = 0 ) as proposalStatus
                , u.id IN (select favUserId from userfavourites where userId = ` + userId + `) as isFavourite
                                 FROM userproposals up 
                                 LEFT JOIN users u ON u.id = up.proposalUserId
                                 LEFT JOIN images img ON img.id = u.imageId
                                 LEFT JOIN userpersonaldetail upd ON upd.userId = u.id
                                 LEFT JOIN occupation o ON o.id = upd.occupationId
                                 LEFT JOIN addresses addr ON addr.id = upd.addressId WHERE up.userId =` + userId + ` 
                                 and u.id NOT IN (select userBlockId from userblock where userId = ` + userId + `)   
                                 and u.id NOT IN (select userId from userblock where userBlockId =` + userId + `)
                                 and u.id NOT IN (select blockRequestUserId from userblockrequest where status = true AND userId = ` + userId + `)
                                 union 
                                 SELECT up.id , up.userId  as visitorId, up.status, u.firstName, u.lastName, u.gender, u.email, u.contactNo, img.imageUrl as image, o.name as occupation, upd.birthDate, u.isVerifyProfilePic, upd.memberid,
                                 addr.cityName, DATE_FORMAT(FROM_DAYS(DATEDIFF(NOW(), upd.birthDate)), '%Y') + 0 AS age,
                                 up.proposalUserId IN (select userBlockId from userblock where userId = ` + userId + `)  as isBlockByMe , 
                                up.proposalUserId IN (select userId from userblock where userBlockId = ` + userId + `)  as isBlockByOther
                                , IF((select COUNT(id) from userproposals where (userId = ` + userId + ` AND proposalUserId = u.id) OR (proposalUserId = ` + userId + ` AND userId = u.id)) > 0,true,false) as isProposed
                , IF((select COUNT(id) from userproposals where (userId = ` + userId + ` AND proposalUserId = u.id) ) > 0,true,false) as isProposalReceived
                , IF((select COUNT(id) from userproposals where (proposalUserId = ` + userId + ` AND userId = u.id)) > 0,true,false) as isProposalSent
                ,  IF((select COUNT(id) from userproposals where ((proposalUserId = u.id AND userId = ` + userId + `) OR (userId = u.id AND proposalUserId = ` + userId + `)) AND hascancelled = 1 ) > 0,true,false) as hascancelled
                , (select status from userproposals where ((proposalUserId = u.id AND userId = ` + userId + `) OR (userId = u.id AND proposalUserId = ` + userId + `)) AND hascancelled = 0 ) as proposalStatus
                                , u.id IN (select favUserId from userfavourites where userId = ` + userId + `) as isFavourite
                                 FROM userproposals up 
                                 LEFT JOIN users u ON u.id = up.userId
                                 LEFT JOIN images img ON img.id = u.imageId
                                 LEFT JOIN userpersonaldetail upd ON upd.userId = u.id
                                 LEFT JOIN occupation o ON o.id = upd.occupationId
                                 LEFT JOIN addresses addr ON addr.id = upd.addressId WHERE up.proposalUserId = ` + userId + ` 
                                 and u.id NOT IN (select userBlockId from userblock where userId = ` + userId + `)  
                                 and u.id NOT IN (select userId from userblock where userBlockId = ` + userId + `)
                                 and u.id NOT IN (select blockRequestUserId from userblockrequest where status = true AND userId = ` + userId + `))  as t1 WHERE t1.status = true`
            console.log(countSql);
            let countResult = await header.query(countSql)
            let sql = `select * from (SELECT u.id ,udd.fcmtoken , up.proposalUserId  as visitorId, up.status, u.firstName, u.middleName,u.lastName, u.gender, u.email, u.contactNo, img.imageUrl as imageUrl, o.name as occupation, u.isVerifyProfilePic, upd.memberid
                , upd.birthDate, upd.eyeColor, upd.languages, upd.expectation, upd.aboutMe, upd.weight, upd.profileForId , pf.name as profileForName
                , addr.addressLine1, addr.addressLine2, addr.pincode, addr.cityId, addr.districtId, addr.stateId, addr.countryId
                , cit.name as cityName, ds.name as districtName, st.name as stateName, cou.name as countryName, ms.name as maritalStatus,ai.value as annualIncome, d.name as diet
                , r.name as religion, c.name as community,sc.name as subCommunity,e.name as education
                , h.name as height, em.name as employmentType
                , addr.latitude, addr.longitude
                , DATE_FORMAT(FROM_DAYS(DATEDIFF(NOW(), upd.birthDate)), '%Y') + 0 AS age
                , up.proposalUserId IN (select userBlockId from userblock where userId =` + userId + `)  as isBlockByMe ,
                up.proposalUserId IN (select userId from userblock where userBlockId = ` + userId + `)  as isBlockByOther
                , IF((select COUNT(id) from userproposals where (userId = ` + userId + ` AND proposalUserId = u.id) OR (proposalUserId = ` + userId + ` AND userId = u.id)) > 0,true,false) as isProposed
, IF((select COUNT(id) from userproposals where (userId = ` + userId + ` AND proposalUserId = u.id) ) > 0,true,false) as isProposalReceived
, IF((select COUNT(id) from userproposals where (proposalUserId = ` + userId + ` AND userId = u.id)) > 0,true,false) as isProposalSent
,  IF((select COUNT(id) from userproposals where (proposalUserId = u.id) AND hascancelled = 1) > 0,true,false) as hascancelled
, (select status from userproposals where ((proposalUserId = u.id AND userId = ` + userId + `) OR (userId = u.id AND proposalUserId = ` + userId + `)) AND hascancelled = 0 ) as proposalStatus
                , u.id IN (select favUserId from userfavourites where userId = ` + userId + `) as isFavourite
                                , (select count(id) from userviewprofilehistories where  userId = u.id ) as totalView
                                 FROM userproposals up
                                 LEFT JOIN users u ON u.id = up.proposalUserId
                                 LEFT JOIN images img ON img.id = u.imageId
                                 LEFT JOIN userpersonaldetail upd ON upd.userId = u.id
                                  LEFT JOIN maritalstatus ms ON ms.id = upd.maritalStatusId
									LEFT JOIN religion r ON r.id = upd.religionId
                LEFT JOIN community c ON c.id = upd.communityId
                LEFT JOIN subcommunity sc ON sc.id = upd.subCommunityId
                LEFT JOIN education e ON e.id = upd.educationId
                LEFT JOIN annualincome ai ON ai.id = upd.annualIncomeId
                 LEFT JOIN diet d ON d.id = upd.dietId
                 LEFT JOIN height h ON h.id = upd.heightId
                LEFT JOIN employmenttype em ON em.id = upd.employmenttypeId
                                 LEFT JOIN profilefor pf ON pf.id = upd.profileForId
                                 LEFT JOIN occupation o ON o.id = upd.occupationId
                                 LEFT JOIN userdevicedetail udd ON udd.userId = u.id
                                 LEFT JOIN addresses addr ON addr.id = upd.addressId
                LEFT JOIN cities cit ON addr.cityId = cit.id
                LEFT JOIN districts ds ON addr.districtId = ds.id
                LEFT JOIN state st ON addr.stateId = st.id
                LEFT JOIN countries cou ON addr.countryId = cou.id WHERE up.userId =` + userId + `
                                 and u.id NOT IN (select userBlockId from userblock where userId = ` + userId + `)
                                 and u.id NOT IN (select userId from userblock where userBlockId =` + userId + `)
                                 and u.id NOT IN (select blockRequestUserId from userblockrequest where status = true AND userId = ` + userId + `)
                                 union
                                 SELECT u.id ,udd.fcmtoken , up.userId  as visitorId, up.status, u.firstName,u.middleName, u.lastName, u.gender, u.email, u.contactNo, img.imageUrl as imageUrl, o.name as occupation, u.isVerifyProfilePic, upd.memberid
                                 , upd.birthDate, upd.eyeColor, upd.languages, upd.expectation, upd.aboutMe, upd.weight, upd.profileForId , pf.name as profileForName,
                                  addr.addressLine1, addr.addressLine2, addr.pincode, addr.cityId, addr.districtId, addr.stateId, addr.countryId
                , cit.name as cityName, ds.name as districtName, st.name as stateName, cou.name as countryName, ms.name as maritalStatus,ai.value as annualIncome, d.name as diet
                , r.name as religion, c.name as community,sc.name as subCommunity,e.name as education
                , h.name as height, em.name as employmentType
                , addr.latitude, addr.longitude
                                 , DATE_FORMAT(FROM_DAYS(DATEDIFF(NOW(), upd.birthDate)), '%Y') + 0 AS age,
                                 up.proposalUserId IN (select userBlockId from userblock where userId = ` + userId + `)  as isBlockByMe ,
                                 up.proposalUserId IN (select userId from userblock where userBlockId = ` + userId + `)  as isBlockByOther
                                 , IF((select COUNT(id) from userproposals where (userId = ` + userId + ` AND proposalUserId = u.id) OR (proposalUserId = ` + userId + ` AND userId = u.id)) > 0,true,false) as isProposed
                 , IF((select COUNT(id) from userproposals where (userId = ` + userId + ` AND proposalUserId = u.id) ) > 0,true,false) as isProposalReceived
                 , IF((select COUNT(id) from userproposals where (proposalUserId = ` + userId + ` AND userId = u.id)) > 0,true,false) as isProposalSent
                 ,  IF((select COUNT(id) from userproposals where (proposalUserId = u.id) AND hascancelled = 1) > 0,true,false) as hascancelled
                 , (select status from userproposals where ((proposalUserId = u.id AND userId = ` + userId + `) OR (userId = u.id AND proposalUserId = ` + userId + `)) AND hascancelled = 0 ) as proposalStatus
                                 , u.id IN (select favUserId from userfavourites where userId = ` + userId + `) as isFavourite
                                , (select count(id) from userviewprofilehistories where  userId = u.id ) as totalView
                                 FROM userproposals up
                                 LEFT JOIN users u ON u.id = up.userId
                                 LEFT JOIN images img ON img.id = u.imageId
                                 LEFT JOIN userpersonaldetail upd ON upd.userId = u.id
                                 LEFT JOIN maritalstatus ms ON ms.id = upd.maritalStatusId
                                 LEFT JOIN religion r ON r.id = upd.religionId
                LEFT JOIN community c ON c.id = upd.communityId
                LEFT JOIN subcommunity sc ON sc.id = upd.subCommunityId
                LEFT JOIN education e ON e.id = upd.educationId
                LEFT JOIN annualincome ai ON ai.id = upd.annualIncomeId
                LEFT JOIN diet d ON d.id = upd.dietId
                 LEFT JOIN height h ON h.id = upd.heightId
                LEFT JOIN employmenttype em ON em.id = upd.employmenttypeId
                                 LEFT JOIN profilefor pf ON pf.id = upd.profileForId
                                 LEFT JOIN occupation o ON o.id = upd.occupationId
                                 LEFT JOIN userdevicedetail udd ON udd.userId = u.id
                                 LEFT JOIN addresses addr ON addr.id = upd.addressId
                LEFT JOIN cities cit ON addr.cityId = cit.id
                LEFT JOIN districts ds ON addr.districtId = ds.id
                LEFT JOIN state st ON addr.stateId = st.id
                LEFT JOIN countries cou ON addr.countryId = cou.id WHERE up.proposalUserId = ` + userId + `
                                 and u.id NOT IN (select userBlockId from userblock where userId = ` + userId + `)
                                 and u.id NOT IN (select userId from userblock where userBlockId = ` + userId + `)
                                 and u.id NOT IN (select blockRequestUserId from userblockrequest where status = true AND userId = ` + userId + `))
                                 as t1 WHERE t1.status = true`

            // let sql = `select * from (SELECT u.id ,udd.fcmtoken , up.proposalUserId  as visitorId, up.status, u.firstName, u.middleName,u.lastName, u.gender, u.email, u.contactNo, img.imageUrl as imageUrl, o.name as occupation
            //     , upd.birthDate, upd.eyeColor, upd.languages, upd.expectation, upd.aboutMe, upd.weight, upd.profileForId , pf.name as profileForName
            //     , addr.addressLine1, addr.addressLine2, addr.pincode, addr.cityId, addr.districtId, addr.stateId, addr.countryId
            //     , cit.name as cityName, ds.name as districtName, st.name as stateName, cou.name as countryName, ms.name as maritalStatus,ai.value as annualIncome, d.name as diet
            //     , r.name as religion, c.name as community,sc.name as subCommunity,e.name as education
            //     , addr.cityName, DATE_FORMAT(FROM_DAYS(DATEDIFF(NOW(), upd.birthDate)), '%Y') + 0 AS age 
            //     , up.proposalUserId IN (select userBlockId from userblock where userId =` + userId + `)  as isBlockByMe , 
            //                     up.proposalUserId IN (select userId from userblock where userBlockId =` + userId + `)  as isBlockByOther,
            //                     u.id IN (select proposalUserId from userproposals where userId = ` + userId + `) as isProposed,
            //                     u.id IN (select favUserId from userfavourites where userId = ` + userId + `) as isFavourite
            //                      FROM userproposals up 
            //                      LEFT JOIN users u ON u.id = up.proposalUserId
            //                      LEFT JOIN images img ON img.id = u.imageId
            //                      LEFT JOIN userpersonaldetail upd ON upd.userId = u.id
            //                      LEFT JOIN profilefor pf ON pf.id = upd.profileForId
            //                      LEFT JOIN occupation o ON o.id = upd.occupationId
            //                      LEFT JOIN addresses addr ON addr.id = upd.addressId WHERE up.userId =` + userId + ` 
            //                      and u.id NOT IN (select userBlockId from userblock where userId = ` + userId + `)   
            //                      and u.id NOT IN (select userId from userblock where userBlockId =` + userId + `)
            //                      and u.id NOT IN (select blockRequestUserId from userblockrequest where status = true AND userId = ` + userId + `)
            //                      union 
            //                      SELECT u.id , up.userId  as visitorId, up.status, u.firstName, u.lastName, u.gender, u.email, u.contactNo, img.imageUrl as image, o.name as occupation
            //                      , upd.birthDate, upd.eyeColor, upd.languages, upd.expectation, upd.aboutMe, upd.weight, upd.profileForId , pf.name as profileForName, 
            //                      addr.cityName, DATE_FORMAT(FROM_DAYS(DATEDIFF(NOW(), upd.birthDate)), '%Y') + 0 AS age,
            //                      up.proposalUserId IN (select userBlockId from userblock where userId = ` + userId + `)  as isBlockByMe , 
            //                     up.proposalUserId IN (select userId from userblock where userBlockId = ` + userId + `)  as isBlockByOther,
            //                     u.id IN (select proposalUserId from userproposals where userId = ` + userId + `) as isProposed,
            //                     u.id IN (select favUserId from userfavourites where userId = ` + userId + `) as isFavourite
            //                      FROM userproposals up 
            //                      LEFT JOIN users u ON u.id = up.userId
            //                      LEFT JOIN images img ON img.id = u.imageId
            //                      LEFT JOIN userpersonaldetail upd ON upd.userId = u.id
            //                      LEFT JOIN profilefor pf ON pf.id = upd.profileForId
            //                      LEFT JOIN occupation o ON o.id = upd.occupationId
            //                      LEFT JOIN addresses addr ON addr.id = upd.addressId WHERE up.proposalUserId = ` + userId + ` 
            //                      and u.id NOT IN (select userBlockId from userblock where userId = ` + userId + `)  
            //                      and u.id NOT IN (select userId from userblock where userBlockId = ` + userId + `)
            //                      and u.id NOT IN (select blockRequestUserId from userblockrequest where status = true AND userId = ` + userId + `))  
            //                      as t1 WHERE t1.status = true`;
            if (startIndex != null && fetchRecord != null) {
                sql += " LIMIT " + fetchRecord + " OFFSET " + startIndex + " ";
            }

            console.log(sql);
            let result = await header.query(sql);
            if (result) {

                for (let i = 0; i < result.length; i++) {
                    result[i].isVerifiedProfile = false;
                    let isVerified = true
                    let docVerifiedSql = `SELECT * FROM userdocument WHERE userId =` + result[i].id;
                    let docVerifiedResult = await header.query(docVerifiedSql);
                    if (docVerifiedResult && docVerifiedResult.length > 0) {
                        for (let j = 0; j < docVerifiedResult.length; j++) {
                            if (docVerifiedResult[j].isRequired && !docVerifiedResult[j].isVerified) {
                                isVerified = false;
                            }
                        }
                    } else {
                        isVerified = false;
                    }
                    result[i].isVerifiedProfile = isVerified;


                    if (result[i].isVerifyProfilePic) {
                        result[i].isVerifyProfilePic = true;
                    } else {
                        result[i].isVerifyProfilePic = false;
                    }



                    // region to get user personal custom data
                    let _customFieldDataResult: any = await controller.getCustomFieldData(result[i].id);
                    if (_customFieldDataResult && _customFieldDataResult.length > 0) {
                        console.log(_customFieldDataResult);
                        result[i].customFields = _customFieldDataResult;

                    }

                    // if (isCustomFieldEnabled) {
                    //     let userCustomDataSql = `SELECT * from userpersonaldetailcustomdata WHERE isActive = 1 AND userId = ` + result[i].id;
                    //     let userCustomDataResult = await header.query(userCustomDataSql);
                    //     let customdata: any[] = [];
                    //     if (userCustomDataResult && userCustomDataResult.length > 0) {

                    //         const userCustomDataArrays = [];
                    //         const keys = Object.keys(userCustomDataResult[0]);
                    //         userCustomDataArrays.push(keys);
                    //         const filteredColumns: string[] = keys.filter(col => !['isActive', 'id', 'isDelete', 'userId', 'createdDate', 'modifiedDate', 'createdBy', 'modifiedBy'].includes(col));

                    //         for (let j = 0; j < filteredColumns.length; j++) {

                    //             let sql = `SELECT * from customfields WHERE mappedFieldName = '` + filteredColumns[j] + `' and isActive = 1`;
                    //             let filterColumnResult = await header.query(sql);

                    //             let userDataSql = `SELECT ` + filteredColumns[j] + ` as value , userId FROM userpersonaldetailcustomdata WHERE userId = ` + result[i].id;
                    //             let userDataResult = await header.query(userDataSql);

                    //             let mergedResult = Object.assign({}, filterColumnResult[0], userDataResult[0]);

                    //             customdata.push(mergedResult);
                    //             console.log(userCustomDataResult);
                    //         }

                    //         if (customdata && customdata.length > 0) {

                    //             for (let i = 0; i < customdata.length; i++) {
                    //                 if (customdata[i].valueList) {


                    //                     const valueListArray: string[] = customdata[i].valueList.includes(';') ? customdata[i].valueList.split(";") : [customdata[i].valueList];
                    //                     customdata[i].valueList = valueListArray;
                    //                 }
                    //                 if (customdata[i].value && typeof customdata[i].value === 'string') {
                    //                     if (customdata[i].valueTypeId == 10) {
                    //                         const valueArray: string[] = customdata[i].value.includes(';') ? customdata[i].value.split(";") : [customdata[i].value];
                    //                         customdata[i].value = valueArray;

                    //                     }

                    //                 }

                    //             }
                    //         }

                    //         result[i].customFields = customdata;
                    //     }
                    // }
                    // end region to get user personal custom data 
                }

                let successResult = new ResultSuccess(200, true, 'Get Visitors', result, countResult[0].totalCount, authorizationResult.token);
                return res.status(200).send(successResult);
            } else {
                let errorResult = new ResultError(400, true, "visitors.getVisitors() Error", new Error('Error While Getting Data'), '');
                next(errorResult);
            }
        } else {
            let errorResult = new ResultError(401, true, "Unauthorized request", new Error(authorizationResult.message), '');
            next(errorResult);
        }
    } catch (error: any) {
        let errorResult = new ResultError(500, true, 'visitors.getVisitors() Exception', error, '');
        next(errorResult);
    }
};

export default { getVisitors };