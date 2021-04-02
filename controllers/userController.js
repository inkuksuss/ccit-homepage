import passport from "passport";
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

export const logout = (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect(routes.home);
};


export const getMe = (req, res) => {
    res.render("userDetail", { pageTitle: "User Detail", user: req.user });
};
  

// Users
export const userDetail = async (req, res) => {
    const {
      params: { id }
    } = req;
    try {
      const user = await User.findById(id);
      res.render("userDetail", { pageTitle: "User Detail", user });
    } catch (error) {
      res.redirect(routes.home);
    }
};

export const getEditProfile = (req, res) => {
     res.render("editProfile", { pageTitle: "Edit Profile" })};

export const postEditProfile = async (req, res) => {
    const {
         user: {
            avatar,
            name,
            email
         }
    } = req;
    console.log(req.user._id);
    console.log(req.user);
    try {
        await User.findByIdAndUpdate(req.user._id, {
            name,
            email,
            avatar: avatar ? avatar : req.user.avatar
        })
        res.redirect(routes.me);
    } catch (err) {
        res.redirect('editProfile', { pageTitle: "editProfile" });
    }

}

export const changePassword = (req,res) => {
     res.render("changePassword", { pageTitle: "Change Paasword" })};

export const cart = (req, res) => { 
    res.render("cart", { pageTitle: "Cart" })};