import { Wholesalers } from "../../../support/enums";
import { APIRequests } from "../../../page-objects/api-routes";
import { getItemForTest, addItemAndCheckCartTab, toPlaceTheOrder, toCheckOrderDetails, toCheckOrderHistory } from "../../../support/manualOrderService";

const pharmacyId = Cypress.env("pharmacyId");
const wholesaler = Wholesalers.UD.Name;
const wholesalerEl = Wholesalers.UD.secondName;


interface Config{
    enviroment: string,
    baseUrl: string, 
    user: string
    password: string
}

const configs: Config[] = [
    {
    enviroment: 'dev',
    baseUrl: '',
    user: '',
    password: ''
    }
]


    

for (const config of configs) {
    
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
        cy.intercept('/api/stock-product/products?skip=0&take=25&sortingDirection=1&sortingField=description&filters%5B0%5D.propertyName=IPUCode&filters%5B0%5D.value=' + '*' + '&filters%5B0%5D.$type=string&filters%5B0%5D.matchMode=0&filters%5B1%5D.propertyName=wholesalerId&filters%5B1%5D.value=1&filters%5B1%5D.$type=number&filters%5B1%5D.matchMode=0&filters%5B2%5D.propertyName=' + '*' + '&filters%5B2%5D.value=true&filters%5B2%5D.$type=boolean').as('textSearchLoaded')
        cy.fixture("main").then(data => {
            cy.signInCreateSession(data.pharmacyUserEmail, data.pharmacyUserPassword);
        });
    });

    afterEach(() => {
        cy.clearAllCookies();
    });

    it('Order 1 United Drug Item | Brokered Ethical', () => {

        cy.visitPage("Brokered Ethical");
        getItemForTest(wholesaler);
        addItemAndCheckCartTab(wholesaler);

        toPlaceTheOrder(wholesaler);
        toCheckOrderDetails(pharmacyId);

        cy.visitPage("Order History");
        toCheckOrderHistory(wholesaler);
    });

    it('Order 1 United Drug Item | Brokered OTC', () => {

        cy.visitPage("Brokered OTC");
        getItemForTest(wholesaler);
        addItemAndCheckCartTab(wholesaler);

        toPlaceTheOrder(wholesaler);
        toCheckOrderDetails(pharmacyId);

        cy.visitPage("Order History");
        toCheckOrderHistory(wholesaler);

    });

    it('Order 1 United Drug Item | Second Line', () => {

        cy.visitPage("Second Line");
        getItemForTest(wholesaler);
        addItemAndCheckCartTab(wholesaler);

        toPlaceTheOrder(wholesaler);
        toCheckOrderDetails(pharmacyId);

        cy.visitPage("Order History");
        toCheckOrderHistory(wholesaler);

    });

    it('Order 1 United Drug Item | ULM', () => {
        cy.visitPage("ULM");

        getItemForTest(wholesalerEl);
        addItemAndCheckCartTab(wholesalerEl.toUpperCase());
        toPlaceTheOrder(wholesalerEl.toUpperCase());

        toCheckOrderDetails(pharmacyId);

        cy.visitPage("Order History");
        toCheckOrderHistory(wholesaler);

    });
    
}