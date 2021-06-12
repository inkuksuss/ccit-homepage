// Global
const HOME = "/"; // 홈
const JOIN = "/join"; // 회원가입
const LOGIN = "/login"; // 로그인
const LOGOUT = "/logout"; // 로그아웃
const SEARCH = "/search"; // 검색
const ME = "/me"; // 내 정보

// Users
const USERS = "/users";
const ADD_KEY = "/addkey";
const EDIT_PROFILE = "/edit-profile"; // 개인정보 수정
const CHANGE_PASSWORD = "/change-password"; // 비밀번호 변경
const PRODUCT = "/my/product";
const PRODUCT_DETAIL = "/product/:id";
const USER_DETAIL = "/:id"; // 유저 세부정보

// Boards
const BOARDS = "/boards"; 

const PHOTHS = "/photo"; // 사진 게시판
const PHOTO_UPLOAD = "/photo/upload"; // 사진 업로드
const EDIT_PHOTO = "/photo/:id/edit"; // 사진 수정
const PHOTO_DETAIL = "/photo/:id"; // 사진 세부정보
const DELETE_PHOTO = "/photo/:id/delete"; // 사진 삭제

const VIDEOS = "/video"; // 비디오 게시판
const VIDEO_UPLOAD = "/video/upload"; // 비디오 업로드
const EDIT_VIDEO = "/video/:id/edit"; // 비디오 수정
const VIDEO_DETAIL = "/video/:id"; // 비디오 세부정보
const DELETE_VIDEO = "/video/:id/delete"; // 비디오 삭제

// API
const API = "/api";
const API_HOME = "/";
const API_JOIN = "/join";
const API_LOGIN = "/login";
const API_LOGOUT = "/logout";
const API_SEARCH = "/search";
const API_ME = "/me";

// API_Users
const API_USERS = "/api/users";
const API_USER_DETAIL = "/:id";
const API_EDIT_PROFILE = "/edit-profile";
const API_CHANGE_PASSWORD = "/change-password";

// API_BOARDS
const API_BOARDS = "/api/boards";

const API_PHOTHS = "/photo";
const API_PHOTO_UPLOAD = "/photo/upload";
const API_EDIT_PHOTO = "/photo/:id/edit";
const API_PHOTO_DETAIL = "/photo/:id";
const API_DELETE_PHOTO = "/photo/:id/delete";

const API_VIDEOS = "/video";
const API_VIDEO_UPLOAD = "/video/upload";
const API_EDIT_VIDEO = "/video/:id/edit";
const API_VIDEO_DETAIL = "/video/:id";
const API_DELETE_VIDEO = "/video/:id/delete";

const REGISTER_PHOTO_VIEW = "/photo/:id/view";
const ADD_COMMENT_PHOTO = "/:id/photo/comment/add";
const UPDATE_COMMENT_PHOTO = "/:id/photo/comment/update";
const DELETE_COMMENT_PHOTO = "/:id/photo/comment/delete";

const REGISTER_VIDEO_VIEW = "/video/:id/view";
const ADD_COMMENT_VIDEO = "/:id/video/comment/add";
const UPDATE_COMMENT_VIDEO = "/:id/video/comment/update";
const DELETE_COMMENT_VIDEO = "/:id/video/comment/delete";

const VIDEO_COMPLAIN =  '/video/:id/complain';
const VIDEO_COMPLAIN_POPUP =  '/video/:id/complain/popup';
const PHOTO_COMPLAIN =  '/photo/:id/complain';
const PHOTO_COMPLAIN_POPUP =  '/photo/:id/complain/popup';


const routes = {
    //Global
    home: HOME,
    join: JOIN,
    login: LOGIN,
    logout: LOGOUT,
    search: SEARCH,

    //Users
    users: USERS,
    editProfile: EDIT_PROFILE,
    changePassword: CHANGE_PASSWORD,
    addKey: ADD_KEY,
    me: ME,
    product: PRODUCT,
    productDetail: id => {
      if(id) {
        return `/users/product/${id}`;
      } else {
        return PRODUCT_DETAIL;
      }
    },
    userDetail: id => {
        if (id) {
          return `/users/${id}`;
        } else {
          return USER_DETAIL;
        }
    },
    

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
    registerVideoView: REGISTER_VIDEO_VIEW,
    registerPhotoView: REGISTER_PHOTO_VIEW,
    addVideoComment: ADD_COMMENT_VIDEO,

    videoComplain: id => {
      if(id) {
        return `/api/boards/video/${id}/complain`
      } else {
        return VIDEO_COMPLAIN;
      }
    },
    photoComplain: id => {
      if(id) {
        return `/api/boards/photo/${id}/complain`
      } else {
        return PHOTO_COMPLAIN;
      }
    },
    videoComplainPopup: id => {
      if(id) {
        return `/api/boards/video/${id}/complain/popup`
      } else {
        return VIDEO_COMPLAIN_POPUP
      }
    },
    photoComplainPopup: id => {
      if(id) {
        return `/api/boards/photo/${id}/complain/popup`
      } else {
        return PHOTO_COMPLAIN_POPUP
      }
    },
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
    updatePhotoComment: id => {
      if(id) {
        return `/api/${id}/photo/comment/delete`
      } else {
        return UPDATE_COMMENT_PHOTO;
      }
    },
    deletePhotoComment: id => {
      if(id) {
        return `/api/${id}/photo/comment/delete`
      } else {
        return DELETE_COMMENT_PHOTO
      }
    },

    //Global API
    apiHome: API_HOME,
    apiJoin: API_JOIN,
    apiLogin: API_LOGIN,
    apiLogout: API_LOGOUT,
    apiSearch: API_SEARCH,

    //Users
    apiUsers: API_USERS,
    apiUserDetail: id => {
        if (id) {
          return `/api/users/${id}`;
        } else {
          return API_USER_DETAIL;
        }
    },

    apiEditProfile: API_EDIT_PROFILE,
    apiChangePassword: API_CHANGE_PASSWORD,
    apiMe: API_ME,
  
    //Boards
    apiBoards: API_BOARDS,

    apiPhotos: API_PHOTHS,
    apiPhotoUpload: API_PHOTO_UPLOAD,
    apiPhotoDetail: id => {
      if (id) {
        return `/api/boards/photo/${id}`;
      } else {
        return API_PHOTO_DETAIL;
      }
    },
    apiEditPhoto: id => { 
      if(id) {
        return `/api/boards/photo/${id}/edit`
      } else {
        return API_EDIT_PHOTO;
      }
    },
    apiDeletePhoto: id => {
      if(id) {
        return `/api/boards/photo/${id}/delete`
      } else {
        return API_DELETE_PHOTO
      }
    },

    apiVideos: API_VIDEOS,
    apiVideoUpload: API_VIDEO_UPLOAD,
    apiVideoDetail: id => {
      if (id) {
        return `/api/boards/video/${id}`;
      } else {
        return API_VIDEO_DETAIL;
      }
    },
    apiEditVideo: id => { 
      if(id) {
        return `/api/boards/video/${id}/edit`
      } else {
        return API_EDIT_VIDEO;
      }
    },
    apiDeleteVideo: id => {
      if(id) {
        return `/api/boards/video/${id}/delete`
      } else {
        return API_DELETE_VIDEO
      }
    },
};

export default routes;

