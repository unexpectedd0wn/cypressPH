import intercept from "../../pages/routes";
describe('The test cases for the check that the system correct works with the OOS items', () => {
    
    // beforeEach(() => {
    //     cy.fixture("main").then(data => {
    //         cy.login(data.pharmacyUserEmail, data.pharmacyUserPassword);
    //     });
    // });
    it('Load the page -> Move UD item to the OOS -> Then Add item to the shopping cart', () => {
        let value = "United Drug";
        cy.sqlServer('delete from ShoppingCartItems where PharmacyId = 411');
        cy.sqlServer('delete from BrokeredItems where PharmacyId = 411');
        cy.fixture("main").then(data => 
            {
                cy.login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });
        
        cy.intercept('/api/pharmacy/shoppingcart*').as('getShoppingCartItems');
        cy.intercept(intercept.requestWith.wholesaler + 1 + '*',).as('searchRequest');
        cy.intercept('/api/stock-product/cart/add*').as('addNewItem')
        cy.visit(Cypress.env("devURL") + "/app/orders/brokeredEthical?filterBy=brokeredEthical");
        cy.title()
            .should('eq','Orders-Brokered Ethical');
            
        
        cy.wait('@getShoppingCartItems').then(({ response }) => {
            expect(response.statusCode).to.equal(200);
            // cy.get('#slide-button > .fa-stack > .fa-circle-thin').click();
            cy.selectWholeslaer(value);
            cy.wait('@searchRequest').then(({ response }) => {
            expect(response.statusCode).to.equal(200);
            cy.get(response.body.items).each(($item) => {
                expect($item.wholesalerId).to.equal(1);
            })
        })
        });
        
        
        cy.get('#orders-page-container > p-table > div > div.p-datatable-wrapper.ng-star-inserted > table > tbody > tr:nth-child(5) > td.qty-column.most-right-cell > div > p-inputnumber > span > span > button.buttons.p-inputnumber-button.p-inputnumber-button-up.p-button.p-component.p-button-icon-only')
        .click();
        cy.get('body > bbwt:nth-child(2) > div:nth-child(1) > app:nth-child(5) > ultima-layout:nth-child(4) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > app-order-products:nth-child(4) > div:nth-child(1) > p-table:nth-child(3) > div:nth-child(1) > div:nth-child(1) > table:nth-child(1) > tbody:nth-child(2) > tr:nth-child(5) > td:nth-child(4) > div:nth-child(1) > i:nth-child(2)')
        .click();

        
        cy.wait('@addNewItem').then(({ response }) => {
            expect(response.statusCode).to.equal(200);
            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
                cy.get('.summary-card').should('be.visible')
                cy.get('[rte="1Be"] > span').should('be.visible').should('have.text','United Drug')
                cy.get('[rte="1xt"]').should('have.text','1 items')
                cy.get('.summary-items-span > span').should('be.visible').should('have.text',' 1 item ')
                cy.get('.ng-star-inserted > .p-badge').should('be.visible')
                cy.get('.summary-card').click()
                
            })
        })
        cy.get('tbody tr:nth-child(1) td:nth-child(1)').invoke('val').then(cy.log)

        // cy.sqlServer(`SELECT Id FROM StockProducts WHERE Id = ${value}`).then((result) => { 
        //             let IPUcode = result;
                    
        //             return IPUcode;
        //         })
        


        
        
        

        



    });
    // it('Load the page -> Move ULM item to the OOS -> Then Add item to the shopping cart', () => {
        
    // });
    // it('Load the page -> Move PI item to the OOS -> Then Add item to the shopping cart', () => {
        
    // });
    // it('Add UD item to the shopping cart -> Move to the OOS', () => {
        
    // });
    // it('Exclude No GMS = true', () => {
        
    // });
    // it('Add PI item to the shopping cart -> Move to the OOS', () => {
        
    // });
});