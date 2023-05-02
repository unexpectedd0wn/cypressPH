import dayjs from 'dayjs'


describe('Expected Delivery', () => {
    
    before(() => {
        cy.sqlServer('DELETE from BrokeredItems where PharmacyId = 411');
        cy.sqlServer(`INSERT INTO BrokeredItems VALUES ('16642','411','1','5099627704601', '2023-04-26 12:45:42.917')`);
    });

    beforeEach(() => {
        cy.fixture("PH2").then(data => {
            cy.login(data.pharmacyUserEmail, data.pharmacyUserPassword);
        });
    });

    after(() => {
        
    });
    
    
    
    it('Case1', () => {
        cy.updateStockProducts(0,0,0,16642);
        cy.updatePharmacy("'21:35:00.0000000'",1,1,411)
        
        cy.intercept('/api/pharmacy/shoppingcart?partial=false*').as('getShoppingCartItems');
        cy.visit(Cypress.env("devURL"));
        
        cy.wait('@getShoppingCartItems').then(({ response }) => {
            expect(response.statusCode).to.equal(200);
        });
        
        cy.get('.selectedWholesaler-span').should('have.text',' Substitutions ');
        cy.get('.pref-exected-delivery').should('have.text',' Out of Stock Dublin ');
        cy.get('.title').should('have.text','Preferred:');
        cy.get('.preferred-description').should('not.be.empty');
        cy.get('.p-button-rounded > .p-button-icon')
        .should('be.visible');
    })
    it('Case2', () => {

        cy.sqlServer('UPDATE StockProducts set InBallinaStock = 1, InDublinStock = 1, InLimerickStock = 1  where Id = 16642');
        cy.sqlServer(`Update Pharmacists set CutOffTime = '01:35:00.0000000', NormalDepotId = '1', MainDepotId = '1' where Id = '411'`);
        
        cy.intercept('/api/pharmacy/shoppingcart?partial=false*').as('getShoppingCartItems');
        cy.visit(Cypress.env("devURL"));
        
        cy.wait('@getShoppingCartItems').then(({ response }) => {
            expect(response.statusCode).to.equal(200);
        });
        
        cy.get('.selectedWholesaler-span').should('have.text',' Substitutions ');
        cy.get('.pref-exected-delivery').should('have.text',' Back In Stock Dublin ');
        cy.get('.title').should('have.text','Preferred:');
        cy.get('.preferred-description').should('not.be.empty');
        cy.get('.next-day-text').should('have.text','Next Day');
        cy.get('.fa.fa-check.ng-star-inserted').should('be.visible');
    })
});


