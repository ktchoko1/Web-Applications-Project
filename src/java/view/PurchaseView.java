package view;

// classes imported from java.sql.*
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import model.purchase.*;

// classes in my project
import dbUtils.*;

public class PurchaseView {

    public static StringDataList allPurchasesAPI(DbConn dbc) {

        //PreparedStatement stmt = null;
        //ResultSet results = null;
        StringDataList sdl = new StringDataList();
        try {
            String sql = "SELECT purchase_id, purchase_date, purchase_qty, product_desc, product_price, product_price,  " +
                    "purchase_t.web_user_id, purchase_t.product_id " +
                    "FROM purchase_t, web_user, product_t where purchase_t.product_id = product_t.product_id " +
                    "and purchase_t.web_user_id = web_user.web_user_id " +
                    "ORDER BY purchase_id ";  // you always want to order by something, not just random order.
            PreparedStatement stmt = dbc.getConn().prepareStatement(sql);
            ResultSet results = stmt.executeQuery();
            while (results.next()) {
                sdl.add(results);
            }
            results.close();
            stmt.close();
        } catch (Exception e) {
            StringData sd = new StringData();
            sd.errorMsg = "Exception thrown in purchaseView.allUsersAPI(): " + e.getMessage();
            sdl.add(sd);
        }
        return sdl;
    }
    
     /* public static StringDataList getPurchaseById(DbConn dbc, String id) {

        //PreparedStatement stmt = null;
        //ResultSet results = null;
        StringDataList sdl = new StringDataList();
        try {
           String sql ="SELECT purchase_id, purchase_qty, purchase_date, purchase_t.web_user_id, purchase_t.product_id "+ 
                    "FROM purchase_t " + 
                    "ORDER BY purchase_id ";

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
    public static StringData getPurchaseById(DbConn dbc, String id) {

        //PreparedStatement stmt = null;
        //ResultSet results = null;
        StringData sd = new StringData();
        try {
            String sql ="SELECT purchase_id, purchase_qty, purchase_date, purchase_t.web_user_id, purchase_t.product_id "+ 
                    "FROM purchase_t " + 
                    "WHERE purchase_id = ? ";

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
            sd.errorMsg = "Exception thrown in PurchaseView.getUserById(): " + e.getMessage();
        }
        return sd;
    }

}