describe('Case Size', () => {
    
    beforeEach(() => {
        
        
    });

    it('Change Qty on the Ordering page', () => {
        let gmsCode = 11849;
        cy.sqlServer('delete from ShoppingCartItems where PharmacyId = 411');
        cy.sqlServer('delete from BrokeredItems where PharmacyId = 411');
        cy.sqlServer(`update StockProducts set CaseSize = 1 where Id = 16605`)
        cy.intercept('/api/stock-product/products?skip=0&take=25&sortingDirection=1&sortingField=description&filters%5B0%5D.propertyName=GMSCode&filters%5B0%5D.value='+ gmsCode +'*',)
        .as('searchRequest');
            cy.intercept('/api/stock-product/products?skip=0&take=25&sortingDirection=1&sortingField=description&filters%5B0%5D.propertyName=expectedDelivery&filters%5B0%5D.value=0&filters%5B0%5D.$type=number&filters%5B0%5D.matchMode=0&filters%5B1%5D.propertyName=brokeredEthical&filters%5B1%5D.value=true&filters%5B1%5D.$type=boolean*')
            .as('pageLoaded');
        cy.fixture("main").then(data => 
            {
                cy.login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });
        
        cy.visit(Cypress.env("devURL") + "/app/orders/brokeredEthical?filterBy=brokeredEthical");
        cy.title()
            .should('eq','Orders-Brokered Ethical');
        
        cy.wait('@pageLoaded').then(({response}) => {
                expect(response.statusCode).to.equal(200);
                
                cy.get('.p-inputgroup > .p-inputtext').type(gmsCode);
                cy.get('.p-inputgroup-addon').click();
                cy.wait('@searchRequest').then(({response}) => {
                expect(response.statusCode).to.equal(200);
                
                cy.get(response.body.items).each(($item) => {
                    expect($item.gmsCode).to.contain(gmsCode);
                })
                })  
        })
        
        cy.sqlServer(`update StockProducts set CaseSize = 10 where Id = 16605`)
        cy.reload()

        cy.wait('@pageLoaded').then(({response}) => {
            expect(response.statusCode).to.equal(200);
            
            cy.get('.p-inputgroup > .p-inputtext').type(gmsCode);
            cy.get('.p-inputgroup-addon').click();
            cy.wait('@searchRequest').then(({response}) => {
            expect(response.statusCode).to.equal(200);
            
            cy.get(response.body.items).each(($item) => {
                expect($item.gmsCode).to.contain(gmsCode);
            })
            })  
        })

        cy.get('.badge')
        .should('be.visible')
        .and('have.text',' Case of 10 ');
        cy.get('#q16605')
        .should('have.css', 'background-color', 'rgb(255, 215, 74)')
        
        cy.get('.p-inputnumber-button-up > .p-button-icon').click()
        cy.get('#q16605').should('have.value', '10')
        cy.get('.p-inputnumber-button-up > .p-button-icon').click()
        cy.get('#q16605').should('have.value', '20')
         
        cy.sqlServer(`update StockProducts set CaseSize = 1 where Id = 16605`)
        cy.reload()

        cy.wait('@pageLoaded').then(({response}) => {
            expect(response.statusCode).to.equal(200);
            
            cy.get('.p-inputgroup > .p-inputtext').type(gmsCode);
            cy.get('.p-inputgroup-addon').click();
            cy.wait('@searchRequest').then(({response}) => {
            expect(response.statusCode).to.equal(200);
            
            cy.get(response.body.items).each(($item) => {
                expect($item.gmsCode).to.contain(gmsCode);
            })
            })  
        })

        cy.get('.badge')
        .should('not.exist')
        
        cy.get('#q16605')
        .should('have.css', 'background-color', 'rgb(244, 244, 244)')
        
        cy.get('.p-inputnumber-button-up > .p-button-icon').click()
        cy.get('#q16605').should('have.value', '1')
        cy.get('.p-inputnumber-button-up > .p-button-icon').click()
        cy.get('#q16605').should('have.value', '2')
    });
    it('Change Qty in the Shopping cart', () => {
        let gmsCode = 11849;
        cy.sqlServer('delete from ShoppingCartItems where PharmacyId = 411');
        cy.sqlServer('delete from BrokeredItems where PharmacyId = 411');
        cy.sqlServer(`update StockProducts set CaseSize = 1 where Id = 16605`)
        cy.sqlServer(`update StockProducts set InBallinaStock = 1, InDublinStock = 1, InLimerickStock = 1 where Id = 16605`)
        cy.intercept('/api/stock-product/products?skip=0&take=25&sortingDirection=1&sortingField=description&filters%5B0%5D.propertyName=GMSCode&filters%5B0%5D.value='+ gmsCode +'*',)
        .as('searchRequest');
            cy.intercept('/api/stock-product/products?skip=0&take=25&sortingDirection=1&sortingField=description&filters%5B0%5D.propertyName=expectedDelivery&filters%5B0%5D.value=0&filters%5B0%5D.$type=number&filters%5B0%5D.matchMode=0&filters%5B1%5D.propertyName=brokeredEthical&filters%5B1%5D.value=true&filters%5B1%5D.$type=boolean*')
            .as('pageLoaded');
            cy.intercept('/api/pharmacy/shoppingcart*').as('getShoppingCartItems');
        
        cy.intercept('/api/stock-product/cart/add*').as('addNewItem')
        cy.fixture("main").then(data => 
            {
                cy.login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });
        
        cy.visit(Cypress.env("devURL") + "/app/orders/brokeredEthical?filterBy=brokeredEthical");
        cy.title()
            .should('eq','Orders-Brokered Ethical');
        
        cy.wait('@pageLoaded').then(({response}) => {
                expect(response.statusCode).to.equal(200);
                
                cy.get('.p-inputgroup > .p-inputtext').type(gmsCode);
                cy.get('.p-inputgroup-addon').click();
                cy.wait('@searchRequest').then(({response}) => {
                expect(response.statusCode).to.equal(200);
                
                cy.get(response.body.items).each(($item) => {
                    expect($item.gmsCode).to.contain(gmsCode);
                })
                })  
        })
        
        cy.sqlServer(`update StockProducts set CaseSize = 10 where Id = 16605`)
        cy.reload()

        cy.wait('@pageLoaded').then(({response}) => {
            expect(response.statusCode).to.equal(200);
            
            cy.get('.p-inputgroup > .p-inputtext').type(gmsCode);
            cy.get('.p-inputgroup-addon').click();
            cy.wait('@searchRequest').then(({response}) => {
            expect(response.statusCode).to.equal(200);
            
            cy.get(response.body.items).each(($item) => {
                expect($item.gmsCode).to.contain(gmsCode);
            })
            })  
        })

        cy.get('.badge')
        .should('be.visible')
        .and('have.text',' Case of 10 ');
        cy.get('#q16605')
        .should('have.css', 'background-color', 'rgb(255, 215, 74)')
        
        cy.get('.p-inputnumber-button-up > .p-button-icon').click()
        cy.get('#q16605').should('have.value', '10')
        cy.get('.p-inputnumber-button-up > .p-button-icon').click()
        cy.get('#q16605').should('have.value', '20')
        cy.get('.p-inputnumber-button-up > .p-button-icon').click()
        cy.get('#q16605').should('have.value', '30')

        cy.get('.pi-plus-circle').click()

        

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

        
        
            cy.get(`[id^="pi"]`).should('have.css', 'background-color', 'rgb(255, 215, 74)')

        
         
        
        
        
        cy.get('pharmax-input > .p-d-flex > .qty > .p-inputnumber > .p-inputnumber-button-group > .p-inputnumber-button-up > .p-button-icon')
        .click()
        cy.get(`[id^="pi"]`).should('have.value', '40').and('be.disabled')

        

        
    });
});