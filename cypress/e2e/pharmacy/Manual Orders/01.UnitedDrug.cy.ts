import { SearchBar } from "../../../page-objects/search-bar";
import { Wholesalers } from "../../../support/enums";
import { APIRequests } from "../../../page-objects/api-routes";
import { ShoppingCart } from "../../../page-objects/shopping-cart";
import { getRandomNumber } from "../../../support/service";

const pharmacyId = Cypress.env("pharmacyId");
const wholesaler = Wholesalers.UD.Name;
const wholesalerEl = Wholesalers.UD.secondName;

describe('Manual Orders: United Drug', () => {

    before(() => {
        cy.cleanUpShoppingCart(pharmacyId);
    });

    beforeEach(() => {
        cy.on('uncaught:exception', (err, runnable) => {
            return false
        })
        cy.intercept('/api/stock-product/products?' + '*').as('pageLoaded');
        cy.intercept(APIRequests.request._filter_wholesaler + '*').as('searchWholesaler')
        cy.intercept(APIRequests.request._getShoppingcart + '*').as('shopingCart')
        cy.intercept(APIRequests.request._addItemShoppingCart).as('itemAdded')
        cy.intercept(APIRequests.request._sendOrder).as('sendorder')
        cy.intercept(APIRequests.request._getDataOrderHistoryPage).as('orderHistory')
        cy.intercept('/api/stock-product/products?skip=0&take=25&sortingDirection=1&sortingField=description&filters%5B0%5D.propertyName=IPUCode&filters%5B0%5D.value=*').as('search')
        cy.intercept('/api/stock-product/products?skip=0&take=25&sortingDirection=1&sortingField=description&filters%5B0%5D.propertyName=IPUCode&filters%5B0%5D.value=' + '*' + '&filters%5B0%5D.$type=string&filters%5B0%5D.matchMode=0&filters%5B1%5D.propertyName=wholesalerId&filters%5B1%5D.value=1&filters%5B1%5D.$type=number&filters%5B1%5D.matchMode=0&filters%5B2%5D.propertyName=' + '*' + '&filters%5B2%5D.value=true&filters%5B2%5D.$type=boolean').as('textSearchLoaded')
        cy.fixture("main").then(data => {
            cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
        });
    });

    afterEach(() => {
        cy.signOut();
        cy.clearAllCookies();
    });

    it('Order 1 United Drug Item | Brokered Ethical', () => {
        cy.visitPage("Brokered Ethical");

        cy.wait('@pageLoaded').then(({ response }) => {
            expect(response.statusCode).to.equal(200);

            cy.selectWholesaler(wholesaler)

            cy.wait('@searchWholesaler').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                let i = getRandomNumber();

                cy.wrap({
                    id: response.body.items[i].id,
                }).as('itemId')
            })
        })

        cy.get('@itemId').then((item: any) => {

            cy.sqlServer(`SELECT Id, IPUCode, Description, PackSize, Type, NetPrice, Discount, TradePrice from Stockproducts WHERE Id = ${item.id}`)
            .then((data: any) => {
                cy.log(data);

                cy.wrap({
                    id: data[0],
                    ipuCode: data[1],
                    description: data[2],
                    packSize: data[3],
                    packType: data[4],
                    netprice: data[5],
                    discount: data[6],
                    tradeprice: data[7]
                }).as('item')
            })
        })
        
        cy.get('@item').then((item: any) => {
            SearchBar.searchByText(item.ipuCode);

            cy.toAddItemToTheShoppingCart();
            ShoppingCart.openCart();

            ShoppingCart.checkCartCard(
                wholesaler,
                '',
                item.description,
                item.packSize,
                item.packType,
                item.netprice.toFixed(2),
                item.discount
            );
        })
       
        cy.toPlaceTheOrder(wholesaler);


        cy.get('@item').then((item: any) => {
            cy.sqlServer(`SELECT TOP (1) Id, WholesalerId, Completed, Sended, IsShoppingCartOrder, IsBrokeredOrder, Status, ConnectionType FROM Orders where PharmacistId = ${pharmacyId} order by Id desc`)
            .then((data: any) => {

                cy.log(data);

                cy.wrap({
                    id: data[0],
                }).as('order')
            })
        
            cy.get('@order').then((order: any) => {
                cy.sqlServer(`select Qty, Description, Cost, IPUCode, TradePrice, Discount from OrderDetails where OrderId = ${order.id} order by Id desc;`)
                    .should('deep.eq', [1, item.description, item.netprice, item.ipuCode, item.tradeprice, item.discount]);
            })
        });
    
        cy.visitPage("Order History");

        cy.wait('@orderHistory').then(({ response }) => {
            expect(response.statusCode).to.equal(200);

            cy.get(response.body.items).each(($item: any, index) => {

                cy.get('@order').then((order: any) => {

                    cy.get('@item').then((item: any) => {
                        if ($item.orderRef == order.id) {
                            cy.log("Found order!")
                            cy.get(`table tbody tr`).eq(index).find(`td`)
                                .then(($tr) => {
                                    return {
                                        orderRef: $tr[1].innerText,
                                        wholesaler: $tr[2].innerText,
                                        numberOfItem: $tr[3].innerText,
                                        totalValue: $tr[4].innerText,

                                    }
                                })
                                .should(`deep.equal`, {

                                    orderRef: `#${order.id}`,
                                    wholesaler: wholesaler,
                                    numberOfItem: '1',
                                    totalValue: `€${item.netprice.toFixed(2)}`,

                                })

                            cy.get(':nth-child(1) > .download-cell >').click({ force: true })
                            cy.readFile(`cypress/downloads/Order_${order.id}.pdf`, 'utf8')

                        } else {
                            cy.log("Skip orders")
                        }
                    })
                })
            })
        })
    });

    it('Order 1 United Drug Item | Brokered OTC', () => {
        cy.visitPage("Brokered OTC");

        cy.wait('@pageLoaded').then(({ response }) => {
            expect(response.statusCode).to.equal(200);

            cy.selectWholesaler(wholesaler)

            cy.wait('@searchWholesaler').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                let i = getRandomNumber();

                cy.wrap({
                    id: response.body.items[i].id,
                }).as('itemId')
            })
        })



        cy.get('@itemId').then((item: any) => {

            cy.sqlServer(`SELECT Id, IPUCode, Description, PackSize, Type, NetPrice, Discount, TradePrice from Stockproducts WHERE Id = ${item.id}`)
            .then((data: any) => {
                cy.log(data);

                cy.wrap({
                    id: data[0],
                    ipuCode: data[1],
                    description: data[2],
                    packSize: data[3],
                    packType: data[4],
                    netprice: data[5],
                    discount: data[6],
                    tradeprice: data[7]
                }).as('item')
            })
        })
        
        cy.get('@item').then((item: any) => {
            SearchBar.searchByText(item.ipuCode);

            cy.toAddItemToTheShoppingCart();
            ShoppingCart.openCart();

            ShoppingCart.checkCartCard(
                wholesaler,
                '',
                item.description,
                item.packSize,
                item.packType,
                item.netprice.toFixed(2),
                item.discount
            );
        })
        
        

        

        
        
        cy.toPlaceTheOrder(wholesaler);


        cy.get('@item').then((item: any) => {
            cy.sqlServer(`SELECT TOP (1) Id, WholesalerId, Completed, Sended, IsShoppingCartOrder, IsBrokeredOrder, Status, ConnectionType FROM Orders where PharmacistId = ${pharmacyId} order by Id desc`)
            .then((data: any) => {

                cy.log(data);

                cy.wrap({
                    id: data[0],
                }).as('order')
            })
        


            cy.get('@order').then((order: any) => {
                cy.sqlServer(`select Qty, Description, Cost, IPUCode, TradePrice, Discount from OrderDetails where OrderId = ${order.id} order by Id desc;`)
                    .should('deep.eq', [1, item.description, item.netprice, item.ipuCode, item.tradeprice, item.discount]);
            })


        });




        cy.visitPage("Order History");

        cy.wait('@orderHistory').then(({ response }) => {
            expect(response.statusCode).to.equal(200);

            cy.get(response.body.items).each(($item: any, index) => {

                cy.get('@order').then((order: any) => {

                    cy.get('@item').then((item: any) => {
                        if ($item.orderRef == order.id) {
                            cy.log("Found order!")
                            cy.get(`table tbody tr`).eq(index).find(`td`)
                                .then(($tr) => {
                                    return {
                                        orderRef: $tr[1].innerText,
                                        wholesaler: $tr[2].innerText,
                                        numberOfItem: $tr[3].innerText,
                                        totalValue: $tr[4].innerText,

                                    }
                                })
                                .should(`deep.equal`, {



                                    orderRef: `#${order.id}`,
                                    wholesaler: wholesaler,
                                    numberOfItem: '1',
                                    totalValue: `€${item.netprice.toFixed(2)}`,

                                })

                            cy.get(':nth-child(1) > .download-cell >').click({ force: true })
                            cy.readFile(`cypress/downloads/Order_${order.id}.pdf`, 'utf8')

                        } else {
                            cy.log("Skip orders")
                        }
                    })



                })
            })


    })

    });

    it('Order 1 United Drug Item | Second Line', () => {
        cy.visitPage("Second Line");

        cy.wait('@pageLoaded').then(({ response }) => {
            expect(response.statusCode).to.equal(200);

            cy.selectWholesaler(wholesaler)

            cy.wait('@searchWholesaler').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                let i = getRandomNumber();

                cy.wrap({
                    id: response.body.items[i].id,
                }).as('itemId')
            })
        })



        cy.get('@itemId').then((item: any) => {

            cy.sqlServer(`SELECT Id, IPUCode, Description, PackSize, Type, NetPrice, Discount, TradePrice from Stockproducts WHERE Id = ${item.id}`)
            .then((data: any) => {
                cy.log(data);

                cy.wrap({
                    id: data[0],
                    ipuCode: data[1],
                    description: data[2],
                    packSize: data[3],
                    packType: data[4],
                    netprice: data[5],
                    discount: data[6],
                    tradeprice: data[7]
                }).as('item')
            })
        })
        
        cy.get('@item').then((item: any) => {
            SearchBar.searchByText(item.ipuCode);

            cy.toAddItemToTheShoppingCart();
            ShoppingCart.openCart();

            ShoppingCart.checkCartCard(
                wholesaler,
                '',
                item.description,
                item.packSize,
                item.packType,
                item.netprice.toFixed(2),
                item.discount
            );
        })
        
        

        

        
        
        cy.toPlaceTheOrder(wholesaler);


        cy.get('@item').then((item: any) => {
            cy.sqlServer(`SELECT TOP (1) Id, WholesalerId, Completed, Sended, IsShoppingCartOrder, IsBrokeredOrder, Status, ConnectionType FROM Orders where PharmacistId = ${pharmacyId} order by Id desc`)
            .then((data: any) => {

                cy.log(data);

                cy.wrap({
                    id: data[0],
                }).as('order')
            })
        


            cy.get('@order').then((order: any) => {
                cy.sqlServer(`select Qty, Description, Cost, IPUCode, TradePrice, Discount from OrderDetails where OrderId = ${order.id} order by Id desc;`)
                    .should('deep.eq', [1, item.description, item.netprice, item.ipuCode, item.tradeprice, item.discount]);
            })


        });




        cy.visitPage("Order History");

        cy.wait('@orderHistory').then(({ response }) => {
            expect(response.statusCode).to.equal(200);

            cy.get(response.body.items).each(($item: any, index) => {

                cy.get('@order').then((order: any) => {

                    cy.get('@item').then((item: any) => {
                        if ($item.orderRef == order.id) {
                            cy.log("Found order!")
                            cy.get(`table tbody tr`).eq(index).find(`td`)
                                .then(($tr) => {
                                    return {
                                        orderRef: $tr[1].innerText,
                                        wholesaler: $tr[2].innerText,
                                        numberOfItem: $tr[3].innerText,
                                        totalValue: $tr[4].innerText,

                                    }
                                })
                                .should(`deep.equal`, {



                                    orderRef: `#${order.id}`,
                                    wholesaler: wholesaler,
                                    numberOfItem: '1',
                                    totalValue: `€${item.netprice.toFixed(2)}`,

                                })

                            cy.get(':nth-child(1) > .download-cell >').click({ force: true })
                            cy.readFile(`cypress/downloads/Order_${order.id}.pdf`, 'utf8')

                        } else {
                            cy.log("Skip orders")
                        }
                    })



                })
            })


    })

    });

    it('Order 1 United Drug Item | ULM', () => {
        cy.visitPage("ULM");

        cy.wait('@pageLoaded').then(({ response }) => {
            expect(response.statusCode).to.equal(200);

            cy.selectWholesaler(wholesalerEl)

            cy.wait('@searchWholesaler').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                // let i = getRandomNumber();

                cy.wrap({
                    id: response.body.items[2].id,
                }).as('itemId')
            })
        })



        cy.get('@itemId').then((item: any) => {

            cy.sqlServer(`SELECT Id, IPUCode, Description, PackSize, Type, NetPrice, Discount, TradePrice from Stockproducts WHERE Id = ${item.id}`)
            .then((data: any) => {
                cy.log(data);

                cy.wrap({
                    id: data[0],
                    ipuCode: data[1],
                    description: data[2],
                    packSize: data[3],
                    packType: data[4],
                    netprice: data[5],
                    discount: data[6],
                    tradeprice: data[7]
                }).as('item')
            })
        })
        
        cy.get('@item').then((item: any) => {
            SearchBar.searchByText(item.ipuCode);

            cy.toAddItemToTheShoppingCart();
            ShoppingCart.openCart();

            ShoppingCart.checkCartCard(
                wholesalerEl.toUpperCase(),
                '',
                item.description,
                item.packSize,
                item.packType,
                item.netprice.toFixed(2),
                item.discount
            );
        })
        
        

        

        
        
        cy.toPlaceTheOrder(wholesalerEl.toUpperCase());


        cy.get('@item').then((item: any) => {
            cy.sqlServer(`SELECT TOP (1) Id, WholesalerId, Completed, Sended, IsShoppingCartOrder, IsBrokeredOrder, Status, ConnectionType FROM Orders where PharmacistId = ${pharmacyId} order by Id desc`)
            .then((data: any) => {

                cy.log(data);

                cy.wrap({
                    id: data[0],
                }).as('order')
            })
        


            cy.get('@order').then((order: any) => {
                cy.sqlServer(`select Qty, Description, Cost, IPUCode, TradePrice, Discount from OrderDetails where OrderId = ${order.id} order by Id desc;`)
                    .should('deep.eq', [1, item.description, item.netprice, item.ipuCode, item.tradeprice, item.discount]);
            })


        });




        cy.visitPage("Order History");

        cy.wait('@orderHistory').then(({ response }) => {
            expect(response.statusCode).to.equal(200);

            cy.get(response.body.items).each(($item: any, index) => {

                cy.get('@order').then((order: any) => {

                    cy.get('@item').then((item: any) => {
                        if ($item.orderRef == order.id) {
                            cy.log("Found order!")
                            cy.get(`table tbody tr`).eq(index).find(`td`)
                                .then(($tr) => {
                                    return {
                                        orderRef: $tr[1].innerText,
                                        wholesaler: $tr[2].innerText,
                                        numberOfItem: $tr[3].innerText,
                                        totalValue: $tr[4].innerText,

                                    }
                                })
                                .should(`deep.equal`, {



                                    orderRef: `#${order.id}`,
                                    wholesaler: wholesaler,
                                    numberOfItem: '1',
                                    totalValue: `€${item.netprice.toFixed(2)}`,

                                })

                            cy.get(':nth-child(1) > .download-cell >').click({ force: true })
                            cy.readFile(`cypress/downloads/Order_${order.id}.pdf`, 'utf8')

                        } else {
                            cy.log("Skip orders")
                        }
                    })



                })
            })


    })

    });

});
