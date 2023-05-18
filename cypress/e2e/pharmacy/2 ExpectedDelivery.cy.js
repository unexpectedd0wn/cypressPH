const dayjs = require("dayjs");
import routes from "../../pages/routes";


describe('Expected Delivery in the Shopping Cart and On the Order page', () => {

    let pharmacyId = Cypress.env("pharmacyId");
    let stockProductId = 34217;
    let ipuCode = 5055565748961;
    let currentDateTime = dayjs().format("YYYY-MM-DD HH:mm:ss:SSS");
    let beforeCutOffTime = "'23:59:00.0000000'";
    let afterCutOffTime = "'00:01:00.0000000'";
    let emptyExpectedDelivery = '  ';

    
    before(() => {
        cy.CleanUpShoppingCart(pharmacyId);
        cy.AddItemToShoppingCart(ipuCode, pharmacyId, stockProductId, currentDateTime);
    });

    beforeEach(() => {
        cy.fixture("main").then(data => {
            cy.LoginAndCreateSession(data.pharmacyUserEmail, data.pharmacyUserPassword);
        });
    });

    after(() => {
        
    });
    
    context('Local Depo: Limerick -> Cut-off Depo: Dublin', () => {
        it('Case 01', () => {
            
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.updatePharmacy(1, beforeCutOffTime, 2, 1, pharmacyId);
            cy.updateStockProducts(0, 0, 1, stockProductId);
            
            VisitPageAndOpenShoppingCart();
            Check_UnitedDrug_ShoppingCartTab('Same Day');
            TypeInTheGlobalSearch(ipuCode);
            CheckTheDataGrid('InStock','SAME DAY');
        });

        it('Case 02', () => {
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.updatePharmacy(1, beforeCutOffTime, 2, 1, pharmacyId);
            cy.updateStockProducts(1, 0, 0, stockProductId);
            
            VisitPageAndOpenShoppingCart();
            Check_OOS_ShoppingCartTab();
            TypeInTheGlobalSearch(ipuCode);
            CheckTheDataGrid('OOS',emptyExpectedDelivery);
        });
        it('Case 03', () => {
            
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.updatePharmacy(1, beforeCutOffTime, 2, 1, pharmacyId);
            cy.updateStockProducts(0, 1, 0, stockProductId);
            
            VisitPageAndOpenShoppingCart();
            Check_UnitedDrug_ShoppingCartTab('Next Day');
            TypeInTheGlobalSearch(ipuCode);
            CheckTheDataGrid('InStock','NEXT DAY');
        });
        it('Case 04', () => {
            
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.updatePharmacy(1, afterCutOffTime, 2, 1, pharmacyId);
            cy.updateStockProducts(0, 0, 1, stockProductId);
            
            VisitPageAndOpenShoppingCart();
            Check_OOS_ShoppingCartTab();
            TypeInTheGlobalSearch(ipuCode);
            CheckTheDataGrid('OOS',emptyExpectedDelivery);
        });
        it('Case 05', () => {
            
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.updatePharmacy(1, afterCutOffTime, 2, 1, pharmacyId);
            cy.updateStockProducts(1, 0, 0, stockProductId);
            
            VisitPageAndOpenShoppingCart();
            Check_OOS_ShoppingCartTab();
            TypeInTheGlobalSearch(ipuCode);
            CheckTheDataGrid('OOS',emptyExpectedDelivery);
        });
        it('Case 06', () => {
            
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.updatePharmacy(1, afterCutOffTime, 2, 1, pharmacyId);
            cy.updateStockProducts(0, 1, 0, stockProductId);
            
            VisitPageAndOpenShoppingCart();
            Check_UnitedDrug_ShoppingCartTab('Next Day');
            TypeInTheGlobalSearch(ipuCode);
            CheckTheDataGrid('InStock','NEXT DAY');
        });
        it('Case 07', () => {
            
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.updatePharmacy(0, 'null', 2, 1, pharmacyId);
            cy.updateStockProducts(0, 0, 1, stockProductId);
            
            VisitPageAndOpenShoppingCart();
            Check_OOS_ShoppingCartTab();
            TypeInTheGlobalSearch(ipuCode);
            CheckTheDataGrid('OOS',emptyExpectedDelivery);
        });
        it('Case 08', () => {
            
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.updatePharmacy(0, 'null', 2, 1, pharmacyId);
            cy.updateStockProducts(1, 0, 0, stockProductId);
            
            VisitPageAndOpenShoppingCart();
            Check_OOS_ShoppingCartTab();
            TypeInTheGlobalSearch(ipuCode);
            CheckTheDataGrid('OOS',emptyExpectedDelivery);
        });
        it('Case 09', () => {
            
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.updatePharmacy(0, 'null', 2, 1, pharmacyId);
            cy.updateStockProducts(0, 1, 0, stockProductId);
            
            VisitPageAndOpenShoppingCart();
            Check_UnitedDrug_ShoppingCartTab('Next Day');
            TypeInTheGlobalSearch(ipuCode);
            CheckTheDataGrid('InStock','NEXT DAY');
        });
    });
    
    context('Local Depo: Limerick -> Cut-off Depo: Ballina', () => {
        it('Case 10', () => {
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.updatePharmacy(1, beforeCutOffTime, 2, 3, pharmacyId);
            cy.updateStockProducts(0, 0, 1, stockProductId);
            
            VisitPageAndOpenShoppingCart();
            Check_UnitedDrug_ShoppingCartTab('Same Day');
            TypeInTheGlobalSearch(ipuCode);
            CheckTheDataGrid('InStock','SAME DAY');
        });
        it('Case 11', () => {
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.updatePharmacy(1, beforeCutOffTime, 2, 3, pharmacyId);
            cy.updateStockProducts(1, 0, 0, stockProductId);
            
            VisitPageAndOpenShoppingCart();
            Check_UnitedDrug_ShoppingCartTab('Next Day');
            TypeInTheGlobalSearch(ipuCode);
            CheckTheDataGrid('InStock','NEXT DAY');
        });
        it('Case 12', () => {
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.updatePharmacy(1, beforeCutOffTime, 2, 3, pharmacyId);
            cy.updateStockProducts(1, 0, 0, stockProductId);
            
            VisitPageAndOpenShoppingCart();
            Check_UnitedDrug_ShoppingCartTab('Next Day');
            TypeInTheGlobalSearch(ipuCode);
            CheckTheDataGrid('InStock','NEXT DAY');
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

function TypeInTheGlobalSearch(searchquerry) {
    cy.get('.filter-container > .p-inputtext').clear().type(searchquerry);
    cy.get('.search-button > .p-button-rounded').should('be.visible').click();
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
  



