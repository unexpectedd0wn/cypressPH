import loginPage from "../page-objects/login-page";
import sqlServer from "cypress-sql-server";
import apiRoutes from "../page-objects/api-routes";
import { Wholeslaers } from "./enums";
const dayjs = require("dayjs");

sqlServer.loadDBCommands();

// -- This is a common Sign In command with the session --
Cypress.Commands.add('signInCreateSession', (email, password) => {
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
Cypress.Commands.add('signOut', () => {
    // cy.intercept('/api/account/logout*').as('requestLogout');
    cy.contains('Logout', { timeout: 60000 }).click();
    // cy.wait('@requestLogout').then(({ response }) => {
    //     expect(response.statusCode).to.equal(204);
    //     cy.title().should('eq', 'Log In');
    // })
})

// -- This is a common and simple Sign In command --
Cypress.Commands.add('signIn', (email, password) => {
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
Cypress.Commands.add('updateUDStockProductStock', (InBallinaStock, InDublinStock, InLimerickStock, StockProductId) => {
    cy.sqlServer(`UPDATE StockProducts SET InBallinaStock = ${InBallinaStock}, InDublinStock = ${InDublinStock}, InLimerickStock = ${InLimerickStock}  where Id = ${StockProductId}`);
})

// -- This is a command to execute sql querry to update Stock for StockProduct --
Cypress.Commands.add('UpdatePIStockProductStock', (InStock, StockProductId) => {
    cy.sqlServer(`UPDATE StockProducts SET InStock = ${InStock}  where Id = ${StockProductId}`);
})

// -- This is a command to execute sql querry to update Pharmacy for SubstitutionCart cases --
Cypress.Commands.add('updatePharmacy', (UseCutOff, CutOffTime, NormalDepotId, MainDepotId, PharmacyId) => {
    cy.sqlServer(`UPDATE Pharmacists SET UseCutOff = ${UseCutOff}, CutOffTime = ${CutOffTime}, NormalDepotId = ${NormalDepotId}, MainDepotId = ${MainDepotId} where Id = ${PharmacyId}`);
})

Cypress.Commands.add('getIPUCode', (Id) => {
    cy.sqlServer(`SELECT IPUCode from Stockproducts WHERE Id = ${Id}`);
})


// -- To clean up Shopping cart for the specific Pharmacy --
Cypress.Commands.add('cleanUpShoppingCart', (PharmacyId) => {
    cy.sqlServer(`DELETE FROM ShoppingCartItems WHERE PharmacyId = ${PharmacyId}`);
    cy.sqlServer(`DELETE FROM BrokeredItems WHERE PharmacyId = ${PharmacyId}`);
})

// -- Add item to the Substitution Shopping cart --
Cypress.Commands.add('addItemToSubstitutionTab', (preferedId, pharmacyId, ipuCode, datetime) => {
    cy.sqlServer(`INSERT INTO BrokeredItems VALUES (${preferedId},${pharmacyId},'1',${ipuCode}, '${datetime}')`);
})
// -- Add item to the Shopping cart --
Cypress.Commands.add('addItemToShoppingCart', (ipuCode, pharmacyId, stockProductId, datetime) => { 
    cy.sqlServer(`INSERT INTO ShoppingCartItems VALUES (${ipuCode},${pharmacyId},'1',${stockProductId}, '${datetime}', '0')`);
})


Cypress.Commands.add('visitBrokeredEthical', (ipuCode, pharmacyId, stockProductId, datetime) => { 
    cy.visit(Cypress.env("devURL") + "/app/orders/brokeredEthical?filterBy=brokeredEthical");
    cy.title().should('eq', 'Orders-Brokered Ethical')
})

Cypress.Commands.add('visitBrokeredOTC', (ipuCode, pharmacyId, stockProductId, datetime) => { 
    cy.visit(Cypress.env("devURL") + "/app/orders/brokeredOtc?filterBy=brokeredOtc");
    cy.title().should('eq', 'Orders-Brokered OTC');
})

Cypress.Commands.add('visitSecondLine', (ipuCode, pharmacyId, stockProductId, datetime) => { 
    cy.visit(Cypress.env("devURL") + "/app/orders/secondLine?filterBy=secondLine");
    cy.title().should('eq', 'Orders-Second Line');
})

Cypress.Commands.add('VisitULM', (ipuCode, pharmacyId, stockProductId, datetime) => { 
    cy.visit(Cypress.env("devURL") + "/app/orders/ulm?filterBy=ulm");
    cy.title().should('eq', 'Orders-ULM');
})


Cypress.Commands.add('getUDItemAndAddItToShoppingCart', (pharmacy) => {
    cy.intercept(apiRoutes._call._getPageDataBrokeredEthical + '*').as('pageLoaded');
    cy.intercept(apiRoutes._call._filter_wholesaler + Wholeslaers.UD.Id + '*',).as('pageLoadedWholeslaer');
        cy.visitBrokeredEthical();
        cy.wait('@pageLoaded').then(({ response }) => {
            expect(response.statusCode).to.equal(200);
            
            cy.selectWholeslaer(Wholeslaers.UD.Name)
        
            cy.wait('@pageLoadedWholeslaer').then(({ response }) => {
            expect(response.statusCode).to.equal(200);
            
            let i = randomItem();
            cy.wrap({
                id: response.body.items[i].id,
                
              }).as('item');
              
            cy.get('@item').then(item => {
                    
                cy.sqlServer(`SELECT Id, IPUCode, Description, PackSize, Type, NetPrice, Discount from Stockproducts WHERE Id = ${item.id}`).then(data => {
                    
                    
                    cy.log(data);
                    Cypress.env('item.Id', data[0]);
                    cy.log(Cypress.env('item.Id'));
                    Cypress.env('item.IPUcode', data[1]);
                    cy.log(Cypress.env('item.IPUcode'));
                    Cypress.env('item.Description', data[2]);
                    cy.log(Cypress.env('item.Description'));
                    Cypress.env('item.PackSize', data[3]);
                    cy.log(Cypress.env('item.PackSize'));
                    Cypress.env('item.PackType', data[4]);
                    cy.log(Cypress.env('item.PackType'));
                    Cypress.env('item.NetPrice', data[5]);
                    cy.log(Cypress.env('item.NetPrice'));
                    Cypress.env('item.Discount', data[6]);
                    cy.log(Cypress.env('item.Discount'));
                    let currentDateTime = dayjs().format("YYYY-MM-DD HH:mm:ss:SSS");
                    cy.addItemToShoppingCart(Cypress.env('item.IPUcode'), Cypress.env("pharmacyId"), Cypress.env('item.Id'), currentDateTime);
                    cy.log("Item has been added to the shopping cart")
                    
            })
        })
    })
})
})




function randomItem() { 
    const randomInt = Math.floor(Math.random() * 24) + 0;
    return randomInt;
 }








