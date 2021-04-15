import axios from "axios";

const addCommentForm = document.getElementById("jsAddComment");
const commentList = document.getElementById("jsCommentList");
const commentNumber = document.getElementById("jsCommentNumber");

const increaseNumber = () => {
    commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) + 1;
};

const addComment = comment => {
    const li = document.createElement("li");
    const span = document.createElement("span");
    // const updateIcon = document.createElement("span");
    // const deleteIcon = document.createElement("span");
    span.innerHTML = comment;
    // updateIcon.innerHTML = '<i class="fas fa-pen"></i>';
    // deleteIcon.innerHTML = '<i class="far fa-times-circle"></i>';
    li.appendChild(span);
    commentList.prepend(li);
    increaseNumber();
};

const sendComment = async (comment) => {
    const videoId = window.location.href.split("/boards/")[1];
    const response = await axios({
        url: `/api/${videoId}/comment`,
        method: "POST",
        data: {
            comment
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

function init() {
    addCommentForm.addEventListener("submit", handleSubmit);
};

if (addCommentForm) {
    init();
}