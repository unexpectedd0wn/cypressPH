import { Wholesalers } from "../../../support/enums";
import { APIRequests } from "../../../page-objects/api-routes";
import { getItemForTest, addItemAndCheckCartTab, toPlaceTheOrder, toCheckOrderDetails, toCheckOrderHistory } from "../../../support/manualOrderService";


const pharmacyId = Cypress.env("pharmacyId");
const wholesaler = Wholesalers.CLINIGEN.Name;

describe('Manual Orders: United Drug', () => {

    before(() => {
        cy.cleanUpShoppingCart(pharmacyId);
    });

    beforeEach(() => {
        cy.on('uncaught:exception', (err, runnable) => {
            return false
        })
        cy.intercept('/api/stock-product/products?' + '*').as('pageLoaded');
        cy.intercept(APIRequests.request._filter_wholesaler + '*').as('searchWholesaler')
        cy.intercept(APIRequests.request._getShoppingcart + '*').as('shopingCart')
        cy.intercept(APIRequests.request._addItemShoppingCart).as('itemAdded')
        cy.intercept(APIRequests.request._sendOrder).as('sendorder')
        cy.intercept(APIRequests.request._getDataOrderHistoryPage).as('orderHistory')
        cy.intercept('/api/stock-product/products?skip=0&take=25&sortingDirection=1&sortingField=description&filters%5B0%5D.propertyName=IPUCode&filters%5B0%5D.value=*').as('search')
        cy.intercept('/api/stock-product/products?skip=0&take=25&sortingDirection=1&sortingField=description&filters%5B0%5D.propertyName=SearchString&filters%5B0%5D.value'+'*').as('textSearchLoaded')
        cy.fixture("main").then(data => {
            cy.signInCreateSession(data.pharmacyUserEmail, data.pharmacyUserPassword);
        });
    });

    afterEach(() => {
        cy.clearAllCookies();
    });

    
    
    it.only('Order 1 O’NEILLS Item | ULM', () => {
        cy.visitPage("ULM");

        getItemForTest(wholesaler);
        addItemAndCheckCartTab(wholesaler);
        toPlaceTheOrder(wholesaler);

        toCheckOrderDetails(pharmacyId);

        cy.visitPage("Order History");
        toCheckOrderHistory(wholesaler);

    });
});
