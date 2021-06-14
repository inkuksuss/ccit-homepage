import axios from "axios";

const startDate = document.getElementById('datepicker1');
const endDate = document.getElementById('datepicker2');
const dateSend = document.getElementById('jsDateSend');
const DateBox = document.querySelector('.jsDateBox')
const allData = document.getElementById('jsAllData');
const dataBody = document.querySelector('.Data__body');
const addBtnBox = document.getElementById('Data__button');
const newDataChartBox = document.getElementById('jsNewDataChartBox');
const oldDataChartBox = document.getElementById('jsDefaultDataChartBox');
const sortTimeBtn = document.getElementById('jsSortTime');
const sortGiveBtn = document.getElementById('jsSortGive');
const sortRestBtn = document.getElementById('jsSortRest');
const sortWeightBtn = document.getElementById('jsSortWeg');

const sortDataDefault = document.getElementById('Data__body__sort__default');
const sortDataTime = document.getElementById('Data__body__sort__time');
const sortDataGive = document.getElementById('Data__body__sort__give');
const sortDataWeight = document.getElementById('Data__body__sort__weight');
const sortDataRest = document.getElementById('Data__body__sort__rest');

const WegIcon = document.getElementById('jsWegIcon');
const GiveIcon = document.getElementById('jsGiveIcon');
const RestIcon = document.getElementById('jsRestIcon');
const TimeIcon = document.getElementById('jsTimeIcon');

const oldChartCtx = document.getElementById('myChart');


const productId = window.location.href.split('/product/')[1];
let n = 2;

let sortBool = {
    time: false,
    weg: false,
    give: false,
    rest: false
};
const { weg, time, give, rest } = sortBool; 

const changeRestIcon = () => {
    if(RestIcon.classList[1] === 'fa-caret-down'){
        RestIcon.classList.replace('fa-caret-down', 'fa-caret-up');
    } else {
        RestIcon.classList.replace('fa-caret-up', 'fa-caret-down');
    }
};

const changeTimeIcon = () => {
    if(TimeIcon.classList[1] === 'fa-caret-down'){
        TimeIcon.classList.replace('fa-caret-down', 'fa-caret-up');
    } else {
        TimeIcon.classList.replace('fa-caret-up', 'fa-caret-down');
    }
};

const changeWegIcon = () => {
    if(WegIcon.classList[1] === 'fa-caret-down'){
        WegIcon.classList.replace('fa-caret-down', 'fa-caret-up');
    } else {
        WegIcon.classList.replace('fa-caret-up', 'fa-caret-down');
    }
};

const changeGiveIcon = () => {
    if(GiveIcon.classList[1] === 'fa-caret-down'){
        GiveIcon.classList.replace('fa-caret-down', 'fa-caret-up');
    } else {
        GiveIcon.classList.replace('fa-caret-up', 'fa-caret-down');
    }
};

const deleteOld = () => {
    if(sortDataDefault.hasChildNodes()) {
        while(sortDataDefault.hasChildNodes()) {
            sortDataDefault.removeChild(sortDataDefault.firstChild)
        }
    } else if(sortDataRest.hasChildNodes()) {
        while(sortDataRest.hasChildNodes()) {
            sortDataRest.removeChild(sortDataRest.firstChild)
        }
    } else if(sortDataWeight.hasChildNodes()) {
        while(sortDataWeight.hasChildNodes()) {
            sortDataWeight.removeChild(sortDataWeight.firstChild)
        }
    } else if(sortDataGive.hasChildNodes()) {
        while(sortDataGive.hasChildNodes()) {
            sortDataGive.removeChild(sortDataGive.firstChild)
        }
    } else if(sortDataTime.hasChildNodes()) {
        while(sortDataTime.hasChildNodes()) {
            sortDataTime.removeChild(sortDataTime.firstChild)
        }
    }
};

