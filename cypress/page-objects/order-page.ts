export class Order{
    
    elements =
        {
            searchTxt: () => cy.get('.p-inputgroup > .p-inputtext'),
            searchBtn: () => cy.get('.p-inputgroup-addon'),
            caseSizeBadge: () => cy.get('.badge'),
            UpQty: () => cy.get('.p-inputnumber-button-up > .p-button-icon'),
            valueQty: () => cy.get(`[id^="q"]`),
            addItemCircle: () => cy.get('.pi-plus-circle'),
            noRecordsFoundFooter: () => cy.get('.p-datatable-footer > .p-d-flex'),
            paginationNaxtPage: () => cy.get('[rte="1MI"] > .fa-stack > .fa-circle-thin'),
            paginationNumberOfPages: () => cy.get('[rte="1MH"]'),
        }

    
        toCheckExpectedDeliveryInTheGrid(type: string, expectedDelivery: string) {
        switch (type) {
            case 'OOS':
                cy.get('.whiteRow > .expectedDelivery-column').should('have.text', `${expectedDelivery}`);
                cy.get('#stockIcon').should('have.attr', 'alt', 'cancel')
                    .and('have.attr', 'src', '/assets/icons/cancel.png')
                cy.screenshot();
                break;
            case 'InStock':
                cy.get('.whiteRow > .expectedDelivery-column').should('have.text', ` ${expectedDelivery} `);
                cy.get('.inStock-column > .fa').should('be.visible')
                cy.screenshot();
                break;
            default:
                return null;
        }
    }
    
        shoppingCartEl =
        {
            valueQty: () => cy.get(`[id^="pi"]`),
            UpQty: () => cy.get('pharmax-input > .p-d-flex > .qty > .p-inputnumber > .p-inputnumber-button-group > .p-inputnumber-button-up > .p-button-icon'),
        }
    
    getNumberOfPages()
    {
        this.elements.paginationNumberOfPages()
    }

    clickToGetNextPage()
    {
        this.elements.paginationNaxtPage().click()
    }
    

    typeInSearchBox(value)
    {
        
        this.elements.searchTxt().type(value)
    }
    clickOnSearchBtn()
    {
        
        this.elements.searchBtn().click()
    }
    typeTextAndClickSearch(value)
    {
        this.elements.searchTxt().type(value)
        this.elements.searchBtn().click()
    }
    
    getCaseSizeBudge()
    {
        return this.elements.caseSizeBadge();
    }
    getQty(){
        return this.elements.valueQty();
    }
    increaseQty()
    {
        this.elements.UpQty().click();
    }

    setQtyAndAddToShoppingCart(){
        this.elements.UpQty().click()
        this.elements.addItemCircle().click()
    }

    
}

export const OrderPage = new Order();