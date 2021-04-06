import passport from "passport";
import axios from 'axios';
import routes from "../routes";
import User from "../models/User";

// Global
export const getJoin = (req, res) => {
    res.render("join", { pageTitle: "Join" });
};
  
export const postJoin = async (req, res, next) => {
const {
    body: { name, email, password, password2 }
} = req;
if (password !== password2) {
    res.status(400);
    res.render("join", { pageTitle: "Join" });
} else {
    try {
        const user = await User({
            name,
            email,
            avatar: "basicimg"
        });
        await User.register(user, password);
        next();
    } catch(err) {
        console.log(err);
        res.redirect(routes.home);
    }
}};

export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "Log In" });

export const postLogin = passport.authenticate("local", {
    failureRedirect: routes.login,
    successRedirect: routes.home
});

export const googleLogin = passport.authenticate('google',{ scope: [ 'email', 'profile' ] });

export const googleLoginCallback = async (request, accessToken, refreshToken, profile, done) => {
    const { 
        _json: { sub, name, email, picture }
    } = profile;
    try {
        const user = await User.findOne({ email })
        if(user) {
            user.googleId = sub;
            user.save();
            return done(null, user);
        } else {
           const newUser = await User.create({
               email,
               name,
               googleId: sub,
               avatar: picture
           });
           newUser.save();
           return done(null, newUser); 
        }
    } catch (err) {
        return done(err);
    }
};

export const kakaoLogin = passport.authenticate('kakao');

export const kakaoLoginCallback =  async (accessToken, refreshToken, profile, done) => {
    const {
        _json: { 
            id, 
            kakao_account: { email, profile: { profile_image_url } },
            properties: { nickname },
        } 
    } = profile;
    try {
        const user = await User.findOne({ email })
        if(user) {
            user.kakaoId = id;
            user.save();
            return done(null, user);
        } else {
            const newUser = await User.create({
                email,
                avatar: profile_image_url,
                name: nickname,
                kakaoId: id,
            });
            newUser.save();
            return done(null, newUser);
        }
    } catch (err) {
        return done(err);
    }
};

export const logout =  async (req, res) => {
    // if(req.user.kakaoId) {
    //     // console.log(req.user);
    //     const { user: { kakaoId }} = req;
    //     await axios.post('http://localhost:4000/v1/user/unlink', {
    //         header: {
    //             'Authorization': `KakaoAk ${process.env.KAKAO_CLIENT_ADMIN}`
    //         }},{
    //         data: {
    //             // target_id_type: ,
    //             target_id: kakaoId
    //         }}
        // )
        if(req.user.kakaoId) {
            const { user: { kakaoId }} = req;
            const url = `http://localhost:4000/logout?client_id=${process.env.KAKAO_CLIENT_ID}&logout_redirect_uri=http://localhost:4000/${routes.kakaoLogout}`
            await axios({
                method: 'get',
                url,
                data: {kakaoId}
            })
            try {
                req.logout();
                req.session.destroy();
                res.redirect(routes.login);
                console.log('hello');
            } catch(err) {
                console.log(err);
                res.redirect(routes.home);
            }
        }
         else {
        req.logout();
        req.session.destroy();
        res.redirect(routes.home);
        }
};

export const getMe =  async (req, res) => {
    const { 
        user: { id }
    } = req;
    try {
        const user = await User.findById(id).populate('boards');
        res.render("userDetail", { pageTitle: "User Detail", user });
    } catch(err) {
        res.redirect(routes.home);
    }
};

// Users
export const userDetail = async (req, res) => {
    const {
      params: { id }
    } = req;
    try {
      const user = await User.findById(id).populate('boards');
      res.render("userDetail", { pageTitle: "User Detail", user });
    } catch (error) {
      res.redirect(routes.home);
    }
};

export const getEditProfile = (req, res) => {
     res.render("editProfile", { pageTitle: "Edit Profile" })};

export const postEditProfile = async (req, res) => {
    const {
         body: {    
            name,
            email
         },
         file
    } = req;    /////////////////////////////// req.user로 하면 에러뜸 why?
    try {
        await User.findByIdAndUpdate({_id: req.user._id}, {$set: {  
            name,
            email,
            avatar: (file ? file.path : req.user.avatar)
        }}, {new: true});
        res.redirect(routes.me);
    } catch (err) {
        res.redirect(routes.editProfile);
    }
};

export const getChangePassword = (req,res) => {
     res.render("changePassword", { pageTitle: "Change Paasword" })};

export const postChangePassword =  async (req,res) => {
    const { body:
            {
                oldPassword,
                newPassword,
                newPassword1
            }
        } = req;
    try {
        if(newPassword !== newPassword1) {
            res.status(400);
            res.redirect(`/users${routes.changePassword}`);
            return;
        }
        await req.user.changePassword(oldPassword, newPassword1);
        res.redirect(routes.me);
    } catch(err) {
        res.status(400);
        res.redirect(`/users${routes.changePassword}`);
    }
};
   

export const cart = (req, res) => { 
    res.render("cart", { pageTitle: "Cart" })};