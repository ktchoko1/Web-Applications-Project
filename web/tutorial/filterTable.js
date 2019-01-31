"use strict";
function FilterTable() {
    var filterTable = {};

    var $ = function (id) {
        return document.getElementById(id);
    };

    filterTable.makeFilter = function (params) {

        params.firstHead = params.firstHead || "Email Address";
        params.secondHead = params.secondHead || "Password ";
        params.thirdHead = params.thirdHead || " Home Address";
        params.fourthHead = params.fourthHead || "Phone Number";
        params.barID = params.barID || "myInput";

        var tableData = params.data;
        var title1 = params.firstHead;
        var title2 = params.secondHead;
        var title3 = params.thirdHead;
        var title4 = params.fourthHead;
        var barID = params.barID;

        var filterObj = $(params.id);

        filterObj.style.borderCollapse = "collapse";
        filterObj.style.width = "100%";
        filterObj.style.border = "1px solid #ddd";
        filterObj.style.fontSize = "18 px";



        var tr = null;
        var td1 = null;
        var td2 = null;
        var td3 = null;
        var td4 = null;


        createTHead();
        displayTable();

        function displayTable() {
            for (var i = 0; i < tableData.length; i++) {

                tr = document.createElement("tr");
                filterObj.appendChild(tr);

                td1 = document.createElement("td");
                tr.appendChild(td1);
                td1.innerHTML = tableData[i].email;

                td2 = document.createElement("td");
                tr.appendChild(td2);
                td2.innerHTML = tableData[i].password;

                td3 = document.createElement("td");
                tr.appendChild(td3);
                td3.innerHTML = tableData[i].address;

                td4 = document.createElement("td");
                tr.appendChild(td4);
                td4.innerHTML = tableData[i].phone;
            }
        }

        function createTHead() {

            var header = document.createElement("thead");
            var tr = document.createElement("tr");
            header.appendChild(tr);
            header.style.backgroundColor = "#f1f1f1";

            filterObj.appendChild(header);

            var th1 = document.createElement("th");
            th1.innerHTML = title1;
            var th2 = document.createElement("th");
            th2.innerHTML = title2;
            var th3 = document.createElement("th");
            th3.innerHTML = title3;
            var th4 = document.createElement("th");
            th4.innerHTML = title4;
            tr.appendChild(th1);
            tr.appendChild(th2);
            tr.appendChild(th3);
            tr.appendChild(th4);


        }



        function dataFilter(inputBar) {

            var input, filter, table, tr, td, i;
            input = document.getElementById(inputBar);
            filter = input.value.toUpperCase();
            table = filterObj;
            tr = table.getElementsByTagName("tr");

            for (i = 0; i < tr.length; i++) {
                td = tr[i].getElementsByTagName("td")[0];
                if (td) {
                    if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
                        tr[i].style.display = "";
                    } else {
                        tr[i].style.display = "none";
                    }
                }
            }
        }


        filterObj.useFilter = function () {
            dataFilter(barID);
        };

        return filterObj;
    };

    return filterTable;
}

