/* eslint-disable no-unused-expressions */
/* eslint-disable no-restricted-syntax */
/* eslint-disable object-shorthand */
import passport from "passport";
import { PythonShell } from "python-shell";
import Mongoose from "mongoose";
import routes from "../routes";
import User from "../models/User";
import Product from "../models/Product";
import Food from "../models/Food";

const scriptPath = '/Users/gim-ingug/Documents/ccit-homepage/.venv'

const { Types: { ObjectId } } = Mongoose

const korea = new Date(); 
const year = korea.getFullYear();
const month = korea.getMonth();
const lastMon = korea.getMonth() - 1;
const date = korea.getDate()+1; // 수정
const today = new Date(Date.UTC(year, month, date));
const lastMonth = new Date(Date.UTC(year, lastMon, date));



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
export const getProduct = (req, res) => {
    res.render("product", { pageTitle: "기기 정보" });
}

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

export const getAddKey = (req, res) => {
    res.render("addKey", {pageTitle: "제품등록"});
}

export const postAddKey = async(req, res) => {
    const {
         user: { id },
         body: { key }
    } = req;
    console.log(key)
    try {
        const product = await Product.findOne({ key });
        console.log(product)
        if(!product) {
            await User.findByIdAndUpdate(id, { $push: { key } });
            const newProduct = await Product.create({
                key,
                controller: id
            })
            newProduct.save()
            const productId = await Product.findOne({ key });
            await User.findByIdAndUpdate(id, { $push: { product: productId.id }});
            req.flash('success', '등록 완료'); // 알림
            res.redirect(routes.me);
        } else {
            req.flash('error', '이미 등록된 제품입니다.');
            res.redirect(`/users${routes.addKey}`);
        }
    } catch(err) {
        console.log(err);
    }
};

export const getProductDetail = async(req, res) => {
    const {
        params: { id }
    } = req;
    try {
        const foods = await Food.aggregate([
            { $match: { $and: [{ product: new ObjectId(id) }, { time: { $gte: lastMonth, $lt: today }}] }},
            {
                $group: {
                    "_id": { "$week": "$time"},
                    avgFoodValue: { $avg: "$amount" },
                    avgRestValue: { $avg: "$rest" },
                    avgWeightValue: { $avg: "$weg" }
                }
            },
            { $sort: { _id: 1 }}
        ]);
        const allData = await Food.find({ product: id, time: { $gte: lastMonth, $lt: today }}).sort({ time: 'desc' });
        const dateBox = [];
        const FoodBox = [];
        const RestBox = [];
        const WeightBox = [];
        for(const food of foods) {
            const startYear = new Date(Date.UTC(year, 0, 1));
            const neededDate = new Date(startYear.setDate(startYear.getDate() + (food._id * 7)))
            const neededYear = neededDate.getFullYear();
            const neededMonth = neededDate.getMonth() + 1;
            const neededDay = neededDate.getDate();
            const needDate = `${neededYear}-${neededMonth < 10 ? `0${neededMonth}` : `${neededMonth}`}-${neededDay < 10 ? `0${neededDay}` : `${neededDay}`}`
            dateBox.push(needDate);
            FoodBox.push(food.avgFoodValue !== null ? food.avgFoodValue : 0);
            RestBox.push(food.avgRestValue !== null ? food.avgRestValue : 0);
            WeightBox.push(food.avgWeightValue !== null ? food.avgWeightValue : 0);
        }
        res.render('productDetail', { pageTitle: "내 기기" , FoodBox, RestBox, WeightBox, dateBox, allData, id })
    } catch(err) {
        console.log(err)
    }

};

export const postProductDetail = (req, res) => {
    const {
        params: { id },
        body: { 
            data
        }
    } = req;
    PythonShell.run('ChartPage.py', {
        mode: 'json',
        pythonOptions: ['-u'],
        scriptPath,
        args: [id, data.start, data.end]
    }, (err, result) => {
        if(err) {
            return console.log(err);
        }
        const DateBox = result[0];
        const DataBox = result[1];
        const allDataList = result[2];
        console.log(DateBox);
        console.log(DataBox);
        console.log(allDataList);
        if(DateBox !== [] && DataBox !== {} && allDataList !== []) {
            return res.json({
                success: true,
                DateBox,
                allDataList,
                amount: DataBox.amount,
                rest: DataBox.rest,
                weight: DataBox.weight
            })
        } 
        return res.json({
            success: false,
            DateBox: [],
            allDataList: [],
            amount: [],
            rest: [],
            weight: []
        })
    })
};