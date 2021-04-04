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
const WATER = "/:id/water";
const EAT = "/:id/eat";
const CART = "/:id/cart";

// Boards
const BOARDS = "/boards";
const UPLOAD = "/upload";
const BOARD_DETAIL = "/:id";
const EDIT_BOARD = "/:id/edit";
const DELETE_BOARD = "/:id/delete";

// Shop
const SHOP = "/shop";
const SHOP_DETAIL = "/shop/:item";

// Social Login
const GOOGLE = "/auth/google";
const GOOGLE_CALLBACK = "/auth/google/callback";
const KAKAO = "/auth/kakao";
const KAKAO_CALLBACK = "/auth/kakao/callback";
const KAKAO_LOGOUT = "auth/kakao/logout";

const API = "/api";
const REGISTER_VIEW = "/:id/view";
const ADD_COMMENT = "/:id/comment";

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
    water: WATER,
    eat: EAT,
    cart: CART,

    //Boards
    boards: BOARDS,
    upload: UPLOAD,
    boardDetail: id => {
        if (id) {
          return `/boards/${id}`;
        } else {
          return BOARD_DETAIL;
        }
    },

    editBoard: id => {
      if(id) {
        return `/boards/${id}/edit`
      } else {
        return EDIT_BOARD;
      }
    },

    deleteBoard: id => {
      if(id) {
        return `/boards/${id}/delete`
      } else {
        return DELETE_BOARD
      }
    },

    // Shop
    shop: SHOP,
    shopDetail: SHOP_DETAIL,

    // Social Login
    google: GOOGLE,
    googleCallback: GOOGLE_CALLBACK,
    kakao: KAKAO,
    kakaoCallback: KAKAO_CALLBACK,
    kakaoLogout: KAKAO_LOGOUT,
    api: API,
    registerView: REGISTER_VIEW,
    addComment: ADD_COMMENT
};

export default routes;

