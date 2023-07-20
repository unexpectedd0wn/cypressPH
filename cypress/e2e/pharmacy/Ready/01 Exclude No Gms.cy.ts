import { checkResponseNoPendingOrEmptyGmsCode } from "../../../support/pharmacySettingsService";
import { sql } from "../../../support/sqlScripts";
const pharmacyId = Cypress.env("pharmacyId");

/*
    The long tests set, can be use if needs, 
    takes around 4 min in case when number of grid pages around 40 per page
    
    In case, when in the Pharmacy settings set Exclude No GMS = true, 
    then system should hide the medicine items from the Order pages, 
    for the Pharmacy.

    Maybe the best way, will be to limit number of pages, around 4-5 would be enough

    Also, here need to make loop for it, create array for the list of the pages

*/

describe('In case, when Exclude No GMS = true, on the order pages should not be shown medicines with the empty OR PENDING GMScode', () => {

    before(() => {
        sql.cleanUpShoppingCart(pharmacyId);
    });

    beforeEach(() => {
        cy.on('uncaught:exception', (err, runnable) => {
            return false
        })
        sql.updatePharmacySetExcludeNoGms(1, pharmacyId);
        cy.clearAllCookies();
        cy.intercept('/api/stock-product/products?skip=' + '*').as('pageLoads');
        
        cy.fixture("main").then(data => {
            cy.signInCreateSession(data.pharmacyUserEmail, data.pharmacyUserPassword);
        });
    });

    after(() => {
        Cypress.session.clearAllSavedSessions();
        //to set back settings for the Pharmacy
        sql.updatePharmacySetExcludeNoGms(0, pharmacyId);
    });

    it('Exclude No GMS = true | check each page ', () => {

        const pages = ["Brokered Ethical", "Brokered OTC", "Second Line", "ULM"];

        pages.forEach((page) => {
            cy.visitPage(page);
            checkResponseNoPendingOrEmptyGmsCode();
        })
    });
});


