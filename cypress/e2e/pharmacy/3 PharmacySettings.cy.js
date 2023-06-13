import { shoppingCart } from "../../page-objects/order-page";
import routes, { _call } from "../../page-objects/api-routes";
import { Wholeslaers } from "../../support/enums";
const dayjs = require("dayjs");


describe('', () => {

    let pharmacyId = Cypress.env("pharmacyId");
    let userId = '455';
    let currentDateTime = dayjs().format("YYYY-MM-DD HH:mm:ss:SSS");

    

    before(() => {
        cy.cleanUpShoppingCart(pharmacyId);
        cy.clearAllCookies();
    });

    beforeEach(() => {
        cy.clearAllCookies();
    });
    
    it('Access ULM | ON\OFF', () => {
        cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
        cy.intercept('/api/stock-product/products?skip=0&take=25&sortingDirection=1&sortingField=description&filters%5B0%5D.propertyName=expectedDelivery&filters%5B0%5D.value=0&filters%5B0%5D.$type=number&filters%5B0%5D.matchMode=0&filters%5B1%5D.propertyName=ulm*').as('ULMPageLoads')
        cy.sqlServer(`DELETE from webpages_UsersInRoles where UserId = ${userId} and RoleId = 9`);

        cy.fixture("main").then(data => {
            cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
        });

        cy.wait('@getShoppingCartItems').then(({ response }) => {
            expect(response.statusCode).to.equal(200);
            cy.get(':nth-child(6) > .p-menuitem-link > .p-menuitem-text').should('be.visible').and('have.text', 'Order History');
        });

        cy.Logout();
        cy.clearAllCookies();
        cy.sqlServer(`INSERT INTO webpages_UsersInRoles VALUES (${userId},9)`);

        cy.fixture("main").then(data => {
            cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
        });

        cy.get(':nth-child(6) > .p-menuitem-link').should('exist').and('be.visible')
        cy.get(':nth-child(6) > .p-menuitem-link > .p-menuitem-text').should('be.visible').and('have.text', 'ULM').click();

        cy.get('#order-title').should('be.visible').and('have.text', 'ULM')
        cy.wait('@ULMPageLoads').then(({ response }) => {
            expect(response.statusCode).to.equal(200);
        });
    });
    it('Exclude No GMS = true | check Brokered Ethical each page ', () => {
        /*
        The long test, can be use if need, takes arount 4 min in case when number of pages around 40
        */
        cy.on('uncaught:exception', (err, runnable) => {

            return false

        })

        
        cy.intercept('/api/stock-product/products?skip=' + '*').as('pageLoads');
        cy.sqlServer(`UPDATE Pharmacists SET ExcludeNoGMS = 1 where Id = ${pharmacyId}`);
        
        cy.fixture("main").then(data => {
            cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
        });
        cy.VisitBrokeredEthical();
        
        cy.wait('@pageLoads').then(({ response }) => {
            expect(response.statusCode).to.equal(200);
            
            cy.get('[rte="1MH"]').then(($number) => {
            let numberOfPages = $number.text()
            cy.log(numberOfPages);

            cy.get(response.body.items).each(($item) => {
                expect($item.gmsCode).to.not.contain('PENDING');
                expect($item.gmsCode).to.not.equal('');
            })
            
            cy.get('[rte="1MI"] > .fa-stack > .fa-circle-thin').click();
            for (let i = 1; i < numberOfPages; i++) {
                
                cy.wait('@pageLoads').then(({ response }) => {
                    expect(response.statusCode).to.equal(200);
        
                    cy.get(response.body.items).each(($item) => {
                        expect($item.gmsCode).to.not.contain('PENDING');
                        expect($item.gmsCode).to.not.equal('');
                    })
                });
                cy.get('[rte="1MI"] > .fa-stack > .fa-circle-thin').click();
              }
            });
        })
        

        
        
    });
    it('Use Parallels | Items on the pages | Brokered Ethical', () => {
    });
    it('Use Parallels | Items on the pages | Brokered OTC', () => {
    });
    it('Use Parallels | Items on the pages | ULM?', () => {
    });
    it('Use Parallels | Filter apply', () => {
    });
    it.only('If "Show UD Prices and Discounts" = false and "Show Second Line Prices and Discounts" = false 0:0', () => {
        // cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
        // cy.intercept(_call._getPageDataBrokeredEthical).as('pageLoad');
        
        cy.sqlServer(`UPDATE Pharmacists SET ShowUdNetPrices = 0, Show2ndLine = 0 where Id = 411`);
        
        cy.fixture("main").then(data => {
            cy.signInCreateSession(data.pharmacyUserEmail, data.pharmacyUserPassword);
        });
        
        cy.getUDItemAndAddItToShoppingCart(pharmacyId);
        cy.fixture("main").then(data => {
            cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
        });

        
        cy.visitBrokeredEthical();
        cy.reload();


    
    });
    it('If "Show UD Prices and Discounts" = true and "Show Second Line Prices and Discounts" = false 1:0', () => {
        
    });
    it('If "Show UD Prices and Discounts" = true and "Show Second Line Prices and Discounts" = false 1:1', () => {
    });
    it('Wholesaler is Deleted = 1 | check Wholeslaer drop downs', () => {
        cy.sqlServer(`UPDATE Wholesalers set IsDeleted = '1' where Id = 4`);

        cy.fixture("main").then(data => {
            cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
        });
    });

});

function randomItem() { 
    const randomInt = Math.floor(Math.random() * 24) + 0;
    return randomInt;
 }
