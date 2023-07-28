import { OrderPage } from "../page-objects/order-page";
import { Wholesalers } from "../support/enums";

export function checkResponseNoPendingOrEmptyGmsCode() {
    cy.wait('@pageLoads').then(({ response }) => {
        expect(response.statusCode).to.equal(200);

        OrderPage.elements.paginationNumberOfPages().then(($number: any) => {
            let numberOfPages = $number.text()
            cy.log(numberOfPages);
    
            cy.get(response.body.items).each(($item: any) => {
                expect($item.gmsCode).to.not.contain('PENDING');
                expect($item.gmsCode).to.not.equal('');
            })
    
            OrderPage.clickToGetNextPage()
            for (let i = 1; i < numberOfPages; i++) {
                cy.wait('@pageLoads').then(({ response }) => {
                    expect(response.statusCode).to.equal(200);
    
                    cy.get(response.body.items).each(($item: any) => {
                        expect($item.gmsCode).to.not.contain('PENDING');
                        expect($item.gmsCode).to.not.equal('');
                    })
                });
    
            OrderPage.clickToGetNextPage()
            }
        });
    })
}

export function toCheckResponseIsUDOnly(unitedDrugOptionName) {
    cy.wait('@pageLoads').then(({ response }) => {
        expect(response.statusCode).to.equal(200);

        OrderPage.elements.paginationNumberOfPages().then(($number: any) => {
            let numberOfPages = $number.text()
            cy.log(`Number of the pages is: ${numberOfPages}`);

            cy.get(response.body.items).each(($item: any) => {
                expect($item.wholesaler).to.contain(unitedDrugOptionName);
            })

            OrderPage.clickToGetNextPage()
            for (let i = 1; i < numberOfPages; i++) {
                cy.wait('@pageLoads').then(({ response }) => {
                    expect(response.statusCode).to.equal(200);

                    cy.get(response.body.items).each(($item: any) => {
                        expect($item.wholesaler).to.contain(unitedDrugOptionName);
                    })
                });
                OrderPage.clickToGetNextPage()
            }
        });
    })
}

export function checkNoPIitemsOnThePages() {

    let piWholesalers = [Wholesalers.PCO.Name, Wholesalers.IMED.Name, Wholesalers.ONEILLS.Name, Wholesalers.LEXON.Name, Wholesalers.CLINIGEN.Name]

    piWholesalers.forEach(element => {
        cy.selectWholesaler(element)
        cy.wait('@pageLoaded').then(({ response }) => {
            expect(response.statusCode).to.equal(200);
            OrderPage.elements.noRecordsFoundFooter()
            .should('be.visible')
            .and('include.text', 'No records found');
        });
    })
}

export function toCheckTableHeaders(headingOption) {
    cy.get('table thead tr th')
    .map('innerText')
    .should('deep.equal', headingOption);
}

export function toCheckPricesDiscountsInTheTable(headingOption, equalOption, wholeslaerId) {

    cy.wait('@pageLoad').then(({ response }) => {
        expect(response.statusCode).to.equal(200);

        toCheckTableHeaders(headingOption);

        cy.get(response.body.items).each(($item: any, index) => {

            if ($item.wholesalerId == wholeslaerId) {
                cy.log("UD Item found")
                cy.get(`table tbody tr`).eq(index).find(`td`)
                    .then(($tr) => {
                        return {
                            NetPrice: $tr[9].innerText,
                            Discount: $tr[10].innerText
                        }
                    })
                    .should(`${equalOption}.equal`, {
                        NetPrice: '',
                        Discount: ''
                    })
            } else {
                cy.log("Skip not a UD Item")
            }
        })
    })
}