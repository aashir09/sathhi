import express from 'express';
import controller from '../../controllers/admin/registrationscreen';

const router = express.Router();

router.post('/getRegistrationScreen', controller.getRegistrationScreen);

router.post('/toggleDisableScreen',controller.toggleDisableScreen);

router.post('/toggleSkipScreen',controller.toggleSkipScreen);

export = router;