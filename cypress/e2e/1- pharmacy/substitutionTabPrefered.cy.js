const dayjs = require("dayjs");
import shoppingCart, { getPrefredInStock } from "../../pages/shoppingCart";

describe('SubstitutionTab check', () => {
    /*
        Before the run, please fill in: 
         preferedId, nextBestId

         also, make sure the conditions is set as expected 
    */
    
    let preferedId = 27405;
    let preferedDescription = " ATORVASTATIN FC  TABS 40MG (ACTAVIS) ATORVASTATIN ";//spaces in the start and and!IMPORTANT!
    let nextBestId = 27694;
    let nextBestDescription = "ATORVASTATIN TABS 10MG (PFIZER) ATORVASTATIN";
    // let pharmacyId = 411;
    // let addItemDateTime = dayjs;
    let IPUcode = 5099627279192;
    let pharmacyId = Cypress.env("pharmacyId");
    
    before(() => {
        cy.clearAllLocalStorage();
        cy.CleanUpShoppingCart(pharmacyId);
        cy.AddItemSubstitutionTab(preferedId, pharmacyId, IPUcode);
    });
    beforeEach(() => {
        cy.clearAllCookies();
        cy.fixture("main").then(data => {
            cy.loginasitis(data.pharmacyUserEmail, data.pharmacyUserPassword);
            
        });

        
    });


    afterEach(() => {
       
        cy.clearAllCookies();
        cy.clearAllLocalStorage();
    });

    // function getIPU(value) {
    //     cy.sqlServer(`SELECT IPUCode FROM StockProducts WHERE Id = ${value}`).then((result) => { 
    //         let IPUcode = result;
            
    //         return IPUcode;
    //     })
    // }
    
    context('Ballina -> Dublin', () => {

        /*
        +--------------+----------------+-----------------+----------------+-----------------+
        | beforeCutOff | PFInStockLocal | PFInStockCutOff | NBInStockLocal | NBInStockCutOff |
        +--------------+----------------+-----------------+----------------+-----------------+
        | 1            | 0              | 0               | 0              | 1               |
        +--------------+----------------+-----------------+----------------+-----------------+
        */
        // it('Test 01.01', () => {
            
            
            
        //     cy.updateStockProducts(0,0,0,preferedId);
        //     cy.updateStockProducts(0,1,0,nextBestId);
        //     cy.updatePharmacy(1,"'23:35:00.0000000'",3,1,411);
            
            
        //     cy.intercept('/api/pharmacy/shoppingcart?partial=false*').as('getShoppingCartItems');
        //     cy.visit(Cypress.env("devURL"));
            
        //     cy.wait('@getShoppingCartItems').then(({ response }) => {
        //         expect(response.statusCode).to.equal(200);
        //     });

            
            

        //     let StockNote = `Out of Stock Ballina,  Out of Stock Dublin `;
        //     let ExpectedDelivery = 'Next Day';
            

        //     cy.SubstitutionState_type1(StockNote, preferedDescription, nextBestDescription, ExpectedDelivery )
                
            
            
            
        // });
        // /*
        // +--------------+----------------+-----------------+----------------+-----------------+
        // | beforeCutOff | PFInStockLocal | PFInStockCutOff | NBInStockLocal | NBInStockCutOff |
        // +--------------+----------------+-----------------+----------------+-----------------+
        // | 1            | 0              | 0               | 0              | 0               |
        // +--------------+----------------+-----------------+----------------+-----------------+
        // */
        // it('Test 01.02', () => {
        //     cy.updateStockProducts(0,0,0,preferedId);
        //     cy.updateStockProducts(0,0,0,nextBestId);
        //     cy.updatePharmacy(1,"'23:35:00.0000000'",3,1,411);
            
            
        //     cy.intercept('/api/pharmacy/shoppingcart?partial=false*').as('getShoppingCartItems');
        //     cy.visit(Cypress.env("devURL"));
            
        //     cy.wait('@getShoppingCartItems').then(({ response }) => {
        //         expect(response.statusCode).to.equal(200);
        //     });

        //     let StockNote = `Out of Stock Ballina,  Out of Stock Dublin `;
            
        //     cy.SubstitutionState_type2(StockNote)
            
        // });
        // // /*
        // // +--------------+----------------+-----------------+----------------+-----------------+
        // // | beforeCutOff | PFInStockLocal | PFInStockCutOff | NBInStockLocal | NBInStockCutOff |
        // // +--------------+----------------+-----------------+----------------+-----------------+
        // // | 1            | 0              | 0               | 1              | 0               |
        // // +--------------+----------------+-----------------+----------------+-----------------+
        // // */
        // it('Test 01.03', () => {
        //     cy.updateStockProducts(0,0,0,preferedId);
        //     cy.updateStockProducts(1,0,0,nextBestId);
        //     cy.updatePharmacy(1,"'23:35:00.0000000'",3,1,411);
            
            
        //     cy.intercept('/api/pharmacy/shoppingcart?partial=false*').as('getShoppingCartItems');
        //     cy.visit(Cypress.env("devURL"));
            
        //     cy.wait('@getShoppingCartItems').then(({ response }) => {
        //         expect(response.statusCode).to.equal(200);
        //     });

        //     let StockNote = `Out of Stock Ballina,  Out of Stock Dublin `;
        //     let ExpectedDelivery = 'Same Day';
        //     cy.SubstitutionState_type1(StockNote, preferedDescription, nextBestDescription, ExpectedDelivery )
            
            
            
        // });
        // /*
        // +--------------+----------------+-----------------+----------------+-----------------+
        // | beforeCutOff | PFInStockLocal | PFInStockCutOff | NBInStockLocal | NBInStockCutOff |
        // +--------------+----------------+-----------------+----------------+-----------------+
        // | 1            | 1              | 0               | 0              | 0               |
        // +--------------+----------------+-----------------+----------------+-----------------+
        // */
        // it('Test 01.04', () => {
        //     cy.updateStockProducts(1,0,0,preferedId);
        //     cy.updateStockProducts(0,0,0,nextBestId);
        //     cy.updatePharmacy(1,"'23:35:00.0000000'",3,1,411);
            
            
        //     cy.intercept('/api/pharmacy/shoppingcart?partial=false*').as('getShoppingCartItems');
        //     cy.visit(Cypress.env("devURL"));
            
        //     cy.wait('@getShoppingCartItems').then(({ response }) => {
        //         expect(response.statusCode).to.equal(200);
        //     });
            
        //     shoppingCart.substitutionTab.preferedTitle().should('have.text','Preferred:')
        //     shoppingCart.substitutionTab.preferedInStock().should('have.text',' Back In Stock Ballina ')
        //     shoppingCart.substitutionTab.preferedNetPrice().should('be.visible')
        //     shoppingCart.substitutionTab.preferedDescription().should('be.visible')
        //     shoppingCart.substitutionTab.expectedDeliveryText().should('have.text', 'Same Day')
        //     shoppingCart.substitutionTab.expectedDeliveryTick().should('be.visible')
        //     shoppingCart.substitutionTab.orderButton().should('be.visible')
        //     shoppingCart.substitutionTab.qtyInput().should('be.visible')
        //     shoppingCart.substitutionTab.deleteIcon().should('be.visible')
        //     shoppingCart.substitutionTab.nextBestTitle().should('not.exist')
        //     shoppingCart.substitutionTab.nextBestDescription().should('not.exist')
        //     shoppingCart.substitutionTab.nextBestNetPrice().should('not.exist')
            
        // });
        it('Test 01.08', () => {
            
            cy.intercept('/api/pharmacy/shoppingcart?partial=false*').as('getShoppingCartItems');
            cy.updateStockProducts(0,0,0,preferedId);
            cy.updateStockProducts(0,1,0,nextBestId);
            cy.updatePharmacy(1,"'01:35:00.0000000'",3,1,411);
            
            
            
            
            cy.visit(Cypress.env("devURL"));
            
            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
            });

            let StockNote = `Out of Stock Ballina,  Out of Stock Dublin `;
            let ExpectedDelivery = 'Next Day';
            

            cy.SubstitutionState_type1(StockNote, preferedDescription, nextBestDescription, ExpectedDelivery )
            
            
            
        });

        it('Test 01.09', () => {
            cy.updateStockProducts(0,0,0,preferedId);
            cy.updateStockProducts(0,0,0,nextBestId);
            cy.updatePharmacy(1,"'01:35:00.0000000'",3,1,411);
            
            
            cy.intercept('/api/pharmacy/shoppingcart?partial=false*').as('getShoppingCartItems');
            cy.visit(Cypress.env("devURL"));
            
            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
            });

            let StockNote = ` Out of Stock Dublin `;
            
            cy.SubstitutionState_type2(StockNote)
            
        });
    })

    context('Dublin -> Dublin', () => {

        // it('Test 01.01', () => {
        //     cy.updateStockProducts(0,0,0,16642);
        //     cy.updatePharmacy(1,"'21:35:00.0000000'",1,1,411)
            
        //     cy.intercept('/api/pharmacy/shoppingcart?partial=false*').as('getShoppingCartItems');
        //     cy.visit(Cypress.env("devURL"));
            
        //     cy.wait('@getShoppingCartItems').then(({ response }) => {
        //         expect(response.statusCode).to.equal(200);
        //     });
            
        //     cy.get('.selectedWholesaler-span').should('have.text',' Substitutions ');
        //     cy.get('.pref-exected-delivery').should('have.text',' Out of Stock Dublin ');
        //     cy.get('.title').should('have.text','Preferred:');
        //     cy.get('.preferred-description').should('not.be.empty');
        //     cy.get('.p-button-rounded > .p-button-icon')
        //     .should('be.visible');
        // });
    })
});