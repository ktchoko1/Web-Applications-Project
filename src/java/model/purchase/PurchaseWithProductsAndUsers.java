/*
 This class will be good for web user update - provides a single web user plus the list of user Roles (for pick list).
 */
package model.purchase;

public class PurchaseWithProductsAndUsers {

    public StringData purchase = new StringData();
    public model.product.StringDataList prodSDL = new model.product.StringDataList();
    public model.webUser.StringDataList webUserSDL = new model.webUser.StringDataList();

}
