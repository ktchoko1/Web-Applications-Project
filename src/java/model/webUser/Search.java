package model.webUser;

import dbUtils.*;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class Search {

    public static StringDataList logonFind(DbConn dbc, String email, String password)
  {
    StringDataList sdl = new StringDataList();
    try {
      String sql = "SELECT web_user_id, user_email, user_password, membership_fee, birthday, web_user.user_role_id, "
              + "user_role_type FROM web_user, user_role WHERE web_user.user_role_id = user_role.user_role_id AND user_email = ? AND user_password = ?";
      


      PreparedStatement stmt = dbc.getConn().prepareStatement(sql);
      
      stmt.setString(1, email);
      stmt.setString(2, password);
      
      ResultSet results = stmt.executeQuery();
      if (results.next()) {
        sdl.add(results);
      }
      results.close();
      stmt.close();
    } catch (Exception e) {
      StringData sd = new StringData();
     sd.errorMsg = ("Exception thrown in model.webUser.Search(): " + e.getMessage());
      sdl.add(sd);
    }
    return sdl;
  }
    public static StringData getUserById(DbConn dbc, String id) {

        //PreparedStatement stmt = null;
        //ResultSet results = null;
        StringData sd = new StringData();
        try {
            String sql = "SELECT web_user_id, user_email, user_password, membership_fee, birthday, "
                    + "web_user.user_role_id, user_role_type "
                    + "FROM web_user, user_role WHERE web_user.user_role_id = user_role.user_role_id "
                    + "AND web_user_id = ?";

            PreparedStatement stmt = dbc.getConn().prepareStatement(sql);

            // Encode the id (that the user typed in) into the select statement, into the first 
            // (and only) ? 
            stmt.setString(1, id);

            ResultSet results = stmt.executeQuery();
            if (results.next()) { // id is unique, one or zero records expected in result set
                sd = new StringData(results);
            }
            results.close();
            stmt.close();
        } catch (Exception e) {
            sd.errorMsg = "Exception thrown in WebUserView.getUserById(): " + e.getMessage();
        }
        return sd;
    }
     
     /*public static StringDataList getUserById(DbConn dbc, String id) {

        //PreparedStatement stmt = null;
        //ResultSet results = null;
        StringDataList sdl = new StringDataList();
        try {
          String sql = "SELECT web_user_id, user_email, user_password, membership_fee, birthday, "
                    + "web_user.user_role_id, user_role_type "
                    + "FROM web_user, user_role WHERE web_user.user_role_id = user_role.user_role_id "
                    + "AND web_user_id = ?";


            PreparedStatement stmt = dbc.getConn().prepareStatement(sql);

            // Encode the id (that the user typed in) into the select statement, into the first 
            // (and only) ? 
            stmt.setString(1, id);

            ResultSet results = stmt.executeQuery();
            if (results.next()) { // id is unique, one or zero records expected in result set
                sdl.add(results);
            }
            results.close();
            stmt.close();
        } catch (Exception e) {
            StringData sd = new StringData();
            sd.errorMsg = "Exception thrown in WebUserView.getProductById(): " + e.getMessage();
            sdl.add(sd);
        }
        return sdl;
    }*/

}
