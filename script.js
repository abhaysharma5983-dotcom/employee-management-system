// ============================================
// EMPLOYEE MANAGEMENT SYSTEM
// script.js - Part 1
// ============================================


// ==============================
// LOADER
// ==============================

window.addEventListener("load", () => {

    const loader = document.getElementById("loader");

    setTimeout(() => {

        loader.style.opacity = "0";

        loader.style.visibility = "hidden";

    }, 1000);

});


// ==============================
// LIVE CLOCK
// ==============================

const liveClock = document.getElementById("liveClock");

function updateClock() {

    const now = new Date();

    const options = {

        hour: "2-digit",

        minute: "2-digit",

        second: "2-digit"

    };

    liveClock.textContent =
        now.toLocaleTimeString("en-IN", options);

}

updateClock();

setInterval(updateClock, 1000);



// ==============================
// LOCAL STORAGE
// ==============================

let employees =
JSON.parse(localStorage.getItem("employees")) || [];

let editIndex = -1;



// ==============================
// HTML ELEMENTS
// ==============================

const employeeForm =
document.getElementById("employeeForm");

const employeeTableBody =
document.getElementById("employeeTableBody");

const emptyState =
document.getElementById("emptyState");

const totalEmployees =
document.getElementById("totalEmployees");

const totalDepartments =
document.getElementById("totalDepartments");

const averageSalary =
document.getElementById("averageSalary");

const highestSalary =
document.getElementById("highestSalary");



// ==============================
// SAVE DATA
// ==============================

function saveEmployees() {

    localStorage.setItem(

        "employees",

        JSON.stringify(employees)

    );

}



// ==============================
// DASHBOARD UPDATE
// ==============================

function updateDashboard() {

    totalEmployees.textContent =
    employees.length;

    const departments =
    [...new Set(

        employees.map(emp => emp.department)

    )];

    totalDepartments.textContent =
    departments.length;

    if (employees.length === 0) {

        averageSalary.textContent = "₹0";

        highestSalary.textContent = "₹0";

        return;

    }

    let total = 0;

    let highest = 0;

    employees.forEach(emp => {

        total += Number(emp.salary);

        if (Number(emp.salary) > highest) {

            highest = Number(emp.salary);

        }

    });

    averageSalary.textContent =
    "₹" +
    Math.round(total / employees.length);

    highestSalary.textContent =
    "₹" + highest;

}
// ============================================
// EMPLOYEE REGISTRATION
// script.js - Part 2
// ============================================


// ==============================
// REGISTER EMPLOYEE
// ==============================

employeeForm.addEventListener("submit", function (e) {

    e.preventDefault();

    const name =
        document.getElementById("employeeName").value.trim();

    const email =
        document.getElementById("employeeEmail").value.trim();

    const department =
        document.getElementById("department").value;

    const position =
        document.getElementById("position").value.trim();

    const salary =
        document.getElementById("salary").value;

    const photoInput =
        document.getElementById("photo");



    // Validation

    if (

        name === "" ||

        email === "" ||

        department === "" ||

        position === "" ||

        salary === ""

    ) {

        showToast("Please fill all required fields.", "error");

        return;

    }



    // Default Image

    let image = "images/default.png";



    // If Photo Selected

    if (photoInput.files.length > 0) {

        const reader = new FileReader();

        reader.onload = function (event) {

            image = event.target.result;

            saveEmployee(image);

        };

        reader.readAsDataURL(photoInput.files[0]);

    }

    else {

        saveEmployee(image);

    }

});



// ==============================
// SAVE EMPLOYEE
// ==============================

function saveEmployee(image) {

    const employee = {

        id:

        editIndex === -1

            ? Date.now()

            : employees[editIndex].id,

        name:

        document.getElementById("employeeName").value.trim(),

        email:

        document.getElementById("employeeEmail").value.trim(),

        department:

        document.getElementById("department").value,

        position:

        document.getElementById("position").value.trim(),

        salary:

        Number(

            document.getElementById("salary").value

        ),

        image: image

    };



    if (editIndex === -1) {

        employees.push(employee);

        showToast("Employee Registered Successfully");

    }

    else {

        employees[editIndex] = employee;

        editIndex = -1;

        showToast("Employee Updated Successfully");

    }



    saveEmployees();

    updateDashboard();

    renderEmployees();

    employeeForm.reset();

}
// ============================================
// EMPLOYEE TABLE
// script.js - Part 3
// ============================================


