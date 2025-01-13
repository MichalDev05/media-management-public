const form = document.getElementById('form');


let model;
model = window.location.pathname.split('/')[2];
let id = window.location.pathname.split('/').pop();
    if (id === 'form' || id == model) {
        id = ''
    }

let errorText;

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = {};
    console.log(formData);
    for (const key of formData.keys()) {
        data[key] = formData.get(key);
        if (data[key] === 'on') {
            data[key] = true;
        } else if (data[key] === 'off') {
            data[key] = false;
        }
    }

    console.log(data);
    

    fetch(`/api/${model}/${id}`, {
        method: (id == '')? 'POST' : 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
        if (data.status === 200) {
            errorText.textContent = data.message;
            errorText.style.color = 'green';
        }
        if (data.status === 400) {
            errorText.style.color = 'red';
            errorText.textContent = data.message;
        }
    });
});

getFormData();
function getFormData(){

    fetch(`/api/${model}/form/${id}`)
        .then((response) => response.json())
        .then((data) => {
            createForm(data);
        });
}


function createForm(data) {
    const fields = data.fields;

    form.innerHTML = '';

    if (data.formData === null && id != "") {
        form.innerHTML = '<p class="notFound">ERROR: 404<br> Data Not Found</p>';
        return;
    }

    for (const key in fields) {
        const field = fields[key];
        const fieldData = data.formData ? data.formData[key]: '';
        if (field.type === 'textarea') {
            const fieldHtml =  `
            <div class="form-group">
                <label for="${key}">${field.title}:</label>
                <textarea id="${key}" name="${key}" ${field.editable? "": "readonly"}>${fieldData ? fieldData : ''}</textarea><br>
            </div>`;
            form.innerHTML += fieldHtml;
            continue;
        }

        if (field.type === 'checkbox') {
            const fieldHtml =  `
            <div class="form-group">
                <label for="${key}">${field.title}:</label>
                <input type="checkbox" class="input-checkbox" id="${key}" name="${key}" ${field.editable? "": "readonly"} ${fieldData ? fieldData? "checked": "" : ""}><br>
            </div>`;
            form.innerHTML += fieldHtml;
            continue;
        }
           
        if (field.type === 'date') {
            let date = new Date(fieldData);
            //format date to yyyy-mm-dd
            let formattedDate = date.toISOString().slice(0, 10);
            const fieldHtml =  `
            <div class="form-group">
                <label for="${key}">${field.title}:</label>
                <input type="date" id="${key}" name="${key}" ${field.editable? "": "readonly"} value="${fieldData ? formattedDate : ''}"><br>   
            </div>`;
            form.innerHTML += fieldHtml;
            continue;
        }

        // console.log(fieldsData.data[key]);
        const fieldHtml =  `
            <div class="form-group">
                <label for="${key}">${field.title}:</label>
                <input type="${field.type}" id="${key}" name="${key}"  ${field.editable? "": "readonly"} value="${fieldData ? fieldData : ''}"><br>
            </div>`;
        form.innerHTML += fieldHtml;
    }

    form.innerHTML += '<p id="errorText" style="color: red;"></p>'
    form.innerHTML += `
    <div style="display: flex; justify-content: space-between">
        <button class="saveButton" type="submit">Submit</button>
        ${id == ""? '' : '<button class="deleteButton" id="deleteElement">Delete</button>'}
    </div>
    `;
    errorText = document.getElementById('errorText');

    let deleteButton = document.getElementById('deleteElement');
    if (deleteButton) {
        deleteButton.addEventListener('click', deleteElement);
    }
}

function deleteElement(e){
    e.preventDefault();
    //create alert to confirm delete
    if (!confirm('Are you sure you want to delete this item?')) {
        return;
    }


    let id = window.location.pathname.split('/').pop();
    if (id === 'form' || id == model) {
        id = ''
    }

    fetch(`/api/${model}/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
        if (data.status === 200) {
            errorText.textContent = data.message;
            errorText.style.color = 'green';
        }
        if (data.status === 400) {
            errorText.style.color = 'red';
            errorText.textContent = data.message;
        }
    });
}




