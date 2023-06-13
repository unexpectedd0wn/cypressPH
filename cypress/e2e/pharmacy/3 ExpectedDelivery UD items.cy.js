const dayjs = require("dayjs");

import routes from "../../page-objects/api-routes";
import { 
    expectedDelivery, 
    depot, 
    cutOffTime, 
    useCutOff, 
    localaDepot, 
    cutoffDepot ,
    Wholeslaers
} from "../../support/enums";
import shoppingCart from "../../page-objects/shopping-cart";

describe('Expected Delivery in the Shopping Cart and On the Order page', () => {

    let pharmacyId = Cypress.env("pharmacyId");
    
    before(() => {
        cy.cleanUpShoppingCart(pharmacyId);
        cy.fixture("main").then(data => {
            cy.signInCreateSession(data.pharmacyUserEmail, data.pharmacyUserPassword);
        });

        cy.getUDItemAndAddItToShoppingCart(pharmacyId);
    });

    beforeEach(() => {
        cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
       
        cy.fixture("main").then(data => {
            cy.signInCreateSession(data.pharmacyUserEmail, data.pharmacyUserPassword);
        });
    });
    
    
    context('Local Depo: Limerick -> Cut-off Depo: Dublin', () => {
        
        it.only('Case 01', () => {
            
            cy.updatePharmacy(useCutOff.yes, cutOffTime.before, localaDepot.Limerick, cutoffDepot.Dublin, pharmacyId);
            cy.updateUDStockProductStock(0, 0, 1, Cypress.env("item.Id"));
            visitPageOpenCart();
            shoppingCart.state_UDShoppingCart(expectedDelivery.SameDay, Cypress.env('item.Description'), Cypress.env('item.PackSize'), Cypress.env('item.PackType'))
            searchInTheGlobalSearch(Cypress.env('item.IPUcode'));
            CheckTheDataGrid('InStock', expectedDelivery.SameDay.toUpperCase());
            
            
        });

        it.only('Case 02', () => {
            
            
            cy.updatePharmacy(useCutOff.yes, cutOffTime.before, localaDepot.Limerick, cutoffDepot.Dublin, pharmacyId);
            cy.updateUDStockProductStock(1, 0, 0, Cypress.env("item.Id"));
            
            visitPageOpenCart();
            shoppingCart.state_OOSShoppingCart(Cypress.env('item.Description'));
            searchInTheGlobalSearch(Cypress.env('item.IPUcode'));
            CheckTheDataGrid('OOS',expectedDelivery.empty);
        });
        it('Case 03', () => {
            
            
            cy.updatePharmacy(useCutOff.yes, cutOffTime.before, localaDepot.Limerick, cutoffDepot.Dublin, pharmacyId);
            cy.updateUDStockProductStock(0, 1, 0, Cypress.env("item.Id"));
            visitPageOpenCart();
            shoppingCart.state_UDShoppingCart(expectedDelivery.NextDay, Cypress.env('item.Description'), Cypress.env('item.PackSize'), Cypress.env('item.PackType'))
            searchInTheGlobalSearch(Cypress.env('item.IPUcode'));
            CheckTheDataGrid('InStock',expectedDelivery.NextDay.toUpperCase());
        });
        it('Case 04', () => {
            
            
            cy.updatePharmacy(useCutOff.yes, cutOffTime.after, localaDepot.Limerick, cutoffDepot.Dublin, pharmacyId);
            cy.updateUDStockProductStock(0, 0, 1, Cypress.env("item.Id"));
            
            visitPageOpenCart();
            shoppingCart.state_OOSShoppingCart(Cypress.env('item.Description'));
            searchInTheGlobalSearch(Cypress.env('item.IPUcode'));
            CheckTheDataGrid('OOS',expectedDelivery.empty);
        });
        it('Case 05', () => {
            
           
            cy.updatePharmacy(useCutOff.yes, cutOffTime.after, localaDepot.Limerick, cutoffDepot.Dublin, pharmacyId);
            cy.updateUDStockProductStock(1, 0, 0, Cypress.env("item.Id"));
            
            visitPageOpenCart();
            shoppingCart.state_OOSShoppingCart(Cypress.env('item.Description'));
            searchInTheGlobalSearch(Cypress.env('item.IPUcode'));
            CheckTheDataGrid('OOS',expectedDelivery.empty);
        });
        it('Case 06', () => {
            
            
            cy.updatePharmacy(useCutOff.yes, cutOffTime.after, localaDepot.Limerick, cutoffDepot.Dublin, pharmacyId);
            cy.updateUDStockProductStock(0, 1, 0, Cypress.env("item.Id"));
            
            visitPageOpenCart();
            shoppingCart.state_UDShoppingCart(expectedDelivery.NextDay, Cypress.env('item.Description'), Cypress.env('item.PackSize'), Cypress.env('item.PackType'))
            searchInTheGlobalSearch(Cypress.env('item.IPUcode'));
            CheckTheDataGrid('InStock',expectedDelivery.NextDay.toUpperCase());
        });
        it('Case 07', () => {
            
            
            cy.updatePharmacy(useCutOff.no, cutOffTime.null, localaDepot.Limerick, cutoffDepot.Dublin, pharmacyId);
            cy.updateUDStockProductStock(0, 0, 1, Cypress.env("item.Id"));
            
            visitPageOpenCart();
            shoppingCart.state_OOSShoppingCart(Cypress.env('item.Description'));
            searchInTheGlobalSearch(Cypress.env('item.IPUcode'));
            CheckTheDataGrid('OOS',expectedDelivery.empty);
        });
        it('Case 08', () => {
            
            
            cy.updatePharmacy(useCutOff.no, cutOffTime.null, localaDepot.Limerick, cutoffDepot.Dublin, pharmacyId);
            cy.updateUDStockProductStock(1, 0, 0, Cypress.env("item.Id"));
            
            visitPageOpenCart();
            shoppingCart.state_OOSShoppingCart(Cypress.env('item.Description'));
            searchInTheGlobalSearch(Cypress.env('item.IPUcode'));
            CheckTheDataGrid('OOS',expectedDelivery.empty);
        });
        it('Case 09', () => {
            
            
            cy.updatePharmacy(useCutOff.no, cutOffTime.null, localaDepot.Limerick, cutoffDepot.Dublin, pharmacyId);
            cy.updateUDStockProductStock(0, 1, 0, Cypress.env("item.Id"));
            
            visitPageOpenCart();
            shoppingCart.state_UDShoppingCart(expectedDelivery.NextDay, Cypress.env('item.Description'), Cypress.env('item.PackSize'), Cypress.env('item.PackType'))
            searchInTheGlobalSearch(Cypress.env('item.IPUcode'));
            CheckTheDataGrid('InStock',expectedDelivery.NextDay.toUpperCase());
        });
    });  
    context('Local Depo: Limerick -> Cut-off Depo: Ballina', () => {
        it('Case 10', () => {
            
            cy.updatePharmacy(useCutOff.yes, cutOffTime.before, localaDepot.Limerick, cutoffDepot.Ballina, pharmacyId);
            cy.updateUDStockProductStock(0, 0, 1, Cypress.env("item.Id"));
            
            visitPageOpenCart();
            shoppingCart.state_UDShoppingCart(expectedDelivery.SameDay, Cypress.env('item.Description'), Cypress.env('item.PackSize'), Cypress.env('item.PackType'))
            searchInTheGlobalSearch(Cypress.env('item.IPUcode'));
            CheckTheDataGrid('InStock',expectedDelivery.SameDay.toUpperCase());
        });
        it('Case 11', () => {
            
            cy.updatePharmacy(useCutOff.yes, cutOffTime.before, localaDepot.Limerick, cutoffDepot.Ballina, pharmacyId);
            cy.updateUDStockProductStock(1, 0, 0, Cypress.env("item.Id"));
            
            visitPageOpenCart();
            shoppingCart.state_UDShoppingCart(expectedDelivery.NextDay, Cypress.env('item.Description'), Cypress.env('item.PackSize'), Cypress.env('item.PackType'))
            searchInTheGlobalSearch(Cypress.env('item.IPUcode'));
            CheckTheDataGrid('InStock',expectedDelivery.NextDay.toUpperCase());
        });
        it('Case 12', () => {
        
            cy.updatePharmacy(useCutOff.yes, cutOffTime.before, localaDepot.Limerick, cutoffDepot.Ballina, pharmacyId);
            cy.updateUDStockProductStock(0, 1, 0, Cypress.env("item.Id"));
            
            visitPageOpenCart();
            shoppingCart.state_OOSShoppingCart(Cypress.env('item.Description'));
            searchInTheGlobalSearch(Cypress.env('item.IPUcode'));
            CheckTheDataGrid('OOS',expectedDelivery.empty);
        });
        it('Case 13', () => {
            
            cy.updatePharmacy(useCutOff.yes, cutOffTime.after, localaDepot.Limerick, cutoffDepot.Ballina, pharmacyId);
            cy.updateUDStockProductStock(0, 0, 1, Cypress.env("item.Id"));
            
            visitPageOpenCart();
            shoppingCart.state_OOSShoppingCart(Cypress.env('item.Description'));
            searchInTheGlobalSearch(Cypress.env('item.IPUcode'));
            CheckTheDataGrid('OOS',expectedDelivery.empty);
        });
        it('Case 14', () => {
            
            cy.updatePharmacy(useCutOff.yes, cutOffTime.after, localaDepot.Limerick, cutoffDepot.Ballina, pharmacyId);
            cy.updateUDStockProductStock(1, 0, 0, Cypress.env("item.Id"));
            
            visitPageOpenCart();
            shoppingCart.state_UDShoppingCart(expectedDelivery.NextDay, Cypress.env('item.Description'), Cypress.env('item.PackSize'), Cypress.env('item.PackType'))
            searchInTheGlobalSearch(Cypress.env('item.IPUcode'));
            CheckTheDataGrid('InStock',expectedDelivery.NextDay.toUpperCase());
        });
        it('Case 15', () => {
            
            cy.updatePharmacy(useCutOff.yes, cutOffTime.after, localaDepot.Limerick, cutoffDepot.Ballina, pharmacyId);
            cy.updateUDStockProductStock(0, 1, 0, Cypress.env("item.Id"));
            
            visitPageOpenCart();
            shoppingCart.state_OOSShoppingCart(Cypress.env('item.Description'));
            searchInTheGlobalSearch(Cypress.env('item.IPUcode'));
            CheckTheDataGrid('OOS',expectedDelivery.empty);
        });

        it('Case 16', () => {
            
            
            cy.updatePharmacy(useCutOff.no, cutOffTime.null, localaDepot.Limerick, cutoffDepot.Ballina, pharmacyId);
            cy.updateUDStockProductStock(0, 0, 1, Cypress.env("item.Id"));
            
            visitPageOpenCart();
            shoppingCart.state_OOSShoppingCart(Cypress.env('item.Description'));
            searchInTheGlobalSearch(Cypress.env('item.IPUcode'));
            CheckTheDataGrid('OOS',expectedDelivery.empty);
        });

        it('Case 17', () => {
            
            
            cy.updatePharmacy(useCutOff.no, cutOffTime.null, localaDepot.Limerick, cutoffDepot.Ballina, pharmacyId);
            cy.updateUDStockProductStock(1, 0, 0, Cypress.env("item.Id"));
            
            visitPageOpenCart();
            shoppingCart.state_OOSShoppingCart(Cypress.env('item.Description'));
            searchInTheGlobalSearch(Cypress.env('item.IPUcode'));
            CheckTheDataGrid('OOS',expectedDelivery.empty);
        });

        it('Case 18', () => {
            
            
            cy.updatePharmacy(useCutOff.no, cutOffTime.null, localaDepot.Limerick, cutoffDepot.Ballina, pharmacyId);
            cy.updateUDStockProductStock(0, 1, 0, Cypress.env("item.Id"));
            
            visitPageOpenCart();
            shoppingCart.state_UDShoppingCart(expectedDelivery.NextDay, Cypress.env('item.Description'), Cypress.env('item.PackSize'), Cypress.env('item.PackType'))
            searchInTheGlobalSearch(Cypress.env('item.IPUcode'));
            CheckTheDataGrid('InStock',expectedDelivery.NextDay.toUpperCase());
        });
    });
    context('Local Depo: Dublin -> Cut-off Depo: Dublin', () => {
        it('Case 19', () => {
            
            cy.updatePharmacy(useCutOff.yes, cutOffTime.before, localaDepot.Dublin, cutoffDepot.Dublin, pharmacyId);
            cy.updateUDStockProductStock(0, 0, 1, Cypress.env("item.Id"));
            
            visitPageOpenCart();
            shoppingCart.state_OOSShoppingCart(Cypress.env('item.Description'));
            searchInTheGlobalSearch(Cypress.env('item.IPUcode'));
            CheckTheDataGrid('OOS',expectedDelivery.empty);
        });

        it('Case 20', () => {
            
            cy.updatePharmacy(useCutOff.yes, cutOffTime.before, localaDepot.Dublin, cutoffDepot.Dublin, pharmacyId);
            cy.updateUDStockProductStock(1, 0, 0, Cypress.env("item.Id"));
            
            visitPageOpenCart();
            shoppingCart.state_OOSShoppingCart(Cypress.env('item.Description'));
            searchInTheGlobalSearch(Cypress.env('item.IPUcode'));
            CheckTheDataGrid('OOS',expectedDelivery.empty);
        });
        it('Case 21', () => {
            
            
            cy.updatePharmacy(useCutOff.yes, cutOffTime.before, localaDepot.Dublin, cutoffDepot.Dublin, pharmacyId);
            cy.updateUDStockProductStock(0, 1, 0, Cypress.env("item.Id"));
            
            visitPageOpenCart();
            shoppingCart.state_UDShoppingCart(expectedDelivery.SameDay, Cypress.env('item.Description'), Cypress.env('item.PackSize'), Cypress.env('item.PackType'))
            searchInTheGlobalSearch(Cypress.env('item.IPUcode'));
            CheckTheDataGrid('InStock',expectedDelivery.SameDay.toUpperCase());
        });
        it('Case 22', () => {
            
            
            cy.updatePharmacy(useCutOff.yes, cutOffTime.after, localaDepot.Dublin, cutoffDepot.Dublin, pharmacyId);
            cy.updateUDStockProductStock(0, 0, 1, Cypress.env("item.Id"));
            
            visitPageOpenCart();
            shoppingCart.state_OOSShoppingCart(Cypress.env('item.Description'));
            searchInTheGlobalSearch(Cypress.env('item.IPUcode'));
            CheckTheDataGrid('OOS',expectedDelivery.empty);
        });
        it('Case 23', () => {
            
           
            cy.updatePharmacy(useCutOff.yes, cutOffTime.after, localaDepot.Dublin, cutoffDepot.Dublin, pharmacyId);
            cy.updateUDStockProductStock(1, 0, 0, Cypress.env("item.Id"));
            
            visitPageOpenCart();
            shoppingCart.state_OOSShoppingCart(Cypress.env('item.Description'));
            searchInTheGlobalSearch(Cypress.env('item.IPUcode'));
            CheckTheDataGrid('OOS',expectedDelivery.empty);
        });
        it('Case 24', () => {
            
            
            cy.updatePharmacy(useCutOff.yes, cutOffTime.after, localaDepot.Dublin, cutoffDepot.Dublin, pharmacyId);
            cy.updateUDStockProductStock(0, 1, 0, Cypress.env("item.Id"));
            
            visitPageOpenCart();
            shoppingCart.state_UDShoppingCart(expectedDelivery.NextDay, Cypress.env('item.Description'), Cypress.env('item.PackSize'), Cypress.env('item.PackType'))
            searchInTheGlobalSearch(Cypress.env('item.IPUcode'));
            CheckTheDataGrid('InStock',expectedDelivery.NextDay.toUpperCase());
        });
        it('Case 25', () => {
            
            
            cy.updatePharmacy(useCutOff.no, cutOffTime.null, localaDepot.Dublin, cutoffDepot.Dublin, pharmacyId);
            cy.updateUDStockProductStock(0, 0, 1, Cypress.env("item.Id"));
            
            visitPageOpenCart();
            shoppingCart.state_OOSShoppingCart(Cypress.env('item.Description'));
            searchInTheGlobalSearch(Cypress.env('item.IPUcode'));
            CheckTheDataGrid('OOS',expectedDelivery.empty);
        });
        it('Case 26', () => {
            
            
            cy.updatePharmacy(useCutOff.no, cutOffTime.null, localaDepot.Dublin, cutoffDepot.Dublin, pharmacyId);
            cy.updateUDStockProductStock(1, 0, 0, Cypress.env("item.Id"));
            
            visitPageOpenCart();
            shoppingCart.state_OOSShoppingCart(Cypress.env('item.Description'));
            searchInTheGlobalSearch(Cypress.env('item.IPUcode'));
            CheckTheDataGrid('OOS',expectedDelivery.empty);
        });
        it('Case 27', () => {
            
            
            cy.updatePharmacy(useCutOff.no, cutOffTime.null, localaDepot.Dublin, cutoffDepot.Dublin, pharmacyId);
            cy.updateUDStockProductStock(0, 1, 0, Cypress.env("item.Id"));
            
            visitPageOpenCart();
            shoppingCart.state_UDShoppingCart(expectedDelivery.NextDay, Cypress.env('item.Description'), Cypress.env('item.PackSize'), Cypress.env('item.PackType'))
            searchInTheGlobalSearch(Cypress.env('item.IPUcode'));
            CheckTheDataGrid('InStock',expectedDelivery.NextDay.toUpperCase());
        });
    });
    context('Local Depo: Dublin -> Cut-off Depo: Ballina', () => {
        it('Case 28', () => {
            
            cy.updatePharmacy(useCutOff.yes, cutOffTime.before, localaDepot.Dublin, cutoffDepot.Ballina, pharmacyId);
            cy.updateUDStockProductStock(0, 0, 1, Cypress.env("item.Id"));
            
            visitPageOpenCart();
            shoppingCart.state_OOSShoppingCart(Cypress.env('item.Description'));
            searchInTheGlobalSearch(Cypress.env('item.IPUcode'));
            CheckTheDataGrid('OOS',expectedDelivery.empty);
        });

        it('Case 29', () => {
            
            cy.updatePharmacy(useCutOff.yes, cutOffTime.before, localaDepot.Dublin, cutoffDepot.Ballina, pharmacyId);
            cy.updateUDStockProductStock(1, 0, 0, Cypress.env("item.Id"));
            
            visitPageOpenCart();
            shoppingCart.state_UDShoppingCart(expectedDelivery.NextDay, Cypress.env('item.Description'), Cypress.env('item.PackSize'), Cypress.env('item.PackType'))
            searchInTheGlobalSearch(Cypress.env('item.IPUcode'));
            CheckTheDataGrid('InStock',expectedDelivery.NextDay.toUpperCase());
        });
        it('Case 30', () => {
            
            
            cy.updatePharmacy(useCutOff.yes, cutOffTime.before, localaDepot.Dublin, cutoffDepot.Ballina, pharmacyId);
            cy.updateUDStockProductStock(0, 1, 0, Cypress.env("item.Id"));
            
            visitPageOpenCart();
            shoppingCart.state_UDShoppingCart(expectedDelivery.SameDay, Cypress.env('item.Description'), Cypress.env('item.PackSize'), Cypress.env('item.PackType'))
            searchInTheGlobalSearch(Cypress.env('item.IPUcode'));
            CheckTheDataGrid('InStock',expectedDelivery.SameDay.toUpperCase());
        });
        it('Case 31', () => {
            
            
            cy.updatePharmacy(useCutOff.yes, cutOffTime.after, localaDepot.Dublin, cutoffDepot.Ballina, pharmacyId);
            cy.updateUDStockProductStock(0, 0, 1, Cypress.env("item.Id"));
            
            visitPageOpenCart();
            shoppingCart.state_OOSShoppingCart(Cypress.env('item.Description'));
            searchInTheGlobalSearch(Cypress.env('item.IPUcode'));
            CheckTheDataGrid('OOS',expectedDelivery.empty);
        });
        it('Case 32', () => {
            
           
            cy.updatePharmacy(useCutOff.yes, cutOffTime.after, localaDepot.Dublin, cutoffDepot.Ballina, pharmacyId);
            cy.updateUDStockProductStock(1, 0, 0, Cypress.env("item.Id"));
            
            visitPageOpenCart();
            shoppingCart.state_UDShoppingCart(expectedDelivery.NextDay, Cypress.env('item.Description'), Cypress.env('item.PackSize'), Cypress.env('item.PackType'))
            searchInTheGlobalSearch(Cypress.env('item.IPUcode'));
            CheckTheDataGrid('InStock',expectedDelivery.NextDay.toUpperCase());
        });
        it('Case 33', () => {
            
            
            cy.updatePharmacy(useCutOff.yes, cutOffTime.after, localaDepot.Dublin, cutoffDepot.Ballina, pharmacyId);
            cy.updateUDStockProductStock(0, 1, 0, Cypress.env("item.Id"));
            
            visitPageOpenCart();
            shoppingCart.state_OOSShoppingCart(Cypress.env('item.Description'));
            searchInTheGlobalSearch(Cypress.env('item.IPUcode'));
            CheckTheDataGrid('OOS',expectedDelivery.empty);
        });
        it('Case 34', () => {
            
            
            cy.updatePharmacy(useCutOff.no, cutOffTime.null, localaDepot.Dublin, cutoffDepot.Ballina, pharmacyId);
            cy.updateUDStockProductStock(0, 0, 1, Cypress.env("item.Id"));
            
            visitPageOpenCart();
            shoppingCart.state_OOSShoppingCart(Cypress.env('item.Description'));
            searchInTheGlobalSearch(Cypress.env('item.IPUcode'));
            CheckTheDataGrid('OOS',expectedDelivery.empty);
        });
        it('Case 35', () => {
            
            
            cy.updatePharmacy(useCutOff.no, cutOffTime.null, localaDepot.Dublin, cutoffDepot.Ballina, pharmacyId);
            cy.updateUDStockProductStock(1, 0, 0, Cypress.env("item.Id"));
            
            visitPageOpenCart();
            shoppingCart.state_OOSShoppingCart(Cypress.env('item.Description'));
            searchInTheGlobalSearch(Cypress.env('item.IPUcode'));
            CheckTheDataGrid('OOS',expectedDelivery.empty);
        });
        it('Case 36', () => {
            
            
            cy.updatePharmacy(useCutOff.no, cutOffTime.null, localaDepot.Dublin, cutoffDepot.Ballina, pharmacyId);
            cy.updateUDStockProductStock(0, 1, 0, Cypress.env("item.Id"));
            
            visitPageOpenCart();
            shoppingCart.state_UDShoppingCart(expectedDelivery.NextDay, Cypress.env('item.Description'), Cypress.env('item.PackSize'), Cypress.env('item.PackType'))
            searchInTheGlobalSearch(Cypress.env('item.IPUcode'));
            CheckTheDataGrid('InStock',expectedDelivery.NextDay.toUpperCase());
        });
    });
});




