/* eslint-disable object-shorthand */
/* eslint-disable no-restricted-syntax */
import routes from "../routes";
import Video from "../models/Video";
import Photo from "../models/Photo";
import User from "../models/User"
import Comment from "../models/Comment"

export async function clearComment(comments) {
    for await (const comment of comments) {
        await Comment.findByIdAndDelete(comment.id);
    };
}; // 비디오의 포함된 댓글들을 삭제하는 함수

export async function clearUserComment(comments) {
    for await (const comment of comments) {
        await User.updateOne({ comments: comment.id }, {$pull: { comments: comment.id }});
    };
}; // 유저의 포함된 댓글들을 삭제하는 함수


// Global
export const home = (req, res) => { // 홈페이지 랜더링
        res.render("home", { pageTitle: "Home" })
}; 

export const search = async(req, res) => { 
    const { 
        query: { term: searchingBy }
    } = req; // query를 통해 데이터 가져옴
    let videos = []; // 빈 배열을 만들어 데이터를 넣어 페이지로 전송할 계획
    let photos = [];
    try {
        videos = await Video.find({
            title: { $regex: searchingBy, $options: "i"}}); // 정규식을 이용하여 관련된 정보 찾기
        photos = await Photo.find({
            title: { $regex: searchingBy, $options: "i"}});
        console.log(photos);
    } catch(err) {
        console.log(err);
    }
    res.render("Search", { pageTitle: `${searchingBy}`, searchingBy, videos, photos }); // 페이지로 채워진 배열 전송
};

// Photo
export const photos = async(req, res) => {
    try{
        const photolist = await Photo.find({}).sort({ _id: -1 }); // Photo DB에서 최신순으로 정렬
        res.render("photos", { pageTitle: "Photo", photolist }); // 정보와 함께 페이지에 랜더링
    } catch(err) {
        console.log(err);
        res.render("photos", { pageTitle: "Photo", photolist: [] });
    }
};

export const getPhotoUpload = (req, res) => { 
    res.render("photoUpload", { pageTitle: "Upload Photo" })};

export const postPhotoUpload = async (req, res) => {
    const {
        body: { title, description },
        file: { path }
    } = req; // 프론트 input에서 받아온 데이터
    try{
        const newPhoto = await Photo.create({ // Photo DB에 새로운 객체 생성
            photoUrl: path,
            title,
            description,
            creator: req.user.id
        });
        req.flash('success', '업로드 성공'); // 알림 표시
        req.user.photos.push(newPhoto.id); // 유저 DB에도 관련 배열에 정보 추가
        req.user.save();
        res.redirect(routes.photoDetail(newPhoto.id)); // 업로드한 사진 세부페이지로 이동
    } catch(err) {
        res.redirect(routes.photoUpload);
        console.log(err);
    }
};

export const getPhotoDetail = async(req, res) => {
    const { 
        params: { id }
    } = req; // params를 통해 해당 Id가져오기
    try {
        const photo = await Photo // 포토 디비에서 해당 Id 정보를 찾고 populate를 통해 연관된 정보 가져오기
            .findById(id)
            .populate("creator")
            .populate("comments");
        res.render('photoDetail', { pageTitle: photo.title, photo })
    } catch(err) {
        console.log(err);
        res.redirect(routes.home);
    }
};

export const postPhotoDetail =(req, res) => {
    const {
        user 
    } = req; // 유저정보 가져오기
    try {
        if(user) { // 로그인한 유저가 있다면
            res.json({ // json방식으로 프론트에 데이터 전송
                loggedUser: user.id,
                loggedUserName: user.name,
            });
        }
    } catch(err) {
        console.log(err);
    } finally {
        res.end(); // 통신 끝
    }
};

export const getEditPhoto = async(req, res) => {
    const {
        params: { id }
      } = req; // params에서 Id 가져오기
    try {
        const photo = await Photo.findById(id); // 포토 디비에서 id값 조회
        if(String(photo.creator) !== req.user.id) { // 게시물 작성자와 유저 id가 같지 않다면
            throw Error();
        } else {
            res.render('editPhoto', { pageTitle: `Edit ${photo.title}`, photo }) // 같다면 수정 페이지 랜더링
        }
    } catch(err) {
        console.log(err);
        res.redirect(routes.home);
    }
};

export const postEditPhoto = async(req, res) => {
    const { 
        params: { id },
        body: { title, description }
    } = req; // post 정보 가져오기
    try {
        await Photo.findByIdAndUpdate(id, { title, description }); // 포토 디비에서 아이디 조회 후 수정
        req.flash('success', '수정 완료'); // 알림
        res.redirect(routes.photoDetail(id)); // 해당 페이지로 리다이렉트
    } catch(err) {
        console.log(err);
        res.redirect(routes.home);
    }
};

