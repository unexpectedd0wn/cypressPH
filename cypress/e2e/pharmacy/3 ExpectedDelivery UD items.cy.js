const dayjs = require("dayjs");

import routes from "../../pagesANDmodules/routes";
import { 
    expectedDelivery, 
    depot, 
    cutOffTime, 
    useCutOff, 
    localaDepot, 
    cutoffDepot 
} from "../../support/enums";

describe('Expected Delivery in the Shopping Cart and On the Order page', () => {

    let pharmacyId = Cypress.env("pharmacyId");
    let stockProductId = 34217;
    let ipuCode = 5055565748961;
    let currentDateTime = dayjs().format("YYYY-MM-DD HH:mm:ss:SSS");
    

    
    before(() => {
        cy.CleanUpShoppingCart(pharmacyId);
        cy.AddItemToShoppingCart(ipuCode, pharmacyId, stockProductId, currentDateTime);
    });

    beforeEach(() => {
        cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
        cy.fixture("main").then(data => {
            cy.LoginAndCreateSession(data.pharmacyUserEmail, data.pharmacyUserPassword);
        });
    });

    after(() => {
        
    });
    context('Local Depo: Limerick -> Cut-off Depo: Dublin', () => {
        it.only('Case 01', () => {
            
            
            cy.updatePharmacy(useCutOff.yes, cutOffTime.before, localaDepot.Limerick, cutoffDepot.Dublin, pharmacyId);
            cy.UpdateStockProductStock(0, 0, 1, stockProductId);
            
            VisitPageAndOpenShoppingCart();
            Check_UnitedDrug_ShoppingCartTab(expectedDelivery.SameDay);
            TypeInTheGlobalSearch(ipuCode);
            CheckTheDataGrid('InStock',expectedDelivery.SameDay.toUpperCase());
        });

        it.only('Case 02', () => {
            
            cy.updatePharmacy(useCutOff.yes, cutOffTime.before, localaDepot.Limerick, cutoffDepot.Dublin, pharmacyId);
            cy.UpdateStockProductStock(1, 0, 0, stockProductId);
            
            VisitPageAndOpenShoppingCart();
            Check_OOS_ShoppingCartTab();
            TypeInTheGlobalSearch(ipuCode);
            CheckTheDataGrid('OOS',expectedDelivery.empty);
        });
        it.only('Case 03', () => {
            
            
            cy.updatePharmacy(useCutOff.yes, cutOffTime.before, localaDepot.Limerick, cutoffDepot.Dublin, pharmacyId);
            cy.UpdateStockProductStock(0, 1, 0, stockProductId);
            
            VisitPageAndOpenShoppingCart();
            Check_UnitedDrug_ShoppingCartTab(expectedDelivery.NextDay);
            TypeInTheGlobalSearch(ipuCode);
            CheckTheDataGrid('InStock',expectedDelivery.NextDay.toUpperCase());
        });
        it.only('Case 04', () => {
            
            
            cy.updatePharmacy(useCutOff.yes, cutOffTime.after, localaDepot.Limerick, cutoffDepot.Dublin, pharmacyId);
            cy.UpdateStockProductStock(0, 0, 1, stockProductId);
            
            VisitPageAndOpenShoppingCart();
            Check_OOS_ShoppingCartTab();
            TypeInTheGlobalSearch(ipuCode);
            CheckTheDataGrid('OOS',expectedDelivery.empty);
        });
        it.only('Case 05', () => {
            
           
            cy.updatePharmacy(useCutOff.yes, cutOffTime.after, localaDepot.Limerick, cutoffDepot.Dublin, pharmacyId);
            cy.UpdateStockProductStock(1, 0, 0, stockProductId);
            
            VisitPageAndOpenShoppingCart();
            Check_OOS_ShoppingCartTab();
            TypeInTheGlobalSearch(ipuCode);
            CheckTheDataGrid('OOS',expectedDelivery.empty);
        });
        it.only('Case 06', () => {
            
            
            cy.updatePharmacy(useCutOff.yes, cutOffTime.after, localaDepot.Limerick, cutoffDepot.Dublin, pharmacyId);
            cy.UpdateStockProductStock(0, 1, 0, stockProductId);
            
            VisitPageAndOpenShoppingCart();
            Check_UnitedDrug_ShoppingCartTab(expectedDelivery.NextDay);
            TypeInTheGlobalSearch(ipuCode);
            CheckTheDataGrid('InStock',expectedDelivery.NextDay.toUpperCase());
        });
        it.only('Case 07', () => {
            
            
            cy.updatePharmacy(useCutOff.no, cutOffTime.null, localaDepot.Limerick, cutoffDepot.Dublin, pharmacyId);
            cy.UpdateStockProductStock(0, 0, 1, stockProductId);
            
            VisitPageAndOpenShoppingCart();
            Check_OOS_ShoppingCartTab();
            TypeInTheGlobalSearch(ipuCode);
            CheckTheDataGrid('OOS',expectedDelivery.empty);
        });
        it.only('Case 08', () => {
            
            
            cy.updatePharmacy(useCutOff.no, cutOffTime.null, localaDepot.Limerick, cutoffDepot.Dublin, pharmacyId);
            cy.UpdateStockProductStock(1, 0, 0, stockProductId);
            
            VisitPageAndOpenShoppingCart();
            Check_OOS_ShoppingCartTab();
            TypeInTheGlobalSearch(ipuCode);
            CheckTheDataGrid('OOS',expectedDelivery.empty);
        });
        it.only('Case 09', () => {
            
            
            cy.updatePharmacy(useCutOff.no, cutOffTime.null, localaDepot.Limerick, cutoffDepot.Dublin, pharmacyId);
            cy.UpdateStockProductStock(0, 1, 0, stockProductId);
            
            VisitPageAndOpenShoppingCart();
            Check_UnitedDrug_ShoppingCartTab(expectedDelivery.NextDay);
            TypeInTheGlobalSearch(ipuCode);
            CheckTheDataGrid('InStock',expectedDelivery.NextDay.toUpperCase());
        });
    });  
    context('Local Depo: Limerick -> Cut-off Depo: Ballina', () => {
        it('Case 10', () => {
            
            cy.updatePharmacy(useCutOff.yes, cutOffTime.before, localaDepot.Limerick, cutoffDepot.Ballina, pharmacyId);
            cy.UpdateStockProductStock(0, 0, 1, stockProductId);
            
            VisitPageAndOpenShoppingCart();
            Check_UnitedDrug_ShoppingCartTab(expectedDelivery.SameDay);
            TypeInTheGlobalSearch(ipuCode);
            CheckTheDataGrid('InStock',expectedDelivery.SameDay.toUpperCase());
        });
        it('Case 11', () => {
            
            cy.updatePharmacy(useCutOff.yes, cutOffTime.before, localaDepot.Limerick, cutoffDepot.Ballina, pharmacyId);
            cy.UpdateStockProductStock(1, 0, 0, stockProductId);
            
            VisitPageAndOpenShoppingCart();
            Check_UnitedDrug_ShoppingCartTab(expectedDelivery.NextDay);
            TypeInTheGlobalSearch(ipuCode);
            CheckTheDataGrid('InStock',expectedDelivery.NextDay.toUpperCase());
        });
        it('Case 12', () => {
        
            cy.updatePharmacy(useCutOff.yes, cutOffTime.before, localaDepot.Limerick, cutoffDepot.Ballina, pharmacyId);
            cy.UpdateStockProductStock(0, 1, 0, stockProductId);
            
            VisitPageAndOpenShoppingCart();
            Check_OOS_ShoppingCartTab();
            TypeInTheGlobalSearch(ipuCode);
            CheckTheDataGrid('OOS',expectedDelivery.empty);
        });
        it('Case 13', () => {
            
            cy.updatePharmacy(useCutOff.yes, cutOffTime.after, localaDepot.Limerick, cutoffDepot.Ballina, pharmacyId);
            cy.UpdateStockProductStock(0, 0, 1, stockProductId);
            
            VisitPageAndOpenShoppingCart();
            Check_OOS_ShoppingCartTab();
            TypeInTheGlobalSearch(ipuCode);
            CheckTheDataGrid('OOS',expectedDelivery.empty);
        });
        it('Case 14', () => {
            
            cy.updatePharmacy(useCutOff.yes, cutOffTime.after, localaDepot.Limerick, cutoffDepot.Ballina, pharmacyId);
            cy.UpdateStockProductStock(1, 0, 0, stockProductId);
            
            VisitPageAndOpenShoppingCart();
            Check_UnitedDrug_ShoppingCartTab(expectedDelivery.NextDay);
            TypeInTheGlobalSearch(ipuCode);
            CheckTheDataGrid('InStock',expectedDelivery.NextDay.toUpperCase());
        });
        it('Case 15', () => {
            
            cy.updatePharmacy(useCutOff.yes, cutOffTime.after, localaDepot.Limerick, cutoffDepot.Ballina, pharmacyId);
            cy.UpdateStockProductStock(0, 1, 0, stockProductId);
            
            VisitPageAndOpenShoppingCart();
            Check_OOS_ShoppingCartTab();
            TypeInTheGlobalSearch(ipuCode);
            CheckTheDataGrid('OOS',expectedDelivery.empty);
        });

        it('Case 16', () => {
            
            
            cy.updatePharmacy(useCutOff.no, cutOffTime.null, localaDepot.Limerick, cutoffDepot.Ballina, pharmacyId);
            cy.UpdateStockProductStock(0, 0, 1, stockProductId);
            
            VisitPageAndOpenShoppingCart();
            Check_OOS_ShoppingCartTab();
            TypeInTheGlobalSearch(ipuCode);
            CheckTheDataGrid('OOS',expectedDelivery.empty);
        });

        it('Case 17', () => {
            
            
            cy.updatePharmacy(useCutOff.no, cutOffTime.null, localaDepot.Limerick, cutoffDepot.Ballina, pharmacyId);
            cy.UpdateStockProductStock(1, 0, 0, stockProductId);
            
            VisitPageAndOpenShoppingCart();
            Check_OOS_ShoppingCartTab();
            TypeInTheGlobalSearch(ipuCode);
            CheckTheDataGrid('OOS',expectedDelivery.empty);
        });

        it('Case 18', () => {
            
            
            cy.updatePharmacy(useCutOff.no, cutOffTime.null, localaDepot.Limerick, cutoffDepot.Ballina, pharmacyId);
            cy.UpdateStockProductStock(0, 1, 0, stockProductId);
            
            VisitPageAndOpenShoppingCart();
            Check_UnitedDrug_ShoppingCartTab(expectedDelivery.NextDay);
            TypeInTheGlobalSearch(ipuCode);
            CheckTheDataGrid('InStock',expectedDelivery.NextDay.toUpperCase());
        });
    });
    context('Local Depo: Dublin -> Cut-off Depo: Dublin', () => {
        it('Case 19', () => {
            
            cy.updatePharmacy(useCutOff.yes, cutOffTime.before, localaDepot.Dublin, cutoffDepot.Dublin, pharmacyId);
            cy.UpdateStockProductStock(0, 0, 1, stockProductId);
            
            VisitPageAndOpenShoppingCart();
            Check_OOS_ShoppingCartTab();
            TypeInTheGlobalSearch(ipuCode);
            CheckTheDataGrid('OOS',expectedDelivery.empty);
        });

        it('Case 20', () => {
            
            cy.updatePharmacy(useCutOff.yes, cutOffTime.before, localaDepot.Dublin, cutoffDepot.Dublin, pharmacyId);
            cy.UpdateStockProductStock(1, 0, 0, stockProductId);
            
            VisitPageAndOpenShoppingCart();
            Check_OOS_ShoppingCartTab();
            TypeInTheGlobalSearch(ipuCode);
            CheckTheDataGrid('OOS',expectedDelivery.empty);
        });
        it('Case 21', () => {
            
            
            cy.updatePharmacy(useCutOff.yes, cutOffTime.before, localaDepot.Dublin, cutoffDepot.Dublin, pharmacyId);
            cy.UpdateStockProductStock(0, 1, 0, stockProductId);
            
            VisitPageAndOpenShoppingCart();
            Check_UnitedDrug_ShoppingCartTab(expectedDelivery.SameDay);
            TypeInTheGlobalSearch(ipuCode);
            CheckTheDataGrid('InStock',expectedDelivery.SameDay.toUpperCase());
        });
        it('Case 22', () => {
            
            
            cy.updatePharmacy(useCutOff.yes, cutOffTime.after, localaDepot.Dublin, cutoffDepot.Dublin, pharmacyId);
            cy.UpdateStockProductStock(0, 0, 1, stockProductId);
            
            VisitPageAndOpenShoppingCart();
            Check_OOS_ShoppingCartTab();
            TypeInTheGlobalSearch(ipuCode);
            CheckTheDataGrid('OOS',expectedDelivery.empty);
        });
        it('Case 23', () => {
            
           
            cy.updatePharmacy(useCutOff.yes, cutOffTime.after, localaDepot.Dublin, cutoffDepot.Dublin, pharmacyId);
            cy.UpdateStockProductStock(1, 0, 0, stockProductId);
            
            VisitPageAndOpenShoppingCart();
            Check_OOS_ShoppingCartTab();
            TypeInTheGlobalSearch(ipuCode);
            CheckTheDataGrid('OOS',expectedDelivery.empty);
        });
        it('Case 24', () => {
            
            
            cy.updatePharmacy(useCutOff.yes, cutOffTime.after, localaDepot.Dublin, cutoffDepot.Dublin, pharmacyId);
            cy.UpdateStockProductStock(0, 1, 0, stockProductId);
            
            VisitPageAndOpenShoppingCart();
            Check_UnitedDrug_ShoppingCartTab(expectedDelivery.NextDay);
            TypeInTheGlobalSearch(ipuCode);
            CheckTheDataGrid('InStock',expectedDelivery.NextDay.toUpperCase());
        });
        it('Case 25', () => {
            
            
            cy.updatePharmacy(useCutOff.no, cutOffTime.null, localaDepot.Dublin, cutoffDepot.Dublin, pharmacyId);
            cy.UpdateStockProductStock(0, 0, 1, stockProductId);
            
            VisitPageAndOpenShoppingCart();
            Check_OOS_ShoppingCartTab();
            TypeInTheGlobalSearch(ipuCode);
            CheckTheDataGrid('OOS',expectedDelivery.empty);
        });
        it('Case 26', () => {
            
            
            cy.updatePharmacy(useCutOff.no, cutOffTime.null, localaDepot.Dublin, cutoffDepot.Dublin, pharmacyId);
            cy.UpdateStockProductStock(1, 0, 0, stockProductId);
            
            VisitPageAndOpenShoppingCart();
            Check_OOS_ShoppingCartTab();
            TypeInTheGlobalSearch(ipuCode);
            CheckTheDataGrid('OOS',expectedDelivery.empty);
        });
        it('Case 27', () => {
            
            
            cy.updatePharmacy(useCutOff.no, cutOffTime.null, localaDepot.Dublin, cutoffDepot.Dublin, pharmacyId);
            cy.UpdateStockProductStock(0, 1, 0, stockProductId);
            
            VisitPageAndOpenShoppingCart();
            Check_UnitedDrug_ShoppingCartTab(expectedDelivery.NextDay);
            TypeInTheGlobalSearch(ipuCode);
            CheckTheDataGrid('InStock',expectedDelivery.NextDay.toUpperCase());
        });
    });
    context('Local Depo: Dublin -> Cut-off Depo: Ballina', () => {
        it('Case 28', () => {
            
            cy.updatePharmacy(useCutOff.yes, cutOffTime.before, localaDepot.Dublin, cutoffDepot.Ballina, pharmacyId);
            cy.UpdateStockProductStock(0, 0, 1, stockProductId);
            
            VisitPageAndOpenShoppingCart();
            Check_OOS_ShoppingCartTab();
            TypeInTheGlobalSearch(ipuCode);
            CheckTheDataGrid('OOS',expectedDelivery.empty);
        });

        it('Case 29', () => {
            
            cy.updatePharmacy(useCutOff.yes, cutOffTime.before, localaDepot.Dublin, cutoffDepot.Ballina, pharmacyId);
            cy.UpdateStockProductStock(1, 0, 0, stockProductId);
            
            VisitPageAndOpenShoppingCart();
            Check_UnitedDrug_ShoppingCartTab(expectedDelivery.NextDay);
            TypeInTheGlobalSearch(ipuCode);
            CheckTheDataGrid('InStock',expectedDelivery.NextDay.toUpperCase());
        });
        it('Case 30', () => {
            
            
            cy.updatePharmacy(useCutOff.yes, cutOffTime.before, localaDepot.Dublin, cutoffDepot.Ballina, pharmacyId);
            cy.UpdateStockProductStock(0, 1, 0, stockProductId);
            
            VisitPageAndOpenShoppingCart();
            Check_UnitedDrug_ShoppingCartTab(expectedDelivery.SameDay);
            TypeInTheGlobalSearch(ipuCode);
            CheckTheDataGrid('InStock',expectedDelivery.SameDay.toUpperCase());
        });
        it('Case 31', () => {
            
            
            cy.updatePharmacy(useCutOff.yes, cutOffTime.after, localaDepot.Dublin, cutoffDepot.Ballina, pharmacyId);
            cy.UpdateStockProductStock(0, 0, 1, stockProductId);
            
            VisitPageAndOpenShoppingCart();
            Check_OOS_ShoppingCartTab();
            TypeInTheGlobalSearch(ipuCode);
            CheckTheDataGrid('OOS',expectedDelivery.empty);
        });
        it('Case 32', () => {
            
           
            cy.updatePharmacy(useCutOff.yes, cutOffTime.after, localaDepot.Dublin, cutoffDepot.Ballina, pharmacyId);
            cy.UpdateStockProductStock(1, 0, 0, stockProductId);
            
            VisitPageAndOpenShoppingCart();
            Check_UnitedDrug_ShoppingCartTab(expectedDelivery.NextDay);
            TypeInTheGlobalSearch(ipuCode);
            CheckTheDataGrid('InStock',expectedDelivery.NextDay.toUpperCase());
        });
        it('Case 33', () => {
            
            
            cy.updatePharmacy(useCutOff.yes, cutOffTime.after, localaDepot.Dublin, cutoffDepot.Ballina, pharmacyId);
            cy.UpdateStockProductStock(0, 1, 0, stockProductId);
            
            VisitPageAndOpenShoppingCart();
            Check_OOS_ShoppingCartTab();
            TypeInTheGlobalSearch(ipuCode);
            CheckTheDataGrid('OOS',expectedDelivery.empty);
        });
        it('Case 34', () => {
            
            
            cy.updatePharmacy(useCutOff.no, cutOffTime.null, localaDepot.Dublin, cutoffDepot.Ballina, pharmacyId);
            cy.UpdateStockProductStock(0, 0, 1, stockProductId);
            
            VisitPageAndOpenShoppingCart();
            Check_OOS_ShoppingCartTab();
            TypeInTheGlobalSearch(ipuCode);
            CheckTheDataGrid('OOS',expectedDelivery.empty);
        });
        it('Case 35', () => {
            
            
            cy.updatePharmacy(useCutOff.no, cutOffTime.null, localaDepot.Dublin, cutoffDepot.Ballina, pharmacyId);
            cy.UpdateStockProductStock(1, 0, 0, stockProductId);
            
            VisitPageAndOpenShoppingCart();
            Check_OOS_ShoppingCartTab();
            TypeInTheGlobalSearch(ipuCode);
            CheckTheDataGrid('OOS',expectedDelivery.empty);
        });
        it('Case 36', () => {
            
            
            cy.updatePharmacy(useCutOff.no, cutOffTime.null, localaDepot.Dublin, cutoffDepot.Ballina, pharmacyId);
            cy.UpdateStockProductStock(0, 1, 0, stockProductId);
            
            VisitPageAndOpenShoppingCart();
            Check_UnitedDrug_ShoppingCartTab(expectedDelivery.NextDay);
            TypeInTheGlobalSearch(ipuCode);
            CheckTheDataGrid('InStock',expectedDelivery.NextDay.toUpperCase());
        });
    });
});


