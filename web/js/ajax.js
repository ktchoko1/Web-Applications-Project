 
function ajax(url, callBackSuccess, errorId) {

// The httpReq Object is now local to function "ajaxCall" (not global)
    var httpReq;
    if (window.XMLHttpRequest) {
        httpReq = new XMLHttpRequest(); //For Firefox, Safari, Opera
    } else if (window.ActiveXObject) {
        httpReq = new ActiveXObject("Microsoft.XMLHTTP"); //For IE 5+
    } else {
        alert('ajax not supported');
        return;
    }

    console.log("ajax.js: ready to make ajax call to " + url);
    httpReq.open("GET", url); // specify the page you want to GET

    
    httpReq.onreadystatechange = function () {

        // readyState == 4 means that the http request is complete
        if (httpReq.readyState === 4) {
            if (httpReq.status === 200) {
                callBackSuccess(httpReq); // success, call the function that was provided by HTML coder
                
            } else { // status code indicates that ajax call didnt return anything (e.g., bad url, no internet connection) 
                
                // communicate error
                var errorMsg = "ajax.js error (" + httpReq.status + " " + httpReq.statusText +
                        ") while attempting to read '" + url + "'";
                console.log(errorMsg);
                
                if (errorId) { // if the HTML coder passed in an errorId
                    if (document.getElementById(errorId)) { // and if that errorId points to a valid DOM element
                        // place error message into the UI
                        document.getElementById(errorId).innerHTML = errorMsg;
                    } else {
                        alert(errorMsg+" -- and errorId is invalid: "+errorId);
                    }
                } else {
                    alert(errorMsg+" -- and errorId was not supplied");
                }
            }
        }
    }; // end of anonymous function

    httpReq.send(null); // initiate ajax call

} // end function ajax