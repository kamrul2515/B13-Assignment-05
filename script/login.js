
const loginBtn = document.getElementById("login-btn");
const usernameInput = document.getElementById("input-username");
const pinInput = document.getElementById("input-pin");

// Create error message element
const formBody = document.querySelector(".card-body");
const errorMsg = document.createElement("p");
errorMsg.className = "text-red-500 text-sm mt-2 hidden";
formBody.appendChild(errorMsg);

loginBtn.addEventListener("click", function() {
    const username = usernameInput.value.trim();
    const pin = pinInput.value.trim();

    if(username === "admin" && pin === "admin123") {
        errorMsg.classList.add("hidden");
        window.location.assign("/home.html");
    } else {
        errorMsg.innerText = "Invalid credentials. Please try again.";
        errorMsg.classList.remove("hidden");
    }
});