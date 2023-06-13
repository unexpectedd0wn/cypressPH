class orderPage{
    
    elements =
        {
            searchTxt: () => cy.get('.p-inputgroup > .p-inputtext'),
            searchBtn: () => cy.get('.p-inputgroup-addon'),
            caseSizeBadge: () => cy.get('.badge'),
            UpQty: () => cy.get('.p-inputnumber-button-up > .p-button-icon'),
            valueQty: () => cy.get(`[id^="q"]`),
            addItemCircle: () => cy.get('.pi-plus-circle'),
            noRecordsFoundFooter: () => cy.get('.p-datatable-footer > .p-d-flex'),

        }

    shoppingCartEl =
        {
            valueQty: () => cy.get(`[id^="pi"]`),
            UpQty: () => cy.get('pharmax-input > .p-d-flex > .qty > .p-inputnumber > .p-inputnumber-button-group > .p-inputnumber-button-up > .p-button-icon'),
        }


    
    getSelectedWholeslaer()
    {
        this.searchBarEl.wholeslaerLabel()
    }

    addItemShoppingCart()
    {
        
        for (let i = 0; i < 5; i++) {
            text += i + "<br>";
          }
    }

    typeInSearchBox(value)
    {
        
        this.orderPageEl.searchTxt().type(value)
    }
    clickOnSearchBtn()
    {
        
        this.orderPageEl.searchBtn().click()
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
    
}

module.exports = new orderPage();