import axios from "axios";


const startDate = document.getElementById('datepicker1');
const endDate = document.getElementById('datepicker2');
const dateSend = document.getElementById('jsDateSend');
const productId = window.location.href.split('/product/')[1];


const sendDate = () => {
    console.log(startDate.value);
    console.log(endDate.value);
    console.log(productId)
    if(startDate.value && endDate.value) {
        axios.post(`/users/product/${productId}`, {
            data: {
                start: startDate.value,
                end: endDate.value
            }
        })
            .then(response => {
                console.log(response);
            })
    } else {
        window.alert('날짜를 선택해주세요.');
    }
}

function init() {
    dateSend.addEventListener('click', sendDate);
}

if(startDate) {
    init()
}