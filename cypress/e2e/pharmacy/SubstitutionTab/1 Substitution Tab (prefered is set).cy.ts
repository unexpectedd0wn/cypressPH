const dayjs = require("dayjs");
import { APIRequests } from "../../../page-objects/api-routes";
import { SubstitutionTab } from "../../../page-objects/substitution-tab";
import {
    expectedDelivery,
    depot,
    cutOffTime,
    useCutOff,
    localaDepot,
    cutoffDepot
}from "../../../support/enums";

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
    let pharmacyId = Cypress.env("pharmacyId");
    let preferedId = 27405;
    let preferedDescription = "ATORVASTATIN FC  TABS 40MG (ACTAVIS) ATORVASTATIN";
    let nextBestId = 27694;
    let nextBestDescription = "ATORVASTATIN TABS 10MG (PFIZER) ATORVASTATIN";
    let IPUcode = 5099627279192;
    let currentDateTime = dayjs().subtract(2, 'hour').format("YYYY-MM-DD HH:mm:ss:SSS");


    before(() => {
        cy.cleanUpShoppingCart(pharmacyId);
        cy.addItemToSubstitutionTab(preferedId, pharmacyId, IPUcode, currentDateTime);
        cy.clearAllCookies();
    });

    beforeEach(() => {
        cy.intercept(APIRequests.request._getShoppingcart).as('getShoppingCartItems');
    });

    afterEach(() => {
        cy.screenshot()
        // cy.signOut();
        cy.clearAllCookies();
    });

    context('Ballina -> Dublin', () => {

        it('01.01', () => {
            /*
            +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         NO        |        NO        |        NO        |        YES        |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.updatePharmacy(useCutOff.yes, cutOffTime.before, localaDepot.Ballina, cutoffDepot.Dublin, pharmacyId);
            cy.updateUDStockProductStock(0, 0, 0, preferedId);
            cy.updateUDStockProductStock(0, 1, 0, nextBestId);

            cy.fixture("main").then(data => {
                cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                SubstitutionTab.state_PreferedToNextBest(
                    SubstitutionTab.OOS_OOS_Message(depot.Ballina, depot.Dublin),
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
            cy.updatePharmacy(useCutOff.yes, cutOffTime.before, localaDepot.Ballina, cutoffDepot.Dublin, pharmacyId);
            cy.updateUDStockProductStock(0, 0, 0, preferedId);
            cy.updateUDStockProductStock(0, 0, 0, nextBestId);


            cy.fixture("main").then(data => {
                cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                SubstitutionTab.state_PreferedNoOrder(
                    SubstitutionTab.OOS_OOS_Message(depot.Ballina, depot.Dublin),
                    preferedDescription
                )
            });
        });

        it('01.03', () => {
            /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         NO        |        NO        |        YES        |        NO        |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.updatePharmacy(useCutOff.yes, cutOffTime.before, localaDepot.Ballina, cutoffDepot.Dublin, pharmacyId);
            cy.updateUDStockProductStock(0, 0, 0, preferedId);
            cy.updateUDStockProductStock(1, 0, 0, nextBestId);


            cy.fixture("main").then(data => {
                cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                SubstitutionTab.state_PreferedToNextBest(
                    SubstitutionTab.OOS_OOS_Message(depot.Ballina, depot.Dublin),
                    preferedDescription,
                    nextBestDescription,
                    expectedDelivery.SameDay
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
            cy.updateUDStockProductStock(1, 0, 0, preferedId);
            cy.updateUDStockProductStock(0, 0, 0, nextBestId);
            cy.updatePharmacy(useCutOff.yes, cutOffTime.before, localaDepot.Ballina, cutoffDepot.Dublin, pharmacyId);

            cy.fixture("main").then(data => {
                cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                SubstitutionTab.state_PreferedOrder(
                    SubstitutionTab.BackInStock_Message(depot.Ballina),
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
            cy.updateUDStockProductStock(0, 1, 0, preferedId);
            cy.updateUDStockProductStock(1, 0, 0, nextBestId);
            cy.updatePharmacy(useCutOff.yes, cutOffTime.before, localaDepot.Ballina, cutoffDepot.Dublin, pharmacyId);

            cy.fixture("main").then(data => {
                cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                SubstitutionTab.state_SelectOptionPreferedNextBest(
                    SubstitutionTab.OOS_BackInStock_Message(depot.Ballina, depot.Dublin),
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
            cy.updateUDStockProductStock(0, 1, 0, preferedId);
            cy.updateUDStockProductStock(0, 0, 0, nextBestId);
            cy.updatePharmacy(useCutOff.yes, cutOffTime.before, localaDepot.Ballina, cutoffDepot.Dublin, pharmacyId);

            cy.fixture("main").then(data => {
                cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                SubstitutionTab.state_PreferedOrder(
                    SubstitutionTab.OOS_BackInStock_Message(depot.Ballina, depot.Dublin),
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
            cy.updateUDStockProductStock(0, 1, 0, preferedId);
            cy.updateUDStockProductStock(0, 0, 0, nextBestId);
            cy.updatePharmacy(useCutOff.yes, cutOffTime.after, localaDepot.Ballina, cutoffDepot.Dublin, pharmacyId);

            cy.fixture("main").then(data => {
                cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                SubstitutionTab.state_PreferedOrder(
                    SubstitutionTab.BackInStock_Message(depot.Dublin),
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
            cy.updateUDStockProductStock(0, 0, 0, preferedId);
            cy.updateUDStockProductStock(0, 1, 0, nextBestId);
            cy.updatePharmacy(
                useCutOff.yes,
                cutOffTime.after,
                localaDepot.Ballina,
                cutoffDepot.Dublin,
                pharmacyId
            );

            cy.fixture("main").then(data => {
                cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                SubstitutionTab.state_PreferedToNextBest(
                    SubstitutionTab.OOS_Message(depot.Dublin),
                    preferedDescription,
                    nextBestDescription,
                    expectedDelivery.NextDay
                )
            });
        });

        it('01.09', () => {
            /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      NO       |                   |        NO        |                  |        NO         |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.updateUDStockProductStock(0, 0, 0, preferedId);
            cy.updateUDStockProductStock(0, 0, 0, nextBestId);
            cy.updatePharmacy(useCutOff.yes, cutOffTime.after, localaDepot.Ballina, cutoffDepot.Dublin, pharmacyId);

            cy.fixture("main").then(data => {
                cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                SubstitutionTab.state_PreferedNoOrder(
                    SubstitutionTab.OOS_Message(depot.Dublin),
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
            cy.updateUDStockProductStock(0, 0, 0, preferedId);
            cy.updateUDStockProductStock(0, 1, 0, nextBestId);
            cy.updatePharmacy(useCutOff.yes, cutOffTime.before, localaDepot.Dublin, cutoffDepot.Dublin, pharmacyId);

            cy.fixture("main").then(data => {
                cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                SubstitutionTab.state_PreferedToNextBest(
                    SubstitutionTab.OOS_Message(depot.Dublin),
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
            cy.updateUDStockProductStock(0, 0, 0, preferedId);
            cy.updateUDStockProductStock(0, 0, 0, nextBestId);
            cy.updatePharmacy(useCutOff.yes, cutOffTime.before, localaDepot.Dublin, cutoffDepot.Dublin, pharmacyId);

            cy.fixture("main").then(data => {
                cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                SubstitutionTab.state_PreferedNoOrder(
                    SubstitutionTab.OOS_Message(depot.Dublin),
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
            cy.updateUDStockProductStock(0, 1, 0, preferedId);
            cy.updateUDStockProductStock(0, 0, 0, nextBestId);
            cy.updatePharmacy(useCutOff.yes, cutOffTime.before, localaDepot.Dublin, cutoffDepot.Dublin, pharmacyId);

            cy.fixture("main").then(data => {
                cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                SubstitutionTab.state_PreferedOrder(
                    SubstitutionTab.BackInStock_Message(depot.Dublin),
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
            cy.updateUDStockProductStock(0, 1, 0, preferedId);
            cy.updateUDStockProductStock(0, 0, 0, nextBestId);
            cy.updatePharmacy(useCutOff.yes, cutOffTime.after, localaDepot.Dublin, cutoffDepot.Dublin, pharmacyId);

            cy.fixture("main").then(data => {
                cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                SubstitutionTab.state_PreferedOrder(
                    SubstitutionTab.BackInStock_Message(depot.Dublin),
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
            cy.updateUDStockProductStock(0, 0, 0, preferedId);
            cy.updateUDStockProductStock(0, 1, 0, nextBestId);
            cy.updatePharmacy(useCutOff.yes, cutOffTime.after, localaDepot.Dublin, cutoffDepot.Dublin, pharmacyId);

            cy.fixture("main").then(data => {
                cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                SubstitutionTab.state_PreferedToNextBest(
                    SubstitutionTab.OOS_Message(depot.Dublin),
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
            cy.updateUDStockProductStock(0, 0, 0, preferedId);
            cy.updateUDStockProductStock(0, 0, 0, nextBestId);
            cy.updatePharmacy(useCutOff.yes, cutOffTime.after, localaDepot.Dublin, cutoffDepot.Dublin, pharmacyId);

            cy.fixture("main").then(data => {
                cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                SubstitutionTab.state_PreferedNoOrder(
                    SubstitutionTab.OOS_Message(depot.Dublin),
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
            cy.updatePharmacy(useCutOff.yes, cutOffTime.before, localaDepot.Limerick, cutoffDepot.Dublin, pharmacyId);
            cy.updateUDStockProductStock(0, 0, 0, preferedId);
            cy.updateUDStockProductStock(0, 1, 0, nextBestId);

            cy.fixture("main").then(data => {
                cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                SubstitutionTab.state_PreferedToNextBest(
                    SubstitutionTab.OOS_OOS_Message(depot.Limerick, depot.Dublin),
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
            cy.updateUDStockProductStock(0, 0, 0, preferedId);
            cy.updateUDStockProductStock(0, 0, 0, nextBestId);
            cy.updatePharmacy(useCutOff.yes, cutOffTime.before, localaDepot.Limerick, cutoffDepot.Dublin, pharmacyId);

            cy.fixture("main").then(data => {
                cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                SubstitutionTab.state_PreferedNoOrder(
                    SubstitutionTab.OOS_OOS_Message(depot.Limerick, depot.Dublin),
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
            cy.updateUDStockProductStock(0, 0, 0, preferedId);
            cy.updateUDStockProductStock(0, 0, 1, nextBestId);
            cy.updatePharmacy(useCutOff.yes, cutOffTime.before, localaDepot.Limerick, cutoffDepot.Dublin, pharmacyId);

            cy.fixture("main").then(data => {
                cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                SubstitutionTab.state_PreferedToNextBest(
                    SubstitutionTab.OOS_OOS_Message(depot.Limerick, depot.Dublin),
                    preferedDescription,
                    nextBestDescription,
                    expectedDelivery.SameDay
                )
            });
        });

        it('03.04', () => {
            /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         YES        |        NO        |        NO        |        NO        |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.updateUDStockProductStock(0, 0, 1, preferedId);
            cy.updateUDStockProductStock(0, 0, 0, nextBestId);
            cy.updatePharmacy(useCutOff.yes, cutOffTime.before, localaDepot.Limerick, cutoffDepot.Dublin, pharmacyId);

            cy.fixture("main").then(data => {
                cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                SubstitutionTab.state_PreferedOrder(
                    SubstitutionTab.BackInStock_Message(depot.Limerick),
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
            cy.updateUDStockProductStock(0, 1, 0, preferedId);
            cy.updateUDStockProductStock(0, 0, 1, nextBestId);
            cy.updatePharmacy(useCutOff.yes, cutOffTime.before, localaDepot.Limerick, cutoffDepot.Dublin, pharmacyId);

            cy.fixture("main").then(data => {
                cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                SubstitutionTab.state_SelectOptionPreferedNextBest(
                    SubstitutionTab.OOS_BackInStock_Message(depot.Limerick, depot.Dublin),
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
            cy.updateUDStockProductStock(0, 1, 0, preferedId);
            cy.updateUDStockProductStock(0, 0, 0, nextBestId);
            cy.updatePharmacy(useCutOff.yes, cutOffTime.before, localaDepot.Limerick, cutoffDepot.Dublin, pharmacyId);

            cy.fixture("main").then(data => {
                cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                SubstitutionTab.state_PreferedOrder(
                    SubstitutionTab.OOS_BackInStock_Message(depot.Limerick, depot.Dublin),
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
            cy.updateUDStockProductStock(0, 1, 0, preferedId);
            cy.updateUDStockProductStock(0, 0, 0, nextBestId);
            cy.updatePharmacy(useCutOff.yes, cutOffTime.after, localaDepot.Limerick, cutoffDepot.Dublin, pharmacyId);

            cy.fixture("main").then(data => {
                cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                SubstitutionTab.state_PreferedOrder(
                    SubstitutionTab.BackInStock_Message(depot.Dublin),
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
            cy.updateUDStockProductStock(0, 0, 0, preferedId);
            cy.updateUDStockProductStock(0, 1, 0, nextBestId);
            cy.updatePharmacy(useCutOff.yes, cutOffTime.after, localaDepot.Limerick, cutoffDepot.Dublin, pharmacyId);

            cy.fixture("main").then(data => {
                cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                SubstitutionTab.state_PreferedToNextBest(
                    SubstitutionTab.OOS_Message(depot.Dublin),
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
            cy.updateUDStockProductStock(0, 0, 0, preferedId);
            cy.updateUDStockProductStock(0, 0, 0, nextBestId);
            cy.updatePharmacy(useCutOff.yes, cutOffTime.after, localaDepot.Limerick, cutoffDepot.Dublin, pharmacyId);

            cy.fixture("main").then(data => {
                cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                SubstitutionTab.state_PreferedNoOrder(
                    SubstitutionTab.OOS_Message(depot.Dublin),
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
            cy.updatePharmacy(useCutOff.yes, cutOffTime.before, localaDepot.Ballina, cutoffDepot.Ballina, pharmacyId);
            cy.updateUDStockProductStock(0, 0, 0, preferedId);
            cy.updateUDStockProductStock(1, 0, 0, nextBestId);

            cy.fixture("main").then(data => {
                cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                SubstitutionTab.state_PreferedToNextBest(
                    SubstitutionTab.OOS_Message(depot.Ballina),
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
            cy.updateUDStockProductStock(0, 0, 0, preferedId);
            cy.updateUDStockProductStock(0, 0, 0, nextBestId);
            cy.updatePharmacy(useCutOff.yes, cutOffTime.before, localaDepot.Ballina, cutoffDepot.Ballina, pharmacyId);

            cy.fixture("main").then(data => {
                cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                SubstitutionTab.state_PreferedNoOrder(
                    SubstitutionTab.OOS_Message(depot.Ballina),
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
            cy.updateUDStockProductStock(0, 0, 0, preferedId);
            cy.updateUDStockProductStock(1, 0, 0, nextBestId);
            cy.updatePharmacy(useCutOff.yes, cutOffTime.before, localaDepot.Ballina, cutoffDepot.Ballina, pharmacyId);

            cy.fixture("main").then(data => {
                cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                SubstitutionTab.state_PreferedToNextBest(
                    SubstitutionTab.OOS_Message(depot.Ballina),
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
            cy.updateUDStockProductStock(1, 0, 0, preferedId);
            cy.updateUDStockProductStock(0, 0, 0, nextBestId);
            cy.updatePharmacy(useCutOff.yes, cutOffTime.before, localaDepot.Ballina, cutoffDepot.Ballina, pharmacyId);

            cy.fixture("main").then(data => {
                cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                SubstitutionTab.state_PreferedOrder(
                    SubstitutionTab.BackInStock_Message(depot.Ballina),
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
            cy.updateUDStockProductStock(1, 0, 0, preferedId);
            cy.updateUDStockProductStock(1, 0, 0, nextBestId);
            cy.updatePharmacy(useCutOff.yes, cutOffTime.before, localaDepot.Ballina, cutoffDepot.Ballina, pharmacyId);

            cy.fixture("main").then(data => {
                cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                SubstitutionTab.state_PreferedOrder(
                    SubstitutionTab.BackInStock_Message(depot.Ballina),
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
            cy.updateUDStockProductStock(1, 0, 0, preferedId);
            cy.updateUDStockProductStock(0, 0, 0, nextBestId);
            cy.updatePharmacy(useCutOff.yes, cutOffTime.before, localaDepot.Ballina, cutoffDepot.Ballina, pharmacyId);

            cy.fixture("main").then(data => {
                cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                SubstitutionTab.state_PreferedOrder(
                    SubstitutionTab.BackInStock_Message(depot.Ballina),
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
            cy.updateUDStockProductStock(1, 0, 0, preferedId);
            cy.updateUDStockProductStock(0, 0, 0, nextBestId);
            cy.updatePharmacy(useCutOff.yes, cutOffTime.after, localaDepot.Ballina, cutoffDepot.Ballina, pharmacyId);

            cy.fixture("main").then(data => {
                cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                SubstitutionTab.state_PreferedOrder(
                    SubstitutionTab.BackInStock_Message(depot.Ballina),
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
            cy.updateUDStockProductStock(0, 0, 0, preferedId);
            cy.updateUDStockProductStock(1, 0, 0, nextBestId);
            cy.updatePharmacy(useCutOff.yes, cutOffTime.after, localaDepot.Ballina, cutoffDepot.Ballina, pharmacyId);

            cy.fixture("main").then(data => {
                cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                SubstitutionTab.state_PreferedToNextBest(
                    SubstitutionTab.OOS_Message(depot.Ballina),
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
            cy.updateUDStockProductStock(0, 0, 0, preferedId);
            cy.updateUDStockProductStock(0, 0, 0, nextBestId);
            cy.updatePharmacy(useCutOff.yes, cutOffTime.after, localaDepot.Ballina, cutoffDepot.Ballina, pharmacyId);

            cy.fixture("main").then(data => {
                cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                SubstitutionTab.state_PreferedNoOrder(
                    SubstitutionTab.OOS_Message(depot.Ballina),
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
            cy.updatePharmacy(useCutOff.yes, cutOffTime.before, localaDepot.Ballina, cutoffDepot.Ballina, pharmacyId);
            cy.updateUDStockProductStock(0, 0, 0, preferedId);
            cy.updateUDStockProductStock(0, 1, 0, nextBestId);

            cy.fixture("main").then(data => {
                cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                SubstitutionTab.state_PreferedToNextBest(
                    SubstitutionTab.OOS_Message(depot.Ballina),
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
            cy.updateUDStockProductStock(0, 1, 0, preferedId);
            cy.updateUDStockProductStock(1, 0, 0, nextBestId);
            cy.updatePharmacy(useCutOff.yes, cutOffTime.before, localaDepot.Ballina, cutoffDepot.Ballina, pharmacyId);

            cy.fixture("main").then(data => {
                cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                SubstitutionTab.state_SelectOptionPreferedNextBest(
                    SubstitutionTab.BackInStock_Message(depot.Ballina),
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
            cy.updateUDStockProductStock(0, 1, 0, preferedId);
            cy.updateUDStockProductStock(0, 0, 0, nextBestId);
            cy.updatePharmacy(useCutOff.yes, cutOffTime.before, localaDepot.Ballina, cutoffDepot.Ballina, pharmacyId);

            cy.fixture("main").then(data => {
                cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                SubstitutionTab.state_PreferedOrder(
                    SubstitutionTab.BackInStock_Message(depot.Ballina),
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
            cy.updateUDStockProductStock(0, 1, 0, preferedId);
            cy.updateUDStockProductStock(0, 0, 0, nextBestId);
            cy.updatePharmacy(useCutOff.yes, cutOffTime.after, localaDepot.Ballina, cutoffDepot.Ballina, pharmacyId);

            cy.fixture("main").then(data => {
                cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                SubstitutionTab.state_PreferedOrder(
                    SubstitutionTab.BackInStock_Message(depot.Ballina),
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
            cy.updateUDStockProductStock(0, 0, 0, preferedId);
            cy.updateUDStockProductStock(0, 1, 0, nextBestId);
            cy.updatePharmacy(useCutOff.yes, cutOffTime.after, localaDepot.Ballina, cutoffDepot.Ballina, pharmacyId);

            cy.fixture("main").then(data => {
                cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                SubstitutionTab.state_PreferedToNextBest(
                    SubstitutionTab.OOS_Message(depot.Ballina),
                    preferedDescription,
                    nextBestDescription,
                    expectedDelivery.NextDay
                )
            });
        });
    })
});


















