import passport from "passport";
import GoogleStrategy from "passport-google-oauth2";
import KakaoStrategy from "passport-kakao";
import { googleLoginCallback, kakaoLoginCallback } from './controllers/userController';
import User from "./models/User";
import routes from './routes';

passport.use(User.createStrategy());

passport.use(
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `http://localhost:4000${routes.googleCallback}`,
        passReqToCallback: true
    },
    googleLoginCallback
));

passport.use(
    new KakaoStrategy({
        clientID: process.env.KAKAO_CLIENT_ID,
        clientSecret: process.env.KAKAO_CLIENT_SECRET,
        callbackURL: `http://localhost:4000${routes.kakaoCallback}`,
    },
    kakaoLoginCallback
))


passport.serializeUser(User.serializeUser((user, done) => {
    return done(null, user);
}));


passport.deserializeUser(function(id, done) {
    User.findOne({email: id}, function (err, user) {
        done(err, user);
    });
});