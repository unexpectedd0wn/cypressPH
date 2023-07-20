import { elements, shoppingCart } from "../../../page-objects/order-page";
import routes, { _call } from "../../../page-objects/api-routes";
import { Wholeslaers } from "../../../support/enums";
const dayjs = require("dayjs");
import 'cypress-map'
import orderPage from "../../../page-objects/order-page";


describe('', () => {

    let pharmacyId = Cypress.env("pharmacyId");
    let userId = '455';
    let currentDateTime = dayjs().format("YYYY-MM-DD HH:mm:ss:SSS");

    

    before(() => {
        cy.cleanUpShoppingCart(pharmacyId);
        cy.clearAllCookies();
        // cy.getUDItemAndAddItToShoppingCart(pharmacyId);
    });

    beforeEach(() => {
        cy.clearAllCookies();
    });
    
    
    it('Wholesaler is Deleted = 1 | check Wholeslaer drop downs', () => {
        cy.sqlServer(`UPDATE Wholesalers set IsDeleted = '1' where Id = 4`);

        cy.fixture("main").then(data => {
            cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
        });
    });
});
