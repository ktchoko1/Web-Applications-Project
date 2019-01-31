
var productCRUD = {}; // globally available object


(function () {  // This is an IIFE, an immediately executing (anonymous) function
    //alert("I am an IIFE!");

    productCRUD.startInsert = function () {

        ajax('htmlPartials/insertUpdateProduct.html', setInsertUI, 'content');

        function setInsertUI(httpRequest) {

            // Place the inserttUser html snippet into the content area.
            console.log("Ajax call was successful.");
            document.getElementById("content").innerHTML = httpRequest.responseText;
            document.getElementById("insertSaveProductButton").style.display = "inline";
            document.getElementById("updateSaveProductButton").style.display = "none";
            document.getElementById("productIdRow").style.display = "none";

        }
    };
    
     function getProductDataFromUI() {

       // var ddList = document.getElementById("rolePickList");

        // strip $ and commas from dollar amount before trying to encode user data for update.
        var dollar = stripDollar(document.getElementById("productPrice").value);

        // create a user object from the values that the user has typed into the page.
        var productInputObj = {
            "productId": document.getElementById("productId").value,
            "productDesc": document.getElementById("productDesc").value,
            "productImage": document.getElementById("productImage").value,
            "productPrice": dollar,

            "errorMsg": ""
        };

        console.log(productInputObj);

        // build the url for the ajax call. Remember to escape the user input object or else 
        // you'll get a security error from the server. JSON.stringify converts the javaScript
        // object into JSON format (the reverse operation of what gson does on the server side).
        return escape(JSON.stringify(productInputObj));
    }

    function writeErrorObjToUI(jsonObj) {
        console.log("here is JSON object (holds error messages.");
        console.log(jsonObj);

        document.getElementById("productDescError").innerHTML = jsonObj.productDesc;
        document.getElementById("productPriceError").innerHTML = jsonObj.productPrice;
        document.getElementById("productImageError").innerHTML = jsonObj.productImage;
        
        document.getElementById("recordError").innerHTML = jsonObj.errorMsg;
    }



    productCRUD.insertSave = function () {

        console.log("productCRUD.insertSave was called");


         // create a user object from the values that the user has typed into the page.
        var productInputObj = {
            "productId": "",
            "productDesc": document.getElementById("productDesc").value,
            "productPrice": document.getElementById("productPrice").value,
            "productImage": document.getElementById("productImage").value,
            "errorMsg": ""
        };
        console.log(productInputObj);


        // build the url for the ajax call. Remember to escape the user input object or else
        // you'll get a security error from the server. JSON.stringify converts the javaScript
        // object into JSON format (the reverse operation of what gson does on the server side).
        var myData = escape(JSON.stringify(productInputObj));
        var url = "webAPIs/insertProductAPI.jsp?jsonData=" + myData;
        ajax(url, processInsert, "recordError");

        function processInsert(httpRequest) {
            console.log("processInsert was called here is httpRequest.");
            console.log(httpRequest);

            // the server prints out a JSON string of an object that holds field level error
            // messages. The error message object (conveniently) has its fiels named exactly
            // the same as the input data was named.
            var jsonObj = JSON.parse(httpRequest.responseText); // convert from JSON to JS Object.
            console.log("here is JSON object (holds error messages.");
            console.log(jsonObj);


            document.getElementById("productDescError").innerHTML = jsonObj.productDesc;
            document.getElementById("productPriceError").innerHTML = jsonObj.productPrice;
            document.getElementById("productImageError").innerHTML = jsonObj.productImage;

            if (jsonObj.errorMsg.length === 0) { // success
                jsonObj.errorMsg = "Record successfully inserted !!!";
            }
            document.getElementById("recordError").innerHTML = jsonObj.errorMsg;
        }
    };


    productCRUD.delete = function (productId, icon) {
        // clear out any old error msg (non-breaking space)
        document.getElementById("listMsg").innerHTML = "&nbsp;";

        if (confirm("Do you really want to delete user " + productId + "? ")) {

            // Calling the DELETE API.
            var url = "webAPIs/deleteProductAPI.jsp?deleteId=" + productId;
            ajax(url, success, "listMsg");

            function success(http) { // API was successfully called (doesnt mean delete worked)
                var obj = JSON.parse(http.responseText);
                console.log("delete API called with success. next line has the object returned.");
                console.log(obj);
                if (obj.errorMsg.length > 0) {
                    document.getElementById("listMsg").innerHTML = obj.errorMsg;
                } else { // everything good, no error means record was deleted

                    // delete the <tr> (row) of the clicked icon from the HTML table
                    console.log("icon that was passed into JS function is printed on next line");
                    console.log(icon);

                    // icon's parent is cell whose parent is row
                    var dataRow = icon.parentNode.parentNode;
                    var rowIndex = dataRow.rowIndex - 1; // adjust for oolumn header row?
                    var dataTable = dataRow.parentNode;
                    dataTable.deleteRow(rowIndex);

                    document.getElementById("listMsg").innerHTML = "Product " + productId + " deleted.";
                }
            }
        }
    };

    productCRUD.list = function () {

        document.getElementById("content").innerHTML = "";
        var dataList = document.createElement("div");
        dataList.id = "dataList"; // set the id so it matches CSS styling rule.
        dataList.innerHTML = "<h2>Products <img src='icons/insert.png' onclick='productCRUD.startInsert();'/></h2>" +
                "<div id='listMsg'>&nbsp;</div>";
        document.getElementById("content").appendChild(dataList);


        ajax('webAPIs/listProductsAPI.jsp', setListUI, 'dataList');

        function setListUI(httpRequest) {

            console.log("starting productCRUD.list (setListUI) with this httpRequest object (next line)");
            console.log(httpRequest);

            var obj = JSON.parse(httpRequest.responseText);

            if (obj === null) {
                dataList.innerHTML = "listProductsResponse Error: JSON string evaluated to null.";
                return;
            }

            for (var i = 0; i < obj.productList.length; i++) {

                // add a property to each object in webUserList - a span tag that when clicked
                // invokes a JS function call that passes in the web user id that should be deleted
                // from the database and a reference to itself (the span tag that was clicked)
                var id = obj.productList[i].productId;
                obj.productList[i].delete = "<img src='icons/delete.png'  onclick='productCRUD.delete(" + id + ",this)'  />";
                
                  obj.productList[i].update = "<img onclick='productCRUD.startUpdate(" + id + ")' src='icons/update.png' />";

                // remove a property from each object in webUserList
                //   delete obj.productList[i].userPassword2;
            }

             
            buildTable(obj.productList, obj.dbError, dataList);
        }
    };
    
     productCRUD.startUpdate = function (productId) {

        console.log("startUpdate");

        // make ajax call to get the insert/update user UI
        ajax('htmlPartials/insertUpdateProduct.html', setUpdateUI, "content");

        // place the insert/update user UI into the content area
        function setUpdateUI(httpRequest) {
            console.log("Ajax call was successful.");
            document.getElementById("content").innerHTML = httpRequest.responseText;

            document.getElementById("insertSaveProductButton").style.display = "none";
            document.getElementById("updateSaveProductButton").style.display = "inline";

            // Call the Get User by id API and (if success), fill the UI with the User data
            ajax("webAPIs/getProductByIdAPI.jsp?id=" + productId, displayProduct, "recordError");

            function displayProduct(httpRequest) {
                var obj = JSON.parse(httpRequest.responseText);
                console.log(obj.product.errorMsg.length);
                if (obj.product.errorMsg.length > 0) {
                    document.getElementById("recordError").innerHTML = "Database error: " +
                            obj.product.errorMsg;
                } else if (obj.product.productId.length < 1) {
                    document.getElementById("recordError").innerHTML = "There is no user with id '" +
                            productId + "' in the database";
                }else {
                   
                    var productObj = obj.product;
                    console.log(productObj.productDesc);
                    document.getElementById("productId").value = productObj.productId;
                    document.getElementById("productDesc").value = productObj.productDesc;
                    document.getElementById("productPrice").value = productObj.productPrice;
                    document.getElementById("productImage").value = productObj.productImage;
                    
                   
 
                }
            }
        } // setUpdateUI
    };

    productCRUD.updateSave = function () {

        console.log("productCRUD.updateSave was called");
        var myData = getProductDataFromUI();
        var url = "webAPIs/updateProductAPI.jsp?jsonData=" + myData;
        ajax(url, processUpdate, "recordError");
        //console.log(url);

        function processUpdate(httpRequest) {
            console.log("processUpdate was called here is httpRequest.");
            console.log(httpRequest);

            // the server prints out a JSON string of an object that holds field level error 
            // messages. The error message object (conveniently) has its fields named exactly 
            // the same as the input data was named. 
            var jsonObj = JSON.parse(httpRequest.responseText); // convert from JSON to JS Object.
            console.log("here is JSON object (holds error messages.");
            console.log(jsonObj);

            if (jsonObj.errorMsg.length === 0) { // success
                jsonObj.errorMsg = "Record successfully updated !!!";
            }

            writeErrorObjToUI(jsonObj);

        }
    };

    // remove commas and $ from user entered dollar amount.
    // private helper function, availble to any functions in the IIFE
    function stripDollar(dollar) {
        dollar = dollar.replace("$", ""); // replace $ with empty string
        dollar = dollar.replace(",", ""); // replace comma with empty string
        return dollar;
    }


}());  // the end of the IIFE