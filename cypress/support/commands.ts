import { LoginPage } from "../page-objects/login-page";
import { APIRequests } from "../page-objects/api-routes";
import { ShoppingCart } from "../page-objects/shopping-cart";
import { OrderPage } from "../page-objects/order-page";
import { getRandomNumber } from "./service";
import { should } from "chai";
import { Wholesalers } from "./enums";
import { piMinOrderValue } from "./enums";

const dayjs = require("dayjs");

Cypress.Commands.add('signInCreateSession', (email, password) => {
    cy.session([email, password], () => {
        cy.intercept('/api/account/login').as('requestLogIn');
        cy.visit(Cypress.env("devURL"));
        LoginPage.typeEmail(email);
        LoginPage.typePassword(password);
        LoginPage.clickOnLogin();
        cy.wait('@requestLogIn').then(({ response }) => {
            expect(response.statusCode).to.equal(200);
        })
        cy.title().should('eq', 'Home');
        cy.contains('Got it').click();
    })
})

Cypress.Commands.add('signIn', (email, password) => {
    cy.intercept('/api/account/ip-locking-time*').as('lastRequst');
    cy.visit(Cypress.env("devURL")).wait('@lastRequst');
    LoginPage.typeEmail(email);
    LoginPage.typePassword(password);
    cy.get('#singin-btn').click();
    cy.title().should('eq', 'Home');
    cy.contains('Got it').click();
})

Cypress.Commands.add('signOut', () => {
    cy.intercept('/api/account/logout*').as('requestLogout');
    cy.contains('Logout', { timeout: 60000 }).click();
    cy.wait('@requestLogout').then(({ response }) => {
        expect(response.statusCode).to.equal(204);
        cy.title().should('eq', 'Log In');
    })
})

Cypress.Commands.add("selectPackType", (value) => {
    cy.get("p-dropdown")
    .then(selects => {
            const select = selects[0];
            cy.wrap(select)
            .click()
            .get("p-dropdownitem")
            .get(".ng-tns-c56-12")
            .contains(new RegExp("^" + value + "$", "g"))
            .then(item => {
            cy.wrap(item).click({ force: true });
        });
    });
});

