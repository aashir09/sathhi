import { NextFunction, Request, Response, query } from 'express';
import logging from "../../config/logging";
import header from "../../middleware/apiHeader";
import { ResultSuccess } from '../../classes/response/resultsuccess';
import { ResultError } from '../../classes/response/resulterror';
import controller from '../../controllers/app/customFields';

const NAMESPACE = 'System Flags';
// interface UserProfile {
//     name: string;
//     age?: number;
//     email?: string;
//     }
// const userProfile: UserProfile = {
//     name: "John Doe",
// };
// const propertyName: keyof UserProfile = "age";
// const propertyValue = userProfile[propertyName];

const getSystemFlagForApp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logging.info(NAMESPACE, 'Getting SystemFlags');
        let sql = `SELECT * FROM systemflags WHERE isActive = 1`;
        let result = await header.query(sql);
        let reponseData: any = [];
        let obj: any = {}
        if (result && result.length > 0) {
            for (let i = 0; i < result.length; i++) {
                let key = result[i].name;
                let value = result[i].value;
                obj[key] = value;
                // let obj = {
                //     [key]: value
                // }
                // const propertyName: keyof any = key;
                // const propertyValue = userProfile[propertyName];

                //reponseData.push(obj);
            }
        }
        if (result && result.length > 0) {
            let successResult = new ResultSuccess(200, true, 'Get System flag successfully', obj, reponseData.length, '');
            return res.status(200).send(successResult);
        } else {
            let errorResult = new ResultError(400, true, "systemflags.getSystemFlagForApp() Error", new Error('Error While Updating Data'), '');
            next(errorResult);
        }
    } catch (error: any) {
        let errorResult = new ResultError(500, true, 'systemflags.getSystemFlagForApp() Exception', error, '');
        next(errorResult);
    }
};