function Check_UnitedDrug_ShoppingCartTab(expectedDelivery){
    
    //leftSummaryCard
    cy.get('.summary-card').should('exist').and('be.visible');
    cy.get('[rte="1Be"] > span').should('have.text', 'United Drug').and('be.visible');
    cy.get('.summary-items-span').should('have.text', ' 1 item ').and('be.visible');
    cy.get('.ng-star-inserted > .p-badge').should('be.visible')
    cy.get('.inStock-span').should('have.text', ` In stock: ${expectedDelivery}`).and('be.visible');
    // cy.get('.inStock-span > .ng-star-inserted > span').should('have.text', `${expectedDelivery}`).and('be.visible');
    
    //title
    cy.get('.selectedWholesaler-span').should('have.text', ' United Drug ').and('be.visible');
}


function Check_OOS_ShoppingCartTab(){
    //Shopping cart tab is displayed
    cy.get('.summary-card').should('exist').and('be.visible');
                
    //Make sure Item moved to the OOS TAB
    cy.get('.special-tab-title > span').should('have.text', 'Out of Stock');
    cy.get('.summary-items-span').should('have.text', ' 1 item ');
    cy.get('.red-badge').should('be.visible')
    
}

function VisitPageAndOpenShoppingCart(params) {
    cy.visit(Cypress.env("devURL"));
    cy.wait('@getShoppingCartItems').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
        cy.get('.fa-circle-thin').should('exist').click();
    });
}


function GetItemForTest(params) {
    cy.intercept(routes._call._getPageDataBrokeredEthical + '*').as('pageLoaded');
    cy.VisitBrokeredEthical();
    cy.wait('@pageLoaded').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
        
        let i = randomItem();
        let ItemGmsCode = response.body.items[i].ipuCode;
        let ItemStockProductId = response.body.items[i].id;
        cy.log(ItemGmsCode);
        cy.wrap(ItemGmsCode).as('itemGmsCode');
        cy.log(ItemStockProductId);
        cy.wrap(ItemStockProductId).as('itemId');
    })
}

function TypeInTheGlobalSearch(searchquerry) {
    
            
           
            
           

            

            cy.get('@itemGmsCode').then((gmsCode) => {
            cy.log("Search Item in the global search");
            cy.get('.filter-container > .p-inputtext').clear().type(searchquerry);
            cy.get('.search-button > .p-button-rounded').should('be.visible').click();
            })
    
    
    
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
  



