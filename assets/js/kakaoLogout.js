// import axios from 'axios';

// const logoutBtn = document.getElementById("jsKakaoLogout");

// const logout = async (user) => {
//     await axios({
//         method: "POST",
//         url: 'http://localhost:4000/logout/v1/user/unlink',
//         headers: {
//             Authorization: `KakaoAK ${process.env.KAKAO_CLIENT_ADMIN}`
//         },
//         data: {
//             target_id: user
//         }
//     })
// };

// const handleClick = event => {
//     event.preventDefault();
//     logout();
// }

// function init(res) {
//     logoutBtn.addEventListener('click', logout);
//     console.log(res);
// }


// if(logoutBtn) {
//     init();
// };
