/* eslint-disable no-restricted-globals */
/* eslint-disable object-shorthand */
/* eslint-disable no-alert */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-vars */
import axios from "axios";

// 해당 태그 설정을 위해 지정
const addPhotoCommentForm = document.getElementById("jsAddPhotoComment");
const commentPhotoList = document.getElementById("jsCommentPhotoList");
const commentPhotoNumber = document.getElementById("jsCommentPhotoNumber");
const deletePhotoCommentForms = document.querySelectorAll('.jsDeletePhotoComment');
const updatePhotoCommentForms = document.querySelectorAll('.jsUpdatePhotoComment');
const photoComplainBtn = document.getElementById('jsPhotoComplain');
const photoId = window.location.href.split("/boards/photo/")[1];

let loggedUser;
let loggedUserName;

const photoComplain = async() => {
    try {
        const userId = loggedUser;
        const photosId = window.location.href.split('/photo/')[1];
        const response = await axios(`/api/boards/photo/${userId}/complain`, {
            method: 'POST',
            data: {
                photosId
            }
        })
        const options = 'width=400, height=500, left=0, top=400, resizable = yes'
        if(response.data.success){
            window.open(`/api/boards/photo/${photosId}/complain/popup`,"popup", options)
        } else {
            alert('이미 신고하신 게시물입니다.');
        }
    } catch(err) {
        console.log(err);
    }
};

function photoComplainInit() {
    photoComplainBtn.addEventListener('click', photoComplain);
}

const increasePhotoNumber = () => { // 댓글 갯수를 추가 해주는 함수
    commentPhotoNumber.innerHTML = parseInt(commentPhotoNumber.innerHTML, 10) + 1;
};

const decreasePhotoNumber = () => { // 댓글 갯수를 줄여주는 함수
    commentPhotoNumber.innerHTML = parseInt(commentPhotoNumber.innerHTML, 10) - 1;
};

// 추가
const reloadPhotoPage = () => { // 페이지 리다이렉트
    window.location.reload();
};

// 댓글을 추가해주는 함수
const addPhotoComment = comment => {
    const li = document.createElement("li");
    const span = document.createElement("span");
    const link = document.createElement("a");
    const reloadBtn = document.createElement('button');
    const icon = document.createElement('i'); // 관련 태그들 지정
    span.innerHTML = comment; // comment 변수 span 태그에 넣기
    link.innerHTML = loggedUserName; // 클릭시 해당 유저정보로 가기위해 유저정보를 포함한 링크 생성
    link.setAttribute("href",`/users/${loggedUser}`); // link에 동적 속성 추가
    li.append(span, link, reloadBtn); // 자식요소로 해당 변수들을 추가
    icon.classList.add("fas", "fa-sync-alt") // 자바스크립트를 이용해 클래스명 추가
    reloadBtn.appendChild(icon); // 리로드 버튼 자식요소로 추가
    reloadBtn.addEventListener('click', reloadPhotoPage); // 클릭시 콜백함수를 실행하는 이벤트 추가
    commentPhotoList.prepend(li); //li 태그를 이용하여 정렬
    increasePhotoNumber(); 
};

const sendPhotoComment = async (comment) => {
    const response = await axios({ // axios를 이용하여 url 서버로 데이터를 전송함
        url: `/api/${photoId}/photo/comment/add`,
        method: "POST",
        data: {
            comment,
            displayName: loggedUserName
        }
    });
    if (response.status === 200) {
        addPhotoComment(comment); // 인증된다면 함수 실행
    }
};

const handlePhotoSubmit = event => {
    event.preventDefault(); // 이벤트 발생을 막아 페이지 리다이렉트 방지
    const commentInput = addPhotoCommentForm.querySelector("input"); // 인풋태그 지정
    const comment = commentInput.value;
    if(loggedUser){
        sendPhotoComment(comment);
        commentInput.value = ""; // 로그인 유저가 있다면 해당 comment 내용 매개변수로 전달
    } else {
        alert("로그인 후 작성 가능합니다.");
        commentInput.value = ""; // 로그인 유저가 없다면 알림 발생
    }
};


