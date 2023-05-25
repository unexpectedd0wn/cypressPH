const dayjs = require("dayjs");
import routes from "../../pages/routes";
import { cutOffTime, depot, expectedDelivery } from "../../support/enums";
import substitutionTab from "../../pages/SubstitutionTab";


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
    
    let OrderedId = 27405;
    let OrderedDescription = "ATORVASTATIN FC  TABS 40MG (ACTAVIS) ATORVASTATIN";
    let bestPriceItemId = 27694;
    let bestPriceItemDescription = "ATORVASTATIN TABS 10MG (PFIZER) ATORVASTATIN";
    let orderedIPUcode = 5099627279192;
    let pharmacyId = Cypress.env("pharmacyId");
    
    let currentDateTime = dayjs().format("YYYY-MM-DD HH:mm:ss:SSS");
    
    
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

        it('06.01', () => {
            /*
            +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         NO        |        NO        |        NO        |        NO         |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.updatePharmacy(1, cutOffTime.before, 3, 1, pharmacyId);
            cy.UpdateStockProductStock(0, 0, 0, OrderedId);
            cy.UpdateStockProductStock(0, 0, 0, bestPriceItemId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                substitutionTab.CheckSubstitutionState_PreferedNoOrder(
                    substitutionTab.OOS_OOS_Message(depot.Ballina, depot.Dublin), 
                    OrderedDescription
                )
            });
        });

        it('06.02', () => {
            /*
            +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |        YES        |       YES        |       YES        |       YES         |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.UpdateStockProductStock(1, 1, 0, OrderedId);
            cy.UpdateStockProductStock(1, 1, 0, bestPriceItemId);
            cy.updatePharmacy(1, cutOffTime.before, 3, 1, pharmacyId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                substitutionTab.CheckSubstitutionState_PreferedOrder(
                    substitutionTab.BackInStock_Message(depot.Ballina), 
                    bestPriceItemDescription, 
                    expectedDelivery.SameDay
                )
            });
        });

        it('06.03', () => {
            /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         YES       |        NO        |        YES        |        NO        |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.UpdateStockProductStock(1, 0, 0, OrderedId);
            cy.UpdateStockProductStock(1, 0, 0, bestPriceItemId);
            cy.updatePharmacy(1, cutOffTime.before, 3, 1, pharmacyId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                substitutionTab.CheckSubstitutionState_PreferedOrder(
                    substitutionTab.BackInStock_Message(depot.Ballina), 
                    bestPriceItemDescription, 
                    expectedDelivery.SameDay
                )
            });
        });

        it('06.04', () => {
            /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         NO        |        YES       |        NO        |        YES        |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.UpdateStockProductStock(0, 1, 0, OrderedId);
            cy.UpdateStockProductStock(0, 1, 0, bestPriceItemId);
            cy.updatePharmacy(1, cutOffTime.before, 3, 1, pharmacyId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                substitutionTab.CheckSubstitutionState_PreferedOrder(
                    substitutionTab.OOS_BackInStock_Message(depot.Ballina, depot.Dublin), 
                    bestPriceItemDescription, 
                    expectedDelivery.NextDay
                )
            });
        });

        it('06.05', () => {
            /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      NO       |         YES       |        YES       |        YES       |        YES        |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.UpdateStockProductStock(1, 1, 0, OrderedId);
            cy.UpdateStockProductStock(1, 1, 0, bestPriceItemId);
            cy.updatePharmacy(1, cutOffTime.after, 3, 1, pharmacyId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
                
                substitutionTab.CheckSubstitutionState_PreferedOrder(
                    substitutionTab.BackInStock_Message(depot.Dublin), 
                    bestPriceItemDescription, 
                    expectedDelivery.NextDay
                )
            });
        });

        it('06.06', () => {
            /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      NO       |         NO        |        YES       |        NO        |        YES        |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.UpdateStockProductStock(0, 1, 0, OrderedId);
            cy.UpdateStockProductStock(0, 1, 0, bestPriceItemId);
            cy.updatePharmacy(1, cutOffTime.after, 3, 1, pharmacyId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
                
                substitutionTab.CheckSubstitutionState_PreferedOrder(
                    substitutionTab.BackInStock_Message(depot.Dublin), 
                    bestPriceItemDescription, 
                    expectedDelivery.NextDay
                )
            });
        });

        it('06.07', () => {
            /*
            +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      NO       |         NO        |        NO        |        NO        |       NO          |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.UpdateStockProductStock(0, 0, 0, OrderedId);
            cy.UpdateStockProductStock(0, 0, 0, bestPriceItemId);
            cy.updatePharmacy(1, cutOffTime.after, 3, 1, pharmacyId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
                
                substitutionTab.CheckSubstitutionState_PreferedNoOrder(
                    substitutionTab.OOS_Message(depot.Dublin), 
                    OrderedDescription
                )
            });
        });
    })

    context('Dublin -> Dublin', () => {
        it('07.01', () => {
            /*
            +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         NO        |        NO        |        NO        |        NO         |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.updatePharmacy(1, cutOffTime.before, 1, 1, pharmacyId);
            cy.UpdateStockProductStock(0, 0, 0, OrderedId);
            cy.UpdateStockProductStock(0, 0, 0, bestPriceItemId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                substitutionTab.CheckSubstitutionState_PreferedNoOrder(
                    substitutionTab.OOS_Message(depot.Dublin), 
                    OrderedDescription
                )
            });
        });

        it('07.02', () => {
            /*
            +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |        YES        |       YES        |       YES        |       YES         |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.UpdateStockProductStock(0, 1, 0, OrderedId);
            cy.UpdateStockProductStock(0, 1, 0, bestPriceItemId);
            cy.updatePharmacy(1, cutOffTime.before, 1, 1, pharmacyId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                substitutionTab.CheckSubstitutionState_PreferedOrder(
                    substitutionTab.BackInStock_Message(depot.Dublin), 
                    bestPriceItemDescription, 
                    expectedDelivery.SameDay
                )
            });
        });

        it('07.05', () => {
            /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      NO       |         YES       |        YES       |        YES       |        YES        |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.UpdateStockProductStock(0, 1, 0, OrderedId);
            cy.UpdateStockProductStock(0, 1, 0, bestPriceItemId);
            cy.updatePharmacy(1, cutOffTime.after, 1, 1, pharmacyId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
                
                substitutionTab.CheckSubstitutionState_PreferedOrder(
                    substitutionTab.BackInStock_Message(depot.Dublin), 
                    bestPriceItemDescription, 
                    expectedDelivery.NextDay
                )
            });
        });

        it('07.07', () => {
            /*
            +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      NO       |         NO        |        NO        |        NO        |       NO          |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.UpdateStockProductStock(0, 0, 0, OrderedId);
            cy.UpdateStockProductStock(0, 0, 0, bestPriceItemId);
            cy.updatePharmacy(1, cutOffTime.after, 1, 1, pharmacyId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
                
                substitutionTab.CheckSubstitutionState_PreferedNoOrder(
                    substitutionTab.OOS_Message(depot.Dublin), 
                    OrderedDescription
                );
            });
        });
    })
});

















