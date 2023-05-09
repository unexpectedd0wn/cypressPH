import OrderPages from "../../pages/OrderPages";
import routes from "../../pages/routes";

describe('Pharmacy Settings', () => {
    it('Exclude No GMS = true', () => {
        cy.intercept(routes._call._getPageData)
        .as('pageLoaded');
       
        cy.fixture("main").then(data => 
            {
                cy.login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });
        
        cy.visit(Cypress.env("devURL") + routes._page.BrokeredEthical);
        cy.title()
            .should('eq','Orders-Brokered Ethical');
        
            cy.log("Clear shopping cart")
        cy.CleanShoppingCart(Cypress.env("pharmacyId"));
        
        cy.log("Get the medicine for the testing: ")
        cy.wait('@pageLoaded').then(({response}) => 
        {
            expect(response.statusCode).to.equal(200);
            ItemId = response.body.items[7].id;
            ItemGmsCode = response.body.items[7].gmsCode;
            cy.log(ItemId);
            cy.log(ItemGmsCode);
            cy.wrap(ItemId).as('itemId');
            cy.wrap(ItemGmsCode).as('itemGmsCode');
        })
        /*
            add a multiline comment 
        */
        cy.log("Make sure item does not have a Case size ")
        cy.get('@itemId').then((Id) => {
            cy.sqlServer(`update StockProducts set CaseSize = 1 where Id = ${Id}`)
        })
    });
});