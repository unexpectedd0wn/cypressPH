import { elements, shoppingCart } from "../../page-objects/order-page";
import routes, { _call } from "../../page-objects/api-routes";
import { Wholeslaers } from "../../support/enums";
const dayjs = require("dayjs");
import 'cypress-map'
import orderPage from "../../page-objects/order-page";


describe('', () => {

    let pharmacyId = Cypress.env("pharmacyId");
    let userId = '455';
    let currentDateTime = dayjs().format("YYYY-MM-DD HH:mm:ss:SSS");

    

    before(() => {
        cy.cleanUpShoppingCart(pharmacyId);
        cy.clearAllCookies();
        // cy.getUDItemAndAddItToShoppingCart(pharmacyId);
    });

    beforeEach(() => {
        cy.clearAllCookies();
    });
    
    it('Access ULM | ON\OFF', () => {
        cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
        cy.intercept('/api/stock-product/products?skip=0&take=25&sortingDirection=1&sortingField=description&filters%5B0%5D.propertyName=expectedDelivery&filters%5B0%5D.value=0&filters%5B0%5D.$type=number&filters%5B0%5D.matchMode=0&filters%5B1%5D.propertyName=ulm*').as('ULMPageLoads')
        
        cy.sqlServer(`DELETE from webpages_UsersInRoles where UserId = ${userId} and RoleId = 9`);

        cy.fixture("main").then(data => {
            cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
        });

        cy.wait('@getShoppingCartItems').then(({ response }) => {
            expect(response.statusCode).to.equal(200);
            cy.get(':nth-child(6) > .p-menuitem-link > .p-menuitem-text').should('be.visible').and('have.text', 'Order History');
        });

        cy.signOut();
        cy.clearAllCookies();
        
        cy.sqlServer(`INSERT INTO webpages_UsersInRoles VALUES (${userId},9)`);

        cy.fixture("main").then(data => {
            cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
        });

        cy.get(':nth-child(6) > .p-menuitem-link').should('exist').and('be.visible')
        cy.get(':nth-child(6) > .p-menuitem-link > .p-menuitem-text').should('be.visible').and('have.text', 'ULM').click();

        cy.get('#order-title').should('be.visible').and('have.text', 'ULM')
        cy.wait('@ULMPageLoads').then(({ response }) => {
            expect(response.statusCode).to.equal(200);
        });
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

function checkGridPrices(equaloption) {
    cy.get(response.body.items).each(($item, index) => {

        if ($item.wholesalerId == Wholeslaers.UD.Id) {
            cy.log("UD Item")
            cy.get(`table tbody tr`).eq(index).find(`td`)
                .then(($tr) => {
                    return {
                        NetPrice: $tr[9].innerText,
                        Discount: $tr[10].innerText
                    }
                })
                .should(`${equaloption}.equal`, {
                    NetPrice: '',
                    Discount: ''
                })
        } else {
            cy.log("Skip not a UD Item")
        }
    })
}
