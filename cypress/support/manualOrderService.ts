import { getRandomNumber } from "./service";
import { SearchBar } from "../page-objects/search-bar";
import { ShoppingCart } from "../page-objects/shopping-cart";
import { piMinOrderValue } from "./enums";
import { Wholesalers } from "./enums";

export function getItemForTest(wholesaler) {
    cy.wait('@pageLoaded').then(({ response }) => {
        expect(response.statusCode).to.equal(200);

        cy.selectWholesaler(wholesaler)

        cy.wait('@searchWholesaler').then(({ response }) => {
            expect(response.statusCode).to.equal(200);

            while (true) {

                let i = getRandomNumber();
                if (response.body.items[i].caseSize > 1) {
                    return false;
                } else {
                    if (wholesaler == Wholesalers.UD.secondName) {
                        let i = 2;
                        cy.wrap({
                            id: response.body.items[i].id,
                        }).as('itemId')
                    } else {
                        cy.wrap({
                            id: response.body.items[i].id
                        }).as('itemId')
                        break;
                    }

                }
            }
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
}

export function addItemAndCheckCartTab(wholesaler) {
    cy.get('@item').then((item: any) => {
        SearchBar.searchByText(item.ipuCode);
        cy.wait(500);

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
}

export function toCheckOrderHistory(wholesaler) {

    
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
                                totalValue: `€${((item.netprice)*(parseInt(localStorage.getItem('newQty')))).toFixed(2)}`,
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
}

export function toCheckOrderDetails(pharmacyId, ) {
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
                .should('deep.eq', [(parseInt(localStorage.getItem('newQty'))), item.description, item.netprice, item.ipuCode, item.tradeprice, item.discount]);
        })
    });
}


export function toPlaceTheOrder(wholesalerName: string) {
    var qty
    function toUpdateQtyToPlaceTheOrder(orderMinValue: number) {
        ShoppingCart.elements.cartCardOrderBtn().should('be.disabled')
        cy.get('@item').then((item: any) => {
            
            let qty = Math.round((orderMinValue / item.netprice.toFixed(2)))
            localStorage.setItem('newQty', `${qty + 1}`); 
            for (let index = 0; index < qty; index++) {
                ShoppingCart.raiseQtyValue()
            }
        }) 
        ShoppingCart.elements.cartCardOrderBtn().should('not.be.disabled');
    }
    
    
    switch (wholesalerName) {
        case "United Drug":
            ShoppingCart.elements.cartCardOrderBtn().should('not.be.disabled');
            localStorage.setItem('newQty', `1`);
            break;
        case "PCO":
            toUpdateQtyToPlaceTheOrder(piMinOrderValue.PCO)
            break;
        case "IMED":
            toUpdateQtyToPlaceTheOrder(piMinOrderValue.IMED)
            break;
        case "Lexon":
            toUpdateQtyToPlaceTheOrder(piMinOrderValue.Lexon)
            break;
        case "O’Neills":
            toUpdateQtyToPlaceTheOrder(piMinOrderValue.ONeils)
            break;
        default:
            break;
    }
    
    ShoppingCart.pressOrderButton();
    

    if (wholesalerName == "ELEMENTS") {
        cy.get('#app-root > app > ultima-layout > div > div > pharmax-header > div > global-cart > p-dialog.ng-tns-c49-17.ng-star-inserted > div > div')
        .should('be.visible')

        cy.get('.p-d-flex > .p-button-success').click()
        cy.wait(500);
    } else {
        cy.log('Skip')
    }

    ShoppingCart.successfulOrderToastMessage(wholesalerName)

    cy.wait('@shopingCart').then(({ response }) => {
        expect(response.statusCode).to.equal(200)
        ShoppingCart.emptyShoppingCartAppers();
    })
}
