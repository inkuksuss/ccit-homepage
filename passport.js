import passport from "passport";
import User from "./models/User";

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser((user, done) => { // strategy 설공시 호출
    return done(null, user); //req.session.passport.user에 저장
}));


passport.deserializeUser((id, done) => { // serializeUser의 user를 받아옴
    User.findOne({email: id}, (err, user) => {
        done(err, user); //user -> req.user 변환
    });
});