const getCombinedMasterData = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logging.info(NAMESPACE, 'Getting All Master Data');
        let requiredFields = [''];
        let validationResult = header.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            //!SECTION - systemflag
            let systemFlagSql = `SELECT * FROM systemflags WHERE isActive = 1`;
            let tempSystemFlag = await header.query(systemFlagSql);
            let systemFlag: any = {}
            if (tempSystemFlag && tempSystemFlag.length > 0) {
                for (let i = 0; i < tempSystemFlag.length; i++) {
                    let key = tempSystemFlag[i].name;
                    let value = tempSystemFlag[i].value;
                    systemFlag[key] = value;
                }
            }
            //!SECTION - masterData        
            const isCustomFieldEnabled = await controller.isCustomFieldEnable();
            let masterData: any;
            console.log(isCustomFieldEnabled);
            let masterDataSql1 = `SELECT * FROM occupation WHERE isActive = 1 AND isDelete = 0;`;
            let masterDataResult1 = await header.query(masterDataSql1);
            let masterDataSql2 = `SELECT * FROM education WHERE isActive = 1 AND isDelete = 0;`;
            let masterDataResult2 = await header.query(masterDataSql2);
            let masterDataSql3 = `SELECT * FROM maritalstatus WHERE isActive = 1 AND isDelete = 0;`;
            let masterDataResult3 = await header.query(masterDataSql3);
            let masterDataSql4 = `SELECT * FROM religion WHERE isActive = 1 AND isDelete = 0`;
            let masterDataResult4 = await header.query(masterDataSql4);
            let masterDataSql5 = `SELECT * FROM community WHERE isActive = 1 AND isDelete = 0;`;
            let masterDataResult5 = await header.query(masterDataSql5);
            let masterDataSql6 = `SELECT * FROM subcommunity WHERE isActive = 1 AND isDelete = 0;`;
            let masterDataResult6 = await header.query(masterDataSql6);
            let masterDataSql7 = `SELECT * FROM diet WHERE isActive = 1 AND isDelete = 0;`;
            let masterDataResult7 = await header.query(masterDataSql7);
            let masterDataSql8 = `SELECT * FROM height WHERE isActive = 1 AND isDelete = 0 order by name;`;
            let masterDataResult8 = await header.query(masterDataSql8);
            let masterDataSql9 = `SELECT * FROM annualincome WHERE isActive = 1 AND isDelete = 0;`;
            let masterDataResult9 = await header.query(masterDataSql9);
            let masterDataSql10 = `SELECT * FROM employmenttype WHERE isActive = 1 AND isDelete = 0;`;
            let masterDataResult10 = await header.query(masterDataSql10);
            let masterDataSql11 = `SELECT * FROM documenttype WHERE isActive = 1 AND isDelete = 0;`;
            let masterDataResult11 = await header.query(masterDataSql11);
            let masterDataSql12 = `SELECT * FROM profilefor WHERE isActive = 1 AND isDelete = 0;`;
            let masterDataResult12 = await header.query(masterDataSql12);
            let masterDataSql13 = `SELECT * FROM weight WHERE isActive = 1 AND isDelete = 0 order by name;`
            let masterDataResult13 = await header.query(masterDataSql13);
            let masterDataResult14 = [];
            if (isCustomFieldEnabled) {
                let masterDataSql14 = `SELECT * FROM customfields WHERE isActive = 1`;
                masterDataResult14 = await header.query(masterDataSql14);
                if (masterDataResult14 && masterDataResult14.length > 0) {

                    for (let i = 0; i < masterDataResult14.length; i++) {
                        if (masterDataResult14[i].valueList) {
                            const valueListArray: string[] = masterDataResult14[i].valueList.includes(';') ? masterDataResult14[i].valueList.split(";") : [masterDataResult14[i].valueList];
                            masterDataResult14[i].valueList = valueListArray;
                        }
                        if (masterDataResult14[i].valueTypeId == 10 && masterDataResult14[i].defaultValue) {
                            const valueListArray: string[] = masterDataResult14[i].defaultValue.includes(';') ? masterDataResult14[i].defaultValue.split(";") : [masterDataResult14[i].defaultValue];
                            masterDataResult14[i].defaultValue = valueListArray;
                        }

                    }
                }

            }
            let sql15 = `SELECT * FROM educationtype WHERE isActive = 1 AND isDelete = 0`;
            let result15 = await header.query(sql15);
            let sql16 = `SELECT * FROM educationmedium WHERE isActive = 1 AND isDelete = 0`;
            let result16 = await header.query(sql16);
            let sql17 = `SELECT * FROM registrationscreens WHERE isActive = 1 AND isDelete = 0`;
            let result17 = await header.query(sql17);
            let minAge = await header.query(`SELECT min(DATE_FORMAT(FROM_DAYS(DATEDIFF(NOW(), upa.birthDate)), '%Y') + 0) as minAge
                                    FROM users u
                                    LEFT JOIN userpersonaldetail upa ON upa.userId = u.id
                                    LEFT JOIN userroles ur ON ur.userId = u.id
                                    WHERE ur.roleId = 2 `);
            let maxAge = await header.query(`SELECT max(DATE_FORMAT(FROM_DAYS(DATEDIFF(NOW(), upa.birthDate)), '%Y') + 0) as maxAge
                                    FROM users u
                                    LEFT JOIN userpersonaldetail upa ON upa.userId = u.id
                                    LEFT JOIN userroles ur ON ur.userId = u.id
                                    WHERE ur.roleId = 2`);

            let ageList = [];
            for (let i = 18; i <= 60; i++) {
                ageList.push(i)
            }
            let cityName = await header.query(`select (cityName) FROM addresses where cityName is not null or cityName !='' group by cityName  having  cityName !=''`)
            masterData = {
                "occupation": masterDataResult1,
                "education": masterDataResult2,
                "maritalStatus": masterDataResult3,
                "religion": masterDataResult4,
                "community": masterDataResult5,
                "subCommunity": masterDataResult6,
                "diet": masterDataResult7,
                "height": masterDataResult8,
                "annualIncome": masterDataResult9,
                "employmentType": masterDataResult10,
                "maxAge": maxAge[0].maxAge ? maxAge[0].maxAge : 60,
                "minAge": minAge[0].minAge ? minAge[0].minAge : 18,
                "ageList": ageList,
                "cityName": cityName,
                "documentType": masterDataResult11,
                "profileFor": masterDataResult12,
                "weight": masterDataResult13,
                "customFields": masterDataResult14,
                "educationType": result15,
                "educationMedium": result16,
                "registrationScreens": result17
            }
            //!SECTION -   getCountries
            let countrySql = `SELECT * FROM countries`;
            let countryResult = await header.query(countrySql);
            //!SECTION -   getDefaultCurrency
            let defaultCurrencySql = `SELECT c.* FROM currencies c WHERE c.isDefault = 1`;
            let defaultCurrencyResult = await header.query(defaultCurrencySql);
            //!SECTION -   getPaymentGatewaysForPackage
            let paymentGatewayForPackageSql = `SELECT pg.* FROM paymentgateway pg INNER JOIN currencypaymentgateway cpg ON pg.id = cpg.paymentGatewayId  INNER JOIN currencies c ON cpg.currencyId = c.id WHERE c.isDefault = 1 AND pg.isActive = 1`;
            if (req.body != null && req.body.appPlatform == "iosApp") {
                paymentGatewayForPackageSql += ` AND useInApple = 1`
            }
            else if (req.body != null && req.body.appPlatform == "androidApp") {
                paymentGatewayForPackageSql += ` AND useInAndroid = 1`
            }
            let tempPaymentGatewayForPackageResult = await header.query(paymentGatewayForPackageSql);
            let paymentGatewayForPackageResult = [];
            if (tempPaymentGatewayForPackageResult && tempPaymentGatewayForPackageResult.length >= 0) {
                for (let i = 0; i < tempPaymentGatewayForPackageResult.length; i++) {
                    let obj = {
                        id: tempPaymentGatewayForPackageResult[i].id,
                        name: tempPaymentGatewayForPackageResult[i].name,
                        jsonData: JSON.parse(tempPaymentGatewayForPackageResult[i].jsonData),
                        useInWallet: tempPaymentGatewayForPackageResult[i].useInWallet,
                        useInCheckout: tempPaymentGatewayForPackageResult[i].useInCheckout,
                        useInAndroid: tempPaymentGatewayForPackageResult[i].useInAndroid,
                        useInApple: tempPaymentGatewayForPackageResult[i].useInApple,
                        isActive: tempPaymentGatewayForPackageResult[i].isActive,
                        isDelete: tempPaymentGatewayForPackageResult[i].isDelete,
                        createdDate: tempPaymentGatewayForPackageResult[i].createdDate,
                        modifiedDate: tempPaymentGatewayForPackageResult[i].modifiedDate,
                        createdBy: tempPaymentGatewayForPackageResult[i].createdBy,
                        modifiedBy: tempPaymentGatewayForPackageResult[i].modifiedBy,
                    }

                    paymentGatewayForPackageResult.push(obj)
                }
            }
            //!SECTION -   getSuccessStory
            let successStorySql = `SELECT s.*, img.imageUrl, u.firstName as userFName, u.lastName as userLName, u.gender as userGender, u.email as userEmail, img1.imageUrl as userImage
            , addr.cityName as userCity, u1.firstName as partnerFName, u1.lastName as partnerLName, u1.gender as partnerGender, u1.email as partnerEmail, img2.imageUrl as partnerImage
            , addr1.cityName as partnerCity FROM successstories s
                        LEFT JOIN images img ON img.id = s.imageId
                        LEFT JOIN users u ON u.id = s.userId
                        LEFT JOIN users u1 ON u1.id = s.partnerUserId 
                        LEFT JOIN images img1 ON img1.id = u.imageId
                        LEFT JOIN images img2 ON img2.id = u1.imageId
                        LEFT JOIN userpersonaldetail upd ON upd.userId = s.userId
                        LEFT JOIN addresses addr ON addr.id = upd.addressId
                        LEFT JOIN userpersonaldetail upd1 ON upd1.userId = s.partnerUserId
                        LEFT JOIN addresses addr1 ON addr1.id = upd1.addressId  ORDER BY s.createdDate DESC 
                        LIMIT 6`;
            let successStoryResult = await header.query(successStorySql);
            //!SECTION -         

            //!SECTION -  blog 
            let blogListSql = `SELECT * FROM blogs WHERE isDelete = 0 ORDER BY id DESC LIMIT 3 `;
            let blogList = await header.query(blogListSql);
            if (blogList && blogList.length > 0) {
                for (const ele of blogList) {

                    if (ele.tags && typeof ele.tags === 'string') {
                        const valueArray: string[] = ele.tags.includes(';') ? ele.tags.split(";") : [ele.tags];
                        ele.tags = valueArray;

                        // ele.tagNames = ele.tags.join(",");
                    }
                }
            }

            let result: any;
            result = {
                "systemFlag": systemFlag,
                "masterData": masterData,
                "countries": countryResult,
                "defaultCurrency": defaultCurrencyResult[0],
                "paymentGatewaysForPackage": paymentGatewayForPackageResult,
                "successStory": successStoryResult,
                "blogList": blogList
            };
            if (result) {
                let successResult = new ResultSuccess(200, true, 'Get Combined master Data Successfully', result, 1, '');
                return res.status(200).send(successResult);
            } else {
                let errorResult = new ResultError(400, true, "systemflags.getCombinedMasterData() Error", new Error('Error While Getting Combined Master Data'), '');
                next(errorResult);
            }
        } else {
            let errorResult = new ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
            next(errorResult);
        }

    } catch (error: any) {
        let errorResult = new ResultError(500, true, 'systemflags.getCombinedMasterData() Exception', error, '');
        next(errorResult);
    }
}

export default { getSystemFlagForApp, getCombinedMasterData }