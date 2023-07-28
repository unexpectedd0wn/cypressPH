// in cypress/support/index.d.ts
// load type definitions that come with Cypress module
/// <reference types="cypress" />



declare namespace Cypress {
    interface Chainable {
        
        /**
         * Command to run queries on database.
         * @example cy.sqlServer('SELECT * FROM AspNetUsers WHERE Nome = 'João Silva';')
         */
        sqlServer(value: string): Chainable<Element>
        /**
         * Custom command to login to the BBWT3-Based website.
         * @example cy.login("username", "password")
         */
        signIn(username: string, password: string): Chainable<void>;

        /**
         * Custom command to select an item from a PrimeNG dropdown.
         * @example cy.SelectDropDown(dropDownNumber, "value");
         */
        signOut(): Chainable<void>;

        /**
         * Custom command to fully clean up shopping cart, include Substitution Tab
         * @example cy.cleanUpShoppingCart(Pharmacies.Id);
         */
        cleanUpShoppingCart(value: number): Chainable<void>;

        /**
         * Custom command to select an item from the pharmacies dropdown
         * @example cy.SelectDropDown("value");
         */
        signInCreateSession(username: string, password: string): Chainable<void>;

        /**
         * Custom command to take an item for test, from the response.body and save it to the global variable,
         * Cypress.env('item.Id');
            Cypress.env('item.IPUcode');
            Cypress.env('item.Description');
            Cypress.env('item.PackSize');
            Cypress.env('item.PackType');
            Cypress.env('item.NetPrice');
            Cypress.env('item.Discount');
            Cypress.env('item.TradePrice');
         * @example cy.getItemForTest(wholesaler name);
         */
        getItemForTest(value: string, value1: string): Chainable<void>;

        /**
         * Custom command to select an item from the pharmacies dropdown
         * @example cy.SelectDropDown("value");
         */
        addItemToSubstitutionTab(preferedId: number, pharmacyId: number, IPUcode: number, currentDateTime: string): Chainable<void>;
    
        /**
         * Custom command to update Pharmacy settings 
         * @example cy.SelectDropDown(useCutOff.yes, cutOffTime.after, localaDepot: number, cutoffDepot: number, pharmacyId: number);
         */
        updatePharmacy(useCutOff: number, cutOffTime: string, localaDepot: number, cutoffDepot: number, pharmacyId: number): Chainable<void>;

        /**
         * Custom command to select an item from the pharmacies dropdown
         * @example cy.SelectDropDown("value");
         */
        updateUDStockProductStock(InBallina: number, InDublin: number, InLimerick: number, preferedId: number): Chainable<void>;

        /**
         * Custom command to update Pharmacy settings 
         * @example cy.SelectDropDown(useCutOff.yes, cutOffTime.after, localaDepot: number, cutoffDepot: number, pharmacyId: number);
         */
        selectWholesaler(wholeslaerName: string): Chainable<void>;

        /**
         * Custom command to update Pharmacy settings 
         * @example cy.SelectDropDown(useCutOff.yes, cutOffTime.after, localaDepot: number, cutoffDepot: number, pharmacyId: number);
         */
        getUDItemAndAddItToShoppingCart(wholesalername: strung, pharmacyId: number): Chainable<void>;
        
        /**
         * Custom command to update Pharmacy settigs 
         * @example cy.SelectDropDown(useCutOff.yes, cutOffTime.after, localaDepot: number, cutoffDepot: number, pharmacyId: number);
         */
        addItemToShoppingCart(ipucode: number, pharmacyId: number, stockproductId: number, currentdatetime: string): Chainable<void>;
        
        /**
         * Custom command to update Pharmacy settigs 
         * @example cy.SelectDropDown(useCutOff.yes, cutOffTime.after, localaDepot: number, cutoffDepot: number, pharmacyId: number);
         */
        updatePharmacySetExcludeNoGms(excludeNoGms: number, pharmacyId: number): Chainable<void>;
        
        /**
         * Custom command to update Pharmacy settigs 
         * @example cy.SelectDropDown(useCutOff.yes, cutOffTime.after, localaDepot: number, cutoffDepot: number, pharmacyId: number);
         */
        updatePharmacySetUseGreys(useGreys: number, pharmacyId: number): Chainable<void>;
        
        /**
         * Custom command to update Pharmacy settigs 
         * @example cy.SelectDropDown(useCutOff.yes, cutOffTime.after, localaDepot: number, cutoffDepot: number, pharmacyId: number);
         */
        getItemAndAddItToShoppingCart(wholesaler: string, pharmacyId: number): Chainable<void>;
        
        /**
         * Custom command to place the order
         * 1.Press the order button
         * 2.Checking successfuly toast message
         * 3.Checking the empty shopping cart appears 
         * @example cy.toPlaceTheOrder(Wholesaler Name);
         */
        toPlaceTheOrder(wholeslaerName: string): Chainable<void>;
        
        /**
         * Custom command to update Pharmacy settigs 
         * @example cy.SelectDropDown(useCutOff.yes, cutOffTime.after, localaDepot: number, cutoffDepot: number, pharmacyId: number);
         */
        toAddItemToTheShoppingCart()

        /**
         * Custom command to visit page
         * @example cy.visitPage("Brokered Ethical");
         * @example cy.visitPage("Brokered OTC");
         * @example cy.visitPage("Second Line");
         * @example cy.visitPage("ULM");
         * @example cy.visitPage("Order History");
         */
        visitPage(pagename: string)

        /**
         * Custom command to update Pharmacy settigs 
         * @example cy.SelectDropDown(useCutOff.yes, cutOffTime.after, localaDepot: number, cutoffDepot: number, pharmacyId: number);
         */
        selectPackType(packtype: string)

        /**
         * Custom command to update Pharmacy settigs 
         * @example cy.SelectDropDown(useCutOff.yes, cutOffTime.after, localaDepot: number, cutoffDepot: number, pharmacyId: number);
         */
        getIPUCode(id: number)

        /**
         * Custom command to update Pharmacy settigs 
         * @example cy.SelectDropDown(useCutOff.yes, cutOffTime.after, localaDepot: number, cutoffDepot: number, pharmacyId: number);
         */
        updatePIStockProductStock(InStock: number, StockProductId: number)

        /**
         * Custom command to update Pharmacy settigs 
         * @example cy.SelectDropDown(useCutOff.yes, cutOffTime.after, localaDepot: number, cutoffDepot: number, pharmacyId: number);
         */
        toUpdatePharmacyPricesDiscounts(IshowUdNetPrices: number , show2ndLine: number, pharmacyId: number)
                 
    }
}