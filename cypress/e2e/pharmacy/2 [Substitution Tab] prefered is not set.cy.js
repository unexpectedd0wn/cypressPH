const dayjs = require("dayjs");
import shoppingCart, { getPrefredInStock } from "../../pages/shoppingCart";
import routes from "../../pages/routes";

describe('Substitution Tab state checks when no Prefered set in the Brokered group', () => {
    /*
    VERY IMPORTANT NOTES:    
    Tests for the manual run ONLY, not for the CI        
    Before the test, to find the Brokered group with the 2 items BestPrice product and nextBestPrice product
    and in the group should not be set prefered item for the test Pharmacy
    and make sure Group is not blocked
    
    Set variables for test: 
            1. preferedId from StockProducts.Id
            2. nextBestId from StockProducts.Id
            3. preferedDescription from StockProducts.Description
            4. nextBestDescription Description from StockProducts.Description
            5. IPUcode: for the Prefered from StockProducts.IpuCode
    */
    //TEST VARIABLES SETUP//
    let OrderedId = 27405;
    let OrderedDescription = " ATORVASTATIN FC  TABS 40MG (ACTAVIS) ATORVASTATIN ";
    let bestPriceItemId = 27694;
    let bestPriceItemDescription = " ATORVASTATIN TABS 10MG (PFIZER) ATORVASTATIN ";
    let orderedIPUcode = 5099627279192;
    let pharmacyId = Cypress.env("pharmacyId");
    let beforeCutOffTime = "'23:59:00.0000000'";
    let afterCutOffTime = "'00:01:00.0000000'";
    let currentDateTime = dayjs().format("YYYY-MM-DD HH:mm:ss:SSS");
    let Ballina = "Ballina";
    let Dublin = "Dublin";
    let NextDay = 'Next Day';
    let SameDay = 'Same Day';
    
    before(() => {
        cy.CleanUpShoppingCart(pharmacyId);
        cy.AddItemToSubstitutionTab(OrderedId, pharmacyId, orderedIPUcode, currentDateTime);
        cy.clearAllCookies();
    });

    afterEach(() => {
        cy.screenshot()
        cy.Logout();
        cy.clearAllCookies();
    });

    context('Ballina -> Dublin', () => {

        it('Test 06.01', () => {
            /*
            +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         NO        |        NO        |        NO        |        NO         |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.updatePharmacy(1, beforeCutOffTime, 3, 1, pharmacyId);
            cy.updateStockProducts(0, 0, 0, OrderedId);
            cy.updateStockProducts(0, 0, 0, bestPriceItemId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                CheckSubstitutionState_PreferedNoOrder(OOS_OOS_Message(Ballina, Dublin), OrderedDescription);
            });
        });

        it('Test 06.02', () => {
            /*
            +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |        YES        |       YES        |       YES        |       YES         |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.updateStockProducts(1, 1, 0, OrderedId);
            cy.updateStockProducts(1, 1, 0, bestPriceItemId);
            cy.updatePharmacy(1, beforeCutOffTime, 3, 1, pharmacyId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                CheckSubstitutionState_PreferedOrder(BackInStock_Message(Ballina), bestPriceItemDescription, SameDay)
            });
        });

        it('Test 06.03', () => {
            /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         YES       |        NO        |        YES        |        NO        |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.updateStockProducts(1, 0, 0, OrderedId);
            cy.updateStockProducts(1, 0, 0, bestPriceItemId);
            cy.updatePharmacy(1, beforeCutOffTime, 3, 1, pharmacyId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                CheckSubstitutionState_PreferedOrder(BackInStock_Message(Ballina), bestPriceItemDescription, SameDay)
            });
        });

        it('Test 06.04', () => {
            /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         NO        |        YES       |        NO        |        YES        |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.updateStockProducts(0, 1, 0, OrderedId);
            cy.updateStockProducts(0, 1, 0, bestPriceItemId);
            cy.updatePharmacy(1, beforeCutOffTime, 3, 1, pharmacyId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                CheckSubstitutionState_PreferedOrder(OOS_BackInStock_Message(Ballina, Dublin), bestPriceItemDescription, NextDay)
            });
        });

        it('Test 06.05', () => {
            /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      NO       |         YES       |        YES       |        YES       |        YES        |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.updateStockProducts(1, 1, 0, OrderedId);
            cy.updateStockProducts(1, 1, 0, bestPriceItemId);
            cy.updatePharmacy(1, afterCutOffTime, 3, 1, pharmacyId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
                
                CheckSubstitutionState_PreferedOrder(BackInStock_Message(Dublin), bestPriceItemDescription, NextDay)
            });
        });

        it('Test 06.06', () => {
            /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      NO       |         NO        |        YES       |        NO        |        YES        |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.updateStockProducts(0, 1, 0, OrderedId);
            cy.updateStockProducts(0, 1, 0, bestPriceItemId);
            cy.updatePharmacy(1, afterCutOffTime, 3, 1, pharmacyId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
                
                CheckSubstitutionState_PreferedOrder(BackInStock_Message(Dublin), bestPriceItemDescription, NextDay)
            });
        });

        it('Test 06.07', () => {
            /*
            +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      NO       |         NO        |        NO        |        NO        |       NO          |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.updateStockProducts(0, 0, 0, OrderedId);
            cy.updateStockProducts(0, 0, 0, bestPriceItemId);
            cy.updatePharmacy(1, afterCutOffTime, 3, 1, pharmacyId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
                
                CheckSubstitutionState_PreferedNoOrder(OOS_Message(Dublin), OrderedDescription);
            });
        });
    })

    context('Dublin -> Dublin', () => {
        it('Test 07.01', () => {
            /*
            +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         NO        |        NO        |        NO        |        NO         |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.updatePharmacy(1, beforeCutOffTime, 1, 1, pharmacyId);
            cy.updateStockProducts(0, 0, 0, OrderedId);
            cy.updateStockProducts(0, 0, 0, bestPriceItemId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                CheckSubstitutionState_PreferedNoOrder(OOS_Message(Dublin), OrderedDescription);
            });
        });

        it('Test 07.02', () => {
            /*
            +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |        YES        |       YES        |       YES        |       YES         |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.updateStockProducts(0, 1, 0, OrderedId);
            cy.updateStockProducts(0, 1, 0, bestPriceItemId);
            cy.updatePharmacy(1, beforeCutOffTime, 1, 1, pharmacyId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                CheckSubstitutionState_PreferedOrder(BackInStock_Message(Dublin), bestPriceItemDescription, SameDay)
            });
        });

        it('Test 07.05', () => {
            /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      NO       |         YES       |        YES       |        YES       |        YES        |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.updateStockProducts(0, 1, 0, OrderedId);
            cy.updateStockProducts(0, 1, 0, bestPriceItemId);
            cy.updatePharmacy(1, afterCutOffTime, 1, 1, pharmacyId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
                
                CheckSubstitutionState_PreferedOrder(BackInStock_Message(Dublin), bestPriceItemDescription, NextDay)
            });
        });

        it('Test 07.07', () => {
            /*
            +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      NO       |         NO        |        NO        |        NO        |       NO          |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.updateStockProducts(0, 0, 0, OrderedId);
            cy.updateStockProducts(0, 0, 0, bestPriceItemId);
            cy.updatePharmacy(1, afterCutOffTime, 1, 1, pharmacyId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
                
                CheckSubstitutionState_PreferedNoOrder(OOS_Message(Dublin), OrderedDescription);
            });
        });
    })
});




function OOS_Message(depot) {
    let message = ` Out of Stock ${depot} `;
    return message;
}

function BackInStock_Message(depot) {
    let message = ` Back In Stock ${depot} `;
    return message;
}

function OOS_OOS_Message(depotMain, depotCutoff) {
    let message = `Out of Stock ${depotMain},  Out of Stock ${depotCutoff} `;
    return message;
}

function OOS_BackInStock_Message(depotMain, depotCutoff) {
    let message = `Out of Stock ${depotMain},  Back In Stock ${depotCutoff} `;
    return message;
}

function CheckSubstitutionState_PreferedToNextBest(StockNote, preferedDescription, nextBestDescription, ExpectedDelivery) {
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
}

function CheckSubstitutionState_PreferedNoOrder(StockNote, preferedDescription) {
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

}

function CheckSubstitutionState_PreferedOrder(StockNote, preferedDescription, ExpectedDelivery) {
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
        shoppingCart.substitutionTab.preferedTitle().should('have.text','Preferred:')
        shoppingCart.substitutionTab.preferedStockNote().should('have.text', StockNote).and('have.css', 'color', 'rgb(104, 159, 56)');
        shoppingCart.substitutionTab.preferedNetPrice().should('be.visible')
        shoppingCart.substitutionTab.preferedDescription().should('have.text', preferedDescription);
        
        shoppingCart.substitutionTab.nextBestTitle().should('not.exist')
        shoppingCart.substitutionTab.nextBestDescription().should('not.exist')
        shoppingCart.substitutionTab.nextBestNetPrice().should('not.exist')
        
        
        shoppingCart.substitutionTab.preferedExpectedDeliveryText().should('have.text', ExpectedDelivery)
        shoppingCart.substitutionTab.preferedExpectedDeliveryTick().should('be.visible')
        
        shoppingCart.substitutionTab.orderButton().should('be.visible')
        shoppingCart.substitutionTab.qtyInput().should('be.visible')
        shoppingCart.substitutionTab.deleteIcon().should('be.visible')
}


function CheckSubstitutionState_SelectPrefereNextBest(StockNote, preferedDescription, nextBestDescription, preferedExpectedDelivery, nextbestExpectedDelivery) {
        
    shoppingCart.substitutionTab.preferedTitle().should('have.text','Preferred:')
        shoppingCart.substitutionTab.preferedStockNote().should('have.text', StockNote).and('have.css', 'color', 'rgb(104, 159, 56)');
        shoppingCart.substitutionTab.preferedNetPrice().should('be.visible')
        shoppingCart.substitutionTab.preferedDescription().should('be.visible').and('have.text', preferedDescription);
        cy.get('.p-radiobutton-box.p-highlight').should('be.visible')
        cy.get('.next-day-text').should('have.text', preferedExpectedDelivery)
        
        shoppingCart.substitutionTab.nextBestTitle().should('have.text','Next Best:');
        shoppingCart.substitutionTab.nextBestDescription().should('be.visible').and('have.text', nextBestDescription);
        shoppingCart.substitutionTab.nextBestNetPrice().should('be.visible');
        cy.get('.selected-info > .ng-untouched > .p-radiobutton > .p-radiobutton-box').should('be.visible')
        cy.get('.next-best-expected-delivery > span').should('have.text', nextbestExpectedDelivery)
        
        
        // shoppingCart.substitutionTab.preferedExpectedDeliveryText().should('have.text', ExpectedDelivery)
        // shoppingCart.substitutionTab.preferedExpectedDeliveryTick().should('be.visible')
        
        shoppingCart.substitutionTab.orderButton().should('be.visible')
        shoppingCart.substitutionTab.qtyInput().should('be.visible')
        shoppingCart.substitutionTab.deleteIcon().should('be.visible')
}

















