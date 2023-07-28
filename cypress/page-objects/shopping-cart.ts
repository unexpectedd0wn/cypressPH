import { piMinOrderValue } from "../support/enums";
class shoppingcart {

    elements = 
        {

            preferedTitle: () => cy.get(`.title[rte='1BE']`),
            preferedStockNote: () => cy.get('.pref-exected-delivery'),
            openShoppingCart: () => cy.get('#slide-button > .fa-stack > .fa-circle-thin'),
            
            summaryCard: () => cy.get('.summary-card'),
            summaryCardWholesalerName: () => cy.get('[rte="1Be"] > span'),
            summaryCardNumberOfItems: () => cy.get('.summary-items-span'),
            summaryCardGreenCircle: () => cy.get('.ng-star-inserted > .p-badge'),

            cartCardTitle: () => cy.get('.selectedWholesaler-span'),
            cartCardItemDescription: () => cy.get('#description-span'),
            cartCardTotalPrice: () => cy.get('#netPrice-span'),
            cartCardItemPrice: () => cy.get('.netPrice-span'),
            cartCardItemPackSize: () => cy.get('#packSize-span > span'),
            cartCardItemPackType: () => cy.get('.packType-span > span'),
            cartCardQty: () => cy.get(`[id^="pi"]`),
            cartCardOrderReady: () => cy.get('[rte="1AX"]'),
            cardYellowOrderReady: () => cy.get('[rte="1AR"]'),
            cartCardGreenCircle: () => cy.get('.p-d-flex > p-badge > .p-badge'),
            cartCardDeleteIcon: () => cy.get('.p-button-rounded > .p-button-icon'),
            cartCardOrderBtn: () => cy.get('.cart-order-btn'),
            cartCardExpectedDelivery: () => cy.get('.inStock-span'),
            
            cartCardQtyRaise: () => cy.get('pharmax-input > .p-d-flex > .qty > .p-inputnumber > .p-inputnumber-button-group > .p-inputnumber-button-up > .p-button-icon'),
            
            
            toastMessage: () => cy.get('.p-toast-message-content'),
            toastMessageTitle: () => cy.get('.p-toast-summary'),
            toastMessageTickIcon: () => cy.get('.p-toast-message-icon'),
            toastMessageDetailMessgae: () => cy.get('.p-toast-detail'),
            
            emptyCart: () => cy.get('.selectedWholesaler-span'), 
            emptyCartText: () => cy.get('.empty-text'), 


            slideNumberOfItems: () => cy.get('#slide-button'),
            
            
        }

openCart(){
    this.elements.openShoppingCart().click();
}

pressOrderButton(){
    this.elements.cartCardOrderBtn().click()
}

raiseQtyValue(){
    this.elements.cartCardQtyRaise().click()
}

        
state_OOSShoppingCart(description){
    //Shopping cart tab is displayed
    cy.get('.summary-card').should('exist').and('be.visible');
                
    //Make sure Item moved to the OOS TAB
    cy.get('.special-tab-title > span').should('have.text', 'Out of Stock');
    cy.get('.summary-items-span').should('have.text', ' 1 item ');
    cy.get('.red-badge').should('be.visible')

    cy.get('.selectedWholesaler-span').should('have.text', ' Out of Stock ').and('be.visible');
    cy.get('.preferred-description').should('have.text', description).and('be.visible');
    cy.get('#product-cart-card > .p-d-flex > .fa').should('be.visible');
    cy.get('.p-d-flex > p').should('be.visible');
    cy.get('.p-button-rounded > .p-button-icon').should('be.visible');
    
}

checkCartCard(wholesaler: string ,expectedDelivery: string, description: string, packsize: string, packtype: string, netprice: number, discount: number){
    
    //leftSummaryCard
    this.elements.summaryCard().should('exist').and('be.visible');
    
    
    
    this.elements.summaryCardWholesalerName().should('include.text', wholesaler).and('be.visible');
    this.elements.summaryCardNumberOfItems().should('include.text', ' 1 item ').and('be.visible');
    this.elements.summaryCardGreenCircle().should('be.visible')
    
    if (expectedDelivery != '') {
        this.elements.cartCardExpectedDelivery().should('include.text', ` In stock: ${expectedDelivery}`).and('be.visible');
    } else {
        this.elements.cartCardExpectedDelivery().should('be.visible')
    }
   
    this.elements.cartCardTitle().should('include.text', wholesaler).and('be.visible');

    this.elements.cartCardItemDescription()
        .should(($name) => {
            expect($name).to.include.text(description?.substring(0, 35))
    })

    this.elements.cartCardTotalPrice().should('be.visible').and('include.text', `Total Net Price: €${netprice}`);
    
    this.elements.cartCardQty().should('have.value', `1`)
    
    if (discount != 0) {
        this.elements.cartCardItemPrice().should('be.visible').and('include.text', ` Net Price: €${netprice}  (${discount}% Discount)`);
    } else {
        
        this.elements.cartCardItemPrice().should('be.visible').and('include.text', ` Net Price: €${netprice}`);
    }
    
    this.elements.cartCardItemPackSize().should('be.visible').and('include.text', packsize);
    this.elements.cartCardItemPackType().should('be.visible').and('include.text', packtype);

    
    
    
    switch (wholesaler) {
        case 'United Drug':
            this.elements.cartCardOrderReady().should('be.visible').and('include.text','Ready for ordering')
            break;
        case 'PCO':
            let leftAmountPco = (piMinOrderValue.PCO - netprice).toFixed(2);
            this.elements.cardYellowOrderReady().should('be.visible').and('include.text',`ONLY €${leftAmountPco} TO GO`)
            break;
        case 'IMED':
            let leftAmountImed = (piMinOrderValue.IMED - netprice).toFixed(2);
            this.elements.cardYellowOrderReady().should('be.visible').and('include.text',`ONLY €${leftAmountImed} TO GO`)
            break;
        case 'Lexon':
            let leftAmountLexon = (piMinOrderValue.Lexon - netprice).toFixed(2);
            this.elements.cardYellowOrderReady().should('be.visible').and('include.text',`ONLY €${leftAmountLexon} TO GO`)
            break;
        default:
            break;
    }
    
    
    
    this.elements.cartCardGreenCircle().should('be.visible')    
    this.elements.cartCardDeleteIcon().should('be.visible')
    this.elements.cartCardOrderBtn().should('be.visible')
}





successfulOrderToastMessage(wholeslaer){
    this.elements.toastMessage().should('be.visible',{ timeout: 30000 })
    this.elements.toastMessageTickIcon().should('be.visible')
    this.elements.toastMessageTitle().should('be.visible').and('include.text','Success')
    this.elements.toastMessageDetailMessgae().should('be.visible').and('include.text',`${wholeslaer} Order was successful`)
}

emptyShoppingCartAppears(){
    this.elements.emptyCart().should('be.visible').and('include.text','Empty')
    this.elements.emptyCartText().should('be.visible').and('include.text','There are no items in your shopping cart.')
    this.elements.slideNumberOfItems().should('be.visible').and('include.text','0 items')
}

}

export const ShoppingCart = new shoppingcart();

