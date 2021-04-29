/* eslint-disable object-shorthand */
/* eslint-disable no-restricted-syntax */
import routes from "../routes";
import Video from "../models/Video";
import Photo from "../models/Photo";
import User from "../models/User"
import Comment from "../models/Comment"

async function clearComment(comments) {
    for await (const comment of comments) {
        await Comment.findByIdAndDelete(comment.id);
    };
}; // 비디오의 포함된 댓글들을 삭제하는 함수

async function clearUserComment(comments) {
    for await (const comment of comments) {
        await User.updateOne({ comments: comment.id }, {$pull: { comments: comment.id }});
    };
}; // 유저의 포함된 댓글들을 삭제하는 함수

// Global
export const home = (req, res) => {
        res.render("home", { pageTitle: "Home" })
};

export const search = async(req, res) => {
    const { 
        query: { term: searchingBy }
    } = req;
    let videos = [];
    let photos = [];
    try {
        videos = await Video.find({
            title: { $regex: searchingBy, $options: "i"}});
        photos = await Photo.find({
            title: { $regex: searchingBy, $options: "i"}});
    } catch(err) {
        console.log(err);
    }
    res.render("Search", { pageTitle: `${searchingBy}`, searchingBy, videos, photos });
};

// Photo
export const photos = async(req, res) => {
    try{
        const photolist = await Photo.find({}).sort({ _id: -1 });
        res.render("photos", { pageTitle: "Photo", photolist });
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
    } = req;
    try{
        const newPhoto = await Photo.create({
            photoUrl: path,
            title,
            description,
            creator: req.user.id
        });
        req.flash('success', '업로드 성공');
        req.user.photos.push(newPhoto.id);
        req.user.save();
        res.redirect(routes.photoDetail(newPhoto.id));
    } catch(err) {
        res.redirect(routes.photoUpload);
        console.log(err);
    }
};

export const getPhotoDetail = async(req, res) => {
    const { 
        params: { id }
    } = req;
    try {
        const photo = await Photo
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
    } = req;
    try {
        if(user) {
            res.json({
                loggedUser: user.id,
                loggedUserName: user.name,
            });
        }
    } catch(err) {
        console.log(err);
    } finally {
        res.end();
    }
};

export const getEditPhoto = async(req, res) => {
    const {
        params: { id }
      } = req;
    try {
        const photo = await Photo.findById(id);
        if(String(photo.creator) !== req.user.id) {
            throw Error();
        } else {
            res.render('editPhoto', { pageTitle: `Edit ${photo.title}`, photo })
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
    } = req;
    try {
        await Photo.findOneAndUpdate({ _id: id }, { title, description });
        req.flash('success', '수정 완료');
        res.redirect(routes.photoDetail(id));
    } catch(err) {
        console.log(err);
        res.redirect(routes.home);
    }
};

export const deletePhoto = async(req, res) => {
    const {
        params: { id },
        user
    } = req;
    try {
        const photo = await Photo
            .findById(id)
            .populate('creator')
            .populate('comments');
        if (String(photo.creator.id) !== user.id) {
           throw Error(); 
        } else {
            const photoCreator = await User.findById(photo.creator._id)
            const photoFilter = photoCreator.photos.filter( index => String(index) !== `${id}`);
            photoCreator.photos = photoFilter;
            photoCreator.save();
            clearUserComment(photo.comments);
            clearComment(photo.comments);
            await Photo.findByIdAndDelete(id);
            await Comment.findByIdAndDelete(photo.comments.id);
            req.flash('success', '삭제 완료');
        }
    } catch(err) { 
        console.log(err)
    } finally {
        res.redirect(`/boards${routes.photos}`);
    }
};

// 비디오 조회수
export const postRegiserPhotoView = async (req, res) => {
    const {
        params: { id }
    } = req;
    try {
        const photo = await Photo.findById(id);
        photo.views += 1;
        photo.save();
        res.status(200);
    } catch(err) {
        res.status(400);
    } finally {
        res.end();
    }
};

// 댓글 추가
export const postAddPhotoComment = async (req, res) => {
    const {
        params: { id },
        body: { comment, displayName },
        user
    } = req;
    try {
        const photo = await Photo.findById(id);
        const userComment = await User.findById(user.id);
        const newComment = await Comment.create({
            text: comment,
            creator: user.id,
            displayName
        });
        userComment.comments.push(newComment);
        userComment.save();
        photo.comments.push(newComment.id);
        photo.save();
        newComment.save();
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
export const postDeletePhotoComment = async (req, res) => {
    const {
        params: { id },
        body: { commentId },
        user
    } = req;
    try {
        const photo = await Photo.findById(id).populate('comments');
        const comment = await Comment.findById(commentId);
        console.log(user.id);
        if (user.id !== String(photo.creator) && user.id !== String(comment.creator)){
            throw Error();
        } else {
            const creator = await User.findById(comment.creator);
            const commentFilter = await creator.comments.filter( index => String(index) !== `${commentId}`);
            const photoFilter = await photo.comments.filter( index => String(index) !== `${commentId}`);
            creator.comments = commentFilter;
            photo.comments = photoFilter;
            creator.save();
            photo.save();
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
        await Video.findOneAndUpdate({ _id: id }, { title, description });
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
