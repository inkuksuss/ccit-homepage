import express from "express";
import passport from 'passport';
import { home, search } from '../controllers/boardController';
import { getJoin, postJoin, logout, getLogin, postLogin, googleLogin, getMe, kakaoLogin } from '../controllers/userController';
import { onlyPrivate, onlyPublic } from '../middleware';
import routes from "../routes";


const globalRouter = express.Router();

globalRouter // Join
    .get(routes.join, onlyPublic, getJoin)
    .post(routes.join, onlyPublic, postJoin, postLogin);

globalRouter // Login
    .get(routes.login, onlyPublic, getLogin)
    .post(routes.login, onlyPublic, postLogin);

globalRouter.get(routes.google, googleLogin);

globalRouter.get(routes.googleCallback, 
    passport.authenticate('google', {
        successRedirect: `${routes.home}`,
        failureRedirect: `${routes.login}`
    }
));

globalRouter.get(routes.kakao, kakaoLogin);

globalRouter.get(routes.kakaoCallback,
    passport.authenticate('kakao', {
        failureRedirect: `${routes.login}`,
        successRedirect: `${routes.home}`
    }
));

globalRouter
    .get(routes.logout, onlyPrivate, logout)
    // .post(routes.logout)


globalRouter.get(routes.me, getMe);
globalRouter.get(routes.home, home);
globalRouter.get(routes.search, search);

export default globalRouter;