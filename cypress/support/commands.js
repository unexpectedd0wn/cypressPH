import loginPage from "../pages/loginPage";
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

// -- This is a common Login command --
Cypress.Commands.add('login', (email, password) => { 
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

// -- This is a select from PackType dropdown list command --
Cypress.Commands.add("selectPackType", (value) => {
    cy.get("p-dropdown")
          .then(selects => {
            const select = selects[0];
            cy.wrap(select)
            .click()
            .get("p-dropdownitem")
            .get(".ng-tns-c56-12")
            .get(".ng-star-inserted")
            .contains(new RegExp("^" + value + "$", "g"))
            .then(item => {
            cy.wrap(item).click({ force: true });
        });
    });
});

// -- This is a select from PackType dropdown list command --
Cypress.Commands.add("selectWholeslaer", (value) => {
    cy.get("p-dropdown")
        .then(selects => {
            const select = selects[1];
            cy.wrap(select)
                .click()
                .get("p-dropdownitem")
                .get(".ng-tns-c56-13")
                .get(".ng-star-inserted")
                .contains(new RegExp("^" + wholesaler + "$", "g"))
                .then(item => {
                    cy.wrap(item).click({force: true});
        });
    });
});

// -- This is a command to execute sql querry to update StockProducts --
Cypress.Commands.add('updateStockProducts', (InBallinaStock, InDublinStock, InLimerickStock, StockProductId ) => { 
        cy.sqlServer(`UPDATE StockProducts SET InBallinaStock = ${InBallinaStock}, InDublinStock = ${InDublinStock}, InLimerickStock = ${InLimerickStock}  where Id = ${StockProductId}`);
    })

 // -- This is a command to execute sql querry to update Pharmacy for SubstitutionCart cases --
Cypress.Commands.add('updatePharmacy', (UseCutOff, CutOffTime, NormalDepotId, MainDepotId, PharmacyId ) => { 
        cy.sqlServer(`UPDATE Pharmacists SET UseCutOff = ${UseCutOff}, CutOffTime = ${CutOffTime}, NormalDepotId = ${NormalDepotId}, MainDepotId = ${MainDepotId} where Id = ${PharmacyId}`);
    })
// -- This is a command to execute sql querry to update Pharmacy for Settings cases --
Cypress.Commands.add('updatePharmacy', (UseCutOff, CutOffTime, NormalDepotId, MainDepotId, PharmacyId ) => { 
    cy.sqlServer(`UPDATE Pharmacists SET UseCutOff = ${UseCutOff}, CutOffTime = ${CutOffTime}, NormalDepotId = ${NormalDepotId}, MainDepotId = ${MainDepotId} where Id = ${PharmacyId}`);
})
// -- This is a command to execute sql querry to update Pharmacy for Settings cases --






//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })