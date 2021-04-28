// Global
const HOME = "/";
const JOIN = "/join";
const LOGIN = "/login";
const LOGOUT = "/logout";
const SEARCH = "/search";

// Users
const USERS = "/users";
const USER_DETAIL = "/:id";
const EDIT_PROFILE = "/edit-profile";
const CHANGE_PASSWORD = "/change-password";
const ME = "/me";
const MQTT = "/:id/mqtt";
const WATER = "/:id/water";
const EAT = "/:id/eat";
const CAM = "/:id/cam";

// Boards
const BOARDS = "/boards";

const PHOTHS = "/photo";
const PHOTO_UPLOAD = "/photo/upload";
const EDIT_PHOTO = "/photo/:id/edit";
const PHOTO_DETAIL = "/photo/:id";
const DELETE_PHOTO = "/photo/:id/delete";

const VIDEOS = "/video";
const VIDEO_UPLOAD = "/video/upload";
const EDIT_VIDEO = "/video/:id/edit";
const VIDEO_DETAIL = "/video/:id";
const DELETE_VIDEO = "/video/:id/delete";

// API
const API = "/api";
const REGISTER_VIEW = "/:id/view";
const ADD_COMMENT_PHOTO = "/:id/photo/comment/add";
const UPDATE_COMMENT_PHOTO = "/:id/photo/comment/update";
const DELETE_COMMENT_PHOTO = "/:id/photo/comment/delete";
const ADD_COMMENT_VIDEO = "/:id/video/comment/add";
const UPDATE_COMMENT_VIDEO = "/:id/video/comment/update";
const DELETE_COMMENT_VIDEO = "/:id/video/comment/delete";
const GOOGLE_MAP = "/:id/google-map";
const HOSPITAL = "/:id/hospital"

const routes = {
    //Global
    home: HOME,
    join: JOIN,
    login: LOGIN,
    logout: LOGOUT,
    search: SEARCH,

    //Users
    users: USERS,
    userDetail: id => {
        if (id) {
          return `/users/${id}`;
        } else {
          return USER_DETAIL;
        }
    },

    editProfile: EDIT_PROFILE,
    changePassword: CHANGE_PASSWORD,
    me: ME,
    mqtt: id => {
      if(id) {
        return `/users/${id}/mqtt`;
      } else {
        return MQTT;
      }
    },
    water: WATER,
    eat: EAT,
    cam: CAM,

    //Boards
    boards: BOARDS,

    photos: PHOTHS,
    photoUpload: PHOTO_UPLOAD,
    photoDetail: id => {
      if (id) {
        return `/boards/photo/${id}`;
      } else {
        return PHOTO_DETAIL;
      }
    },
    editPhoto: id => { 
      if(id) {
        return `/boards/photo/${id}/edit`
      } else {
        return EDIT_PHOTO;
      }
    },
    deletePhoto: id => {
      if(id) {
        return `/boards/photo/${id}/delete`
      } else {
        return DELETE_PHOTO
      }
    },

    videos: VIDEOS,
    videoUpload: VIDEO_UPLOAD,
    videoDetail: id => {
      if (id) {
        return `/boards/video/${id}`;
      } else {
        return VIDEO_DETAIL;
      }
    },
    editVideo: id => { 
      if(id) {
        return `/boards/video/${id}/edit`
      } else {
        return EDIT_VIDEO;
      }
    },
    deleteVideo: id => {
      if(id) {
        return `/boards/video/${id}/delete`
      } else {
        return DELETE_VIDEO
      }
    },

    // API
    api: API,
    registerView: REGISTER_VIEW,
    addVideoComment: ADD_COMMENT_VIDEO,
    updateVideoComment: id => {
      if(id) {
        return `/api/${id}/video/comment/delete`
      } else {
        return UPDATE_COMMENT_VIDEO;
      }
    },
    deleteVideoComment: id => {
      if(id) {
        return `/api/${id}/video/comment/delete`
      } else {
        return DELETE_COMMENT_VIDEO
      }
    },
    addPhotoComment: ADD_COMMENT_PHOTO,
    updatePhotoComment: UPDATE_COMMENT_PHOTO,
    deletePhotoComment: id => {
      if(id) {
        return `/api/${id}/photo/comment/delete`
      } else {
        return DELETE_COMMENT_PHOTO
      }
    },
    googleMap: GOOGLE_MAP,
    hospital: HOSPITAL
};

export default routes;

