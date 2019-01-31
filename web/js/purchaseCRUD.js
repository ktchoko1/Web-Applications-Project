
var purchaseCRUD = {}; // globally available object


(function () {  // This is an IIFE, an immediately executing (anonymous) function
    //alert("I am an IIFE!");

    purchaseCRUD.startInsert = function () {

        ajax('htmlPartials/insertUpdatePurchase.html', setInsertUI, 'content');


        function setInsertUI(httpRequest) {

            // Place the inserttUser html snippet into the content area.
            console.log("Ajax call was successful.");
            document.getElementById("content").innerHTML = httpRequest.responseText;
            document.getElementById("insertSavePurchaseButton").style.display = "inline";
            document.getElementById("updateSavePurchaseButton").style.display = "none";
            document.getElementById("purchaseIdRow").style.display = "none";

            ajax("webAPIs/listUsersAPI.jsp", setRolePickList, "webUserIdError");
            ajax("webAPIs/listProductsAPI.jsp", setRolePickList, "productId.Error");

            function setRolePickList(httpRequest) {

                console.log("setRolePickList was called, see next line for object holding list of roles");
                var jsonObj = JSON.parse(httpRequest.responseText); // convert from JSON to JS Object.
                console.log(jsonObj);


                if (jsonObj.dbError.length > 0) {

                    if (jsonObj.webUserList.webUserId === null) {
                        document.getElementById("webUserIdError").innerHTML = jsonObj.dbError;
                    } else {
                        document.getElementById("webUserIdError").innerHTML = jsonObj.dbError;
                        document.getElementById("productIdError").innerHTML = jsonObj.dbError;
                        return;
                    }
                }


                // function makePickList(list, keyProp, valueProp, selectListId) {
                makePickList(jsonObj.webUserList, "webUserId", "userEmail", "rolePickList");
                // console.log();
                makePickList(jsonObj.productList, "productId", "productDesc", "rolePickList2");
            }

        }
    };
function getPurchaseDataFromUI() {

        var ddList = document.getElementById("rolePickList");
        var ddList1 = document.getElementById("rolePickList2");

        // strip $ and commas from dollar amount before trying to encode user data for update.
       // var dollar = stripDollar(document.getElementById("membershipFee").value);

        // create a user object from the values that the user has typed into the page.
        var purchaseInputObj = {
            "purchaseId": document.getElementById("purchaseId").value,
            "purchaseQty": document.getElementById("purchaseQty").value,
            "purchaseDate": document.getElementById("purchaseDate").value,
            

            // Modification here for role pick list
            "webUserId": ddList.options[ddList.selectedIndex].value,

            "userEmail": ddList.options[ddList.selectedIndex].value,
           
            
            "productId": ddList1.options[ddList1.selectedIndex].value,

            "productDesc": ddList1.options[ddList1.selectedIndex].value,

            
            "errorMsg": ""
            
        };

        console.log(purchaseInputObj);

        // build the url for the ajax call. Remember to escape the user input object or else 
        // you'll get a security error from the server. JSON.stringify converts the javaScript
        // object into JSON format (the reverse operation of what gson does on the server side).
        return escape(JSON.stringify(purchaseInputObj));
    }

    function writeErrorObjToUI(jsonObj) {
        console.log("here is JSON object (holds error messages.");
        console.log(jsonObj);

        document.getElementById("purchaseQtyError").innerHTML = jsonObj.purchaseQty;
        document.getElementById("purchaseDateError").innerHTML = jsonObj.purchaseDate;
        document.getElementById("webUserIdError").innerHTML = jsonObj.webUserId;
        document.getElementById("productIdError").innerHTML = jsonObj.productId;
        
        document.getElementById("recordError").innerHTML = jsonObj.errorMsg;
    }


    purchaseCRUD.insertSave = function () {

        console.log("purchaseCRUD.insertSave was called");

        var ddList = document.getElementById("rolePickList");
        var ddList1 = document.getElementById("rolePickList2");


        // create a user object from the values that the user has typed into the page.
        var purchaseInputObj = {
            "purchaseId": "",
            "purchaseQty": document.getElementById("purchaseQty").value,
            "purchaseDate": document.getElementById("purchaseDate").value,
            "webUserId": ddList.options[ddList.selectedIndex].value,
            "userEmail":ddList.options[ddList.selectedIndex].value,
            "productId": ddList1.options[ddList1.selectedIndex].value,
            "productDesc":ddList1.options[ddList1.selectedIndex].value,
            "errorMsg": ""


        };
        console.log(purchaseInputObj);

        // build the url for the ajax call. Remember to escape the user input object or else
        // you'll get a security error from the server. JSON.stringify converts the javaScript
        // object into JSON format (the reverse operation of what gson does on the server side).
        var myData = escape(JSON.stringify(purchaseInputObj));
        var url = "webAPIs/insertPurchaseAPI.jsp?jsonData=" + myData;
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


            document.getElementById("purchaseQtyError").innerHTML = jsonObj.purchaseQty;
            document.getElementById("purchaseDateError").innerHTML = jsonObj.purchaseDate;
            document.getElementById("webUserIdError").innerHTML = jsonObj.webUserId;
            document.getElementById("productIdError").innerHTML = jsonObj.productId;


            if (jsonObj.errorMsg.length === 0) { // success
                jsonObj.errorMsg = "Record successfully inserted !!!";
            }
            document.getElementById("recordError").innerHTML = jsonObj.errorMsg;
        }
    };


    purchaseCRUD.delete = function (purchaseId, icon) {
        // clear out any old error msg (non-breaking space)
        document.getElementById("listMsg").innerHTML = "&nbsp;";

        if (confirm("Do you really want to delete user " + purchaseId + "? ")) {

            // Calling the DELETE API.
            var url = "webAPIs/deletePurchaseAPI.jsp?deleteId=" + purchaseId;
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

                    document.getElementById("listMsg").innerHTML = "Purchases " + purchaseId + " deleted.";
                }
            }
        }
    };

    purchaseCRUD.list = function () {

        document.getElementById("content").innerHTML = "";
        var dataList = document.createElement("div");
        dataList.id = "dataList"; // set the id so it matches CSS styling rule.
        dataList.innerHTML = "<h2>Add Purchases <img src='icons/insert.png' onclick='purchaseCRUD.startInsert();'/></h2>" +
                "<div id='listMsg'>&nbsp;</div>";
        document.getElementById("content").appendChild(dataList);


        ajax('webAPIs/listPurchasesAPI.jsp', setListUI, 'dataList');

        function setListUI(httpRequest) {

            console.log("starting purchaseCRUD.list (setListUI) with this httpRequest object (next line)");
            console.log(httpRequest);

            var obj = JSON.parse(httpRequest.responseText);

            if (obj === null) {
                dataList.innerHTML = "listPurchasesResponse Error: JSON string evaluated to null.";
                return;
            }

            for (var i = 0; i < obj.purchaseList.length; i++) {

                // add a property to each object in webUserList - a span tag that when clicked
                // invokes a JS function call that passes in the web user id that should be deleted
                // from the database and a reference to itself (the span tag that was clicked)
                var id = obj.purchaseList[i].purchaseId;
                obj.purchaseList[i].delete = "<img src='icons/delete.png'  onclick='purchaseCRUD.delete(" + id + ",this)'  />";

                obj.purchaseList[i].update = "<img onclick='purchaseCRUD.startUpdate(" + id + ")' src='icons/update.png' />";

                
            }

            // buildTable Parameters:
            // First:  array of objects that are to be built into an HTML table.
            // Second: string that is database error (if any) or empty string if all OK.
            // Third:  reference to DOM object where built table is to be stored.
            buildTable(obj.purchaseList, obj.dbError, dataList);
        }
    };

    // user has clicked on an update icon from the web_user list UI.