export const deletePhoto = async(req, res) => {
    const {
        params: { id },
        user
    } = req; // 유저정보 및 id가져오기
    try {
        const photo = await Photo // 포토 디비 아이디로 조회
            .findById(id)
            .populate('creator')
            .populate('comments');
        if (String(photo.creator.id) !== user.id) { //로그인 유저와 작성자가 다르다면 에러발생
           throw Error(); 
        } else {
            const photoCreator = await User.findById(photo.creator._id) // 유저 디비에서 아이디 조회
            const photoFilter = photoCreator.photos.filter( index => String(index) !== `${id}`); // 해당 배열 수정
            photoCreator.photos = photoFilter;
            photoCreator.save(); // 저장
            clearUserComment(photo.comments); // 상위 함수를 이용하여 댓글 디비 수정
            clearComment(photo.comments);
            await Photo.findByIdAndDelete(id); // 사진 디비에서 해당 아이디 삭제
            await Comment.findByIdAndDelete(photo.comments.id); // 댓글 디비에서 삭제
            req.flash('success', '삭제 완료'); // 알림
        }
    } catch(err) { 
        console.log(err)
    } finally {
        res.redirect(`/boards${routes.photos}`);
    }
};

// 사진 조회수
export const postRegiserPhotoView = async (req, res) => {
    const {
        params: { id }
    } = req; // Params 가져오기
    try {
        const photo = await Photo.findById(id); // 사진 디비에서 조회
        photo.views += 1; // view에 1 더하기
        photo.save(); // 저장
        res.status(200); // 정상 http code
    } catch(err) {
        res.status(400); // 에러
    } finally {
        res.end(); // 통신 끝
    }
};

// 댓글 추가
export const postAddPhotoComment = async (req, res) => {
    const {
        params: { id },
        body: { comment, displayName },
        user
    } = req; // post 정보 가져오기
    try {
        const photo = await Photo.findById(id); // 사진 디비 조회
        const userComment = await User.findById(user.id); // 유저 디비 조회
        const newComment = await Comment.create({ // 새로운 댓글 객체 생성
            text: comment,
            creator: user.id,
            displayName
        });
        userComment.comments.push(newComment); // 유저 디비에 댓글 배열에 추가
        userComment.save(); // 저장
        photo.comments.push(newComment.id); // 사진 디비에 댓글 배열에 추가
        photo.save(); // 저장
        newComment.save(); // 댓글 디비 저장
    } catch (err) {
        res.status(400);
    } finally {
        res.end();
    }
};

// 댓글 수정
export const postUpdatePhotoComment = async (req, res) => {
    const {
        body: { comment, commentId },
        user
    } = req; // 댓글 및 유저 정보 가져오기
    try {
        const comments = await Comment.findById(commentId); // 댓글 디비에서 아이디 조회
        if (user.id !== String(comments.creator)){ // 로그인유저와 댓글 작성자 값이 다르다면 에러발생
            throw Error();
        } else {
            await Comment.findByIdAndUpdate(commentId, // 같다면 댓글 디비 정보 수정
                {$set: 
                    { text: comment }
                }, {new: true });
        }
    } catch(err){
        res.status(400);
    } finally {
        res.end();
    }
};

// 댓글 삭제
export const postDeletePhotoComment = async (req, res) => {
    const {
        params: { id },
        body: { commentId },
        user
    } = req; // post 정보 가져오기
    try {
        const photo = await Photo.findById(id).populate('comments'); // 사진 디비 아이디 값 조회
        const comment = await Comment.findById(commentId); // 댓글 디비 조회
        if (user.id !== String(photo.creator) && user.id !== String(comment.creator)){ // 게시물 작성자와 댓글 작성자 비교
            throw Error();
        } else {
            const creator = await User.findById(comment.creator); // 유저 디비 조회
            const commentFilter = await creator.comments.filter( index => String(index) !== `${commentId}`);
            // 댓글 디비 수정
            const photoFilter = await photo.comments.filter( index => String(index) !== `${commentId}`);
            // 사진 디비 수정
            creator.comments = commentFilter;
            photo.comments = photoFilter;
            creator.save(); // 저장
            photo.save(); // 저장
            await Comment.findByIdAndDelete(commentId);
        }
    } catch(err){
        res.status(400);
    } finally {
        res.end();
    }
};

// Video
export const videos = async(req, res) => {
    try{
        const videolist = await Video.find({}).sort({ _id: -1 });
        res.render("videos", { pageTitle: "Video", videolist });
    } catch(err) {
        console.log(err);
        res.render("videos", { pageTitle: "Video", videolist: [] });
    }
};

export const getVideoUpload = (req, res) => { 
    res.render("videoUpload", { pageTitle: "Upload Video" })};

