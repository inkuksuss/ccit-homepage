import express from "express";
import { home, search } from '../controllers/boardController';
import { getJoin, postJoin, logout, getLogin, postLogin  } from '../controllers/userController';
import routes from "../routes";


const globalRouter = express.Router();

globalRouter // Join
    .get(routes.join, getJoin)
    .post(routes.join, postJoin);

globalRouter // Login
    .get(routes.login, getLogin)
    .post(routes.login, postLogin);

globalRouter.get(routes.home, home);
globalRouter.get(routes.logout, logout);
globalRouter.get(routes.search, search);

export default globalRouter;