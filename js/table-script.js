const table = document.getElementById('table');
const tableHead = document.getElementById('table_head');
const tableBody = document.getElementById('table_body');

const newItemButton = document.getElementById('newItemButton');
const nextButton = document.getElementById('pageNextBtn');
const previousButton = document.getElementById('pagePrevBtn');


const pagination = 10;
let activePage = 1;
let maxPage = 1;

let model;
model = window.location.pathname.split('/').pop();

getTableData();
function getTableData(){
    fetch(`/api/${model}/table?page=${activePage}&pagination=${pagination}`)
    .then((response) => response.json())
    .then((data) => {
        maxPage = data.paginationInfo.pages;
        createPaginationNumberNav();
        createTableHead(data);
        feedTableData(data);
    });
}

previousButton.addEventListener('click', previousPage);
nextButton.addEventListener('click', nextPage);
newItemButton.addEventListener('click', () => {
    window.location.href = `/form/${model}`;
});


function feedTableData(data){
    tableBody.innerHTML = '';

    let tableData = data.tableData;
    let tableColumns = convertToArray(data.columns);

    console.log(tableData);
    console.log(tableColumns);

    tableData.forEach((item) => {
        const tr = document.createElement('tr');
        tableBody.appendChild(tr);

        tableColumns.forEach((key) => {
            const td = document.createElement('td');

            //Check if data is boolean
            if(typeof item[key.key] === 'boolean'){
                //If boolean, create a checkbox
                // const checkbox = document.createElement('input');
                // checkbox.type = 'checkbox';
                // checkbox.checked = item[key.toLowerCase()];
                // td.appendChild(checkbox);

                //Only emojis checkmark
                td.textContent = item[key.key] ? '✅' : '❌';
            } else {
                //If not boolean, just display the data
                td.textContent = item[key.key];
            }

            td.style.flex = key.width;
            if (key.centered) td.style.textAlign = 'center';
            // if (key.size) td.style.width = key.size + 'px';

            tr.appendChild(td);
        });
        tr.addEventListener('click', () => {
            console.log('Clicked on ' + item._id);
            window.location.href = `/form/${model}/${item._id}`;
        });
    
    });

}


function createTableHead(data) {
    const tableHeadElement = document.createElement('tr');
    tableHead.innerHTML = '';
    tableHead.appendChild(tableHeadElement);

    let tableHeadData = convertToArray(data.columns);

    tableHeadData.forEach((item) => {
        const th = document.createElement('th');
        th.style.flex = item.width;
        th.textContent = item.title;
        tableHeadElement.appendChild(th);
    });
    return tableHeadElement;
}

function nextPage(){
    if(activePage < maxPage){
        activePage++;
        getTableData();
    }
}

function previousPage(){
    if(activePage > 1){
        activePage--;
        getTableData();
    }
}

function createPaginationNumberNav(){
    const pageNumbers = document.getElementById('pageNumbers');
    pageNumbers.innerHTML = '';

    for(let i = 1; i <= maxPage; i++){
        const button = document.createElement('button');
        button.textContent = i;
        button.classList.add('pageNumberBtn');
        if (i === activePage) button.classList.add('activePage');
        button.addEventListener('click', () => {
            activePage = i;
            getTableData();
        });
        pageNumbers.appendChild(button);
    }
}


const convertToArray = (columnsObject) => {
    const columnsArray = Object.keys(columnsObject).map(key => ({
        key: key,
        width: columnsObject[key].width,
        title: columnsObject[key].title,
        centered: columnsObject[key].centered,
        // size: columnsObject[key].size
    }));
    return columnsArray;
};
