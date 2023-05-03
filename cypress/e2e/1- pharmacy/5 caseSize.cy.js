let ItemId, ItemGmsCode;
import OrderPages from "../../pages/OrderPages";
import api from "../../pages/api";

describe('Case Size', () => {
    
    beforeEach(() => {
        cy.intercept(api.route._getPageData)
        .as('pageLoaded');
       
        cy.fixture("main").then(data => 
            {
                cy.login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });
        
        cy.visit(Cypress.env("devURL") + api.pages.BrokeredEthical);
        cy.title()
            .should('eq','Orders-Brokered Ethical');
        
            cy.log("Clear shopping cart")
        cy.CleanShoppingCart(Cypress.env("pharmacyId"));
        
        cy.log("Get the medicine for the testing: ")
        cy.wait('@pageLoaded').then(({response}) => 
        {
            expect(response.statusCode).to.equal(200);
            ItemId = response.body.items[7].id;
            ItemGmsCode = response.body.items[7].gmsCode;
            cy.log(ItemId);
            cy.log(ItemGmsCode);
            cy.wrap(ItemId).as('itemId');
            cy.wrap(ItemGmsCode).as('itemGmsCode');
        })
        cy.log("Make sure item does not have a Case size ")
        cy.get('@itemId').then((Id) => {
            cy.sqlServer(`update StockProducts set CaseSize = 1 where Id = ${Id}`)
        })
    });

    it('Change Qty on the Ordering page', () => {
        let caseSize = 10;
        cy.get('@itemGmsCode').then((gmsCode) => {
            cy.intercept(api.route._filter_GmsCode + gmsCode +'*',)
            .as('searchRequest');
        })
        cy.visit(Cypress.env("devURL") + api.pages.BrokeredEthical);
        
        cy.get('@itemGmsCode').then((gmsCode) => 
        {
            OrderPages.typeAndClickSearch(gmsCode);
                cy.wait('@searchRequest').then(({response}) => 
                {
                    expect(response.statusCode).to.equal(200);
                    cy.get(response.body.items).each(($item) => 
                    {
                        expect($item.gmsCode).to.contain(gmsCode);
                    })
                }) 
        })
        
        cy.log("Update item to make a cases size");
        cy.get('@itemId').then((Id) => {
            cy.sqlServer(`UPDATE StockProducts SET CaseSize = ${caseSize} where Id = ${Id}`)
            cy.reload()
        })
         
        cy.get('@itemGmsCode').then((gmsCode) => 
        {
            cy.wait('@pageLoaded').then(({response}) => 
            {
                expect(response.statusCode).to.equal(200);
                OrderPages.typeAndClickSearch(gmsCode);
                    cy.wait('@searchRequest').then(({response}) => 
                    {
                        expect(response.statusCode).to.equal(200);
                        cy.get(response.body.items).each(($item) => 
                        {
                            expect($item.gmsCode).to.contain(gmsCode);
                        })
                    })  
            }) 
        })
        
        OrderPages.getCaseSizeBudge()
        .should('be.visible')
        .and('have.text',` Case of ${caseSize} `);
        cy.get(`[id^="q"]`)
        .should('have.css', 'background-color', 'rgb(255, 215, 74)')
        
        cy.get('.p-inputnumber-button-up > .p-button-icon').click()
        cy.get(`[id^="q"]`).should('have.value', `${caseSize}`)
        cy.get('.p-inputnumber-button-up > .p-button-icon').click();
        cy.get(`[id^="q"]`).should('have.value', `${caseSize * 2}`)
         
        cy.get('@itemId').then((Id) => {
            cy.sqlServer(`update StockProducts set CaseSize = 1 where Id = ${Id}`)
            cy.reload()
        })
        
        cy.get('@itemGmsCode').then((gmsCode) => {
            cy.wait('@pageLoaded').then(({response}) => {
                expect(response.statusCode).to.equal(200);
                OrderPages.typeAndClickSearch(gmsCode);
                    cy.wait('@searchRequest').then(({response}) => {
                    expect(response.statusCode).to.equal(200);
                    cy.get(response.body.items).each(($item) => {
                        expect($item.gmsCode).to.contain(gmsCode);
                    })
                })  
            })
        })
        
        OrderPages.el.caseSizeBadge()
            .should('not.exist')
        
        OrderPages.el.valueQty()
            .should('have.css', 'background-color', 'rgb(244, 244, 244)')
        
        OrderPages.changeQtyUP()
        OrderPages.el.valueQty()
            .should('have.value', '1')
        OrderPages.changeQtyUP()
        OrderPages.el.valueQty()
            .should('have.value', '2')
    });
    it('Change Qty in the Shopping cart', () => {
        
        cy.get('@itemGmsCode').then((gmsCode)=>{
        cy.intercept(api.route._filter_GmsCode + gmsCode +'*',)
        .as('searchRequest');
        })
        
        cy.intercept(api.route._getShoppingcart).as('getShoppingCartItems');
        cy.intercept(api.route._AddItemShoppingCart).as('addNewItem')
        
        cy.visit(Cypress.env("devURL") + api.pages.BrokeredEthical);
        
        cy.get('@itemGmsCode').then((gmsCode)=>{
            cy.wait('@pageLoaded').then(({response}) => 
            {
                expect(response.statusCode).to.equal(200);
                OrderPages.typeAndClickSearch(gmsCode)
                cy.wait('@searchRequest').then(({response}) => 
                {
                    expect(response.statusCode).to.equal(200);
                    cy.get(response.body.items).each(($item) => 
                    {
                        expect($item.gmsCode).to.contain(gmsCode);
                    })
                })  
            })
        })
        
        cy.get('@itemId').then((Id)=>{
            cy.sqlServer(`update StockProducts set CaseSize = 10 where Id = ${Id}`)
            cy.reload()
        })
        

        cy.get('@itemGmsCode').then((gmsCode)=>{
            cy.wait('@pageLoaded').then(({response}) => 
            {
                expect(response.statusCode).to.equal(200);
                OrderPages.typeAndClickSearch(gmsCode);
                cy.wait('@searchRequest').then(({response}) => 
                {
                    expect(response.statusCode).to.equal(200);
                    cy.get(response.body.items).each(($item) => 
                    {
                        expect($item.gmsCode).to.contain(gmsCode);
                    })
                })  
            })
        })
        

        OrderPages.el.caseSizeBadge()
            .should('be.visible')
            .and('have.text',' Case of 10 ');
        
        OrderPages.el.valueQty()
            .should('have.css', 'background-color', 'rgb(255, 215, 74)')
        
        OrderPages.changeQtyUP();
        OrderPages.el.valueQty()
            .should('have.value', '10')
        
        OrderPages.changeQtyUP();
        OrderPages.el.valueQty()
            .should('have.value', '20')
        
        OrderPages.changeQtyUP();
        OrderPages.el.valueQty()
            .should('have.value', '30')

        OrderPages.addItemShoppingCart();

        

        cy.wait('@addNewItem').then(({ response }) => {
            expect(response.statusCode).to.equal(200);
            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
                cy.get('.summary-card').should('be.visible')
                cy.get('[rte="1Be"] > span').should('be.visible').should('have.text','United Drug')
                cy.get('[rte="1xt"]').should('have.text','1 items')
                cy.get('.summary-items-span > span').should('be.visible').should('have.text',' 1 item ')
                cy.get('.ng-star-inserted > .p-badge').should('be.visible')
                cy.get('#slide-button > .fa-stack > .fa-circle-thin').click()
                
            })
        })
        
        OrderPages.el.valueQty()
            .should('have.css', 'background-color', 'rgb(255, 215, 74)')
        cy.get('pharmax-input > .p-d-flex > .qty > .p-inputnumber > .p-inputnumber-button-group > .p-inputnumber-button-up > .p-button-icon')
        .click()
        OrderPages.el.valueQty()
            .should('have.value', '40').and('be.disabled')
    });
});