// inject the insert/update web_user UI into the content area and pre-fill
// that with the web_user data exracted from the database.
    purchaseCRUD.startUpdate = function (purchaseId) {

        console.log("startUpdate");

        // make ajax call to get the insert/update user UI
        ajax('htmlPartials/insertUpdatePurchase.html', setUpdateUI, "content");

        // place the insert/update user UI into the content area
        function setUpdateUI(httpRequest) {
            console.log("Ajax call was successful.");
            document.getElementById("content").innerHTML = httpRequest.responseText;

            document.getElementById("insertSavePurchaseButton").style.display = "none";
            document.getElementById("updateSavePurchaseButton").style.display = "inline";

            // Call the Get User by id API and (if success), fill the UI with the User data
            ajax("webAPIs/getPurchaseByIdAPI.jsp?id=" + purchaseId, displayPurchase, "recordError");

            function displayPurchase(httpRequest) {
                var obj = JSON.parse(httpRequest.responseText);
                console.log(obj);
                if (obj.purchase.errorMsg.length > 0) {
                    document.getElementById("recordError").innerHTML = "Database error: " +
                            obj.purchase.errorMsg;
                } else if (obj.purchase.purchaseId.length < 1) {
                    document.getElementById("recordError").innerHTML = "There is no user with id '" +
                            purchaseId + "' in the database";
                } else if (obj.webUserSDL.dbError.length > 0) {                    //document.getElementById("purchaseId").value = purchaseObj.purchaseId;

                    document.getElementById("recordError").innerHTML += "<br/>Error extracting the user List options from the database: " +
                            obj.webUserSDL.dbError;
                } else if (obj.prodSDL.dbError.length > 0) {
                    document.getElementById("recordError").innerHTML += "<br/>Error extracting the product List options from the database: " +
                            obj.prodSDL.dbError;
                } else {
                    var purchaseObj = obj.purchase;
                    
                    document.getElementById("purchaseId").value = purchaseObj.purchaseId;
                    document.getElementById("purchaseQty").value = purchaseObj.purchaseQty;
                    document.getElementById("purchaseDate").value = purchaseObj.purchaseDate;
                   
                  
                  console.log(obj.webUserSDL.webUserList);
                     
                    makePickList(obj.webUserSDL.webUserList, // list of key/value objects for role pick list
                   
                            "webUserId", // key property name
                            "userEmail", // value property namE
                            "rolePickList", // id of dom element where to put role pick list
                            purchaseObj.webUserId); // key to be selected (role id fk in web_user object)

                    console.log(purchaseObj.productId);
                    makePickList(obj.prodSDL.productList, // list of key/value objects for role pick list
                            "productId", // key property name
                            "productDesc", // value property name
                            "rolePickList2", // id of dom element where to put role pick list
                            purchaseObj.productId); // key to be selected (role id fk in web_user object)
                }
            }
        } // setUpdateUI
    };

    purchaseCRUD.updateSave = function () {

        console.log("purchaseCRUD.updateSave was called");
        var myData = getPurchaseDataFromUI();
        var url = "webAPIs/updatePurchaseAPI.jsp?jsonData=" + myData;
        ajax(url, processUpdate, "recordError");

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


}());  // the end of the IIFE