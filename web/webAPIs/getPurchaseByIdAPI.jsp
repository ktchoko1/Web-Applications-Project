<%@page import="model.webUser.Search"%>
<%@page contentType="application/json; charset=UTF-8" pageEncoding="UTF-8"%> 
<%@page language="java" import="dbUtils.*" %>
<%@page language="java" import="model.purchase.*" %> 
<%@page language="java" import="view.*" %> 
<%@page language="java" import="com.google.gson.*" %>

<%

    // default constructor creates nice empty StringDataList with all fields "" (empty string, nothing null).
    
    PurchaseWithProductsAndUsers wurl = new PurchaseWithProductsAndUsers();
   
    wurl.purchase = new StringData();
    
    wurl.webUserSDL = new model.webUser.StringDataList();
    wurl.prodSDL = new model.product.StringDataList();
  

    String searchId = request.getParameter("id");
    if (searchId == null) {
        wurl.purchase.errorMsg = "Cannot search for web user - 'id' most be supplied as URL parameter";
       // wurl.prodSDL.dbError = "Cannot search for web user - 'id' most be supplied as URL parameter";
    } else {

        DbConn dbc = new DbConn();
        wurl.purchase.errorMsg = dbc.getErr(); // returns "" if connection is good, else db error msg.
        // wurl.prodSDL.dbError= dbc.getErr();

        if (wurl.purchase.errorMsg.length() == 0){ // if got good DB connection,
                  
            System.out.println("*** Ready to call getUserById");
            System.out.println("*** Ready to call getUserById");
            wurl.purchase = view.PurchaseView.getPurchaseById(dbc, searchId);
            wurl.webUserSDL = view.WebUserView.allUsersAPI(dbc); 
          
        }
           if (wurl.purchase.errorMsg.length() == 0){ // if got good DB connection,
             System.out.println("*** Ready to call getUserById");
            //wurl.P = Search.getUserById(dbc, searchId);

            System.out.println("*** Ready to call getUserById");
            wurl.purchase = view.PurchaseView.getPurchaseById(dbc, searchId);
            wurl.prodSDL= view.ProductView.allProductsAPI(dbc); 
          
        }

        dbc.close(); // EVERY code path that opens a db connection, must also close it - no DB Conn leaks.
    }
    // This object (from the GSON library) can to convert between JSON <-> POJO (plain old java object) 
    Gson gson = new Gson();
    out.print(gson.toJson(wurl).trim());
    //out.print(gson.toJson(wurlb).trim());
%>