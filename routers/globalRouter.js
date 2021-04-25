import express from "express";
import { home, search } from '../controllers/boardController';
import { getJoin, postJoin, logout, getLogin, postLogin, getMe } from '../controllers/userController';
import { onlyPrivate, onlyPublic } from '../middleware';
import routes from "../routes";


const globalRouter = express.Router();

globalRouter
    .get(routes.join, onlyPublic, getJoin)
    .post(routes.join, onlyPublic, postJoin, postLogin);

    
globalRouter 
    .post(routes.login, onlyPublic, postLogin)
    .get(routes.login, onlyPublic, getLogin);
        
globalRouter
    .get(routes.logout, onlyPrivate, logout)

globalRouter
    .get(routes.home, home)

globalRouter.get(routes.me, getMe);

globalRouter.get(routes.search, search);

export default globalRouter;