package model.product;

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

    public String productId = "";
    public String productDesc = "";
    public String productPrice = "";
    public String productImage = "";
    public String errorMsg = "";

    // default constructor leaves all data members with empty string (Nothing null).
    public StringData() {
    }

    // overloaded constructor sets all data members by extracting from resultSet.
    public StringData(ResultSet results) {
        try {
            this.productId = FormatUtils.formatInteger(results.getObject("product_id"));
            this.productDesc = FormatUtils.formatString(results.getObject("product_desc"));
            this.productPrice = FormatUtils.formatDollar(results.getObject("product_price"));
            this.productImage = FormatUtils.formatString(results.getObject("product_image"));
             
        } catch (Exception e) {
            this.errorMsg = "Exception thrown in model.product.StringData (the constructor that takes a ResultSet): " + e.getMessage();
        }
    }

    public int getCharacterCount() {
        String s = this.productId + this.productDesc + this.productPrice+ this.productImage;
        return s.length();
    }

    public String toString() {
        return "Product Id:" + this.productId
                + ", Product Description: " + this.productDesc
                + ", Product Price: " + this.productPrice
                + ", Product Image: " + this.productImage;
                
    }
}
