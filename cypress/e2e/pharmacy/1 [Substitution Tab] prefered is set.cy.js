const dayjs = require("dayjs");
import shoppingCart, { getPrefredInStock } from "../../pages/shoppingCart";
import routes from "../../pages/routes";
import { expectedDelivery } from "../../support/enums";
import { depot } from "../../support/enums";
import { cutOffTime } from "../../support/enums";

describe('Substitution Tab states for UD items where prefered is set', () => {
    /*
    
    IMPORTANT NOTES:    
    Tests for the manual run ONLY, not for the CI        
    Before the test, to find the Brokered group with the 1 prefered item for the test Pharmacy
    and next best item(make sure Group is not blocked!)
    Set variables for test: 
            1. preferedId from StockProducts.Id
            2. nextBestId from StockProducts.Id
            3. preferedDescription from StockProducts.Description
            4. nextBestDescription Description from StockProducts.Description
            5. IPUcode: for the Prefered from StockProducts.IpuCode
    */
    let preferedId = 27405;
    let preferedDescription = "ATORVASTATIN FC  TABS 40MG (ACTAVIS) ATORVASTATIN";
    let nextBestId = 27694;
    let nextBestDescription = "ATORVASTATIN TABS 10MG (PFIZER) ATORVASTATIN";
    let IPUcode = 5099627279192;
    let currentDateTime = dayjs().subtract(2, 'hour').format("YYYY-MM-DD HH:mm:ss:SSS");
    let pharmacyId = Cypress.env("pharmacyId");
    
    before(() => {
        cy.CleanUpShoppingCart(pharmacyId);
        cy.AddItemToSubstitutionTab(preferedId, pharmacyId, IPUcode, currentDateTime);
        cy.clearAllCookies();
    });

    afterEach(() => {
        cy.screenshot()
        cy.Logout();
        cy.clearAllCookies();
    });

    context('Ballina -> Dublin', () => {

        it.only('01.01', () => {
            /*
            +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         NO        |        NO        |        NO        |        YES        |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.updatePharmacy(1, cutOffTime.before, 3, 1, pharmacyId);
            cy.UpdateStockProductStocktock(0, 0, 0, preferedId);
            cy.UpdateStockProductStocktock(0, 1, 0, nextBestId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                CheckSubstitutionState_PreferedToNextBest(
                    OOS_OOS_Message(depot.Ballina, depot.Dublin),
                    preferedDescription,
                    nextBestDescription,
                    expectedDelivery.NextDay
                )
            });
        });

        it('01.02', () => {
            /*
            +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         NO        |        NO        |        NO        |        NO         |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.UpdateStockProductStocktock(0, 0, 0, preferedId);
            cy.UpdateStockProductStocktock(0, 0, 0, nextBestId);
            cy.updatePharmacy(1, cutOffTime.before, 3, 1, pharmacyId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                CheckSubstitutionState_PreferedNoOrder(
                    OOS_OOS_Message(depot.Ballina, depot.Dublin),
                    preferedDescription
                )
            });
        });

        it.only('01.03', () => {
            /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         NO        |        NO        |        YES        |        NO        |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.UpdateStockProductStocktock(0, 0, 0, preferedId);
            cy.UpdateStockProductStocktock(1, 0, 0, nextBestId);
            cy.updatePharmacy(1, cutOffTime.before, 3, 1, pharmacyId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                CheckSubstitutionState_PreferedToNextBest(
                    OOS_OOS_Message(depot.Ballina, depot.Dublin), 
                    preferedDescription, 
                    nextBestDescription, 
                    expectedDelivery.NextDay
                )
            });
        });

        it('01.04', () => {
            /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         YES        |        NO        |        NO        |        NO        |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.UpdateStockProductStock(1, 0, 0, preferedId);
            cy.UpdateStockProductStock(0, 0, 0, nextBestId);
            cy.updatePharmacy(1, cutOffTime.before, 3, 1, pharmacyId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                CheckSubstitutionState_PreferedOrder(
                    BackInStock_Message(depot.Ballina), 
                    preferedDescription, 
                    expectedDelivery.SameDay
                )
            });
        });

        it('01.05', () => {
            /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         NO        |        YES       |        YES       |        NO         |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.UpdateStockProductStock(0, 1, 0, preferedId);
            cy.UpdateStockProductStock(1, 0, 0, nextBestId);
            cy.updatePharmacy(1, cutOffTime.before, 3, 1, pharmacyId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
                
                CheckSubstitutionState_SelectPrefereNextBest(
                    OOS_BackInStock_Message(depot.Ballina, depot.Dublin), 
                    preferedDescription, 
                    nextBestDescription, 
                    expectedDelivery.NextDay, 
                    expectedDelivery.SameDay
                )
            });
        });

        it('01.06', () => {
            /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         NO        |        YES       |        NO        |        NO         |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.UpdateStockProductStock(0, 1, 0, preferedId);
            cy.UpdateStockProductStock(0, 0, 0, nextBestId);
            cy.updatePharmacy(1, cutOffTime.before, 3, 1, pharmacyId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
                
                CheckSubstitutionState_PreferedOrder(
                    OOS_BackInStock_Message(depot.Ballina, depot.Dublin), 
                    preferedDescription, 
                    expectedDelivery.NextDay
                )
            });
        });

        it('01.07', () => {
            /*
            +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      NO       |                   |        YES       |                  |                   |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.UpdateStockProductStock(0, 1, 0, preferedId);
            cy.UpdateStockProductStock(0, 0, 0, nextBestId);
            cy.updatePharmacy(1, cutOffTime.after, 3, 1, pharmacyId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
                
                CheckSubstitutionState_PreferedOrder(
                    BackInStock_Message(depot.Dublin), 
                    preferedDescription, 
                    expectedDelivery.NextDay
                )
            });
        });

        it('01.08', () => {
            /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      NO       |                   |        NO        |                  |        YES        |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.UpdateStockProductStock(0, 0, 0, preferedId);
            cy.UpdateStockProductStock(0, 1, 0, nextBestId);
            cy.updatePharmacy(1, cutOffTime.after, 3, 1, pharmacyId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                CheckSubstitutionState_PreferedToNextBest(
                    OOS_Message(depot.Dublin), 
                    preferedDescription, 
                    nextBestDescription, 
                    expectedDelivery.NextDay
                )
            });
        });

        it('B->D_Test_01.09', () => {
            /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      NO       |                   |        NO        |                  |        NO         |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.UpdateStockProductStock(0, 0, 0, preferedId);
            cy.UpdateStockProductStock(0, 0, 0, nextBestId);
            cy.updatePharmacy(1, cutOffTime.after, 3, 1, pharmacyId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                CheckSubstitutionState_PreferedNoOrder(
                    OOS_Message(depot.Dublin), 
                    preferedDescription
                )
            });
        });
    })

    context('Dublin -> Dublin', () => {

        it('02.01', () => {
            /*
            +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         NO        |        NO        |        NO        |        YES        |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.UpdateStockProductStock(0, 0, 0, preferedId);
            cy.UpdateStockProductStock(0, 1, 0, nextBestId);
            cy.updatePharmacy(1, cutOffTime.before, 1, 1, pharmacyId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                CheckSubstitutionState_PreferedToNextBest(
                    OOS_Message(depot.Dublin),
                    preferedDescription,
                    nextBestDescription,
                    expectedDelivery.SameDay
                )
            });
        });

        it('02.02', () => {
            /*
            +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         NO        |        NO        |        NO        |        NO         |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.UpdateStockProductStock(0, 0, 0, preferedId);
            cy.UpdateStockProductStock(0, 0, 0, nextBestId);
            cy.updatePharmacy(1, cutOffTime.before, 1, 1, pharmacyId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                CheckSubstitutionState_PreferedNoOrder(
                    OOS_Message(depot.Dublin), 
                    preferedDescription
                )
            });
        });

        it('02.04', () => {
            /*
              +---------------+-------------------+------------------+------------------+-------------------+
             | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
             |               |       local       |      cutOff      |       local      |       cutOff      |
             +---------------+-------------------+------------------+------------------+-------------------+
             |      YES      |         YES        |        NO        |        NO        |        NO        |
             +---------------+-------------------+------------------+------------------+-------------------+
             */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.UpdateStockProductStock(0, 1, 0, preferedId);
            cy.UpdateStockProductStock(0, 0, 0, nextBestId);
            cy.updatePharmacy(1, cutOffTime.before, 1, 1, pharmacyId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                CheckSubstitutionState_PreferedOrder(
                    BackInStock_Message(depot.Dublin), 
                    preferedDescription, 
                    expectedDelivery.SameDay
                )
            });
        });

        it('02.07', () => {
            /*
            +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      NO       |                   |        YES       |                  |                   |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.UpdateStockProductStock(0, 1, 0, preferedId);
            cy.UpdateStockProductStock(0, 0, 0, nextBestId);
            cy.updatePharmacy(1, cutOffTime.after, 1, 1, pharmacyId);
            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                CheckSubstitutionState_PreferedOrder(
                    BackInStock_Message(depot.Dublin), 
                    preferedDescription, 
                    expectedDelivery.NextDay
                )
            });
        });

        it('02.08', () => {
            /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      NO       |                   |        NO        |                  |        YES        |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.UpdateStockProductStock(0, 0, 0, preferedId);
            cy.UpdateStockProductStock(0, 1, 0, nextBestId);
            cy.updatePharmacy(1, cutOffTime.after, 1, 1, pharmacyId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                CheckSubstitutionState_PreferedToNextBest(
                    OOS_Message(depot.Dublin), 
                    preferedDescription, 
                    nextBestDescription, 
                    expectedDelivery.NextDay
                )
            });
        });

        it('02.09', () => {
            /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      NO       |                   |        NO        |                  |        NO         |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.UpdateStockProductStock(0, 0, 0, preferedId);
            cy.UpdateStockProductStock(0, 0, 0, nextBestId);
            cy.updatePharmacy(1, cutOffTime.after, 1, 1, pharmacyId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                CheckSubstitutionState_PreferedNoOrder(
                    OOS_Message(depot.Dublin), 
                    preferedDescription
                )
            });
        });
    })

    context('Limerick -> Dublin', () => {

        it('03.01', () => {
            /*
            +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         NO        |        NO        |        NO        |        YES        |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.updatePharmacy(1, cutOffTime.before, 2, 1, pharmacyId);
            cy.UpdateStockProductStock(0, 0, 0, preferedId);
            cy.UpdateStockProductStock(0, 1, 0, nextBestId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                CheckSubstitutionState_PreferedToNextBest(
                    OOS_OOS_Message(depot.Limerick, depot.Dublin),
                    preferedDescription,
                    nextBestDescription,
                    expectedDelivery.NextDay
                )
            });
        });

        it('03.02', () => {
            /*
            +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         NO        |        NO        |        NO        |        NO         |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.UpdateStockProductStock(0, 0, 0, preferedId);
            cy.UpdateStockProductStock(0, 0, 0, nextBestId);
            cy.updatePharmacy(1, cutOffTime.before, 2, 1, pharmacyId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });
            
            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                CheckSubstitutionState_PreferedNoOrder(
                    OOS_OOS_Message(depot.Limerick, depot.Dublin), 
                    preferedDescription
                )
            });
        });

        it('03.03', () => {
            /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         NO        |        NO        |        YES        |        NO        |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.UpdateStockProductStock(0, 0, 0, preferedId);
            cy.UpdateStockProductStock(0, 0, 1, nextBestId);
            cy.updatePharmacy(1, cutOffTime.before, 2, 1, pharmacyId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });
            
            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                CheckSubstitutionState_PreferedToNextBest(
                    OOS_OOS_Message(depot.Limerick, depot.Dublin), 
                    preferedDescription, 
                    nextBestDescription, 
                    expectedDelivery.SameDay
                )
            });
        });

        it('L->D_Test_03.04', () => {
            /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         YES        |        NO        |        NO        |        NO        |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.UpdateStockProductStock(0, 0, 1, preferedId);
            cy.UpdateStockProductStock(0, 0, 0, nextBestId);
            cy.updatePharmacy(1, cutOffTime.before, 2, 1, pharmacyId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });
            
            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
                
                CheckSubstitutionState_PreferedOrder(
                    BackInStock_Message(depot.Limerick), 
                    preferedDescription, 
                    expectedDelivery.SameDay
                )
            });
        });

            it('03.05', () => {
                /*
                +---------------+-------------------+------------------+------------------+-------------------+
                | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
                |               |       local       |      cutOff      |       local      |       cutOff      |
                +---------------+-------------------+------------------+------------------+-------------------+
                |      YES      |         NO        |        YES       |        YES       |        NO         |
                +---------------+-------------------+------------------+------------------+-------------------+
                */
                cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
                cy.UpdateStockProductStock(0, 1, 0, preferedId);
                cy.UpdateStockProductStock(0, 0, 2, nextBestId);
                cy.updatePharmacy(1, cutOffTime.before, 2, 1, pharmacyId);

                cy.fixture("main").then(data => {
                    cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
                });
                
                cy.wait('@getShoppingCartItems').then(({ response }) => {
                    expect(response.statusCode).to.equal(200);
                    
                    CheckSubstitutionState_SelectPrefereNextBest(
                        OOS_BackInStock_Message(depot.Limerick, depot.Dublin), 
                        preferedDescription, 
                        nextBestDescription, 
                        expectedDelivery.NextDay, 
                        expectedDelivery.SameDay
                    )
                });
            });
        
        it('03.06', () => {
            /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         NO        |        YES       |        NO        |        NO         |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.UpdateStockProductStock(0, 1, 0, preferedId);
            cy.UpdateStockProductStock(0, 0, 0, nextBestId);
            cy.updatePharmacy(1, cutOffTime.before, 2, 1, pharmacyId);
            
            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
                
                CheckSubstitutionState_PreferedOrder(
                    OOS_BackInStock_Message(depot.Limerick, depot.Dublin), 
                    preferedDescription, 
                    expectedDelivery.NextDay
                )
            });
        });
        
        it('03.07', () => {
            /*
            +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      NO       |                   |        YES       |                  |                   |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.UpdateStockProductStock(0, 1, 0, preferedId);
            cy.UpdateStockProductStock(0, 0, 0, nextBestId);
            cy.updatePharmacy(1, cutOffTime.after, 2, 1, pharmacyId);
            
            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

           cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
                
                CheckSubstitutionState_PreferedOrder(
                    BackInStock_Message(depot.Dublin), 
                    preferedDescription, 
                    expectedDelivery.NextDay
                )
            });
        });
        
        it('03.08', () => {
            /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      NO       |                   |        NO        |                  |        YES        |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.UpdateStockProductStock(0, 0, 0, preferedId);
            cy.UpdateStockProductStock(0, 1, 0, nextBestId);
            cy.updatePharmacy(1, cutOffTime.after, 2, 1, pharmacyId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });
            
            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                CheckSubstitutionState_PreferedToNextBest(
                    OOS_Message(depot.Dublin), 
                    preferedDescription, 
                    nextBestDescription, 
                    expectedDelivery.NextDay
                )
            });
        });
        
        it('03.09', () => {
            /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      NO       |                   |        NO        |                  |        NO         |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.UpdateStockProductStock(0, 0, 0, preferedId);
            cy.UpdateStockProductStock(0, 0, 0, nextBestId);
            cy.updatePharmacy(1, cutOffTime.after, 2, 1, pharmacyId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
                
                CheckSubstitutionState_PreferedNoOrder(
                    OOS_Message(depot.Dublin), 
                    preferedDescription
                )
            });
        });
    })

    context('Ballina -> Ballina', () => {

        it('04.01', () => {
            /*
            +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         NO        |        NO        |        NO        |        YES        |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.updatePharmacy(1, cutOffTime.before, 3, 3, pharmacyId);
            cy.UpdateStockProductStock(0, 0, 0, preferedId);
            cy.UpdateStockProductStock(1, 0, 0, nextBestId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                CheckSubstitutionState_PreferedToNextBest(
                    OOS_Message(depot.Ballina),
                    preferedDescription,
                    nextBestDescription,
                    expectedDelivery.SameDay
                )
            });
        });

        it('04.02', () => {
            /*
            +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         NO        |        NO        |        NO        |        NO         |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.UpdateStockProductStock(0, 0, 0, preferedId);
            cy.UpdateStockProductStock(0, 0, 0, nextBestId);
            cy.updatePharmacy(1, cutOffTime.before, 3, 3, pharmacyId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });
            
            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                CheckSubstitutionState_PreferedNoOrder(
                    OOS_Message(depot.Ballina), 
                    preferedDescription
                )
            });
        });

        it('04.03', () => {
            /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         NO        |        NO        |        YES        |        NO        |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.UpdateStockProductStock(0, 0, 0, preferedId);
            cy.UpdateStockProductStock(1, 0, 0, nextBestId);
            cy.updatePharmacy(1, cutOffTime.before, 3, 3, pharmacyId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });
            
            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                CheckSubstitutionState_PreferedToNextBest(
                    OOS_Message(depot.Ballina), 
                    preferedDescription, 
                    nextBestDescription, 
                    expectedDelivery.SameDay
                )
            });
        });

        it('04.04', () => {
            /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         YES        |        NO        |        NO        |        NO        |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.UpdateStockProductStock(1, 0, 0, preferedId);
            cy.UpdateStockProductStock(0, 0, 0, nextBestId);
            cy.updatePharmacy(1, cutOffTime.before, 3, 3, pharmacyId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });
            
            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
                
                CheckSubstitutionState_PreferedOrder(
                    BackInStock_Message(depot.Ballina), 
                    preferedDescription, 
                    expectedDelivery.SameDay
                )
            });
        });
        it('04.05', () => {
            /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         NO        |        YES       |        YES       |        NO         |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.UpdateStockProductStock(1, 0, 0, preferedId);
            cy.UpdateStockProductStock(1, 0, 0, nextBestId);
            cy.updatePharmacy(1, cutOffTime.before, 3, 3, pharmacyId);
            
            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
                
                CheckSubstitutionState_PreferedOrder(
                    BackInStock_Message(depot.Ballina), 
                    preferedDescription, 
                    expectedDelivery.SameDay
                )
            });
        });
        
        it('04.06', () => {
            /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         NO        |        YES       |        NO        |        NO         |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.UpdateStockProductStock(1, 0, 0, preferedId);
            cy.UpdateStockProductStock(0, 0, 0, nextBestId);
            cy.updatePharmacy(1, cutOffTime.before, 3, 3, pharmacyId);
            
            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
                
                CheckSubstitutionState_PreferedOrder(
                    BackInStock_Message(depot.Ballina), 
                    preferedDescription, 
                    expectedDelivery.SameDay
                )
            });
        });
        
        it('04.07', () => {
            /*
            +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      NO       |                   |        YES       |                  |                   |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.UpdateStockProductStock(1, 0, 0, preferedId);
            cy.UpdateStockProductStock(0, 0, 0, nextBestId);
            cy.updatePharmacy(1, cutOffTime.after, 3, 3, pharmacyId);
            
            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

           cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
                
                CheckSubstitutionState_PreferedOrder(
                    BackInStock_Message(depot.Ballina), 
                    preferedDescription, 
                    expectedDelivery.NextDay
                )
            });
        });
        
        it('04.08', () => {
            /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      NO       |                   |        NO        |                  |        YES        |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.UpdateStockProductStock(0, 0, 0, preferedId);
            cy.UpdateStockProductStock(1, 0, 0, nextBestId);
            cy.updatePharmacy(1, cutOffTime.after, 3, 3, pharmacyId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });
            
            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                CheckSubstitutionState_PreferedToNextBest(
                    OOS_Message(depot.Ballina), 
                    preferedDescription, 
                    nextBestDescription, 
                    expectedDelivery.NextDay
                )
            });
        });
        
        it('04.09', () => {
            /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      NO       |                   |        NO        |                  |        NO         |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.UpdateStockProductStock(0, 0, 0, preferedId);
            cy.UpdateStockProductStock(0, 0, 0, nextBestId);
            cy.updatePharmacy(1, cutOffTime.after, 3, 3, pharmacyId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
                
                CheckSubstitutionState_PreferedNoOrder(
                    OOS_Message(depot.Ballina), 
                    preferedDescription
                )
            });
        });
    })
    context('Ballina -> Ballina(Dublin)', () => {

        it('05.01', () => {
            /*
            +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         NO        |        NO        |        NO        |        YES        |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.updatePharmacy(1, cutOffTime.before, 3, 3, pharmacyId);
            cy.UpdateStockProductStock(0, 0, 0, preferedId);
            cy.UpdateStockProductStock(0, 1, 0, nextBestId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                CheckSubstitutionState_PreferedToNextBest(
                    OOS_Message(depot.Ballina),
                    preferedDescription,
                    nextBestDescription,
                    expectedDelivery.NextDay
                )
            });
        });
        it('05.05', () => {
            /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         NO        |        YES       |        YES       |        NO         |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.UpdateStockProductStock(0, 1, 0, preferedId);
            cy.UpdateStockProductStock(1, 0, 0, nextBestId);
            cy.updatePharmacy(1, cutOffTime.before, 3, 3, pharmacyId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                CheckSubstitutionState_SelectPrefereNextBest(
                    BackInStock_Message(depot.Ballina), 
                    preferedDescription, 
                    nextBestDescription, 
                    expectedDelivery.NextDay, 
                    expectedDelivery.SameDay
                )
            });
        });

        it('04.06', () => {
            /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         NO        |        YES       |        NO        |        NO         |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.UpdateStockProductStock(0, 1, 0, preferedId);
            cy.UpdateStockProductStock(0, 0, 0, nextBestId);
            cy.updatePharmacy(1, cutOffTime.before, 3, 3, pharmacyId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                CheckSubstitutionState_PreferedOrder(
                    BackInStock_Message(depot.Ballina), 
                    preferedDescription, 
                    expectedDelivery.NextDay
                )
            });
        });

        it('04.07', () => {
            /*
            +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      NO       |                   |        YES       |                  |                   |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.UpdateStockProductStock(0, 1, 0, preferedId);
            cy.UpdateStockProductStock(0, 0, 0, nextBestId);
            cy.updatePharmacy(1, cutOffTime.after, 3, 3, pharmacyId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                CheckSubstitutionState_PreferedOrder(
                    BackInStock_Message(depot.Ballina), 
                    preferedDescription, 
                    expectedDelivery.NextDay
                )
            });
        });

        it('04.08', () => {
            /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      NO       |                   |        NO        |                  |        YES        |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.UpdateStockProductStock(0, 0, 0, preferedId);
            cy.UpdateStockProductStock(0, 1, 0, nextBestId);
            cy.updatePharmacy(1, cutOffTime.after, 3, 3, pharmacyId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                CheckSubstitutionState_PreferedToNextBest(
                    OOS_Message(depot.Ballina), 
                    preferedDescription, 
                    nextBestDescription, 
                    expectedDelivery.NextDay
                )
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
        // shoppingCart.substitutionTab.preferedDescription().should('be.visible').and('contain.text', preferedDescription);
        shoppingCart.substitutionTab.preferedDescription().should('be.visible').and('include.text', preferedDescription);
        shoppingCart.substitutionTab.preferedNetPrice().should('be.visible');

        shoppingCart.substitutionTab.nextBestTitle().should('have.text','Next Best:');
        shoppingCart.substitutionTab.nextBestDescription().should('be.visible').and('include.text', nextBestDescription);
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
        shoppingCart.substitutionTab.preferedDescription().should('be.visible').and('have.text', preferedDescription);
        
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

