export const postVideoUpload = async (req, res) => {
    const {
        body: { title, description },
        file: { path }
    } = req;
    try{
        const newvideo = await Video.create({
            videoUrl: path,
            title,
            description,
            creator: req.user.id
        });
        req.flash('success', '업로드 성공');
        req.user.videos.push(newvideo.id);
        req.user.save();
        res.redirect(routes.videoDetail(newvideo.id));
    } catch(err) {
        res.redirect(routes.videoUpload);
        console.log(err);
    }
};

export const getVideoDetail = async(req, res) => {
    const { 
        params: { id }
    } = req;
    try {
        const video = await Video
            .findById(id)
            .populate("creator")
            .populate("comments");
        res.render("videoDetail", { pageTitle: video.title, video });
    } catch(err) {
        console.log(err);
        res.redirect(routes.home);
    }
};

export const postVideoDetail = async(req, res) => {
    const {
        user,
        params: { id } 
    } = req;
    try {
        const videoCreator = await User.findOne({ videos: id });
        if(user) {
            res.json({
                loggedUser: user.id,
                loggedUserName: user.name,
                videoCreator: videoCreator.id
            });
        }
    } catch(err) {
        console.log(err);
    } finally {
        res.end();
    }
};

export const getEditVideo = async(req, res) => {
    const {
        params: { id }
      } = req;
    try {
        const video = await Video.findById(id);
        if(String(video.creator) !== req.user.id) {
            throw Error();
        } else {
            res.render('editVideo', { pageTitle: `Edit ${video.title}`, video })
        }
    } catch(err) {
        console.log(err);
        res.redirect(routes.home);
    }
};

export const postEditVideo = async(req, res) => {
    const { 
        params: { id },
        body: { title, description }
    } = req;
    try {
        await Video.findByIdAndUpdate(id, { title, description });
        req.flash('success', '수정 완료');
        res.redirect(routes.videoDetail(id));
    } catch(err) {
        console.log(err);
        res.redirect(routes.home);
    }
};

export const deleteVideo = async(req, res) => {
    const {
        params: { id },
        user
    } = req;
    try {
        const video = await Video
            .findById(id)
            .populate('creator')
            .populate('comments');
        if (String(video.creator.id) !== user.id) {
           throw Error(); 
        } else {
            const videoCreator = await User.findById(video.creator._id)
            const videoFilter = videoCreator.videos.filter( index => String(index) !== `${id}`);
            videoCreator.videos = videoFilter;
            videoCreator.save();
            clearUserComment(video.comments);
            clearComment(video.comments);
            await Video.findByIdAndDelete(id);
            await Comment.findByIdAndDelete(video.comments.id);
            req.flash('success', '삭제 완료');
        }
    } catch(err) { 
        console.log(err)
    } finally {
        res.redirect(`/boards${routes.videos}`);
    }
};

// 비디오 조회수
export const postRegiserVideoView = async (req, res) => {
    const {
        params: { id }
    } = req;
    try {
        const video = await Video.findById(id);
        video.views += 1;
        video.save();
        res.status(200);
    } catch(err) {
        res.status(400);
    } finally {
        res.end();
    }
};

// 댓글 추가
export const postAddVideoComment = async (req, res) => {
    const {
        params: { id },
        body: { comment, displayName },
        user
    } = req;
    try {
        const video = await Video.findById(id);
        const userComment = await User.findById(user.id);
        const newComment = await Comment.create({
            text: comment,
            creator: user.id,
            displayName
        });
        userComment.comments.push(newComment);
        userComment.save();
        video.comments.push(newComment.id);
        video.save();
        newComment.save();
    } catch (err) {
        res.status(400);
    } finally {
        res.end();
    }
};

// 댓글 수정
export const postUpdateVideoComment = async (req, res) => {
    const {
        body: { comment, commentId },
        user
    } = req;
    try {
        const comments = await Comment.findById(commentId);
        if (user.id !== String(comments.creator)){
            throw Error();
        } else {
            await Comment.findByIdAndUpdate(commentId, 
                {$set: 
                    { text: comment }
                }, {new: true });
        }
    } catch(err){
        res.status(400);
    } finally {
        res.end();
    }
};

// 댓글 삭제
export const postDeleteVideoComment = async (req, res) => {
    const {
        params: { id },
        body: { commentId },
        user
    } = req;
    try {
        const video = await Video.findById(id).populate('comments');
        const comment = await Comment.findById(commentId);
        console.log(user.id);
        if (user.id !== String(video.creator) && user.id !== String(comment.creator)){
            throw Error();
        } else {
            const creator = await User.findById(comment.creator);
            const commentFilter = await creator.comments.filter( index => String(index) !== `${commentId}`);
            const videoFilter = await video.comments.filter( index => String(index) !== `${commentId}`);
            creator.comments = commentFilter;
            video.comments = videoFilter;
            creator.save();
            video.save();
            await Comment.findByIdAndDelete(commentId);
        }
    } catch(err){
        res.status(400);
    } finally {
        res.end();
    }
};
