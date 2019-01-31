package model.product;

import dbUtils.*;
import java.sql.PreparedStatement;
//import java.sql.PreparedStatement;
//import java.sql.ResultSet;

public class DbMods {

    /*
    Returns a "StringData" object that is full of field level validation
    error messages (or it is full of all empty strings if inputData
    totally passed validation.  
     */
    private static StringData validate(StringData inputData) {

        StringData errorMsgs = new StringData();

        errorMsgs.productDesc = ValidationUtils.stringValidationMsg(inputData.productDesc,45, true);
        errorMsgs.productPrice = ValidationUtils.decimalValidationMsg(inputData.productPrice, false);
        errorMsgs.productImage = ValidationUtils.stringValidationMsg(inputData.productImage,45, false);

        return errorMsgs;
    } // validate 

    public static StringData insert(StringData inputData, DbConn dbc) {

        StringData errorMsgs = new StringData();
        errorMsgs = validate(inputData);
        if (errorMsgs.getCharacterCount() > 0) {  // at least one field has an error, don't go any further.
            errorMsgs.errorMsg = "Please try again";
            return errorMsgs;

        } else {  
            // Start preparing SQL statement
            String sql = "INSERT INTO product_t (product_desc, product_price, product_image) "
                    + "values (?,?,?)";

            
            PrepStatement pStatement = new PrepStatement(dbc, sql);

            // Encode string values into the prepared statement (wrapper class).
            pStatement.setString(1, inputData.productDesc); // string type is simple
            pStatement.setBigDecimal(2, ValidationUtils.decimalConversion(inputData.productPrice));
            pStatement.setString(3, inputData.productImage);
             

            // here the SQL statement is actually executed
            int numRows = pStatement.executeUpdate();

            // This will return empty string if all went well, else all error messages.
            errorMsgs.errorMsg = pStatement.getErrorMsg();
            if (errorMsgs.errorMsg.length() == 0) {
                if (numRows == 1) {
                    errorMsgs.errorMsg = ""; // This means SUCCESS. Let the user interface decide how to tell this to the user.
                } else {
                    // probably never get here unless you forgot your WHERE clause and did a bulk sql update.
                    errorMsgs.errorMsg = numRows + " records were inserted when exactly 1 was expected.";
                }
            } /*else if (errorMsgs.errorMsg.contains("foreign key")) {
                errorMsgs.errorMsg = "Invalid U Id";
            }  */

        } // customerId is not null and not empty string.
        return errorMsgs;
    } // insert
    
    public static String delete(String productId, DbConn dbc) {

        if (productId == null) {
            return "Programmer error: cannot attempt to delete web_user record that matches null user id";
        }

        // This method assumes that the calling Web API (JSP page) has already confirmed 
        // that the database connection is OK. BUT if not, some reasonable exception should 
        // be thrown by the DB and passed back anyway... 
        String result = ""; // empty string result means the delete worked fine.
        try {

            String sql = "DELETE FROM product_t WHERE product_id = ?";

            // This line compiles the SQL statement (checking for syntax errors against your DB).
            PreparedStatement pStatement = dbc.getConn().prepareStatement(sql);

            // Encode user data into the prepared statement.
            pStatement.setString(1, productId);

            int numRowsDeleted = pStatement.executeUpdate();

            if (numRowsDeleted == 0) {
                result = "Programmer Error: did not delete the record with product_id " + productId;
            } else if (numRowsDeleted > 1) {
                result = "Programmer Error: > 1 record deleted. Did you forget the WHERE clause?";
            }

        } catch (Exception e) {
            result = "Exception thrown in model.webUser.DbMods.delete(): " + e.getMessage();
            if (result.contains("foreign key")) {
                result = "Cannot delete user " + productId + " because that user already posted reviews.";
            }
        }

        return result;
    } // delete
     public static StringData update(StringData inputData, DbConn dbc) {

        StringData errorMsgs = new StringData();
        errorMsgs = validate(inputData);
        if (errorMsgs.getCharacterCount() > 0) {  // at least one field has an error, don't go any further.
            errorMsgs.errorMsg = "Please try again";
            return errorMsgs;

        } else { // all fields passed validation

            String sql = "UPDATE product_t SET product_desc=?, product_price=?, product_image=? "+
                    "WHERE product_id = ? "; 
 

             
            PrepStatement pStatement = new PrepStatement(dbc, sql);

            // Encode string values into the prepared statement (wrapper class).
            pStatement.setString(1, inputData.productDesc); // string type is simple
            pStatement.setBigDecimal(2, ValidationUtils.decimalConversion(inputData.productPrice));
            pStatement.setString(3, inputData.productImage);
            pStatement.setInt(4, ValidationUtils.integerConversion(inputData.productId));

            // here the SQL statement is actually executed
            int numRows = pStatement.executeUpdate();

            // This will return empty string if all went well, else all error messages.
            errorMsgs.errorMsg = pStatement.getErrorMsg();
            if (errorMsgs.errorMsg.length() == 0) {
                if (numRows == 1) {
                    errorMsgs.errorMsg = ""; // This means SUCCESS. Let the user interface decide how to tell this to the user.
                } else {
                    // probably never get here unless you forgot your WHERE clause and did a bulk sql update.
                    errorMsgs.errorMsg = numRows + " records were updated (expected to update one record).";
                }
            } else if (errorMsgs.errorMsg.contains("foreign key")) {
                errorMsgs.errorMsg = "Invalid User Role Id";
            } else if (errorMsgs.errorMsg.contains("Duplicate entry")) {
                errorMsgs.errorMsg = "That email address is already taken";
            }

        } // customerId is not null and not empty string.
        return errorMsgs;
    } // update
    

} // class