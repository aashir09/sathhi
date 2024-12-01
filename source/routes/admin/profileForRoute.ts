import express from 'express';
// import controller from '../../controllers/admin/documentType';
import controller from '../../controllers/admin/profileFor'

const router = express.Router();

router.post('/getProfileFor',controller.getProfileFor)

router.post('/insertUpdateProfileFor',controller.insertUpdateProfileFor)

router.post('/activeInactiveProfileFor',controller.activeInactiveProfileFor)

export = router;