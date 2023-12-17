let serverURL = "http://localhost:3001";
// let serverURL = "https://88b8-115-96-85-55.ngrok-free.app";
let userData = {};
window.onload = () => {
  getAllData();
};

var __ACTION_LIST = {
  ADD: "ADD",
  UPDATE: "UPDATE",
};
var __ACTION = null;

function getFormData() {
  ID = document.getElementById("id").value;
  return {
    id: ID==""?-1:ID,
    name: document.getElementById("name").value,
    date: document.getElementById("date").value,
    status: document.getElementById("status").checked,
  };
}

function refreshData(){
  getAllData();
  showSuccessMessage("User table refreshed");
}

function getAllData() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", `${serverURL}/getdata`);
  xhr.send();
  xhr.responseType = "json";
  xhr.onload = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {
      userData = xhr.response.data;
      rePopulateTable(userData);
    } else {
      console.log(`Error: ${xhr.status}`);
      showFailureMessage(`Error: ${xhr.status}`);
    }
  };
}

function addData() {
  __ACTION = __ACTION_LIST.ADD;
  document.getElementById("action").innerText = __ACTION;
  showModal();
}

function updateData() {
  let selectedRow = document.querySelector(
    'input[name="userSelector"]:checked'
  );
  if (selectedRow == null) {
    showFailureMessage("Select a row to update.");
    return;
  }
  __ACTION = __ACTION_LIST.UPDATE;
  document.getElementById("action").innerText = __ACTION;

  let id = selectedRow.value;
  let user = userData.find( obj=>{
    return obj.id==id;
  } )
  document.getElementById("id").value = id;
  document.getElementById("name").value = user.name;
  document.getElementById("date").value = user.date;
  document.getElementById("status").checked = user.status;

  showModal();
}


function deleteData(){
  let selectedRow = document.querySelector(
    'input[name="userSelector"]:checked'
  );
  if (selectedRow == null) {
    showFailureMessage("Select a row to update.");
    return;
  }
  let id= selectedRow.value;
  const xhr = new XMLHttpRequest();
  xhr.open("DELETE", `${serverURL}/deleteData?id=${id}`);
  xhr.send();
  xhr.responseType = "json";
  xhr.onload = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {
      showSuccessMessage("User ID:"+id+" deleted successfully");
      getAllData();
    } else {
      console.log(`Error: ${xhr.status}`);
      showFailureMessage(`Error: ${xhr.status}`);
    }
  };
}

function submit() {
  let data = getFormData();

  const xhr = new XMLHttpRequest();
  if (__ACTION == __ACTION_LIST.ADD) {
    xhr.open("POST", `${serverURL}/addData`);
  } else if (__ACTION == __ACTION_LIST.UPDATE) {
    xhr.open("POST", `${serverURL}/updateData`);
  } else {
    return;
  }
  
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify(data));
  xhr.responseType = "json";
  xhr.onload = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {
        showSuccessMessage(xhr.response.data.message);
        hideModal();
        getAllData(); 
    } else {
      console.log(`Error: ${xhr.status} \n ${xhr.response}`);
    }
  };
}

function rePopulateTable(data = {}) {
  var table = document.getElementById("userDataTable");
  var tr = table.getElementsByTagName("tr");

  while (tr.length > 1) {
    // console.log(i,tr[1]);
    tr[1].remove();
  }

  for (i = 0; i < data.length; i++) {
    table.innerHTML += `
      <tr onclick="javascript:selectRow(this)">
        <td><input type="radio" name="userSelector" value="${data[i].id}"></td>
        <td>${data[i].id}</td>
        <td>${data[i].name}</td>
        <td>${data[i].date}</td>
        <td>${data[i].status ? "present" : "absent"}</td>
      </tr>
      `;
  }
}
function selectRow(rowElement) {
  rowElement.querySelector("input[type='radio']").checked = true;
}

function showSuccessMessage(msg) {
  var toast = document.getElementsByClassName("toast-success")[0];
  toast.innerText = msg;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
    toast.classList.add("hide");
    setTimeout(() => {
      toast.classList.remove("hide");
    }, 1000);
  }, 4000);
}
function showFailureMessage(msg) {
  var toast = document.getElementsByClassName("toast-failure")[0];
  toast.innerText = msg;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
    toast.classList.add("hide");
    setTimeout(() => {
      toast.classList.remove("hide");
    }, 1000);
  }, 4000);
}

function showModal() {
  document.getElementById("modalpop").style.display = "block";
}
function hideModal() {
  document.getElementById("modalpop").style.display = "none";
}
