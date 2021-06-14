import axios from "axios";
import { doc } from 'prettier';


const startDate = document.getElementById('datepicker1');
const endDate = document.getElementById('datepicker2');
const dateSend = document.getElementById('jsDateSend');
const DateBox = document.querySelector('.jsDateBox')
const Amount = document.querySelector('.jsAmount');
const Rest = document.querySelector('.jsRest');
const Weight = document.querySelector('.jsWeight');
const defaultFoodChart = document.getElementById('myChart');
const defaultWeightChart = document.getElementById('myWeight');
const defaultDataChartBox = document.getElementById('jsDefaultDataChartBox');
const newDataChartBox = document.getElementById('jsNewDataChartBox');
const asd = document.getElementById('myFoodChart');
const productId = window.location.href.split('/product/')[1];


const sendDate = () => {
    if(startDate.value && endDate.value) {
        axios.post(`/users/product/${productId}`, {
            data: {
                start: startDate.value,
                end: endDate.value
            }
        })
            .then(response => {
                const { 
                    data: { success, dateBox, amount, rest, weight }
                } = response;
                if(success) {
                    if(document.getElementById('newPostChart')) {
                        const oldChart = document.getElementById('newPostChart')
                        oldChart.remove()
                    }
                    defaultFoodChart.style.display = "none";
                    defaultWeightChart.style.display = "none";
                    newDataChartBox.style.display = "block"
                    const newChart = document.createElement('canvas');
                    newChart.setAttribute('id', 'newPostChart');
                    newDataChartBox.append(newChart)
                    const testChart = document.getElementById('newPostChart').getContext('2d');
                    const postMyChart = new Chart(testChart, {
                        data: {
                            labels: dateBox,
                            datasets: [{
                                type: 'line',
                                label: '지급량',
                                data: amount,
                                borderColor: 'rgb(255, 99, 132)',
                                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            }, {
                                type: 'line',
                                label: '잔량',
                                data: rest,
                                borderColor: 'rgb(120, 159, 132)',
                                backgroundColor: 'rgba(225, 129, 172, 0.2)'
                            }, {
                                type: 'bar',
                                label: '몸무게',
                                data: weight,
                                borderColor: 'rgb(120, 159, 182)',
                                backgroundColor: 'rgba(225, 129, 22, 0.2)'
                            }],
                        },
                        options: {
                            responsive: false
                        }
                    });
                } else {
                    alert('데이터가 존재하지 않습니다.');
                }
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