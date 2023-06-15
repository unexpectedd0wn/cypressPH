import orderPage, { elements } from "../../page-objects/order-page";
import { _call } from "../../page-objects/api-routes";
import { Wholeslaers } from "../../support/enums";

let pharmacyId = Cypress.env("pharmacyId");

function checkResponseWhereWholeslaerIsUDonly(unitedDrugOptionName) {
    cy.wait('@pageLoads').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
        
        elements.paginationNumberOfPages().then(($number) => {
        let numberOfPages = $number.text()
        cy.log(`Number of the pages is: ${numberOfPages}`);

        cy.get(response.body.items).each(($item) => {
            expect($item.wholesaler).to.contain(unitedDrugOptionName);
        })
        
        orderPage.clickToGetNextPage()
        for (let i = 1; i < numberOfPages; i++) {
            cy.wait('@pageLoads').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
    
                cy.get(response.body.items).each(($item) => {
                    expect($item.wholesaler).to.contain(unitedDrugOptionName);
                })
            });
                orderPage.clickToGetNextPage()
            }
        });
    })
}

function checkNoPIitemsOnThePages() {
    
    // let wholeslaers = [Wholeslaers.PCO.Name, Wholeslaers.IMED.Name, Wholeslaers.ONEILLS.Name, Wholeslaers.LEXON.Name, Wholeslaers.CLINIGEN.Name]
    


    // for (let index = 0; index < wholeslaers.length; index++) {
        
    //     cy.selectWholeslaer(Wholeslaers.PCO.Name)
    //     cy.wait('@pageLoaded').then(({ response }) => {
    //     expect(response.statusCode).to.equal(200);
    //     elements.noRecordsFoundFooter().should('be.visible').and('include.text', 'No records found');
    // })
        
    // }
    
    cy.selectWholeslaer(Wholeslaers.PCO.Name)
    cy.wait('@pageLoaded').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
        elements.noRecordsFoundFooter().should('be.visible').and('include.text', 'No records found');
    })
        
    cy.selectWholeslaer(Wholeslaers.IMED.Name)
    cy.wait('@pageLoaded').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
        elements.noRecordsFoundFooter().should('be.visible').and('include.text', 'No records found');
    })
        
    cy.selectWholeslaer(Wholeslaers.ONEILLS.Name)
    cy.wait('@pageLoaded').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
        elements.noRecordsFoundFooter().should('be.visible').and('include.text', 'No records found');
    })

    cy.selectWholeslaer(Wholeslaers.LEXON.Name)
    cy.wait('@pageLoaded').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
        elements.noRecordsFoundFooter().should('be.visible').and('include.text', 'No records found');
    })
    
    cy.selectWholeslaer(Wholeslaers.CLINIGEN.Name)
    cy.wait('@pageLoaded').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
        elements.noRecordsFoundFooter().should('be.visible').and('include.text', 'No records found');
    })
}


describe('', () => {
    
    before(() => {
        cy.cleanUpShoppingCart(pharmacyId);
        cy.updatePharmacySetUseGreys(0, pharmacyId)

    });

    beforeEach(() => {
        cy.intercept('/api/stock-product/products?skip=' + '*').as('pageLoads');
        cy.intercept(_call._filter_wholesaler + '*').as('pageLoaded');
        cy.on('uncaught:exception', (err, runnable) => {
            return false
        })
        cy.fixture("main").then(data => {
            cy.signInCreateSession(data.pharmacyUserEmail, data.pharmacyUserPassword);
        });
    });
    
    it('Use Parallels = false | Items on the pages | Brokered Ethical', () => {
        
        cy.visitBrokeredEthical();
        checkResponseWhereWholeslaerIsUDonly(Wholeslaers.UD.Name);
        
    });
    
    it('Use Parallels = false | Items on the pages | Brokered OTC', () => {
        
        cy.visitBrokeredOTC();
        checkResponseWhereWholeslaerIsUDonly(Wholeslaers.UD.Name);

    });
    
    it('Use Parallels = false | Items on the pages | Second Line', () => {
        
        cy.visitSecondLine();
        checkResponseWhereWholeslaerIsUDonly(Wholeslaers.UD.Name);

    });
    
    it('Use Parallels = false | Items on the pages | ULM', () => {
        
        cy.visitULM();
        checkResponseWhereWholeslaerIsUDonly(Wholeslaers.UD.secondName);

    });
    
    it('Use Parallels = false | Brokered Ethical | Filter apply', () => {
        
        cy.visitBrokeredEthical();
        checkNoPIitemsOnThePages();
        
    });
    
    it('Use Parallels = false | Brokered OTC | Filter apply', () => {
        
        cy.visitBrokeredOTC();
        checkNoPIitemsOnThePages();
        
    });
    
    it('Use Parallels = false | Second Line | Filter apply', () => {
        
        cy.visitSecondLine();
        checkNoPIitemsOnThePages();
    
    });
    
    it('Use Parallels = false | ULM | Filter apply', () => {
        
        cy.visitULM();
        checkNoPIitemsOnThePages();
    
    });
});
