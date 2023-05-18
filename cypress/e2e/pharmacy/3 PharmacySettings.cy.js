import routes from "../../pages/routes";

describe('', () => {

    let pharmacyId = Cypress.env("pharmacyId");
    let userId = '455';
    

    before(() => {
        cy.CleanUpShoppingCart(pharmacyId);
        cy.clearAllCookies();
    });

    beforeEach(() => {
        cy.clearAllCookies();
    });
    
    // it('Access ULM | ON\OFF', () => {
    //     cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
    //     cy.intercept('/api/stock-product/products?skip=0&take=25&sortingDirection=1&sortingField=description&filters%5B0%5D.propertyName=expectedDelivery&filters%5B0%5D.value=0&filters%5B0%5D.$type=number&filters%5B0%5D.matchMode=0&filters%5B1%5D.propertyName=ulm*').as('ULMPageLoads')
    //     cy.sqlServer(`DELETE from webpages_UsersInRoles where UserId = ${userId} and RoleId = 9`);

    //     cy.fixture("main").then(data => {
    //         cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
    //     });

    //     cy.wait('@getShoppingCartItems').then(({ response }) => {
    //         expect(response.statusCode).to.equal(200);
    //         cy.get(':nth-child(6) > .p-menuitem-link > .p-menuitem-text').should('be.visible').and('have.text', 'Order History');
    //     });

    //     cy.Logout();
    //     cy.clearAllCookies();
    //     cy.sqlServer(`INSERT INTO webpages_UsersInRoles VALUES (${userId},9)`);

    //     cy.fixture("main").then(data => {
    //         cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
    //     });

    //     cy.get(':nth-child(6) > .p-menuitem-link').should('exist').and('be.visible')
    //     cy.get(':nth-child(6) > .p-menuitem-link > .p-menuitem-text').should('be.visible').and('have.text', 'ULM').click();

    //     cy.get('#order-title').should('be.visible').and('have.text', 'ULM')
    //     cy.wait('@ULMPageLoads').then(({ response }) => {
    //         expect(response.statusCode).to.equal(200);
    //     });
    // });
    
    // it('Exclude No GMS = true', () => {
    //     cy.intercept('/api/stock-product/products?*').as('pageLoads');
    //     cy.sqlServer(``);
    //     cy.fixture("main").then(data => {
    //         cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
    //     });
    //     cy.visit(Cypress.env("devURL") + routes._page.BrokeredEthical);
    //     cy.title()
    //         .should('eq', 'Orders-Brokered Ethical');

    //     cy.wait('@PageLoads').then(({ response }) => {
    //         expect(response.statusCode).to.equal(200);

    //         cy.get(response.body.items).each(($item) => {
    //             expect($item.gmsCode).to.not.contain('PENDING');
    //         })
    //     });
        
    // });
    // it('Use Parallels | Items on the pages', () => {
        
    // });
    it('If "Show UD Prices and Discounts" = false and "Show Second Line Prices and Discounts" = false 0:0', () => {
        cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
        cy.sqlServer(`DELETE from webpages_UsersInRoles where UserId = ${userId} and RoleId = 9`);

        cy.fixture("main").then(data => {
            cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
        });

        cy.wait('@getShoppingCartItems').then(({ response }) => {
            expect(response.statusCode).to.equal(200);
            
        });
    });
    // it('If "Show UD Prices and Discounts" = true and "Show Second Line Prices and Discounts" = false 1:0', () => {
        
    // });
    // it('If "Show UD Prices and Discounts" = true and "Show Second Line Prices and Discounts" = false 1:1', () => {
        
    // });
    // it('Wholesaler is Deleted = 1 | check Wholeslaer drop downs', () => {
    //     cy.sqlServer(`UPDATE Wholesalers set IsDeleted = '1' where Id = 4`);

    //     cy.fixture("main").then(data => {
    //         cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
    //     });






    // });

});