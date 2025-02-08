import { Router } from 'express';
import {
  contactUs,
  userStats,
} from '../controllers/miscellaneous.controller.js';
import { authorizeRoles, isLoggedIn } from '../middlewares/auth.middleware.js';

const miscRouter = Router();

// {{URL}}/api/v1/
miscRouter.route('/contact').post(contactUs);
miscRouter
  .route('/admin/stats/users')
  .get(isLoggedIn, authorizeRoles('ADMIN'), userStats);

export default miscRouter;