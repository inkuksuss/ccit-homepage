import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import bodyPareser from "body-parser";
import passport from "passport";
import session from "express-session";
import Mongostore from "connect-mongo";
import flash from "express-flash";
import mqtt from "mqtt";
import DHT11 from "./models/DHT11";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import boardRouter from "./routers/boardRouter";
import apiRouter from "./routers/apiRouter";
import routes from "./routes";
import { localsMiddleware } from './middleware';
import "./passport";

const app = express();
const client = mqtt.connect("mqtt://127.0.0.1");

client.on("connect", () => {
    console.log("😇Mqtt Connect");
    client.subscribe('topic'); // 읽을 토픽
});

client.on("message", (topic, message) => {
    const obj = JSON.parse(message);
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const today = date.getDate();
    const hours = date.getHours();
    const mintues = date.getMinutes();
    const seconds = date.getSeconds();
    obj.createdAt = new Date(Date.UTC(year, month, today, hours, mintues, seconds));
    const dht11 = new DHT11({
        tmp: obj.tmp,
        hum: obj.hum,
        createdAt: obj.createdAt,
        key: obj.key
    });
    try{
        dht11.save();
        console.log('Success MQTT');
    } catch (err) {
        console.log({ message: err });
    }
})


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
    //     maxAge : 3 * 60 * 60 
    // },
    store: Mongostore.create({ mongoUrl: process.env.MONGO_URL, autoRemove: 'native', ttl: 60 * 60 }),
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(localsMiddleware);

//Router
app.use(routes.home, globalRouter);
app.use(routes.users, userRouter);
app.use(routes.boards, boardRouter);
app.use(routes.api, apiRouter);


export default app;