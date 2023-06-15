import orderPage, { elements } from "../../page-objects/order-page";

function checkResponseNoPendingOrEmptyGmsCode() {
    cy.wait('@pageLoads').then(({ response }) => {
        expect(response.statusCode).to.equal(200);

        elements.paginationNumberOfPages().then(($number) => {
            let numberOfPages = $number.text()
            cy.log(numberOfPages);
    
            cy.get(response.body.items).each(($item) => {
                expect($item.gmsCode).to.not.contain('PENDING');
                expect($item.gmsCode).to.not.equal('');
            })
    
            orderPage.clickToGetNextPage()
            for (let i = 1; i < numberOfPages; i++) {
                cy.wait('@pageLoads').then(({ response }) => {
                    expect(response.statusCode).to.equal(200);
    
                    cy.get(response.body.items).each(($item) => {
                        expect($item.gmsCode).to.not.contain('PENDING');
                        expect($item.gmsCode).to.not.equal('');
                    })
                });
    
                orderPage.clickToGetNextPage()
            }
        });
    })
}

/*
    The long tests set, can be use if needs, 
    takes around 4 min in case when number of pages around 40
    In case, when in the Pharmacy settings set Exclude No GMS = true, 
    then system should hide the medicine items from the Order pages, 
    for the Pharmacy.

    Maybe the best way, will be to limit number of pages, around 4-5 would be enough
*/

describe('In case, when Exclude No GMS = true, on the order pages should not be shown medicines with the empty OR PENDING GMScode', () => {

    let pharmacyId = Cypress.env("pharmacyId");

    before(() => {
        cy.cleanUpShoppingCart(pharmacyId);
    });

    beforeEach(() => {
        cy.clearAllCookies();
        cy.intercept('/api/stock-product/products?skip=' + '*').as('pageLoads');
        cy.on('uncaught:exception', (err, runnable) => {
            return false
        })
        cy.updatePharmacySetExcludeNoGms(1, pharmacyId);
        cy.fixture("main").then(data => {
            cy.signInCreateSession(data.pharmacyUserEmail, data.pharmacyUserPassword);
        });
       
    });

    after(() => {
        Cypress.session.clearAllSavedSessions()
    });

    it('Exclude No GMS = true | check Brokered Ethical each page ', () => {

        cy.visitBrokeredEthical();
        checkResponseNoPendingOrEmptyGmsCode();
    });

    it('Exclude No GMS = true | check Brokered OTC each page ', () => {

        cy.visitBrokeredOTC();
        checkResponseNoPendingOrEmptyGmsCode();
    });

    it('Exclude No GMS = true | check Second Line each page ', () => {
        
        cy.visitSecondLine();
        checkResponseNoPendingOrEmptyGmsCode();
    });

    it('Exclude No GMS = true | check ULM each page ', () => {

        cy.visitULM();
        checkResponseNoPendingOrEmptyGmsCode();
    });
});


