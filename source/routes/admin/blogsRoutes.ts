import express from 'express';
import controller from '../../controllers/admin/blogs';
import { route } from '../sampleRoutes';

const router = express.Router();


router.post('/getBlogs', controller.getBlogs);

router.post('/insertBlog', controller.insertBlog);

router.post('/updateBlog', controller.updateBlog);

router.post('/activeInactiveBlog', controller.activeInactiveBlog);

router.post('/deleteBlog', controller.deleteBlog);

router.post('/getBlogDetail', controller.getBlogDetail)

export = router;