function visitPageOpenCart(params) {
    cy.visit(Cypress.env("devURL"));
    cy.wait('@getShoppingCartItems').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
        cy.get('.fa-circle-thin').should('exist').click();
    });
}


function GetItemForTest() {
    cy.intercept(routes._call._getPageDataBrokeredEthical + '*').as('pageLoaded');
    cy.visitBrokeredEthical();
    cy.wait('@pageLoaded').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
        
        // let Cypress.env("item.Id") = 34217;
        // let ipuCode = 5055565748961;
        // let Description = 'AGOMELATINE FC TABS 25MG (ACCORD)'
        // let packSize = 28;
        // let packType = 'GENERIC';

        let i = randomItem();
        let Item = {
            Id: response.body.items[i].id,
            IpuCode: response.body.items[i].ipuCode,
            Description: response.body.items[i].description,
            PackSize: response.body.items[i].packSize,
            PackType: response.body.items[i].packType,
        };
        // let ItemGmsCode = 
        // let ItemCypress.env("item.Id") = response.body.items[i].id;
        // let ItemCypress.env("item.Id") = response.body.items[i].id;
        // let ItemCypress.env("item.Id") = response.body.items[i].id;
        // let ItemCypress.env("item.Id") = response.body.items[i].id;
        cy.log(Item);
        // cy.wrap(ItemGmsCode).as('itemGmsCode');
        
        // cy.wrap(ItemCypress.env("item.Id")).as('itemId');
    })
}

