package model.purchase;

import dbUtils.FormatUtils;
import java.sql.ResultSet;


/* The purpose of this class is just to "bundle together" all the 
 * character data that the user might type in when they want to 
 * add a new Customer or edit an existing customer.  This String
 * data is "pre-validated" data, meaning they might have typed 
 * in a character string where a number was expected.
 * 
 * There are no getter or setter methods since we are not trying to
 * protect this data in any way.  We want to let the JSP page have
 * free access to put data in or take it out. */
public class StringData {

    public String purchaseId = "";
    public String purchaseQty= "";
    public String purchaseDate = "";
    public String webUserId = "";
    public String productId= ""; 
    
    public String errorMsg = "";

    // default constructor leaves all data members with empty string (Nothing null).
    public StringData() {
    }

    // overloaded constructor sets all data members by extracting from resultSet.
    public StringData(ResultSet results) {
        try {
            this.purchaseId = FormatUtils.formatInteger(results.getObject("purchase_id"));
            this.purchaseQty = FormatUtils.formatInteger(results.getObject("purchase_qty"));
            this.purchaseDate = FormatUtils.formatDate(results.getObject("purchase_date"));
            this.webUserId = FormatUtils.formatInteger(results.getObject("web_user_id"));
            this.productId = FormatUtils.formatInteger(results.getObject("product_id"));
             
        } catch (Exception e) {
            this.errorMsg = "Exception thrown in model.purchase.StringData (the constructor that takes a ResultSet): " + e.getMessage();
        }
    }

    public int getCharacterCount() {
        String s = this.purchaseId + this.purchaseQty + this.purchaseDate + this.webUserId
                + this.productId;
        return s.length();
    }

    public String toString() {
        return "Purchase Id:" + this.purchaseId
                + ", Purchase Quantity: " + this.purchaseQty
                + ", Purchase Date: " + this.purchaseDate
                + ", Web User Id: " + this.webUserId
                + ", Product Id: " + this.productId;
                 
    }
}
