/* eslint-disable object-shorthand */
/* eslint-disable no-restricted-syntax */
import Video from "../models/Video";
import Photo from "../models/Photo";
import User from "../models/User"
import Complain from "../models/Complain";
import Comment from "../models/Comment";
import { clearComment, clearUserComment } from './boardController';

// Global

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
        res.json({
            searchingBy,
            videos,
            photos
        });
    } catch(err) {
        throw Error();
    }
};

// Photo
export const apiPhotos = async(req, res) => {
    try{
        const photoList = await Photo.find({}).sort({ _id: -1 });
        res.json({
            success: true,
            data: photoList
        });
    } catch(err) {
        throw Error();
    }
};

export const apiPostPhotoUpload = async (req, res) => {
    const {
        body: { title, description },
        file: { path },
        user: { _id: id}
    } = req;
    try{
        const newPhoto = await Photo.create({
            photoUrl: path,
            title,
            description,
            creator: id
        });
        req.user.photos.push(newPhoto.id);
        req.user.save();
        res.json({
            success: true
        })
    } catch(err) {
        throw Error();
    }
};

export const apiGetPhotoDetail = async(req, res) => {
    const { 
        params: { id }
    } = req;
    try {
        const photo = await Photo
            .findById(id)
            .populate("creator")
            .populate("comments");
        res.json({
            data: photo
        })
    } catch(err) {
        res.json({
            data: {}
        })
    }
};

export const apiPostPhotoDetail =(req, res) => {
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

export const apiGetEditPhoto = async(req, res) => {
    const {
        params: { id }
      } = req;
    try {
        const photo = await Photo.findById(id);
        if(String(photo.creator) !== req.user.id) {
            throw Error();
        } else {
            res.json({
                data: photo
            })
        }
    } catch(err) {
        throw Error();
    }
};

export const apiPostEditPhoto = async(req, res) => {
    const { 
        params: { id },
        body: { title, description }
    } = req;
    try {
        await Photo.findByIdAndUpdate(id, { title, description });
        res.json({
            success: true
        })
    } catch(err) {
        throw Error();
    }
};

export const apiDeletePhoto = async(req, res) => {
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
            res.json({
                success: true
            })
        }
    } catch(err) { 
        throw Error();
    } 
};

// 사진 조회수
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
export const apiVideos = async(req, res) => {
    try{
        const videoList = await Video.find({}).sort({ _id: -1 });
        res.json({
            data: videoList
        })
    } catch(err) {
        res.json({
            data: {}
        })
    }
};

export const apiPostVideoUpload = async (req, res) => {
    const {
        body: { title, description },
        file: { path },
        user: { _id: id }
    } = req;
    try{
        const newVideo = await Video.create({
            videoUrl: path,
            title,
            description,
            creator: id
        });
        req.user.videos.push(newVideo.id);
        req.user.save();
        res.json({
            data: newVideo,
        })
    } catch(err) {
        res.json({
            data: {}
        })
    }
};

export const apiGetVideoDetail = async(req, res) => {
    const { 
        params: { id }
    } = req;
    try {
        const video = await Video
            .findById(id)
            .populate("creator")
            .populate("comments");
        res.json({
            data: video
        })
    } catch(err) {
        res.json({
            data: {}
        })
    }
};

export const apiPostVideoDetail = async(req, res) => {
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

export const apiGetEditVideo = async(req, res) => {
    const {
        params: { id }
      } = req;
    try {
        const video = await Video.findById(id);
        if(String(video.creator) !== req.user.id) {
            throw Error();
        } else {
            res.json({
                success: true,
                data: video
            })
        }
    } catch(err) {
        res.json({
            success: false,
            data: {}
        })
    }
};


export const apiPostEditVideo = async(req, res) => {
    const { 
        params: { id },
        body: { title, description }
    } = req;
    try {
        await Video.findByIdAndUpdate(id, { title, description });
        res.json({
            success: true,
            id
        })
    } catch(err) {
        res.json({
            success: false,
            id
        })
    }
};

export const apiDeleteVideo = async(req, res) => {
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
            res.json({
                success: true
            })
        }
    } catch(err) { 
        res.json({
            success: false
        })
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

export const postVideoComplain = async (req, res) => {
    const { 
        params: { id },
        body: { videoId }
    } = req;
    try {
        const user = await User.findById(id)
        const already = user.complain.filter(list => String(list) === String(videoId));
        console.log(already)
        if(already.length === 0) {
            res.json({
                success: true,
            });
        } else {
            res.json({
                success: false,
            });
        }
    } catch(err) {
        console.log(err);
    }
};

export const getVideoComplainPopup = (req, res) => {
    res.render("complain", { pageTitle: "신고" });
}

export const postVideoComplainPopup = async(req, res) => {
    const { 
        body: { title, description, userId },
        params: { id }
    } = req;
    try {
        const user = await User.findById(userId);
        const video  = await Video.findById(id);
        if(user && video) {
            const exist = video.complain.filter(list => String(list) === String(userId));
            if(exist.length === 0){
                await Complain.create({
                    title,
                    description,
                    complainer: userId,
                    complainedVideo: id
                });
                await Video.findByIdAndUpdate(id, {$push: { complain: userId }});
                await User.findByIdAndUpdate(userId, {$push: { complain: id }});
                return res.send("신고가 완료되었습니다");
            } else {
                return res.send("이미 신고된 게시물입니다.");
            }
        } 
    } catch(err) {
        console.log(err);
    }
}

export const postPhotoComplain = async (req, res) => {
    const { 
        params: { id },
        body: { photosId }
    } = req;
    try {
        const user = await User.findById(id)
        const already = user.complain.filter(list => String(list) === String(photosId));
        if(already.length === 0) {
            res.json({
                success: true,
            });
        } else {
            res.json({
                success: false,
            });
        }
    } catch(err) {
        console.log(err);
    }
};

export const getPhotoComplainPopup = (req, res) => {
    res.render("photoComplain", { pageTitle: "신고" });
}

export const postPhotoComplainPopup = async(req, res) => {
    const { 
        body: { title, description, userId },
        params: { id }
    } = req;
    try {
        const user = await User.findById(userId);
        const photo  = await Photo.findById(id);
        console.log(photo)
        console.log(user)
        if(user && photo) {
            const exist = photo.complain.filter(list => String(list) === String(userId));
            if(exist.length === 0){
                await Complain.create({
                    title,
                    description,
                    complainer: userId,
                    complainedPhoto: id
                });
                await Photo.findByIdAndUpdate(id, {$push: { complain: userId }});
                await User.findByIdAndUpdate(userId, {$push: { complain: id }});
                return res.send("신고가 완료되었습니다");
            } else {
                return res.send("이미 신고된 게시물입니다.");
            }
        } 
    } catch(err) {
        console.log(err);
    }
}