import http from 'http';

//IMPORTS for HTTPS Server

// // https server
// import https from "https";
// // Requiring file system to use local files
// import fs from "fs";

import express from 'express';
import bodyParser from 'body-parser';
import logging from './config/logging';
import config from './config/config';
import sampleroutes from './routes/sampleRoutes'
import { Request, Response } from 'express';
import header from "./middleware/apiHeader";
import useragent from 'useragent';
const cors = require('cors');
const path = require('path');


//#region Admin
import usersRoutes from './routes/admin/usersRoutes';
import dashboardRoutes from './routes/admin/dashboardRoutes';
import annualIncomeRoutes from './routes/admin/annualIncomeRoutes';
import appUsersRoutes from './routes/admin/appUsersRoutes'
import communityRoutes from './routes/admin/communityRoutes';
import dietRoutes from './routes/admin/dietRoutes';
import educationRoutes from './routes/admin/educationRoutes';
import heightRoutes from './routes/admin/heightRoutes';
import maritalStatusRoutes from './routes/admin/maritalStatusRoutes';
import occupationRoutes from './routes/admin/occupationRoutes';
import religionRoutes from './routes/admin/religionRoutes';
import reportRoutes from './routes/admin/reportRoutes';
import subCommunityRoutes from './routes/admin/subCommunityRoutes';
import userBlockReqRoutes from './routes/admin/userBlockRequestRoutes';
import systemFlagsRoutes from './routes/admin/systemFlagsRoutes';
import citiesRoutes from './routes/admin/citiesRoutes';
import statesRoutes from './routes/admin/statesRoutes';
import districtsRoutes from './routes/admin/districtsRoutes';
import employmentType from './routes/admin/employmentTypeRoutes';
import successStory from './routes/admin/successStoriesRoutes';
import premiumAccountType from './routes/admin/premiumAccountTypeRoutes';
import premiumFacility from './routes/admin/premiumFacilityRoutes';
import timeDuration from './routes/admin/timeDurationRoutes';
import userPackage from './routes/admin/packageRoutes';
import feedback from './routes/admin/feedbackRoutes';
import questionCategoriesRoutes from './routes/admin/questionCategoriesRoutes';
import documentTypeRoutes from './routes/admin/documentTypeRoutes';
import couponRoutes from './routes/admin/couponRoutes';
import customeNotificationRoutes from './routes/admin/customNotificationRoutes';
import regionRoutes from './routes/admin/regionRoutes';
import userPagesRoutes from './routes/admin/userPagesRoutes';
import currenciesRoutes from './routes/admin/currenciesRoutes';
import paymentGatewayRoutes from './routes/admin/paymentgatewayRoutes';
import profileFor from './routes/admin/profileForRoute';
import weight from './routes/admin/weightRoutes';
import manageCustomFieldsRoutes from './routes/admin/manageCustomFieldsRoutes';
import configurationRoutes from './routes/admin/configurationRoutes';
import blogRoutes from './routes/admin/blogsRoutes';
import registrationcreenRouter from './routes/admin/registrationScreenRoutes';
//#endregion Admin

//#region App
import userRoutes from './routes/app/usersRoutes';
import homeRoutes from './routes/app/homeRoutes';
import agoraToken from './routes/app/agoraTokenRoutes';
import proposalRoutes from './routes/app/proposalRoutes';
import userBlockRequestRoutes from './routes/app/userBlockRequestRoutes';
import userFavouritesRoutes from './routes/app/userFavouritesRoutes';
import userNotificationsRoutes from './routes/app/userNotificationsRoutes';
import visitorsRoutes from './routes/app/visitorsRoutes';
import userChatRoutes from './routes/app/userChatRoutes';
import feedbackRoutes from './routes/app/feedbackRoutes';
import packageRoutes from './routes/app/packageRoutes';
import paymentRoutes from './routes/app/paymentRoutes';
import questionCategoryRoutes from './routes/app/questionCategoriesRoutes'
import successStoriesRoutes from './routes/app/successStoriesRoutes';
import userBlockRoutes from './routes/app/userBlockRoutes';
import appCouponRoutes from './routes/app/couponRoutes';
import appRegionRoutes from './routes/app/regionRoutes';
import appSystemFlagsRoutes from './routes/app/systemFlagsRoutes';
import appUserWalletRoutes from './routes/app/userWalletRoutes';
import appPaymentGatewayRoutes from './routes/app/paymentGatewayRoutes';
import appCurrencyRoutes from './routes/app/currencyRoutes';
import customFieldsRoutes from './routes/app/customFieldsRoutes';
import blogAppRoutes from './routes/app/blogsRoute'
//#endregion

