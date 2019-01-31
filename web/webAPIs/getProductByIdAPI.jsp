<%@page contentType="application/json; charset=UTF-8" pageEncoding="UTF-8"%> 

<%@page language="java" import="dbUtils.*" %>
<%@page language="java" import="model.product.*" %> 
<%@page language="java" import="view.*" %> 
<%@page language="java" import="com.google.gson.*" %>
<%@page language="java" import="view.ProductView" %> 

<%

   ProductList wurl = new ProductList();
    wurl.product = new StringData();
   /// wurl.prod = new model.product.StringDataList();
    
    String searchId = request.getParameter("id");
    if (searchId == null) {
        wurl.product.errorMsg = "Cannot search for product - 'id' most be supplied as URL parameter";
    } else {

        DbConn dbc = new DbConn();
        wurl.product.errorMsg = dbc.getErr(); // returns "" if connection is good, else db error msg.

        if (wurl.product.errorMsg.length() == 0) { // if got good DB connection,

            System.out.println("*** Ready to call getUserById");
            wurl.product = view.ProductView.getProductById(dbc, searchId);
            
          //  wurl.role= view.RoleView.getAllRoles(dbc); 
        }

        dbc.close(); // EVERY code path that opens a db connection, must also close it - no DB Conn leaks.
    }
    // This object (from the GSON library) can to convert between JSON <-> POJO (plain old java object) 
    Gson gson = new Gson();
    out.print(gson.toJson(wurl).trim());
%>