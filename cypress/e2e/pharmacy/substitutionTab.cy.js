const dayjs = require("dayjs");
import shoppingCart, { getPrefredInStock } from "../../pages/shoppingCart";

describe('SubstitutionTab check', () => {
    let preferedId = 27405;
    let nextBestId = 27694;
    let pharmacyId = 411;
    let addItemDateTime = dayjs;
    let IPUcode = 5099627279192;
    
    before(() => {
        
        cy.sqlServer(`DELETE from BrokeredItems where PharmacyId = ${pharmacyId}`);
        cy.sqlServer(`INSERT INTO BrokeredItems VALUES (${preferedId},${pharmacyId},'1',${IPUcode}, '2023-04-26 12:45:42.917')`);

        
    });
    beforeEach(() => {
        cy.fixture("PH2").then(data => {
            cy.login(data.pharmacyUserEmail, data.pharmacyUserPassword);
        });

        
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
        it('Test 01.01', () => {
            
            
            
            cy.updateStockProducts(0,0,0,preferedId);
            cy.updateStockProducts(0,1,0,nextBestId);
            cy.updatePharmacy(1,"'23:35:00.0000000'",3,1,411);
            
            
            cy.intercept('/api/pharmacy/shoppingcart?partial=false*').as('getShoppingCartItems');
            cy.visit(Cypress.env("devURL"));
            
            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
            });
            
            shoppingCart.substitutionTab.preferedTitle().should('have.text','Preferred:')
            
            shoppingCart.substitutionTab.preferedInStock().should('have.text','Out of Stock Ballina,  Out of Stock Dublin ')
            shoppingCart.substitutionTab.expectedDeliveryText().should('have.text', 'Next Day')
            shoppingCart.substitutionTab.nextBestTitle().should('have.text','Next Best:')
            
            shoppingCart.substitutionTab.nextBestDescription().should('be.visible')
            shoppingCart.substitutionTab.nextBestNetPrice().should('be.visible')
            shoppingCart.substitutionTab.preferedNetPrice().should('be.visible')
            shoppingCart.substitutionTab.preferedDescription().should('be.visible')
            shoppingCart.substitutionTab.expectedDeliveryTick().should('be.visible')
            shoppingCart.substitutionTab.orderButton().should('be.visible')
            shoppingCart.substitutionTab.qtyInput().should('be.visible')
            shoppingCart.substitutionTab.deleteIcon().should('be.visible')
            
        });
        /*
        +--------------+----------------+-----------------+----------------+-----------------+
        | beforeCutOff | PFInStockLocal | PFInStockCutOff | NBInStockLocal | NBInStockCutOff |
        +--------------+----------------+-----------------+----------------+-----------------+
        | 1            | 0              | 0               | 0              | 0               |
        +--------------+----------------+-----------------+----------------+-----------------+
        */
        it('Test 01.02', () => {
            cy.updateStockProducts(0,0,0,preferedId);
            cy.updateStockProducts(0,0,0,nextBestId);
            cy.updatePharmacy(1,"'23:35:00.0000000'",3,1,411);
            
            
            cy.intercept('/api/pharmacy/shoppingcart?partial=false*').as('getShoppingCartItems');
            cy.visit(Cypress.env("devURL"));
            
            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
            });
            
            shoppingCart.substitutionTab.preferedTitle().should('have.text','Preferred:')
            shoppingCart.substitutionTab.preferedInStock().should('have.text','Out of Stock Ballina,  Out of Stock Dublin ')
            shoppingCart.substitutionTab.preferedNetPrice().should('not.exist')
            shoppingCart.substitutionTab.preferedDescription().should('be.visible')
            
            shoppingCart.substitutionTab.expectedDeliveryText().should('not.exist')
            
            shoppingCart.substitutionTab.expectedDeliveryTick().should('not.exist')
            shoppingCart.substitutionTab.orderButton().should('not.exist')
            shoppingCart.substitutionTab.qtyInput().should('not.exist')
            
            shoppingCart.substitutionTab.deleteIcon().should('be.visible')
            
            shoppingCart.substitutionTab.nextBestTitle().should('not.exist')
            shoppingCart.substitutionTab.nextBestDescription().should('not.exist')
            shoppingCart.substitutionTab.nextBestNetPrice().should('not.exist')
            
        });
        /*
        +--------------+----------------+-----------------+----------------+-----------------+
        | beforeCutOff | PFInStockLocal | PFInStockCutOff | NBInStockLocal | NBInStockCutOff |
        +--------------+----------------+-----------------+----------------+-----------------+
        | 1            | 0              | 0               | 1              | 0               |
        +--------------+----------------+-----------------+----------------+-----------------+
        */
        it('Test 01.03', () => {
            cy.updateStockProducts(0,0,0,preferedId);
            cy.updateStockProducts(1,0,0,nextBestId);
            cy.updatePharmacy(1,"'23:35:00.0000000'",3,1,411);
            
            
            cy.intercept('/api/pharmacy/shoppingcart?partial=false*').as('getShoppingCartItems');
            cy.visit(Cypress.env("devURL"));
            
            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
            });
            
            shoppingCart.substitutionTab.preferedTitle().should('have.text','Preferred:')
            shoppingCart.substitutionTab.preferedInStock().should('have.text','Out of Stock Ballina,  Out of Stock Dublin ')
            shoppingCart.substitutionTab.preferedNetPrice().should('be.visible')
            shoppingCart.substitutionTab.preferedDescription().should('be.visible')
            shoppingCart.substitutionTab.expectedDeliveryText().should('have.text', 'Same Day')
            shoppingCart.substitutionTab.expectedDeliveryTick().should('be.visible')
            shoppingCart.substitutionTab.orderButton().should('be.visible')
            shoppingCart.substitutionTab.qtyInput().should('be.visible')
            shoppingCart.substitutionTab.deleteIcon().should('be.visible')
            shoppingCart.substitutionTab.nextBestTitle().should('have.text','Next Best:')
            shoppingCart.substitutionTab.nextBestDescription().should('be.visible')
            shoppingCart.substitutionTab.nextBestNetPrice().should('be.visible')
            
        });
        /*
        +--------------+----------------+-----------------+----------------+-----------------+
        | beforeCutOff | PFInStockLocal | PFInStockCutOff | NBInStockLocal | NBInStockCutOff |
        +--------------+----------------+-----------------+----------------+-----------------+
        | 1            | 1              | 0               | 0              | 0               |
        +--------------+----------------+-----------------+----------------+-----------------+
        */
        it('Test 01.04', () => {
            cy.updateStockProducts(1,0,0,preferedId);
            cy.updateStockProducts(0,0,0,nextBestId);
            cy.updatePharmacy(1,"'23:35:00.0000000'",3,1,411);
            
            
            cy.intercept('/api/pharmacy/shoppingcart?partial=false*').as('getShoppingCartItems');
            cy.visit(Cypress.env("devURL"));
            
            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
            });
            
            shoppingCart.substitutionTab.preferedTitle().should('have.text','Preferred:')
            shoppingCart.substitutionTab.preferedInStock().should('have.text',' Back In Stock Ballina ')
            shoppingCart.substitutionTab.preferedNetPrice().should('be.visible')
            shoppingCart.substitutionTab.preferedDescription().should('be.visible')
            shoppingCart.substitutionTab.expectedDeliveryText().should('have.text', 'Same Day')
            shoppingCart.substitutionTab.expectedDeliveryTick().should('be.visible')
            shoppingCart.substitutionTab.orderButton().should('be.visible')
            shoppingCart.substitutionTab.qtyInput().should('be.visible')
            shoppingCart.substitutionTab.deleteIcon().should('be.visible')
            shoppingCart.substitutionTab.nextBestTitle().should('not.exist')
            shoppingCart.substitutionTab.nextBestDescription().should('not.exist')
            shoppingCart.substitutionTab.nextBestNetPrice().should('not.exist')
            
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