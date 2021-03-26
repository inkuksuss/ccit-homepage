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
    editBoard: EDIT_BOARD,
    deleteBoard: DELETE_BOARD,

    //Shop
    shop: SHOP,
    shopDetail: SHOP_DETAIL
};

export default routes;

