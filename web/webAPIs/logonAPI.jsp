<%@page contentType="application/json" pageEncoding="UTF-8"%> 

<%@page language="java" import="dbUtils.DbConn"%> 
<%@page language="java" import="view.WebUserView"%>
<%@page language="java" import="model.webUser.*"%>
<%@page language="java" import="com.google.gson.*" %>

<%
    StringDataList list = new StringDataList();

    String userEmail = request.getParameter("email");
    String userPassword = request.getParameter("password");
    
    System.out.println("Email: " + userEmail);
    System.out.println(userPassword);
    
    if (userEmail == "" || userEmail == null || userPassword == "" || userPassword == null){
        System.out.println("email and password not provided");
        list.dbError = "Must provide both email and password";
    } else {
        DbConn dbc = new DbConn();
        list.dbError = dbc.getErr();
        
        if (list.dbError.length() == 0){ //no error
            System.out.println("*** Ready to call logonAPI");
            list = Search.logonFind(dbc, userEmail, userPassword);
            session.setAttribute("user", list); //store the session!
        }
        
        dbc.close();
    }
    
    //convert list to JSON
    Gson gson = new Gson();
    out.print(gson.toJson(list).trim());
%>