function mapingIndex(sorting, what) {
    deleteOld();
    if(sorting.length > 10) {
        sorting.slice(0, 10 * n).map(res => {
            const year = res.time.split('T')[0]
            const hours = res.time.split('T')[1]
            const hour = hours.split('.000Z')[0]
            const index = document.createElement('div');
            const giveData = document.createElement('div');
            const restData = document.createElement('div');
            const weightData = document.createElement('div');
            const timeData = document.createElement('div');
            index.setAttribute('class', 'Data__Box__index');
            giveData.innerHTML = `${res.amount}`;
            timeData.innerHTML = `${year} | ${hour}`;
            restData.innerHTML = `${res.rest}`;
            weightData.innerHTML = `${res.weg}`;
            index.append(timeData, giveData, restData, weightData);
            if(what === "rest") {
                sortDataRest.append(index);
            } else if(what === "give") {
                sortDataGive.append(index);
            } else if(what === "weg") {
                sortDataWeight.append(index);
            } else {
                sortDataTime.append(index);
            }
        });
        const addBtn = document.createElement('button');
        addBtn.style.width = "80%";
        const btnSpan = document.createElement('span');
        addBtn.append(btnSpan);
        btnSpan.innerHTML = '<i class="fas fa-plus"></i>'
        if(addBtnBox.hasChildNodes()){
            addBtnBox.removeChild(addBtnBox.firstChild);
        }
        addBtnBox.append(addBtn);
        addBtn.addEventListener('click', () => {
            n += 1;
            sorting.slice((10 * n) + 1, 10 * (n+1)).map(res => {
                const addYear = res.time.split('T')[0]
                const addHours = res.time.split('T')[1]
                const addHour = addHours.split('.000Z')[0]
                const addIndex = document.createElement('div');
                const addGiveData = document.createElement('div');
                const addRestData = document.createElement('div');
                const addWeightData = document.createElement('div');
                const addTimeData = document.createElement('div');
                addIndex.setAttribute('class', 'Data__Box__index');
                addTimeData.innerHTML = `${addYear} | ${addHour}`;
                addGiveData.innerHTML = `${res.amount}`;
                addRestData.innerHTML = `${res.rest}`;
                addWeightData.innerHTML = `${res.weg}`;
                addIndex.append(addTimeData, addGiveData, addRestData, addWeightData);
                if(what === "rest") {
                    sortDataRest.append(addIndex);
                } else if(what === "give") {
                    sortDataGive.append(addIndex);
                } else if(what === "weg") {
                    sortDataWeight.append(addIndex);
                } else {
                    sortDataTime.append(addIndex);
                }
            });
        });
    }
}

const sortingRest = () => {
    changeRestIcon();
    sortBool.rest = !(sortBool.rest);
    sortBool = {...sortBool, weg:false, give:false, time:false}
    const Data = JSON.parse(allData.value)
    if(sortBool.rest) {
        const desSort = Data.sort((start, end) => { // 내림차순
            if(start.rest > end.rest) {
                return 1;
            } else if(start.rest < end.rest) {
                return -1;
            } else {
                return 0;
            }
        })
        mapingIndex(desSort, "rest")
    } else {
        const ascSort = Data.sort((start, end) => { // 내림차순
            if(start.rest > end.rest) {
                return -1;
            } else if(start.rest < end.rest) {
                return 1;
            } else {
                return 0;
            }
        })
        mapingIndex(ascSort, "rest")
    }
};

const sortingGive = () => {
    changeGiveIcon();
    sortBool.give = !(sortBool.give);
    sortBool = {...sortBool, weg:false, time:false, rest:false}
    const Data = JSON.parse(allData.value)
    if(sortBool.give) {
        const desSort = Data.sort((start, end) => { // 내림차순
            if(start.amount > end.amount) {
                return 1;
            } else if(start.amount < end.amount) {
                return -1;
            } else {
                return 0;
            }
        })
        mapingIndex(desSort, "give")
    } else {
        const ascSort = Data.sort((start, end) => { // 내림차순
            if(start.amount > end.amount) {
                return -1;
            } else if(start.amount < end.amount) {
                return 1;
            } else {
                return 0;
            }
        })
        mapingIndex(ascSort, "give")
    }
};

const sortingWeight = () => {
    changeWegIcon();
    sortBool.weg = !(sortBool.weg);
    sortBool = {...sortBool, time:false, give:false, rest:false}
    const Data = JSON.parse(allData.value)
    if(sortBool.weg) {
        const desSort = Data.sort((start, end) => { // 내림차순
            if(start.weg > end.weg) {
                return 1;
            } else if(start.weg < end.weg) {
                return -1;
            } else {
                return 0;
            }
        })
        mapingIndex(desSort, "weg")
    } else {
        const ascSort = Data.sort((start, end) => { // 내림차순
            if(start.weg > end.weg) {
                return -1;
            } else if(start.weg < end.weg) {
                return 1;
            } else {
                return 0;
            }
        })
        mapingIndex(ascSort, "weg")
    }
};

const sortingTime = () => {
    changeTimeIcon()
    sortBool.time = !(sortBool.time);
    sortBool = {...sortBool, weg:false, give:false, rest:false}
    const Data = JSON.parse(allData.value)
    if(sortBool.time) {
        const desSort = Data.sort((start, end) => { // 내림차순
            if(start.time > end.time) {
                return 1;
            } else if(start.time < end.time) {
                return -1;
            } else {
                return 0;
            }
        })
        mapingIndex(desSort, "time")
    } else {
        const ascSort = Data.sort((start, end) => { // 내림차순
            if(start.time > end.time) {
                return -1;
            } else if(start.time < end.time) {
                return 1;
            } else {
                return 0;
            }
        })
        mapingIndex(ascSort, "time")
    }
};

