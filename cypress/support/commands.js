import loginPage from "../pages/loginPage";
import shoppingCart from "../pages/shoppingCart";


// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
import sqlServer from "cypress-sql-server";
sqlServer.loadDBCommands();

// -- This is a common Login command with the session created --
Cypress.Commands.add('LoginAndCreateSession', (email, password) => {
    cy.session([email, password], () => {
        cy.intercept('/api/account/login').as('requestLogIn');
        cy.visit(Cypress.env("devURL"));
        loginPage.typeEmail(email);
        loginPage.typePassword(password);
        loginPage.clickOnLogin();
        cy.wait('@requestLogIn').then(({ response }) => {
            expect(response.statusCode).to.equal(200);
        })
        cy.title().should('eq', 'Home');
        cy.contains('Got it').click();
    })
})

// -- This is a common Logout command --
Cypress.Commands.add('Logout', () => {
    // cy.intercept('/api/account/logout*').as('requestLogout');
    cy.contains('Logout', { timeout: 30000 }).click();
    // cy.wait('@requestLogout').then(({ response }) => {
    //     expect(response.statusCode).to.equal(204);
    //     cy.title().should('eq', 'Log In');
    // })
})

// -- This is a common and simple Login command --
Cypress.Commands.add('Login', (email, password) => {
    cy.intercept('/api/account/ip-locking-time*').as('lastRequst');
    cy.visit(Cypress.env("devURL")).wait('@lastRequst');
    loginPage.typeEmail(email);
    loginPage.typePassword(password);
    cy.get('#singin-btn').click();
    cy.title().should('eq', 'Home');
    cy.contains('Got it').click();

})

// -- This is a select from PackType dropdown list command --
Cypress.Commands.add("selectPackType", (value) => {
    cy.get("p-dropdown")
    .then(selects => {
            const select = selects[0];
            cy.wrap(select)
            .click()
            .get("p-dropdownitem")
            .get(".ng-tns-c56-12")
            // .get(".ng-star-inserted")
            .contains(new RegExp("^" + value + "$", "g"))
            .then(item => {
            cy.wrap(item).click({ force: true });
        });
    });
});

// -- This is a select from Wholesaler dropdown list command --
Cypress.Commands.add("selectWholeslaer", (value) => {
    cy.get("p-dropdown")
        .then(selects => {
            const select = selects[1];
            cy.wrap(select)
            .click()
            .get("p-dropdownitem")
            .get(".ng-tns-c56-13")
            .get(".ng-star-inserted")
            .contains(new RegExp("^" + value + "$", "g"))
            .then(item => {
            cy.wrap(item).click({ force: true });
        });
    });
});

// -- This is a select from PackType dropdown list command --
Cypress.Commands.add("selectUnitedDrug", (value) => {
    cy.get("p-dropdown")
        .then(selects => {
            const select = selects[1];
            cy.wrap(select)
                .click()
                .get("p-dropdownitem")
                .get(".ng-tns-c56-13")
                .get(".ng-star-inserted")
                .contains(new RegExp("^" + "United Drug" + "$", "g"))
                .then(item => {
                    cy.wrap(item).click({force: true});
        });
    });
});

// -- This is a command to execute sql querry to update Stock for StockProduct --
Cypress.Commands.add('updateStockProducts', (InBallinaStock, InDublinStock, InLimerickStock, StockProductId) => {
    cy.sqlServer(`UPDATE StockProducts SET InBallinaStock = ${InBallinaStock}, InDublinStock = ${InDublinStock}, InLimerickStock = ${InLimerickStock}  where Id = ${StockProductId}`);
})

// -- This is a command to execute sql querry to update Stock for StockProduct --
Cypress.Commands.add('UpdateStockProductStock', (InBallinaStock, InDublinStock, InLimerickStock, StockProductId) => {
    cy.sqlServer(`UPDATE StockProducts SET InBallinaStock = ${InBallinaStock}, InDublinStock = ${InDublinStock}, InLimerickStock = ${InLimerickStock}  where Id = ${StockProductId}`);
})

// -- This is a command to execute sql querry to update Pharmacy for SubstitutionCart cases --
Cypress.Commands.add('updatePharmacy', (UseCutOff, CutOffTime, NormalDepotId, MainDepotId, PharmacyId) => {
    cy.sqlServer(`UPDATE Pharmacists SET UseCutOff = ${UseCutOff}, CutOffTime = ${CutOffTime}, NormalDepotId = ${NormalDepotId}, MainDepotId = ${MainDepotId} where Id = ${PharmacyId}`);
})


// -- To clean up Shopping cart for the specific Pharmacy --
Cypress.Commands.add('CleanUpShoppingCart', (PharmacyId) => {
    cy.sqlServer(`DELETE FROM ShoppingCartItems WHERE PharmacyId = ${PharmacyId}`);
    cy.sqlServer(`DELETE FROM BrokeredItems WHERE PharmacyId = ${PharmacyId}`);
})

// -- Add item to the Substitution Shopping cart --
Cypress.Commands.add('AddItemToSubstitutionTab', (preferedId, pharmacyId, ipuCode, datetime) => {
    cy.sqlServer(`INSERT INTO BrokeredItems VALUES (${preferedId},${pharmacyId},'1',${ipuCode}, '${datetime}')`);
})
// -- Add item to the Shopping cart --
Cypress.Commands.add('AddItemToShoppingCart', (ipuCode, pharmacyId, stockProductId, datetime) => { 
    cy.sqlServer(`INSERT INTO ShoppingCartItems VALUES (${ipuCode},${pharmacyId},'1',${stockProductId}, '${datetime}', '0')`);
})


Cypress.Commands.add('VisitBrokeredEthical', (ipuCode, pharmacyId, stockProductId, datetime) => { 
    cy.visit(Cypress.env("devURL") + "/app/orders/brokeredEthical?filterBy=brokeredEthical");
    cy.title().should('eq', 'Orders-Brokered Ethical')
})

Cypress.Commands.add('VisitBrokeredOTC', (ipuCode, pharmacyId, stockProductId, datetime) => { 
    cy.visit(Cypress.env("devURL") + "/app/orders/brokeredOtc?filterBy=brokeredOtc");
    cy.title().should('eq', 'Orders-Brokered OTC');
})

Cypress.Commands.add('VisitSecondLine', (ipuCode, pharmacyId, stockProductId, datetime) => { 
    cy.visit(Cypress.env("devURL") + "/app/orders/secondLine?filterBy=secondLine");
    cy.title().should('eq', 'Orders-Second Line');
})

Cypress.Commands.add('VisitULM', (ipuCode, pharmacyId, stockProductId, datetime) => { 
    cy.visit(Cypress.env("devURL") + "/app/orders/ulm?filterBy=ulm");
    cy.title().should('eq', 'Orders-ULM');
})