function addPhotoInit() {
    addPhotoCommentForm.addEventListener("submit", handlePhotoSubmit); // form에서 인풋 전송시 이벤트 발생
};

//삭제
const deletePhotoComment = async(commentId) => {
    await axios({ // 해당 Url 서버에 데이터 전송
        url: `/api/${photoId}/photo/comment/delete`,
        method: "POST",
        data: {
            commentId
        }
    });
}

const handlePhotoDelete = (event) => {
    event.preventDefault(); // 이벤트 발생 방지 
    const commentInput = event.target.querySelector(".jsDeletePhotoInput"); // 해당 클래스 선택
    const commentId = commentInput.value; // 해당 인풋값 저장
    event.currentTarget.parentNode.remove(); // 이벤트 받은 타켓에 부모요소 삭제
    deletePhotoComment(commentId); // 해당 함수로 위에 저장한 변수 전송
    decreasePhotoNumber(); 
}


function deletePhotoInit() {
    for(const deletePhotoCommentForm of deletePhotoCommentForms) { // 댓글의 갯수가 여러개이므로 각각 해당 이벤트 추가
        deletePhotoCommentForm.addEventListener("submit", handlePhotoDelete);
    };
};

// 수정
const updatePhotoComment = (comment, commentId) => {
    const inputContainer = document.querySelectorAll('.jsUpdatePhotoTarget'); // 클래스 지정
    for(const input of inputContainer) { // 해당 input에 각각의 제공
        if(input.value === commentId) {
            const targetInput = input; // 해당 요소의 동적 태그를 생성해줌
            const form = targetInput.parentNode;
            const li = form.parentNode;
            li.firstChild.innerHTML = `${comment}`;
        };
    };
};

const sendPhotoUpdate = async (comment, commentId) => {
    const response = await axios({ // 해당 서버에 데이터 전송
        url: `/api/${photoId}/photo/comment/update`,
        method: "POST",
        data: {
            comment,
            commentId
        }
    });
    if (response.status === 200) {
        updatePhotoComment(comment,commentId);
    }
};

const handlePhotoUpdate = (event) => {
    event.preventDefault();
    const updateInput = event.target.querySelector('.jsUpdatePhotoInput');
    const updateTarget = event.target.querySelector('.jsUpdatePhotoTarget');
    updateInput.classList.toggle("visible"); // 업데이트 버튼을 토글방식으로 사용가능
    const comment = updateInput.value; // input 데이터
    const commentId = updateTarget.value; // Input에 지정된 value값
    if(comment) {
        if(confirm("정말 수정하시겠습니까?")) { // 수정시 확인란을 만들기
            sendPhotoUpdate(comment, commentId);
            updateInput.value = "";
        }
    };
};

function updatePhotoInit() {
    for(const updatePhotoCommentForm of updatePhotoCommentForms) { // 여러개인 댓글 각각의 이벤트 적용
        updatePhotoCommentForm.addEventListener("submit", handlePhotoUpdate);
    };
};

const authenticationPhotoUser = async() => {
    const url = window.location.href; // 페이지 url가져오기
    try {
        await axios.post(url) // 해당 url 서버로 데이터 받아오기
        .then(res => {
            loggedUser = res.data.loggedUser;
            loggedUserName = res.data.loggedUserName;
        })
    } catch(err) {
        alert("로그인 유저 정보를 가져올 수 없습니다"); // 에러 핸들링
        console.log(err);
    } finally {
        addPhotoInit(); // 아래 함수 실행
        deletePhotoInit();
        updatePhotoInit();
    }
};

const registerPhotoView = () => {
    fetch(`/api/photo/${photoId}/view`, { // fetch를 이용하여 해당 서버에서 데이터 전송
        method: "POST"
    });
};

function checkCookie() {
    if(!document.cookie.split(';').some(item => item.includes(photoId))) {
        registerPhotoView();
        document.cookie = `${photoId}=true`;
    }; // 쿠키를 이용하여 한 접속자가 여러번 조회수를 올리는 버그를 방지
};

if(addPhotoCommentForm){ // html 문서에 해당 페이지가 있다면 해당 파일 실행
    authenticationPhotoUser();
    checkCookie();
    if(photoComplainBtn){
        photoComplainInit();
    }
}