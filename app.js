import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import bodyPareser from "body-parser";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import boardRouter from "./routers/boardRouter";
import shopRouter from "./routers/shopRouter";
import routes from "./routes";
import { localsMiddleware } from './middleware';


const app = express();


//middlewares
app.use(helmet()); // 보안
app.set("view engine", "pug"); //view Engine
app.use("/uploads", express.static('uploads')); // /uploads로 접근하면 uploads파일로 싸줌
app.use(cookieParser()); // 쿠키 저장
app.use(bodyPareser.json()); //JSON 가져옴
app.use(bodyPareser.urlencoded({ extended: true })); // FORM형식 가져옴
app.use(morgan("dev")); // 접속 추적

app.use(localsMiddleware);

//Router
app.use(routes.home, globalRouter);
app.use(routes.users, userRouter);
app.use(routes.boards, boardRouter);
app.use(routes.shop, shopRouter);


export default app;