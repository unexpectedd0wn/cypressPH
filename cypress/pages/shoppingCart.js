

class shoppingCart {
    
    

    substitutionTab = 
        {

            preferedTitle: () => cy.get(`.title[rte='1BE']`),
            preferedStockNote: () => cy.get('.pref-exected-delivery'),
            preferedNetPrice: () => cy.get(`div[class='preferred p-d-flex'] p[class='net-price ng-star-inserted']`),
            preferedDescription: () => cy.get(`div[class='preferred p-d-flex'] p[class='preferred-description']`),
            preferedExpectedDeliveryText: () => cy.get('.preferred-expected-delivery > span'),
            preferedExpectedDeliveryTick: () => cy.get('.preferred-expected-delivery > .fa'),

            expectedDeliveryTick: () => cy.get(`.fa.fa-check`),
            expectedDeliveryText: () => cy.get(`#product-cart-card > div.quantity-column.p-d-flex.p-flex-column.p-ai-end.ng-star-inserted > div.next-best-expected-delivery.ng-star-inserted`),

            orderButton: () => cy.get(`.cart-order-btn.p-button.p-component`),
            qtyInput: () => cy.get(`.p-d-flex.pharmax-input`),
            deleteIcon: () => cy.get(`.p-button-icon.fa.fa-trash-o`),

            nextBestTitle: () => cy.get(`div[class='selected-info p-d-flex ng-star-inserted'] p[class='title']`),
            nextBestDescription: () => cy.get(`div[class='selected-info p-d-flex ng-star-inserted'] p[class='preferred-description']`),
            nextBestNetPrice: () => cy.get(`div[class='selected-info p-d-flex ng-star-inserted'] p[class='net-price ng-star-inserted']`)


        }

        getPrefredInStock() 
        {
            // this.elements.emailTxt().clear().type(password);
            return this.substitutionTab.preferedInStock();
        }


        InStockNote() 
        {

        }

        OOS_Message(depot) {
            let message = ` Out of Stock ${depot} `;
            return message;
        }

        

        

    // StockNote(localDepo, cutoffDepo)
    // {

    // }


}

module.exports = new shoppingCart();

