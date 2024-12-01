import express from 'express';
import controller from '../../controllers/app/blogs';

const router = express.Router();


router.post('/getBlogs', controller.getBlogs);


router.post('/getBlogDetail', controller.getBlogDetail);

export = router;