// ==============================
// RENDER EMPLOYEES
// ==============================

function renderEmployees(data = employees) {

    employeeTableBody.innerHTML = "";

    if (data.length === 0) {

        emptyState.style.display = "block";

        return;

    }

    emptyState.style.display = "none";

    data.forEach((employee, index) => {

        employeeTableBody.innerHTML += `

        <tr>

            <td>${employee.id}</td>

            <td>

                <img src="${employee.image}" alt="Employee">

            </td>

            <td>${employee.name}</td>

            <td>${employee.email}</td>

            <td>${employee.department}</td>

            <td>${employee.position}</td>

            <td>₹${employee.salary}</td>

            <td>

                <button

                    class="action-btn edit-btn"

                    onclick="editEmployee(${index})">

                    <i class="fa-solid fa-pen"></i>

                </button>

                <button

                    class="action-btn delete-btn"

                    onclick="deleteEmployee(${index})">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </td>

        </tr>

        `;

    });

}



// ==============================
// DELETE EMPLOYEE
// ==============================

function deleteEmployee(index) {

    const confirmDelete = confirm(

        "Are you sure you want to delete this employee?"

    );

    if (!confirmDelete) return;

    employees.splice(index, 1);

    saveEmployees();

    updateDashboard();

    renderEmployees();

    showToast("Employee Deleted Successfully");

}



// ==============================
// EDIT EMPLOYEE
// ==============================

function editEmployee(index) {

    editIndex = index;

    const employee = employees[index];

    document.getElementById("employeeName").value =
        employee.name;

    document.getElementById("employeeEmail").value =
        employee.email;

    document.getElementById("department").value =
        employee.department;

    document.getElementById("position").value =
        employee.position;

    document.getElementById("salary").value =
        employee.salary;

    window.scrollTo({

        top: document.getElementById("register").offsetTop - 80,

        behavior: "smooth"

    });

}



// ==============================
// FIRST LOAD
// ==============================

updateDashboard();

renderEmployees();
// ============================================
// SEARCH • FILTER • SORT • PAGINATION
// script.js - Part 4
// ============================================


// ==============================
// HTML ELEMENTS
// ==============================

const searchInput =
document.getElementById("searchInput");

const filterDepartment =
document.getElementById("filterDepartment");

const sortEmployees =
document.getElementById("sortEmployees");

const prevPage =
document.getElementById("prevPage");

const nextPage =
document.getElementById("nextPage");

const pageNumber =
document.getElementById("pageNumber");


// ==============================
// PAGINATION
// ==============================

let currentPage = 1;

const rowsPerPage = 5;


// ==============================
// GET FILTERED DATA
// ==============================

function getFilteredEmployees() {

    let filtered = [...employees];

    // Search

    const keyword =
    searchInput.value.toLowerCase().trim();

    if (keyword !== "") {

        filtered = filtered.filter(emp =>

            emp.name.toLowerCase().includes(keyword)

        );

    }

    // Department Filter

    if (

        filterDepartment.value !== "All"

    ) {

        filtered = filtered.filter(emp =>

            emp.department ===
            filterDepartment.value

        );

    }

    // Sorting

    if (sortEmployees.value === "name") {

        filtered.sort((a, b) =>

            a.name.localeCompare(b.name)

        );

    }

    if (sortEmployees.value === "salary") {

        filtered.sort((a, b) =>

            b.salary - a.salary

        );

    }

    return filtered;

}



// ==============================
// PAGINATION RENDER
// ==============================

function renderPagination() {

    const filtered =
    getFilteredEmployees();

    const totalPages =
    Math.ceil(filtered.length / rowsPerPage) || 1;

    if (currentPage > totalPages) {

        currentPage = totalPages;

    }

    const start =
    (currentPage - 1) * rowsPerPage;

    const end =
    start + rowsPerPage;

    renderEmployees(

        filtered.slice(start, end)

    );

    pageNumber.textContent =
    `Page ${currentPage} of ${totalPages}`;

}



