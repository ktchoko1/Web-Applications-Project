function login(email, password){
    var target = document.getElementById("content"); //replace the whole content
    
    ajax("webAPIs/logonAPI.jsp?email=" + email + "&password=" + password, loginSuccess, loginError);
    
    function loginSuccess(httpRequest){
        var obj = JSON.parse(httpRequest.responseText);
        if (obj.dbError.length > 0){
            target.innerHTML = "Error logging in: " + obj.dbError;
        } else if (obj.webUserList.length === 0){
            target.innerHTML = "No matching user with given credentials found!";
        } else {
            target.innerHTML = "Logged in! You are: " + obj.webUserList[0].userEmail;
        }
    }
    
    function loginError(httpRequest){
        target.innerHTML = "Error trying to make the API call: " + httpRequest.errorMsg;
    }
    
}

 
 
 
