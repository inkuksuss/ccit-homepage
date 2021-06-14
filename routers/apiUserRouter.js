import express from 'express';
import { getApiProductDetail, postApiProductDetail } from '../controllers/apiUserController';
import { userDetail, getEditProfile, postEditProfile, getChangePassword, postChangePassword } from '../controllers/userController';
import { jwtOnlyPrivate, uploadAvatar } from '../middleware';
import routes from '../routes';

const apiUserRouter = express.Router();

apiUserRouter
    .get(routes.editProfile, jwtOnlyPrivate, getEditProfile)
    .post(routes.editProfile, jwtOnlyPrivate, uploadAvatar, postEditProfile);

apiUserRouter
    .get(routes.changePassword, jwtOnlyPrivate, getChangePassword)  
    .post(routes.changePassword, jwtOnlyPrivate, postChangePassword);

apiUserRouter
    .get(routes.apiProductDetail(), jwtOnlyPrivate, getApiProductDetail)
    .post(routes.apiProductDetail(), jwtOnlyPrivate, postApiProductDetail);


apiUserRouter.get(routes.userDetail(), userDetail);

export default apiUserRouter;

