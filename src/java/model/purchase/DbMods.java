package model.purchase;

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

         
        // Validation
       // errorMsgs.userEmail = ValidationUtils.stringValidationMsg(inputData.userEmail, 45, true);
       // errorMsgs.userPassword = ValidationUtils.stringValidationMsg(inputData.userPassword, 45, true);
        errorMsgs.purchaseQty = ValidationUtils.integerValidationMsg(inputData.purchaseQty, true);
        errorMsgs.purchaseDate = ValidationUtils.dateValidationMsg(inputData.purchaseDate, false);
        errorMsgs.webUserId = ValidationUtils.integerValidationMsg(inputData.webUserId, true);
        errorMsgs.productId = ValidationUtils.integerValidationMsg(inputData.productId, true);

        return errorMsgs;
    } // validate 

    public static StringData insert(StringData inputData, DbConn dbc) {

        StringData errorMsgs = new StringData();
        errorMsgs = validate(inputData);
        if (errorMsgs.getCharacterCount() > 0) {  // at least one field has an error, don't go any further.
            errorMsgs.errorMsg = "Please try again";
            return errorMsgs;

        } else { // all fields passed validation

            
            // Start preparing SQL statement
            String sql = "INSERT INTO purchase_t (purchase_qty, purchase_date, web_user_id, product_id) "
                    + "values (?,?,?,?)";

            // PrepStatement is Sally's wrapper class for java.sql.PreparedStatement
            // Only difference is that Sally's class takes care of encoding null 
            // when necessary. And it also System.out.prints exception error messages.
            PrepStatement pStatement = new PrepStatement(dbc, sql);

            // Encode string values into the prepared statement (wrapper class).
           // pStatement.setInt(1, inputData.purchaseId); // string type is simple
            //pStatement.setInt(1, inputData.purchaseQty); 
            pStatement.setInt(1, ValidationUtils.integerConversion(inputData.purchaseQty));
            pStatement.setDate(2, ValidationUtils.dateConversion(inputData.purchaseDate));
            pStatement.setInt(3, ValidationUtils.integerConversion(inputData.webUserId));
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
                    errorMsgs.errorMsg = numRows + " records were inserted when exactly 1 was expected.";
                }
            } else if (errorMsgs.errorMsg.contains("foreign key")) {
                errorMsgs.errorMsg = "Invalid web User Id";
            } else if (errorMsgs.errorMsg.contains("foreign key")) {
                errorMsgs.errorMsg = "Invalid product Id";
            }

        } // customerId is not null and not empty string.
        return errorMsgs;
    } // insert
    
      public static String delete(String purchaseId, DbConn dbc) {

        if (purchaseId == null) {
            return "Programmer error: cannot attempt to delete web_user record that matches null user id";
        }

        // This method assumes that the calling Web API (JSP page) has already confirmed 
        // that the database connection is OK. BUT if not, some reasonable exception should 
        // be thrown by the DB and passed back anyway... 
        String result = ""; // empty string result means the delete worked fine.
        try {

            String sql = "DELETE FROM purchase_t WHERE purchase_id = ?";

            // This line compiles the SQL statement (checking for syntax errors against your DB).
            PreparedStatement pStatement = dbc.getConn().prepareStatement(sql);

            // Encode user data into the prepared statement.
            pStatement.setString(1, purchaseId);

            int numRowsDeleted = pStatement.executeUpdate();

            if (numRowsDeleted == 0) {
                result = "Programmer Error: did not delete the record with web_user_id " + purchaseId;
            } else if (numRowsDeleted > 1) {
                result = "Programmer Error: > 1 record deleted. Did you forget the WHERE clause?";
            }

        } catch (Exception e) {
            result = "Exception thrown in model.purchase.DbMods.delete(): " + e.getMessage();
            if (result.contains("foreign key")) {
                result = "Cannot delete user " + purchaseId + " because that user already posted reviews.";
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

            /*
                String sql = "SELECT web_user_id, user_email, user_password, membership_fee, birthday, "+
                    "web_user.user_role_id, user_role_type "+
                    "FROM web_user, user_role where web_user.user_role_id = user_role.user_role_id " + 
                    "ORDER BY web_user_id ";
             */

            String sql = "UPDATE purchase_t SET purchase_qty=?, purchase_date=?, web_user_id=?, product_id=? "+
                    "WHERE purchase_id = ?";

            // PrepStatement is Sally's wrapper class for java.sql.PreparedStatement
            // Only difference is that Sally's class takes care of encoding null 
            // when necessary. And it also System.out.prints exception error messages.
            PrepStatement pStatement = new PrepStatement(dbc, sql);

            // Encode string values into the prepared statement (wrapper class).
             
            pStatement.setInt(1, ValidationUtils.integerConversion(inputData.purchaseQty));
            pStatement.setDate(2, ValidationUtils.dateConversion(inputData.purchaseDate));
            pStatement.setInt(3, ValidationUtils.integerConversion(inputData.webUserId));
            pStatement.setInt(4, ValidationUtils.integerConversion(inputData.productId));
            pStatement.setInt(5, ValidationUtils.integerConversion(inputData.purchaseId));

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
                errorMsgs.errorMsg = "Invalid User Id or product";
            } else if (errorMsgs.errorMsg.contains("Duplicate entry")) {
                errorMsgs.errorMsg = "That email address is already taken";
            }

        } // customerId is not null and not empty string.
        return errorMsgs;
    } // update


} // class