function sortBtnEvent() {
    sortTimeBtn.addEventListener('click', sortingTime);
    sortWeightBtn.addEventListener('click', sortingWeight);
    sortGiveBtn.addEventListener('click',sortingGive);
    sortRestBtn.addEventListener('click', sortingRest);
}

const createDefaultData = (Data) => {
    if(Data.length > 10) {
        Data.slice(0, 10 * n).map(res => {
            const year = res.time.split('T')[0]
            const hours = res.time.split('T')[1]
            const hour = hours.split('.000Z')[0]
            const index = document.createElement('div');
            const giveData = document.createElement('div');
            const restData = document.createElement('div');
            const weightData = document.createElement('div');
            const timeData = document.createElement('div');
            index.setAttribute('class', 'Data__Box__index');
            giveData.innerHTML = `${res.amount}`;
            timeData.innerHTML = `${year} | ${hour}`;
            restData.innerHTML = `${res.rest}`;
            weightData.innerHTML = `${res.weg}`;
            index.append(timeData, giveData, restData, weightData);
            sortDataDefault.append(index);
            dataBody.append(sortDataDefault);
        });
        const addBtn = document.createElement('button');
        addBtn.style.width = "80%";
        const btnSpan = document.createElement('span');
        addBtn.append(btnSpan);
        btnSpan.innerHTML = '<i class="fas fa-plus"></i>'
        addBtnBox.append(addBtn);
        addBtn.addEventListener('click', () => {
            n += 1;
            Data.slice((10 * n) + 1, 10 * (n+1)).map(res => {
                const addYear = res.time.split('T')[0]
                const addHours = res.time.split('T')[1]
                const addHour = addHours.split('.000Z')[0]
                const addIndex = document.createElement('div');
                const addGiveData = document.createElement('div');
                const addRestData = document.createElement('div');
                const addWeightData = document.createElement('div');
                const addTimeData = document.createElement('div');
                addIndex.setAttribute('class', 'Data__Box__index');
                addGiveData.innerHTML = `${res.amount}`;
                addTimeData.innerHTML = `${addYear} | ${addHour}`;
                addRestData.innerHTML = `${res.rest}`;
                addWeightData.innerHTML = `${res.weg}`;
                addIndex.append(addTimeData, addGiveData, addRestData, addWeightData);
                sortDataDefault.append(addIndex);
            });
        });
    }
}


if(allData) {
    sortBtnEvent()
    const Data = JSON.parse(allData.value)
    if(!weg && !time && !give && !rest) {
        createDefaultData(Data);
    }
} 



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
                    data: { success, DateBox: chartDateBox, amount, rest: postRest, weight, allDataList }
                } = response;
                if(success && DateBox && allDataList && amount && rest && weight) {
                    if(oldDataChartBox.hasChildNodes()) {
                        while(oldDataChartBox.hasChildNodes()){
                            oldDataChartBox.removeChild(oldDataChartBox.firstChild);
                        }
                        deleteOld();
                    }
                    sortBtnEvent();
                    createDefaultData(allDataList);
                    if(amount.length >= 1 && weight.length >= 1 && rest.length >= 1) {
                        newDataChartBox.style.display = "block"
                        const newChart = document.createElement('canvas');
                        newChart.setAttribute('id', 'newPostChart');
                        newDataChartBox.append(newChart);
                        const chartCtx = document.getElementById('newPostChart').getContext('2d');
                        const postNewMyChart = new Chart(chartCtx, {
                            data: {
                                labels: chartDateBox,
                                datasets: [{
                                    type: 'line',
                                    label: '지급량',
                                    data: amount,
                                    borderColor: 'rgb(255, 99, 132)',
                                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                                }, {
                                    type: 'line',
                                    label: '잔량',
                                    data: postRest,
                                    borderColor: 'rgb(120, 159, 132)',
                                    backgroundColor: 'rgba(225, 129, 172, 0.2)'
                                }, {
                                    type: 'bar',
                                    label: '몸무게',
                                    data: rest,
                                    borderColor: 'rgb(12, 19, 232)',
                                    backgroundColor: 'rgba(25, 129, 12, 0.2)'
                                }]
                            },
                            options: {
                                responsive: false
                            }
                        });
                    } else {
                        alert('데이터가 충분하지 않습니다.');
                    }
                } else {
                    alert('데이터가 존재하지 않습니다.');
                }
            })
    } else {
        window.alert('날짜를 선택해주세요.');
    }
};

function init() {
    dateSend.addEventListener('click', sendDate);
};

if(startDate) {
    init()
};