const NAMESPACE = 'Server';
const router = express();

router.use(cors());

/** Logging the request */
router.use((req, res, next) => {
    /** Log the req */
    logging.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

    res.on('finish', () => {
        /** Log the res */
        logging.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`);
    });

    next();
});

/** Parse the body of the request */
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json({
    limit: "50mb"
}));

/** Rules of our API */
router.use((req, res, next) => {
    // res.header('Access-Control-Allow-Origin', '*');
    // res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization,refreshtoken');

    // if (req.method == 'OPTIONS') {
    //     res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    //     return res.status(200).json({});
    // }

    // Website you wish to allow to connect
    res.header('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, refreshtoken');

    next();
});

/** Routes go here */
router.use('/api', express.static('apidoc'));
router.use('/content', express.static('content'));
router.use('/api/sample', sampleroutes);

//#region Admin
router.use('/api/admin/users', usersRoutes);
router.use('/api/admin/dashboard', dashboardRoutes);
router.use('/api/admin/annualIncome', annualIncomeRoutes);
router.use('/api/admin/appUsers', appUsersRoutes);
router.use('/api/admin/community', communityRoutes);
router.use('/api/admin/diet', dietRoutes);
router.use('/api/admin/education', educationRoutes);
router.use('/api/admin/height', heightRoutes);
router.use('/api/admin/maritalStatus', maritalStatusRoutes);
router.use('/api/admin/occupation', occupationRoutes);
router.use('/api/admin/religion', religionRoutes);
router.use('/api/admin/report', reportRoutes);
router.use('/api/admin/subCommunity', subCommunityRoutes);
router.use('/api/admin/userBlockRequest', userBlockReqRoutes);
router.use('/api/admin/systemFlags', systemFlagsRoutes);
router.use('/api/admin/cities', citiesRoutes);
router.use('/api/admin/states', statesRoutes);
router.use('/api/admin/districts', districtsRoutes);
router.use('/api/admin/employmentType', employmentType);
router.use('/api/admin/successStories', successStory);
router.use('/api/admin/premiumAccountType', premiumAccountType);
router.use('/api/admin/premiumFacility', premiumFacility);
router.use('/api/admin/timeDuration', timeDuration);
router.use('/api/admin/package', userPackage);
router.use('/api/admin/feedback', feedback);
router.use('/api/admin/questionCategories', questionCategoriesRoutes);
router.use('/api/admin/documentType', documentTypeRoutes);
router.use('/api/admin/coupons', couponRoutes);
router.use('/api/admin/customNotification', customeNotificationRoutes);
router.use('/api/admin/region', regionRoutes);
router.use('/api/admin/userPages', userPagesRoutes);
router.use('/api/admin/currencies', currenciesRoutes);
router.use('/api/admin/paymentGateways', paymentGatewayRoutes);
router.use('/api/admin/profileFor', profileFor);
router.use('/api/admin/weight', weight);
router.use('/api/admin/manageCustomFields', manageCustomFieldsRoutes);
router.use('/api/admin/configuration', configurationRoutes);
router.use('/api/admin/blog', blogRoutes);
router.use('/api/admin/registrationScreen', registrationcreenRouter)
//#endregion

//#region App
router.use('/api/app/users', userRoutes);
router.use('/api/app/home', homeRoutes);
router.use('/api/app/agoraToken', agoraToken);
router.use('/api/app/proposals', proposalRoutes);
router.use('/api/app/userBlockRequest', userBlockRequestRoutes);
router.use('/api/app/favourites', userFavouritesRoutes);
router.use('/api/app/notifications', userNotificationsRoutes);
router.use('/api/app/visitors', visitorsRoutes);
router.use('/api/app/userChat', userChatRoutes);
router.use('/api/app/feedback', feedbackRoutes)
router.use('/api/app/package', packageRoutes)
router.use('/api/app/payment', paymentRoutes)
router.use('/api/app/questioncategories', questionCategoryRoutes)
router.use('/api/app/successStories', successStoriesRoutes)
router.use('/api/app/block', userBlockRoutes)
router.use('/api/app/coupons', appCouponRoutes)
router.use('/api/app/regions', appRegionRoutes)
router.use('/api/app/systemFlags', appSystemFlagsRoutes)
router.use('/api/app/userWallet', appUserWalletRoutes);
router.use('/api/app/paymentGateways', appPaymentGatewayRoutes);
router.use('/api/app/currency', appCurrencyRoutes);
router.use('/api/app/customFields', customFieldsRoutes);
router.use('/api/app/blog', blogAppRoutes);
router.use('/admin', express.static('client'));
router.use('/', express.static('client/website'));

router.get('/admin/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/index.html'));
});

router.get('/api/test', (req, res) => {
    res.status(200).json({ message: 'API is working perfectly!' });
});;

  
router.get('/app', async (req: Request, res: Response) => {
    const queryParams = req.query;
    const userAgent = req.headers['user-agent'] || '';
    const agent = useragent.parse(userAgent);
    let platform: string;
    let name: string = 'playstore';
    if (agent.os.family === 'iOS') {
        platform = 'iOS';
        name = 'appstore';
    } else if (agent.os.family === 'Android') {
        platform = 'Android';
        name = 'playstore';
    }
    else if (agent.os.family === 'Windows') {
        platform = 'Android';
        name = 'playstore';
    } else {
        platform = 'Unknown';
    }
    // if(queryParams.appName && queryParams.appName == 'customerApp'){

    // }
    let sql = `SELECT value FROM systemflags WHERE name = '` + name + `'`;
    let result = await header.query(sql);
    res.redirect(result[0].value);

    // res.redirect('');
});

router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/website/index.html'));
});
//#endregion



/** Error handling */
router.use((req, res, next) => {
    const error = new Error('Not found');

    res.status(404).json({
        message: error.message
    });
});


router.use((result: any, req: any, res: any, next: any) => {
    if (result.status == 200) {
        res.json({
            status: result.status,
            isDisplayMessage: result.isDisplayMessage,
            message: result.message,
            recordList: result.recordList,
            totalRecords: result.totalRecords
        });
    } else {
        var error = result;
        var trace = null;
        res.status(error.status || 500);
        if (error.error != null) {
            trace = error.error;
        }
        var errorResult = {
            status: error.status,
            isDisplayMessage: error.isDisplayMessage,
            message: error.message,//error.error != undefined && error.error != null ? error.error.message : 'Error object is not available',
            value: error.value,
            error: error
            // error: {
            //     apiName: error.request != undefined && error.request != null ? error.request.url : '',
            //     apiType: error.request != undefined && error.request != null ? error.request.method : '',
            //     fileName: trace != null && trace.length > 0 ? trace[0].getFileName().split('\\').pop() : 'trace is not available',
            //     functionName: trace != null && trace.length > 0 ? trace[0].getFunctionName() : 'trace is not available',
            //     functionErrorMessage:
            //         (error.message != undefined && error.message != null ? error.message : 'Error message is not available') +
            //         ' : ' +
            //         (error.error != undefined && error.error != null ? error.error : 'Error object is not available'),
            //     lineNumber: trace != null && trace.length > 0 ? trace[0].getLineNumber() : 'trace is not available',
            //     typeName: trace != null && trace.length > 0 ? trace[0].getTypeName() : 'trace is not available',
            //     stack: error.stack != undefined && error.stack != null ? error.stack : 'Error stack is not available'
            // }
        };
        // console.log(req.body);
        console.log(errorResult);
        res.json(errorResult);
    }
});


/** Create the Server */
const httpServer = http.createServer(router);
httpServer.listen(config.server.port, () => logging.info(NAMESPACE, `Http Server is running ${config.server.hostname}:${config.server.port}`));
// process.on('restartServer', () => {
//     console.log('Restarting server...');
//     closeServer();
// });
// function closeServer() {
//     if (httpServer) {
//         httpServer.close(() => {
//             console.log('Server closed at', new Date());
//             httpServer.listen(config.server.port, () => logging.info(NAMESPACE, `Http Server is running ${config.server.hostname}:${config.server.port}`));
//         });
//     }
// }
// module.exports = { router, httpServer };
// export default router;
// Code for HTTPS Server

// // Creating object of key and certificate
// // for SSL
// const options = {
//     key: fs.readFileSync("server.key"),
//     cert: fs.readFileSync("server.cert"),
// };

// // Creating https server by passing
// // options and app object
// https.createServer(options, router)
//     .listen(config.server.port, () => logging.info(NAMESPACE, `Https Server is running ${config.server.hostname}:${config.server.port}`));