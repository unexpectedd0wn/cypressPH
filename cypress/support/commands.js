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

// -- This is a common Login command --
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

 Cypress.Commands.add('Logout', (email, password) => { 
    
        cy.intercept('/api/account/logout').as('requestLogout');
        cy.contains('Logout').click()
        cy.wait('@requestLogout').then(({ response }) => {
            expect(response.statusCode).to.equal(204);

            cy.title().should('eq', 'Log In');
        })
        
        
      
 })


 // -- This is a common Login command --
Cypress.Commands.add('Login', (email, password) => { 
    
        cy.intercept('/api/account/login').as('requestLogIn');
        cy.intercept('/api/content*').as('finish')
        cy.visit(Cypress.env("devURL"));
        loginPage.typeEmail(email);
        loginPage.typePassword(password);
        loginPage.clickOnLogin();
        cy.wait('@requestLogIn').then(({ response }) => {
            expect(response.statusCode).to.equal(200);
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
                .contains(new RegExp("^" + value + "$", "g"))
                .then(item => {
                    cy.wrap(item).click({force: true});
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

// -- This is a command to execute sql querry to update StockProducts --
Cypress.Commands.add('updateStockProducts', (InBallinaStock, InDublinStock, InLimerickStock, StockProductId ) => { 
        cy.sqlServer(`UPDATE StockProducts SET InBallinaStock = ${InBallinaStock}, InDublinStock = ${InDublinStock}, InLimerickStock = ${InLimerickStock}  where Id = ${StockProductId}`);
    })

 // -- This is a command to execute sql querry to update Pharmacy for SubstitutionCart cases --
Cypress.Commands.add('updatePharmacy', (UseCutOff, CutOffTime, NormalDepotId, MainDepotId, PharmacyId ) => { 
        cy.sqlServer(`UPDATE Pharmacists SET UseCutOff = ${UseCutOff}, CutOffTime = ${CutOffTime}, NormalDepotId = ${NormalDepotId}, MainDepotId = ${MainDepotId} where Id = ${PharmacyId}`);
    })
// // -- This is a command to execute sql querry to update Pharmacy for Settings cases --
// Cypress.Commands.add('updatePharmacy', (UseCutOff, CutOffTime, NormalDepotId, MainDepotId, PharmacyId ) => { 
//     cy.sqlServer(`UPDATE Pharmacists SET UseCutOff = ${UseCutOff}, CutOffTime = ${CutOffTime}, NormalDepotId = ${NormalDepotId}, MainDepotId = ${MainDepotId} where Id = ${PharmacyId}`);
// })
// -- This is a command to execute sql querry to update Pharmacy for Settings cases --


// -- To clean up Shopping cart for the specific Pharmacy --
Cypress.Commands.add('CleanUpShoppingCart', (PharmacyId) => { 
    cy.sqlServer(`DELETE FROM ShoppingCartItems WHERE PharmacyId = ${PharmacyId}`);
    cy.sqlServer(`DELETE FROM BrokeredItems WHERE PharmacyId = ${PharmacyId}`);
})

// -- Add item to the Substitution Shopping cart --
Cypress.Commands.add('AddItemToSubstitutionTab', (preferedId, pharmacyId, ipuCode) => { 
    cy.sqlServer(`INSERT INTO BrokeredItems VALUES (${preferedId},${pharmacyId},'1',${ipuCode}, '2023-04-26 12:45:42.917')`);
})

// -- This is command for the check Shopping cart --
/*
            +--+------------+-----------------------+-----------+-----+--------+--+
            |  |            |                       |           |     |        |  |
            +--+------------+-----------------------+-----------+-----+--------+--+
            |  | Prefered:  | Prefered.Description  |           | Order btn    |  |
            +--+------------+-----------------------+-----------+-----+--------+--+
            |  |            | Stock note            |           |     |        |  |
            +--+------------+-----------------------+-----------+-----+--------+--+
            |  |            | NetPrice (Discount)   |           |     |        |  |
            +--+------------+-----------------------+-----------+-----+--------+--+
            |  | Next Best: | Next Best.Description | Expected  | Qty | Delete |  |
            |  |            |                       | Delivery  |     |        |  |
            +--+------------+-----------------------+-----------+-----+--------+--+
            |  |            |                       |           |     |        |  |
            +--+------------+-----------------------+-----------+-----+--------+--+
*/
Cypress.Commands.add('SubstitutionState_type1', (StockNote, preferedDescription, nextBestDescription, ExpectedDelivery) => { 
    
    shoppingCart.substitutionTab.preferedTitle().should('be.visible').and('have.text','Preferred:')
    shoppingCart.substitutionTab.preferedStockNote().should('have.text', StockNote).and('have.css', 'color', 'rgb(255, 0, 0)');
    shoppingCart.substitutionTab.preferedDescription().should('be.visible').and('have.text', preferedDescription);
    shoppingCart.substitutionTab.preferedNetPrice().should('be.visible');

    shoppingCart.substitutionTab.nextBestTitle().should('have.text','Next Best:');
    shoppingCart.substitutionTab.nextBestDescription().should('be.visible').and('have.text', nextBestDescription);
    shoppingCart.substitutionTab.nextBestNetPrice().should('be.visible');

    
    shoppingCart.substitutionTab.expectedDeliveryText().should('have.text', ExpectedDelivery);
    shoppingCart.substitutionTab.expectedDeliveryTick().should('be.visible');
    shoppingCart.substitutionTab.orderButton().should('be.visible');
    shoppingCart.substitutionTab.qtyInput().should('be.visible');
    shoppingCart.substitutionTab.deleteIcon().should('be.visible');
})

/*
        +--+-----------+----------------------+--+--+--------+--+
        |  |           |                      |  |  |        |  |
        +--+-----------+----------------------+--+--+--------+--+
        |  | Prefered: | Prefered.Description |  |  | Delete |  |
        +--+-----------+----------------------+--+--+--------+--+
        |  |           | Stock notes          |  |  |        |  |
        +--+-----------+----------------------+--+--+--------+--+
        |  |           |                      |  |  |        |  |
        +--+-----------+----------------------+--+--+--------+--+
*/

// -- This is a command to execute chek for the shoppinc --
Cypress.Commands.add('SubstitutionState_type2', (StockNote, preferedDescription) => { 
    shoppingCart.substitutionTab.preferedTitle().should('have.text','Preferred:');
    shoppingCart.substitutionTab.preferedStockNote().should('have.text', StockNote).and('have.css', 'color', 'rgb(255, 0, 0)');
    shoppingCart.substitutionTab.preferedNetPrice().should('not.exist');
    shoppingCart.substitutionTab.preferedDescription().should('be.visible').and('have.text', preferedDescription);
    
    shoppingCart.substitutionTab.nextBestTitle().should('not.exist');
    shoppingCart.substitutionTab.nextBestDescription().should('not.exist');
    shoppingCart.substitutionTab.nextBestNetPrice().should('not.exist');
    
    shoppingCart.substitutionTab.expectedDeliveryText().should('not.exist');
    shoppingCart.substitutionTab.expectedDeliveryTick().should('not.exist');
    shoppingCart.substitutionTab.orderButton().should('not.exist');
    shoppingCart.substitutionTab.qtyInput().should('not.exist');
            
    shoppingCart.substitutionTab.deleteIcon().should('be.visible');
            
            
})

/*
        +--+-----------+----------------------+--+----------+-----+--+-----+--+
        |  |           |                      |  |          |     |  |     |  |
        +--+-----------+----------------------+--+----------+-----+--+-----+--+
        |  | Prefered: | Prefered.Description |  | Expected |     | Order  |  |
        |  |           |                      |  | Delivery |     |        |  |
        +--+-----------+----------------------+--+----------+-----+--+-----+--+
        |  |           | Stock notes          |  |          |     |  |     |  |
        +--+-----------+----------------------+--+----------+-----+--+-----+--+
        |  |           | Net Price (Discount) |  |          | QTY |  | DEL |  |
        +--+-----------+----------------------+--+----------+-----+--+-----+--+
        |  |           |                      |  |          |     |  |     |  |
+--+-----------+----------------------+--+----------+-----+--+-----+--+
*/

// // -- This is a command to execute chek for the shoppinc --
Cypress.Commands.add('SubstitutionState_type3', (StockNote, preferedDescription, ExpectedDelivery) => { 
            shoppingCart.substitutionTab.preferedTitle().should('have.text','Preferred:')
            shoppingCart.substitutionTab.preferedStockNote().should('have.text', StockNote).and('have.css', 'color', 'rgb(104, 159, 56)');
            shoppingCart.substitutionTab.preferedNetPrice().should('be.visible')
            shoppingCart.substitutionTab.preferedDescription().should('be.visible').and('have.text', preferedDescription);
            
            shoppingCart.substitutionTab.nextBestTitle().should('not.exist')
            shoppingCart.substitutionTab.nextBestDescription().should('not.exist')
            shoppingCart.substitutionTab.nextBestNetPrice().should('not.exist')
            
            
            shoppingCart.substitutionTab.preferedExpectedDeliveryText().should('have.text', ExpectedDelivery)
            shoppingCart.substitutionTab.preferedExpectedDeliveryTick().should('be.visible')
            
            shoppingCart.substitutionTab.orderButton().should('be.visible')
            shoppingCart.substitutionTab.qtyInput().should('be.visible')
            shoppingCart.substitutionTab.deleteIcon().should('be.visible')
            
})








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