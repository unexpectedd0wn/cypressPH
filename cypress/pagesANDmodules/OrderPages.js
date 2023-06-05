class orderPage{
    
    orderPageEl =
        {
            searchTxt : () => cy.get('.p-inputgroup > .p-inputtext'),
            searchBtn: () => cy.get('.p-inputgroup-addon'),
            caseSizeBadge: () => cy.get('.badge'),
            UpQty: () => cy.get('.p-inputnumber-button-up > .p-button-icon'),
            valueQty: () => cy.get(`[id^="q"]`),
            addItemCircle: () => cy.get('.pi-plus-circle'),
            noRecordsFoundFooter : () => cy.get('.p-datatable-footer > .p-d-flex'),
            
        }

    shoppingCart =
    {
        valueQty: () => cy.get(`[id^="pi"]`),
        UpQty: () => cy.get('pharmax-input > .p-d-flex > .qty > .p-inputnumber > .p-inputnumber-button-group > .p-inputnumber-button-up > .p-button-icon'),
    }


    addItemShoppingCart()
    {
        
        for (let i = 0; i < 5; i++) {
            text += i + "<br>";
          }
    }

    typeInSearchBox(value)
    {
        
        this.el.searchTxt().type(value)
    }
    clickOnSearchBtn()
    {
        
        this.el.searchBtn().click()
    }
    typeAndClickSearch(value)
    {
        this.el.searchTxt().type(value)
        this.el.searchBtn().click()
    }
    getCaseSizeBudge()
    {
        return cy.get('.badge');
    }
    changeQtyUP()
    {
        this.el.UpQty().click();
    }
    
}

module.exports = new orderPage();