function searchInTheGlobalSearch(searchquerry) {
    
            
           
            
           

            

            // cy.get('@itemGmsCode').then((gmsCode) => {
            cy.log("Search Item in the global search");
            cy.get('.filter-container > .p-inputtext').clear().type(searchquerry);
            cy.get('.search-button > .p-button-rounded').should('be.visible').click();
            // })
    
    
    
}

function randomItem() { 
    const randomInt = Math.floor(Math.random() * 24) + 0;
    return randomInt;
 }

function CheckTheDataGrid(type, expectedDelivery) {
    
    switch (type) {
        case 'OOS':
            cy.get('.whiteRow > .expectedDelivery-column').should('have.text', `${expectedDelivery}`);
            cy.get('#stockIcon').should('have.attr', 'alt', 'cancel')
                .and('have.attr', 'src', '/assets/icons/cancel.png')
            cy.screenshot();
            break;
        case 'InStock':
            cy.get('.whiteRow > .expectedDelivery-column').should('have.text', ` ${expectedDelivery} `);
            cy.get('.inStock-column > .fa').should('be.visible')
            cy.screenshot();
            break;
        default:
            return null;
    }
}


function getItem() {
    cy.intercept(routes._call._getPageDataBrokeredEthical + '*').as('pageLoaded');
    cy.intercept(routes._call._filter_wholesaler + Wholeslaers.UD.Id + '*',).as('pageLoadedWholeslaer');
        cy.visitBrokeredEthical();
        cy.wait('@pageLoaded').then(({ response }) => {
            expect(response.statusCode).to.equal(200);
            
            cy.selectWholeslaer(Wholeslaers.UD.Name)
        
            cy.wait('@pageLoadedWholeslaer').then(({ response }) => {
            expect(response.statusCode).to.equal(200);
            
            let i = randomItem();
            cy.wrap({
                id: response.body.items[i].id,
                ipuCode: response.body.items[i].ipuCode,
                description: response.body.items[i].description,
                packSize: response.body.items[i].packSize,
                packType: response.body.items[i].packType,
              }).as('item');
              
            cy.get('@item').then(item => {
                    
                cy.getIPUCode(item.id).as('ipuCode')
                cy.get('@ipuCode').then(itemIPU => {
                    if (itemIPU != null) {
                        let currentDateTime = dayjs().format("YYYY-MM-DD HH:mm:ss:SSS");
                        cy.addItemToShoppingCart(itemIPU, Cypress.env("pharmacyId"), item.id, currentDateTime)

                        Cypress.env('Item.Id', item.Id);
                        Cypress.env('Item.IPUcode', itemIPU)
                        Cypress.env('Item.Description', item.description)
                        Cypress.env('Item.PackSize', item.packSize)
                        Cypress.env('Item.PackType', item.packType)
                          
                    } else {
                        getItem()
                    }
                })
            })
        })
    })
}

function getItemAndAddingItToShoppingCart() {
    cy.intercept(routes._call._getPageDataBrokeredEthical + '*').as('pageLoaded');
    cy.intercept(routes._call._filter_wholesaler + Wholeslaers.UD.Id + '*',).as('pageLoadedWholeslaer');
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
                    cy.task('setMyUniqueId', data[0])
                    // Cypress.env('item.Id', data[0]);
                    // cy.log(Cypress.env('item.Id'));
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
})}
