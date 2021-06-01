/* eslint-disable object-shorthand */
import passport from "passport";
import { PythonShell } from "python-shell";
import routes from "../routes";
import User from "../models/User";

const options = { // pythonShell을 통해 CGI와 데이터를 주고 받기 위한 옵션
    scriptPath: './.venv',
    pythonPath: 'python3',
    pythonOptins: ['-u'],
    args: []
}

export const getPython = (req, res) => {
    PythonShell.run('mongo.py', options, (err, results) => { // mongo.py로 부터 데이터를 받아옴
        if(err) console.log(err);
        res.send(results);
    })
};

// Global
export const getJoin = (req, res) => { // get방식으로 join 페이지를 랜더링함
    res.render("join", { pageTitle: "Join" });
};
  
export const postJoin = async (req, res, next) => { // 회원가입 기능을 담당하는 post 컨트롤러
    const {
        body: { name, email, password, password2 } // 프론트 input을 통해 입력된 데이터들
    } = req;
    const checkEmail = await User.findOne({ email }) // DB에서 이메일 검색
    if (password !== password2) { //비밀번호와 비밀번호 확인이 같지 않다면
        req.flash("error",  '비밀번호가 일치하지 않습니다.');
        res.status(400);
        res.render("join", { pageTitle: "Join" });
    } else if(checkEmail){ // 이미 가입된 이메일이 있을 경우
        res.status(400);
        res.render("join", { pageTitle: "Join" });
    } else { // 둘다 문제 없다면
        try {
            const user = await User({ // user 객체 생성
                name,
                email,
                avatar: "basicimg"
            });
            await User.register(user, password); // user,password DB에 저장 
            next(); // 다음으로 -> login 페이지로 이동하기 위해
        } catch(err) {
            console.log(err); // 에러가 발생한다면 홈으로 이동
            res.redirect(routes.home);
        }
    }
};

export const getLogin = (req, res) => // get 방식 요청이오면 login 페이지 랜더링
  res.render("login", { pageTitle: "Log In" });

export const postLogin = passport.authenticate("local", { // post방식으로 Passport를 사용한 로그인 방식
    failureRedirect: routes.login, // 실패시 Login 페이지 리다이렉트
    successRedirect: routes.home, // 성공시 홈페이지 이동
    successFlash: '환영합니다.', // req.flash()를 이용하여 페이지에 알림을 뛰움
    failureFlash: '아이디나 비밀번호를 확인해주세요.'
});

export const logout = (req, res) => {
    req.flash('info', '로그아웃 완료');
    req.logout();
    res.redirect(routes.login);
    // req.session.destroy(() => {
    //     res.clearCookie('connect.sid');
    // }); 
};

export const getMe =  async (req, res) => {
    const { 
        user: { id }
    } = req; // 접속중인 유저 Id 가져오기
    try {
        const user = await User.findById(id).populate('videos').populate('photos'); // id로 user에서 해당 유저 찾기
        res.render("userDetail", { pageTitle: "User Detail", user }); // populate를 사용하여 연동된 디비 정보도 가져오기
    } catch(err) {
        res.redirect(routes.home);
    }
};

// Users
export const userDetail = async (req, res) => {
    const {
        params: { id } // url에서 유저 Id값 가져오기
    } = req;
    try {
        const user = await User.findById(id).populate('videos').populate('photos'); // 위와 동일
        res.render("userDetail", { pageTitle: "User Detail", user });
    } catch (error) {
        req.flash('error', '유저가 존재하지 않습니다.');
        res.redirect(routes.home);
    }
};

export const getEditProfile = (req, res) => { // get방식 유저 수정페이지 랜더링
     res.render("editProfile", { pageTitle: "Edit Profile" })};

export const postEditProfile = async (req, res) => {
    const {
         body: {    
            name,
            email
         },
         user: { id },
         file
    } = req;    // post에서 가져온 유저 관련 데이터
    try {
        await User.findByIdAndUpdate(id, {       
            name,
            email,
            avatar: (file ? file.path : req.user.avatar)
        }, {new: true}); // 디비에서 Id조회후 해당 객체 수정
        req.flash('success', '프로필 수정 완료');
        res.redirect(routes.me); // 내 정보 페이지로 리다이랙트
    } catch (err) {
        req.flash('error', '프로필 수정 실패');
        res.redirect(routes.editProfile);
    }
};

export const getChangePassword = (req,res) => { // get 비밀번호 변경 페이지 랜더링
     res.render("changePassword", { pageTitle: "Change Paasword" })};

export const postChangePassword =  async (req,res) => {
    const { body:
            {
                oldPassword,
                newPassword,
                newPassword1
            }
        } = req; // 프론트 input을 통해 받아온 데이터 가져오기
    try {
        if(newPassword !== newPassword1) { // 비밀번호와 비밀번호 확인 일치 확인
            req.flash('error', '비밀번호가 일치하지 않습니다.');
            res.status(400);
            res.redirect(`/users${routes.changePassword}`);
            return;
        }
        req.flash('error', '비밀번호 변경 완료');
        await req.user.changePassword(oldPassword, newPassword1); // changePassword메소드를 통해 유저 비밀번호 변경
        res.redirect(routes.me);
    } catch(err) {
        req.flash('error', '비밀번호 변경 실패');
        res.status(400);
        res.redirect(`/users${routes.changePassword}`);
    }
};

export const userMqtt = (req, res) => {
    res.render("socket", { pageTitle: "Socket"})};