Cypress.Commands.add("selectWholesaler", (value) => {
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

Cypress.Commands.add('updateUDStockProductStock', (InBallinaStock, InDublinStock, InLimerickStock, StockProductId) => {
    cy.sqlServer(`UPDATE StockProducts SET InBallinaStock = ${InBallinaStock}, InDublinStock = ${InDublinStock}, InLimerickStock = ${InLimerickStock}  where Id = ${StockProductId}`);
})

Cypress.Commands.add('updatePIStockProductStock', (InStock, StockProductId) => {
    cy.sqlServer(`UPDATE StockProducts SET InStock = ${InStock}  where Id = ${StockProductId}`);
})

Cypress.Commands.add('updatePharmacy', (UseCutOff, CutOffTime, NormalDepotId, MainDepotId, PharmacyId) => {
    
    cy.sqlServer(`UPDATE Pharmacists SET UseCutOff = ${UseCutOff}, CutOffTime = ${CutOffTime}, NormalDepotId = ${NormalDepotId}, MainDepotId = ${MainDepotId} where Id = ${PharmacyId}`);
})

Cypress.Commands.add('getIPUCode', (Id) => {
    cy.sqlServer(`SELECT IPUCode from Stockproducts WHERE Id = ${Id}`);
})

Cypress.Commands.add('cleanUpShoppingCart', (PharmacyId) => {
    cy.sqlServer(`DELETE FROM ShoppingCartItems WHERE PharmacyId = ${PharmacyId}`);
    cy.sqlServer(`DELETE FROM BrokeredItems WHERE PharmacyId = ${PharmacyId}`);
})

Cypress.Commands.add('addItemToSubstitutionTab', (preferedId, pharmacyId, ipuCode, datetime) => {
    cy.sqlServer(`INSERT INTO BrokeredItems VALUES (${preferedId},${pharmacyId},'1',${ipuCode}, '${datetime}')`);
})

Cypress.Commands.add('addItemToShoppingCart', (ipuCode, pharmacyId, stockProductId, datetime) => { 
    cy.sqlServer(`INSERT INTO ShoppingCartItems VALUES (${ipuCode},${pharmacyId},'1',${stockProductId}, '${datetime}', '0')`);
})

Cypress.Commands.add('visitPage', (name: string) => { 
    
    switch (name) {
        case 'Brokered Ethical':
            cy.visit(Cypress.env("devURL") + "/app/orders/brokeredEthical?filterBy=brokeredEthical");
            cy.title().should('eq', 'Orders-Brokered Ethical')
            break;
        case 'Brokered OTC':
            cy.visit(Cypress.env("devURL") + "/app/orders/brokeredOtc?filterBy=brokeredOtc");
            cy.title().should('eq', 'Orders-Brokered OTC');
            break;
        case 'Second Line':
            cy.visit(Cypress.env("devURL") + "/app/orders/secondLine?filterBy=secondLine");
            cy.title().should('eq', 'Orders-Second Line');
            break;
        case 'ULM':
            cy.visit(Cypress.env("devURL") + "/app/orders/ulm?filterBy=ulm");
            cy.title().should('eq', 'Orders-ULM');
            break;
        case 'Order History':
            cy.visit(Cypress.env("devURL") + "/app/orderhistory");
            cy.title().should('eq', 'Order History');
            break;
        default:
            break;
    }
})

Cypress.Commands.add('updatePharmacySetExcludeNoGms', (excludeNoGms , pharmacyId) => { 
    cy.sqlServer(`UPDATE Pharmacists SET ExcludeNoGMS = ${excludeNoGms} where Id = ${pharmacyId}`);

})

Cypress.Commands.add('updatePharmacySetUseGreys', (useGreys , pharmacyId) => { 
    cy.sqlServer(`UPDATE Pharmacists SET UseGreys = ${useGreys} where Id = ${pharmacyId}`);

})

Cypress.Commands.add('toUpdatePharmacyPricesDiscounts', (showUdNetPrices , show2ndLine, pharmacyId) => { 
    cy.sqlServer(`UPDATE Pharmacists SET ShowUdNetPrices = ${showUdNetPrices}, Show2ndLine = ${show2ndLine} where Id = ${pharmacyId}`);
})



Cypress.Commands.add('toAddItemToTheShoppingCart', () => { 
    
    cy.wait('@search').then(({ response }) => {
        expect(response.statusCode).to.equal(200)
        
        
    })

    
    OrderPage.setQtyAndAddToShoppingCart()
    cy.wait(500);
   cy.wait('@itemAdded').then(({ response }) => {
        expect(response.statusCode).to.equal(200)

        // cy.wait('@shopingCart').then(({ response }) => {
        //     expect(response.statusCode).to.equal(200)
        // })
    })
})

Cypress.Commands.add('getItemAndAddItToShoppingCart', (wholesalerName, pharmacyId) => {
    cy.intercept(APIRequests.request._getPageDataBrokeredEthical + '*').as('pageLoaded');
    cy.intercept(APIRequests.request._filter_wholesaler + '*',).as('pageLoadedWholeslaer');
        cy.visitBrokeredEthical();
        
        cy.wait('@pageLoaded').then(({ response }) => {
            expect(response.statusCode).to.equal(200);
            
            cy.selectWholesaler(wholesalerName)
        
            cy.wait('@pageLoadedWholeslaer').then(({ response }) => {
            expect(response.statusCode).to.equal(200);
            
            let i = getRandomNumber();
            cy.wrap({
                id: response.body.items[i].id,})
                .as('item');
              
            cy.get('@item').then((item: any) => {
                
                cy.sqlServer(`SELECT Id, IPUCode, Description, PackSize, Type, NetPrice, Discount, TradePrice from Stockproducts WHERE Id = ${item.id}`)
                .then((data: any) => {
                    cy.log(data);
                    Cypress.env('item.Id', data[0]);
                    Cypress.env('item.IPUcode', data[1]);
                    Cypress.env('item.Description', data[2]);
                    Cypress.env('item.PackSize', data[3]);
                    Cypress.env('item.PackType', data[4]);
                    Cypress.env('item.NetPrice', data[5]);
                    Cypress.env('item.Discount', data[6]);
                    Cypress.env('item.TradePrice', data[7]);
                    let currentDateTime = dayjs().format("YYYY-MM-DD HH:mm:ss:SSS");
                    cy.addItemToShoppingCart(
                        Cypress.env('item.IPUcode'), 
                        Cypress.env("pharmacyId"), 
                        Cypress.env('item.Id'), 
                        currentDateTime);
                    cy.log("Item has been added to the shopping cart")
                })
            })
        })
    })
})

Cypress.Commands.add('getItemForTest', (wholesalerName, page) => {
    cy.intercept('/api/stock-product/products?' + '*').as('pageLoaded');
    cy.intercept(APIRequests.request._filter_wholesaler + '*',).as('pageLoadedWholeslaer');
        // cy.visitBrokeredEthical();
        
        switch (page) {
            case "Brokered Ethical":
                cy.visitPage("Brokered Ethical");
  
                break;
            case "Brokered OTC":
                cy.visitPage("Brokered OTC");

                break;

            default:
                break;
        }

        cy.wait('@pageLoaded').then(({ response }) => {
            expect(response.statusCode).to.equal(200);
            
            cy.selectWholesaler(wholesalerName)
        
            cy.wait('@pageLoaded').then(({ response }) => {
            expect(response.statusCode).to.equal(200);
            
            let i = getRandomNumber();
            cy.wrap({
                id: response.body.items[i].id,})
                .as('item');
              
            cy.get('@item').then((item: any) => {
                    
                cy.sqlServer(`SELECT Id, IPUCode, Description, PackSize, Type, NetPrice, Discount, TradePrice from Stockproducts WHERE Id = ${item.id}`)
                .then((data: any) => {
                    
                    cy.log(data);
                    Cypress.env('item.Id', data[0]);
                    Cypress.env('item.IPUcode', data[1]);
                    Cypress.env('item.Description', data[2]);
                    Cypress.env('item.PackSize', data[3]);
                    Cypress.env('item.PackType', data[4]);
                    Cypress.env('item.NetPrice', data[5]);
                    Cypress.env('item.Discount', data[6]);
                    Cypress.env('item.TradePrice', data[7]);
                })
            })
        })
    })
})










