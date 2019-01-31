/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


  function toggleSubMenu(ele) {
                console.log("current element is " + ele.innerHTML);

                var subs = ele.getElementsByClassName("submenu");

                if (subs.length > 0) {
                    var submenu = subs[0]; // get first submenu
                    console.log("submenu is " + submenu.innerHTML);

                    if (submenu.style.display === "block") {
                        submenu.style.display = "none";
                    } else {
                        submenu.style.display = "block";
                    }
                } else {
                    console.log("this element does not have any children with class 'submenu'. ");
                }
            }