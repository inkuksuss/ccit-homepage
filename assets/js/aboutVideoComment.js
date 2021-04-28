import axios from "axios";

const addCommentForm = document.getElementById("jsAddComment");
const commentList = document.getElementById("jsCommentList");
const commentNumber = document.getElementById("jsCommentNumber");
const deleteCommentForms = document.querySelectorAll('.jsDeleteComment');
const updateCommentForms = document.querySelectorAll('.jsUpdateComment');

let loggedUser;
let loggedUserName;
let videoCreator;

const increaseNumber = () => {
    commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) + 1;
};

const reloadPage = () => {
    window.location.reload();
};

const addComment = comment => {
    const li = document.createElement("li");
    const span = document.createElement("span");
    const link = document.createElement("a");
    const reloadBtn = document.createElement('button');
    const icon = document.createElement('i');
    span.innerHTML = comment;
    link.innerHTML = loggedUserName;
    link.setAttribute("href",`/users/${loggedUser}`);
    li.append(span, link, reloadBtn);
    icon.classList.add("fas", "fa-sync-alt")
    reloadBtn.appendChild(icon);
    reloadBtn.addEventListener('click', reloadPage);
    commentList.prepend(li); 
    increaseNumber();
};

const sendComment = async (comment) => {
    const videoId = window.location.href.split("/boards/video/")[1];
    const response = await axios({
        url: `/api/${videoId}/video/comment/add`,
        method: "POST",
        data: {
            comment,
            displayName: loggedUserName
        }
    });
    if (response.status === 200) {
        addComment(comment);
    }
};

const handleSubmit = event => {
    event.preventDefault();
    const commentInput = addCommentForm.querySelector("input");
    const comment = commentInput.value;
    sendComment(comment);
    commentInput.value = "";
};


function addInit() {
    addCommentForm.addEventListener("submit", handleSubmit);
};

const deleteComment = async(commentId) => {
    const videoId = window.location.href.split("/boards/video/")[1];
    await axios({
        url: `/api/${videoId}/video/comment/delete`,
        method: "POST",
        data: {
            commentId
        }
    });
}

const handleDelete = (event) => {
    event.preventDefault();
    const commentInput = event.target.querySelector(".jsDeleteInput");
    const commentId = commentInput.value;
    event.currentTarget.parentNode.remove();
    deleteComment(commentId);
}


function deleteInit() {
    for(let i = 0; i < deleteCommentForms.length; i++) {
        deleteCommentForms[i].addEventListener("submit", handleDelete);
    };
}

const updateComment = (comment, commentId) => {
    const inputContainer = document.querySelectorAll('.jsUpdateTarget');
    for(let i = 0; i < inputContainer.length; i++) {
        if(inputContainer[i].value === commentId) {
            const targetInput = inputContainer[i];
            const form = targetInput.parentNode;
            const li = form.parentNode;
            li.firstChild.innerHTML = `${comment}`;
        };
    };
}

const sendUpdate = async (comment, commentId) => {
    const videoId = window.location.href.split("/boards/video/")[1];
    const response = await axios({
        url: `/api/${videoId}/video/comment/update`,
        method: "POST",
        data: {
            comment,
            commentId
        }
    });
    if (response.status === 200) {
        updateComment(comment,commentId);
    }
};

const handleUpdate = (event) => {
    event.preventDefault();
    const updateInput = event.target.querySelector('.jsUpdateInput');
    const updateTarget = event.target.querySelector('.jsUpdateTarget');
    updateInput.classList.toggle("visible");
    const comment = updateInput.value;
    const commentId = updateTarget.value;
    if(comment) {
        sendUpdate(comment, commentId);
    }
};

function updateInit() {
    for(let i = 0; i < updateCommentForms.length; i++) {
        updateCommentForms[i].addEventListener("submit", handleUpdate);
    };
};

const authenticationUser = async() => {
    const url = window.location.href;
    try {
        await axios.post(url)
        .then(res => {
            loggedUser = res.data.loggedUser;
            loggedUserName = res.data.loggedUserName;
            videoCreator = res.data.videoCreator;
        })
    } catch(err) {
        console.log(err);
    }
    if(loggedUser && videoCreator && loggedUserName) { 
        addInit();
        deleteInit();
        updateInit();
    }
};

if(addCommentForm){
    authenticationUser();
}