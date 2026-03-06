document.getElementById("login-btn")
.addEventListener("click", function(){
    // 1.get the username input
    const usernameInput = document.getElementById("input-username");
    const username = usernameInput.value;
    console.log(username);
    // 2. get the pin input
    const inputPin = document.getElementById("input-pin");
    const pin = inputPin.value;
    console.log(pin);
    // 3. match pin and username
    if(username == "admin" && pin =="admin123"){
        // true:::>> alert> homepage
        alert("Login Successfull");

        window.location.assign("/home.html");

    }
    else{
        // false:::>> alert> invalid
        alert("Login Failed");
        return;
    }
});