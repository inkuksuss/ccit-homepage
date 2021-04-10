import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import bodyPareser from "body-parser";
import passport from "passport";
import session from "express-session";
import Mongostore from "connect-mongo";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import boardRouter from "./routers/boardRouter";
import shopRouter from "./routers/shopRouter";
import apiRouter from "./routers/apiRouter";
import routes from "./routes";
import { localsMiddleware } from './middleware';
import "./passport";

const app = express();


//middlewares
app.use(helmet({ 
    contentSecurityPolicy: false 
})); // 보안
app.set("view engine", "pug"); //view Engine
app.use("/uploads", express.static('uploads')); // /uploads로 접근하면 uploads파일로 싸줌
app.use("/static", express.static('static'));
app.use("/image", express.static('image'));
app.use(cookieParser()); // 쿠키 저장
app.use(bodyPareser.json()); //JSON 가져옴
app.use(bodyPareser.urlencoded({ extended: true })); // FORM형식 가져옴
app.use(morgan("dev")); // 접속 추적
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    // cookie : { // 쿠키에 들어가는 세션 ID값의 옵션
    //     maxAge : 1000 * 60 * 10 // 10분후 폭파
    // },
    store: Mongostore.create({ mongoUrl: process.env.MONGO_URL, autoRemove: 'native', ttl: 60 * 60}),
}));
app.use(passport.initialize());
app.use(passport.session());

// app.use(cors({
//     origin: true,
//     credentials: true
//   }));

app.use(localsMiddleware);

//Router
app.use(routes.api, apiRouter);
app.use(routes.home, globalRouter);
app.use(routes.users, userRouter);
app.use(routes.boards, boardRouter);
app.use(routes.shop, shopRouter);


export default app;