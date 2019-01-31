<%@page contentType="application/json; charset=UTF-8" pageEncoding="UTF-8"%>
<%@page language="java" import="dbUtils.*" %>
<%@page language="java" import="com.google.gson.*" %>
<%@page language="java" import="model.webUser.*" %>

<%
    StringDataList webUser = (StringDataList) session.getAttribute("user");
    
    if (webUser == null){
        webUser = new StringDataList();
        webUser.dbError = "Profile not found! Please Log on.";
    }
    
    Gson gson = new Gson();
    out.print(gson.toJson(webUser).trim());
%>