// ==============================
// SEARCH
// ==============================

searchInput.addEventListener("input", () => {

    currentPage = 1;

    renderPagination();

});



// ==============================
// FILTER
// ==============================

filterDepartment.addEventListener("change", () => {

    currentPage = 1;

    renderPagination();

});



// ==============================
// SORT
// ==============================

sortEmployees.addEventListener("change", () => {

    currentPage = 1;

    renderPagination();

});



// ==============================
// NEXT PAGE
// ==============================

nextPage.addEventListener("click", () => {

    const totalPages =

    Math.ceil(

        getFilteredEmployees().length /

        rowsPerPage

    ) || 1;

    if (currentPage < totalPages) {

        currentPage++;

        renderPagination();

    }

});



// ==============================
// PREVIOUS PAGE
// ==============================

prevPage.addEventListener("click", () => {

    if (currentPage > 1) {

        currentPage--;

        renderPagination();

    }

});



// ==============================
// UPDATE TABLE
// ==============================

renderPagination();
// ============================================
// FINAL FEATURES
// script.js - Part 5
// ============================================


// ==============================
// DARK MODE
// ==============================

const themeBtn =
document.getElementById("themeBtn");

const savedTheme =
localStorage.getItem("theme");

if(savedTheme==="dark"){

    document.body.classList.add("dark");

    themeBtn.innerHTML =
    '<i class="fa-solid fa-sun"></i>';

}

themeBtn.addEventListener("click",()=>{

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){

        localStorage.setItem("theme","dark");

        themeBtn.innerHTML =
        '<i class="fa-solid fa-sun"></i>';

    }

    else{

        localStorage.setItem("theme","light");

        themeBtn.innerHTML =
        '<i class="fa-solid fa-moon"></i>';

    }

});



// ==============================
// TOAST NOTIFICATION
// ==============================

function showToast(message,type="success"){

    const container =
    document.getElementById("toastContainer");

    const toast =
    document.createElement("div");

    toast.className =
    `toast ${type}`;

    toast.innerHTML = message;

    container.appendChild(toast);

    setTimeout(()=>{

        toast.remove();

    },3000);

}



// ==============================
// SCROLL TO TOP
// ==============================

const scrollTopBtn =
document.getElementById("scrollTopBtn");

window.addEventListener("scroll",()=>{

    if(window.scrollY>300){

        scrollTopBtn.style.display="flex";

        scrollTopBtn.style.alignItems="center";

        scrollTopBtn.style.justifyContent="center";

    }

    else{

        scrollTopBtn.style.display="none";

    }

});

scrollTopBtn.addEventListener("click",()=>{

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

});



// ==============================
// EXPORT CSV
// ==============================

document
.getElementById("exportCSV")
.addEventListener("click",()=>{

    let csv =
"ID,Name,Email,Department,Position,Salary\n";

    employees.forEach(emp => {

    csv += `${emp.id},${emp.name},${emp.email},${emp.department},${emp.position},${emp.salary}\n`;

});

    const blob =
    new Blob([csv],{

        type:"text/csv"

    });

    const link =
    document.createElement("a");

    link.href =
    URL.createObjectURL(blob);

    link.download =
    "employees.csv";

    link.click();

    showToast("CSV Exported Successfully");

});



// ==============================
// IMPORT JSON
// ==============================

const importBtn =
document.getElementById("importJSON");

const importFile =
document.getElementById("importFile");

importBtn.addEventListener("click",()=>{

    importFile.click();

});

importFile.addEventListener("change",(e)=>{

    const file =
    e.target.files[0];

    if(!file) return;

    const reader =
    new FileReader();

    reader.onload=function(event){

        try{

            const data =
            JSON.parse(event.target.result);

            if(Array.isArray(data)){

                employees = data;

                saveEmployees();

                updateDashboard();

                renderPagination();

                showToast(
                "JSON Imported Successfully"
                );

            }

            else{

                showToast(
                "Invalid JSON File",
                "error"
                );

            }

        }

        catch{

            showToast(
            "Import Failed",
            "error"
            );

        }

    };

    reader.readAsText(file);

});



// ==============================
// FINAL LOAD
// ==============================

updateDashboard();

renderPagination();

showToast(
"Employee Management System Ready"
);