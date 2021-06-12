import express from 'express';
import { userDetail, getEditProfile, postEditProfile, getChangePassword, postChangePassword, postAddKey, getAddKey, getProduct, getProductDetail, postProductDetail } from '../controllers/userController';
import { onlyPrivate, uploadAvatar } from '../middleware';
import routes from '../routes';

const userRouter = express.Router();

userRouter
    .get(routes.editProfile, onlyPrivate, getEditProfile) 
    .post(routes.editProfile, onlyPrivate, uploadAvatar, postEditProfile);

userRouter
    .get(routes.changePassword, onlyPrivate, getChangePassword)  
    .post(routes.changePassword, onlyPrivate, postChangePassword);
userRouter
    .get(routes.addKey, getAddKey)
    .post(routes.addKey, postAddKey);

userRouter
    .get(routes.product, getProduct);

userRouter
    .get(routes.productDetail(), getProductDetail)
    .post(routes.productDetail(), postProductDetail);

userRouter.get(routes.userDetail(), userDetail);


export default userRouter;

