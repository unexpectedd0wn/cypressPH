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



    
    context('', () => {
        it('If "Show UD Prices and Discounts" = false and "Show Second Line Prices and Discounts" = false 0:0 | Pages', () => {
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.intercept(_call._getPageDataBrokeredEthical + '*').as('pageLoad');
            cy.intercept(_call._getPageDataBrokeredOTC + '*').as('pageLoad');
            
            cy.sqlServer(`UPDATE Pharmacists SET ShowUdNetPrices = 0, Show2ndLine = 0 where Id = 411`);
            
            cy.fixture("main").then(data => {
                cy.signInCreateSession(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });
            
            // cy.getUDItemAndAddItToShoppingCart(pharmacyId);
            // cy.fixture("main").then(data => {
            //     cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
            // });
            // cy.reload();
            
            cy.visitBrokeredEthical();
           
    
            cy.wait('@pageLoad').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
                const headings = ['Description', 'Pack\nSize', 'In\nStock', 'Qty', 'Expected\nDelivery', 'Trade\nPrice', 'Wholesaler', 'GMS\nCode', 'Pack Type', 'Discount', 'Net\nPrice', 'Comment']
                            cy.get('table thead tr th').map('innerText').should('deep.equal', headings);
                
                cy.get(response.body.items).each(($item, index) => {
                            
                    if ($item.wholesalerId == Wholeslaers.UD.Id) {
                        cy.log("UD Item")
                        cy.get(`table tbody tr`).eq(index).find(`td`)
                        
                        .then(($tr) => {
                            return{
                                NetPrice: $tr[9].innerText,
                                Discount: $tr[10].innerText
                            }
                        })
                        .should('deep.equal',
                        {
                            NetPrice: '',
                            Discount: ''
                        }
    
                        )
                        
                    } else {
                        cy.log("Skip not a UD Item")
                    }
                })
    
            })
    
            cy.visitBrokeredOTC();
            cy.wait('@pageLoad').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
                const headings = ['Description', 'Pack\nSize', 'In\nStock', 'Qty', 'Expected\nDelivery', 'Trade\nPrice', 'Wholesaler', 'GMS\nCode', 'Pack Type', 'Discount', 'Net\nPrice', 'Comment']
                            cy.get('table thead tr th').map('innerText').should('deep.equal', headings);
                cy.get(response.body.items).each(($item, index) => {
                            
                   if ($item.wholesalerId == Wholeslaers.UD.Id) {
                        cy.log("UD Item")
                        cy.log(index) 
                        cy.get(`table tbody tr`)
                        .eq(index)
                        .find(`td`)
                        
                        .then(($tr) => {
                            return{
                                NetPrice: $tr[9].innerText,
                                Discount: $tr[10].innerText
                            }
                        })
                        .should('deep.equal',
                        {
                            NetPrice: '',
                            Discount: ''
                        }
    
                        )
                        
                    } else {
                        cy.log("Skip not a UD Item")
                    }
                    
                    
        
                             
                })
    
            })
    
            cy.visitSecondLine()
            const headingssl = ['Description', 'Pack\nSize', 'In\nStock', 'Qty', 'Expected\nDelivery', 'Trade\nPrice', 'Wholesaler', 'GMS\nCode', 'Pack Type', 'Comment']
                            cy.get('table thead tr th').map('innerText').should('deep.equal', headingssl);
            
            cy.VisitULM()
            const headings = ['Description', 'Pack\nSize', 'In\nStock', 'Qty', 'Expected\nDelivery', 'Trade\nPrice', 'Wholesaler', 'GMS\nCode', 'Pack Type']
                            cy.get('table thead tr th').map('innerText').should('deep.equal', headings);
    
            cy.getUDItemAndAddItToShoppingCart(pharmacyId);
            // cy.fixture("main").then(data => {
            //     cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
            // });
            cy.reload();
            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
                cy.get('#slide-button > .fa-stack > .fa-circle-thin').click()
            cy.get('#netPrice-span').should('be.visible').and('include.text', `Trade Price : ${Cypress.env('item.TradePrice')}`);
    
            })
    
            
            // cy.get('.netPrice-span').should('be.visible').and('include.text', nextBestDescription);
            
           
    
        
        });
        it('If "Show UD Prices and Discounts" = true and "Show Second Line Prices and Discounts" = false 1:0 | Pages' , () => {
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.intercept(_call._getPageDataBrokeredEthical + '*').as('pageLoad');
            cy.intercept(_call._getPageDataBrokeredOTC + '*').as('pageLoad');
            
            cy.sqlServer(`UPDATE Pharmacists SET ShowUdNetPrices = 1, Show2ndLine = 0 where Id = 411`);
            
            cy.fixture("main").then(data => {
                cy.signInCreateSession(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });
            
            // cy.getUDItemAndAddItToShoppingCart(pharmacyId);
            // cy.fixture("main").then(data => {
            //     cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
            // });
            // cy.reload();
            
            cy.visitBrokeredEthical();
           
    
            cy.wait('@pageLoad').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
                const headings = ['Description', 'Pack\nSize', 'In\nStock', 'Qty', 'Expected\nDelivery', 'Trade\nPrice', 'Wholesaler', 'GMS\nCode', 'Pack Type', 'Discount', 'Net\nPrice', 'Comment']
                            cy.get('table thead tr th').map('innerText').should('deep.equal', headings);
                cy.get(response.body.items).each(($item, index) => {
                            
                    
                    
                    
                    if ($item.wholesalerId == Wholeslaers.UD.Id) {
                        cy.log("UD Item")
                        cy.log(index) 
                        cy.get(`table tbody tr`)
                        .eq(index)
                        .find(`td`)
                        
                        .then(($tr) => {
                            return{
                                NetPrice: $tr[9].innerText,
                                Discount: $tr[10].innerText
                            }
                        })
                        .should('not.equal',
                        {
                            NetPrice: '',
                            Discount: ''
                        }
    
                        )
                        
                    } else {
                        cy.log("Skip not a UD Item")
                    }
                    
                    
        
                             
                })
    
            })
    
            cy.visitBrokeredOTC();
            cy.wait('@pageLoad').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
                const headings = ['Description', 'Pack\nSize', 'In\nStock', 'Qty', 'Expected\nDelivery', 'Trade\nPrice', 'Wholesaler', 'GMS\nCode', 'Pack Type', 'Discount', 'Net\nPrice', 'Comment']
                            cy.get('table thead tr th').map('innerText').should('deep.equal', headings);
                cy.get(response.body.items).each(($item, index) => {
                            
                   if ($item.wholesalerId == Wholeslaers.UD.Id) {
                        cy.log("UD Item")
                        cy.log(index) 
                        cy.get(`table tbody tr`)
                        .eq(index)
                        .find(`td`)
                        
                        .then(($tr) => {
                            return{
                                NetPrice: $tr[9].innerText,
                                Discount: $tr[10].innerText
                            }
                        })
                        .should('not.equal',
                        {
                            NetPrice: '',
                            Discount: ''
                        }
    
                        )
                        
                    } else {
                        cy.log("Skip not a UD Item")
                    }
                    
                    
        
                             
                })
    
            })
    
            cy.visitSecondLine()
            const headingssl = ['Description', 'Pack\nSize', 'In\nStock', 'Qty', 'Expected\nDelivery', 'Trade\nPrice', 'Wholesaler', 'GMS\nCode', 'Pack Type', 'Comment']
                            cy.get('table thead tr th').map('innerText').should('deep.equal', headingssl);
            
            cy.VisitULM()
            const headings = ['Description', 'Pack\nSize', 'In\nStock', 'Qty', 'Expected\nDelivery', 'Trade\nPrice', 'Wholesaler', 'GMS\nCode', 'Pack Type']
                            cy.get('table thead tr th').map('innerText').should('deep.equal', headings);
        });
        it('If "Show UD Prices and Discounts" = true and "Show Second Line Prices and Discounts" = false 1:1 | Pages', () => {
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.intercept(_call._getPageDataBrokeredEthical + '*').as('pageLoad');
            cy.intercept(_call._getPageDataBrokeredOTC + '*').as('pageLoad');
            
            cy.sqlServer(`UPDATE Pharmacists SET ShowUdNetPrices = 1, Show2ndLine = 1 where Id = 411`);
            
            cy.fixture("main").then(data => {
                cy.signInCreateSession(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });
            
            // cy.getUDItemAndAddItToShoppingCart(pharmacyId);
            // cy.fixture("main").then(data => {
            //     cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
            // });
            // cy.reload();
            
            cy.visitBrokeredEthical();
           
    
            cy.wait('@pageLoad').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
                const headings = ['Description', 'Pack\nSize', 'In\nStock', 'Qty', 'Expected\nDelivery', 'Trade\nPrice', 'Wholesaler', 'GMS\nCode', 'Pack Type', 'Discount', 'Net\nPrice', 'Comment']
                            cy.get('table thead tr th').map('innerText').should('deep.equal', headings);
                cy.get(response.body.items).each(($item, index) => {
                            
                    if ($item.wholesalerId == Wholeslaers.UD.Id) {
                        cy.log("UD Item")
                        cy.log(index) 
                        cy.get(`table tbody tr`)
                        .eq(index)
                        .find(`td`)
                        
                        .then(($tr) => {
                            return{
                                NetPrice: $tr[9].innerText,
                                Discount: $tr[10].innerText
                            }
                        })
                        .should('not.equal',
                        {
                            NetPrice: '',
                            Discount: ''
                        }
    
                        )
                        
                    } else {
                        cy.log("Skip not a UD Item")
                    }
                })
            })
    
            cy.visitBrokeredOTC();
            cy.wait('@pageLoad').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
                const headings = ['Description', 'Pack\nSize', 'In\nStock', 'Qty', 'Expected\nDelivery', 'Trade\nPrice', 'Wholesaler', 'GMS\nCode', 'Pack Type', 'Discount', 'Net\nPrice', 'Comment']
                            cy.get('table thead tr th').map('innerText').should('deep.equal', headings);
                
                cy.get(response.body.items).each(($item, index) => {
                            
                   if ($item.wholesalerId == Wholeslaers.UD.Id) {
                        cy.log("UD Item")
                        cy.get(`table tbody tr`).eq(index).find(`td`)
                            .then(($tr) => {
                                return{
                                    NetPrice: $tr[9].innerText,
                                    Discount: $tr[10].innerText
                                }
                            })
                            .should('not.equal',
                            {
                                NetPrice: '',
                                Discount: ''
                            }
                        )
                    } else {
                        cy.log("Skip not a UD Item")
                    }
                })
    
            })
    
            cy.visitSecondLine()
            const headingssl = ['Description', 'Pack\nSize', 'In\nStock', 'Qty', 'Expected\nDelivery', 'Trade\nPrice', 'Wholesaler', 'GMS\nCode', 'Pack Type', 'Discount', 'Net\nPrice', 'Comment']
                            cy.get('table thead tr th').map('innerText').should('deep.equal', headingssl);
            
            cy.VisitULM()
            const headings = ['Description', 'Pack\nSize', 'In\nStock', 'Qty', 'Expected\nDelivery', 'Trade\nPrice', 'Wholesaler', 'GMS\nCode', 'Pack Type']
                            cy.get('table thead tr th').map('innerText').should('deep.equal', headings);
        
        });
        it('"Show UD Prices and Discounts" and "Show Second Line Prices and Discounts" | Shopping Cart', () => {
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.intercept(_call._getPageDataBrokeredEthical + '*').as('pageLoad');
            cy.intercept(_call._getPageDataBrokeredOTC + '*').as('pageLoad');
            
            cy.sqlServer(`UPDATE Pharmacists SET ShowUdNetPrices = 1, Show2ndLine = 1 where Id = 411`);
            
            cy.fixture("main").then(data => {
                cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });
            
            
            
            cy.visitBrokeredEthical();
           
    
            cy.wait('@pageLoad').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
                const headings = ['Description', 'Pack\nSize', 'In\nStock', 'Qty', 'Expected\nDelivery', 'Trade\nPrice', 'Wholesaler', 'GMS\nCode', 'Pack Type', 'Discount', 'Net\nPrice', 'Comment']
                            cy.get('table thead tr th').map('innerText').should('deep.equal', headings);
                cy.get(response.body.items).each(($item, index) => {
                            
                    if ($item.wholesalerId == Wholeslaers.UD.Id) {
                        cy.log("UD Item")
                        cy.log(index) 
                        cy.get(`table tbody tr`)
                        .eq(index)
                        .find(`td`)
                        
                        .then(($tr) => {
                            return{
                                NetPrice: $tr[9].innerText,
                                Discount: $tr[10].innerText
                            }
                        })
                        .should('not.equal',
                        {
                            NetPrice: '',
                            Discount: ''
                        }
    
                        )
                        
                    } else {
                        cy.log("Skip not a UD Item")
                    }
                })
            })
    
            cy.visitBrokeredOTC();
            cy.wait('@pageLoad').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
                const headings = ['Description', 'Pack\nSize', 'In\nStock', 'Qty', 'Expected\nDelivery', 'Trade\nPrice', 'Wholesaler', 'GMS\nCode', 'Pack Type', 'Discount', 'Net\nPrice', 'Comment']
                            cy.get('table thead tr th').map('innerText').should('deep.equal', headings);
                
                cy.get(response.body.items).each(($item, index) => {
                            
                   if ($item.wholesalerId == Wholeslaers.UD.Id) {
                        cy.log("UD Item")
                        cy.get(`table tbody tr`).eq(index).find(`td`)
                            .then(($tr) => {
                                return{
                                    NetPrice: $tr[9].innerText,
                                    Discount: $tr[10].innerText
                                }
                            })
                            .should('not.equal',
                            {
                                NetPrice: '',
                                Discount: ''
                            }
                        )
                    } else {
                        cy.log("Skip not a UD Item")
                    }
                })
    
            })
    
            cy.visitSecondLine()
            const headingssl = ['Description', 'Pack\nSize', 'In\nStock', 'Qty', 'Expected\nDelivery', 'Trade\nPrice', 'Wholesaler', 'GMS\nCode', 'Pack Type', 'Discount', 'Net\nPrice', 'Comment']
                            cy.get('table thead tr th').map('innerText').should('deep.equal', headingssl);
            
            cy.VisitULM()
            const headings = ['Description', 'Pack\nSize', 'In\nStock', 'Qty', 'Expected\nDelivery', 'Trade\nPrice', 'Wholesaler', 'GMS\nCode', 'Pack Type']
                            cy.get('table thead tr th').map('innerText').should('deep.equal', headings);
        
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
