import routes from "../../pagesANDmodules/routes";
import { orderPageEl } from "../../pagesANDmodules/OrderPages";
import { searchBarEl } from "../../pagesANDmodules/searchBar";
import { cutOffTime } from "../../support/enums"
import { _call } from "../../pagesANDmodules/routes";
import 'cypress-map';

var pharmacyId = Cypress.env("pharmacyId");

describe('Simple search on the order pages', () => {
    before(() => {
        
        cy.cleanUpShoppingCart(pharmacyId);
        cy.updatePharmacy(1,cutOffTime.before, 2, 1, pharmacyId);
    });
    
    beforeEach(() => {
        
        cy.fixture("main").then(data => {
            cy.signInAndCreateSession(data.pharmacyUserEmail, data.pharmacyUserPassword);
        });
    });

    afterEach(() => {
        // cy.screenshot()
    });

    // context('Filter data using: PackType filter', () => {
    //     it('Brokered Ethical | Apply & Clear: PackType', () => {
    //         let packtype = getPackType();
            
    //        cy.intercept(routes._call.filter_pack_type + packtype + '*',)
    //             .as('searchRequest');
    //         cy.intercept(routes._call.ClearFilter + '*',)
    //             .as('clearFiltersRequest');

    //         cy.visitOrderPage("brokeredEthical");

    //         cy.selectPackType(packtype);
    //         searchBarEl.packTypeLabel()
    //             .should('have.text', packtype);
    
    //         cy.wait('@searchRequest').then(({ response }) => {
    //             expect(response.statusCode).to.equal(200);
                
    //             if (response.body.items.length == 0) {
    //                 cy.log("The server return 0 result.All is fine")
                    
    //                 orderPageEl.noRecordsFoundFooter()
    //                     .should('be.visible')
    //                     .and('include.text', 'No records found'
    //                 )
    //             } 
    //             else {
    //                 cy.get(response.body.items).each(($item) => {
    //                     expect($item.packType.toLowerCase()).to.contain(packtype.toLowerCase());
    //                 })
    //             }
    //         })
    
    //         cy.contains("Clear filters")
    //             .should('be.visible')
    //             .click();
    //         cy.wait('@clearFiltersRequest').then(({ response }) => {
    //             expect(response.statusCode).to.equal(200);

    //             searchBarEl.packTypeLabel()
    //             .should('have.text', 'All');
    //         })
    //     })
    //     it('Brokered OTC | Apply then Clear: PackType', () => {
    //         let packtype = getPackType();
            
    //         cy.intercept(routes._call.filter_pack_type + packtype + '*',)
    //             .as('searchRequest');
    //         cy.intercept(routes._call.ClearFilter + '*',)
    //             .as('clearFiltersRequest');

    //         cy.visitOrderPage("brokeredOTC");
    
    //         cy.selectPackType(packtype);
    //         searchBarEl.packTypeLabel().should('have.text', packtype);
    
    //         cy.wait('@searchRequest').then(({ response }) => {
    //             expect(response.statusCode).to.equal(200);
                
    //             if (response.body.items.length == 0) {
    //                 cy.log("The server return 0 result.All is fine")
    //                 cy.get('.p-datatable-footer > .p-d-flex').should('be.visible').and('include.text', 'No records found')
    //             } else {
    //                 cy.get(response.body.items).each(($item) => {
    //                     expect($item.packType.toLowerCase()).to.contain(packtype.toLowerCase());
    //                 })
    //             }
                
    //         })
    
    //         cy.contains("Clear filters").should('be.visible').click();
    //         searchBarEl.packTypeLabel().should('have.text', 'All');
            
    //         cy.wait('@clearFiltersRequest').then(({ response }) => {
    //             expect(response.statusCode).to.equal(200);
    //         })
    //     });
    //     it('Second Line | Apply then Clear: PackType', () => {
    //         let packtype = getPackType();
    //         cy.visit(Cypress.env("devURL") + "/app/orders/secondLine?filterBy=secondLine");
    //         cy.title().should('eq', 'Orders-Second Line');
    //         cy.intercept(routes._call.filter_pack_type + packtype + '*',)
    //             .as('searchRequest');
    //         cy.intercept(routes._call.ClearFilter + '*',)
    //             .as('clearFiltersRequest');
    
    //         cy.selectPackType(packtype);
    //         searchBar.elements.packTypeLabel().should('have.text', packtype);
    
    //         cy.wait('@searchRequest').then(({ response }) => {
    //             expect(response.statusCode).to.equal(200);
                
    //             if (response.body.items.length == 0) {
    //                 cy.log("The server return 0 result.All is fine")
    //                 cy.get('.p-datatable-footer > .p-d-flex').should('be.visible').and('include.text', 'No records found')
    //             } else {
    //                 cy.get(response.body.items).each(($item) => {
    //                     expect($item.packType.toLowerCase()).to.contain(packtype.toLowerCase());
    //                 })
    //             }
                
    //         })
    
    //         cy.contains("Clear filters").should('be.visible').click();
    //         searchBar.elements.packTypeLabel().should('have.text', 'All');
            
    //         cy.wait('@clearFiltersRequest').then(({ response }) => {
    //             expect(response.statusCode).to.equal(200);
    //         })
    //     });
    //     it('ULM | Apply then Clear: PackType', () => {
    //         let packtype = getPackType();
    //         cy.visit(Cypress.env("devURL") + "/app/orders/ulm?filterBy=ulm");
    //         cy.title().should('eq', 'Orders-ULM');
    //         cy.intercept(routes._call.filter_pack_type + packtype + '*',)
    //             .as('searchRequest');
    //         cy.intercept(routes._call.ClearFilter + '*',)
    //             .as('clearFiltersRequest');
    
    //         cy.selectPackType(packtype);
    //         searchBar.elements.packTypeLabel().should('have.text', packtype);
    
    //         cy.wait('@searchRequest').then(({ response }) => {
    //             expect(response.statusCode).to.equal(200);
                
    //             if (response.body.items.length == 0) {
    //                 cy.log("The server return 0 result.All is fine")
    //                 cy.get('.p-datatable-footer > .p-d-flex').should('be.visible').and('include.text', 'No records found')
    //             } else {
    //                 cy.get(response.body.items).each(($item) => {
    //                     expect($item.packType.toLowerCase()).to.contain(packtype.toLowerCase());
    //                 })
    //             }
                
    //         })
    
    //         cy.contains("Clear filters").should('be.visible').click();
    //         searchBar.elements.packTypeLabel().should('have.text', 'All');
            
    //         cy.wait('@clearFiltersRequest').then(({ response }) => {
    //             expect(response.statusCode).to.equal(200);
    //         })
    //     });
    // });
    // context('Filter data using: PackSize filter', () => {
        
    //     it('Brokered Ethical | Apply then Clear', () => {
    
    //         let packsize = getPackSize();
    //         cy.visit(Cypress.env("devURL") + "/app/orders/brokeredEthical?filterBy=brokeredEthical");
    //         cy.title().should('eq', 'Orders-Brokered Ethical');
    //         cy.intercept(routes._call.filter_pack_size + packsize + '*',)
    //             .as('searchRequest');
    //         cy.intercept(routes._call.ClearFilter + '*',)
    //             .as('clearFiltersRequest');
            
    //         cy.get('.filter-input > #packSize')
    //         searchBarEl.packSizeTxt().type(packsize);
    //         cy.get('.p-inputgroup-addon').click();
    //         cy.wait('@searchRequest').then(({ response }) => {
    //             expect(response.statusCode).to.equal(200);
    //             if (response.body.items.length == 0) {
    //                 cy.log("The server return 0 result.All is fine")
    //                 cy.get('.p-datatable-footer > .p-d-flex').should('be.visible').and('include.text', 'No records found')
    //             } else {
    //                 cy.get(response.body.items).each(($item) => {
    //                     expect($item.packSize.toLowerCase()).to.contain(packsize.toLowerCase());
    //                 })
                
    //             }
                
                
    //         })
    
    //         cy.contains("Clear filters").should('be.visible').click();
    //         searchBarEl.packSizeTxt().should('be.empty');
    //         cy.wait('@clearFiltersRequest').then(({ response }) => {
    //             expect(response.statusCode).to.equal(200);
    //         })
    //     })
    //     it('Brokered OTC | Apply then Clear', () => {
    
    //         let packsize = getPackSize();
    //         cy.visit(Cypress.env("devURL") + "/app/orders/brokeredOtc?filterBy=brokeredOtc");
    //         cy.title().should('eq', 'Orders-Brokered OTC');
    //         cy.intercept(routes._call.filter_pack_size + packsize + '*',)
    //             .as('searchRequest');
    //         cy.intercept(routes._call.ClearFilter + '*',)
    //             .as('clearFiltersRequest');
            
    //         cy.get('.filter-input > #packSize').type(packsize);
    //         cy.get('.p-inputgroup-addon').click();
    //         cy.wait('@searchRequest').then(({ response }) => {
    //             expect(response.statusCode).to.equal(200);
    //             if (response.body.items.length == 0) {
    //                 cy.log("The server return 0 result.All is fine")
    //                 cy.get('.p-datatable-footer > .p-d-flex').should('be.visible').and('include.text', 'No records found')
    //             } else {
    //                 cy.get(response.body.items).each(($item) => {
    //                     expect($item.packSize.toLowerCase()).to.contain(packsize.toLowerCase());
    //                 })
                
    //             }
    //         })
    
    //         cy.contains("Clear filters").should('be.visible').click();
    //         cy.get('.filter-input > #packSize').should('be.empty');
    //         cy.wait('@clearFiltersRequest').then(({ response }) => {
    //             expect(response.statusCode).to.equal(200);
    //         })
    //     })
    //     it('Second Line | Apply then Clear', () => {
    
    //         let packsize = getPackSize();
    //         cy.visit(Cypress.env("devURL") + "/app/orders/secondLine?filterBy=secondLine");
    //         cy.title().should('eq', 'Orders-Second Line');
    //         cy.intercept(routes._call.filter_pack_size + packsize + '*',)
    //             .as('searchRequest');
    //         cy.intercept(routes._call.ClearFilter + '*',)
    //             .as('clearFiltersRequest');
            
    //         cy.get('.filter-input > #packSize').type(packsize);
    //         cy.get('.p-inputgroup-addon').click();
    //         cy.wait('@searchRequest').then(({ response }) => {
    //             expect(response.statusCode).to.equal(200);
    //             if (response.body.items.length == 0) {
    //                 cy.log("The server return 0 result.All is fine")
    //                 cy.get('.p-datatable-footer > .p-d-flex').should('be.visible').and('include.text', 'No records found')
    //             } else {
    //                 cy.get(response.body.items).each(($item) => {
    //                     expect($item.packSize.toLowerCase()).to.contain(packsize.toLowerCase());
    //                 })
                
    //             }
    //         })
    
    //         cy.contains("Clear filters").should('be.visible').click();
    //         cy.get('.filter-input > #packSize').should('be.empty');
    //         cy.wait('@clearFiltersRequest').then(({ response }) => {
    //             expect(response.statusCode).to.equal(200);
    //         })
    //     })
    //     it('ULM | Apply then Clear', () => {
    
    //         let packsize = getPackSize();
    //         cy.visit(Cypress.env("devURL") + "/app/orders/ulm?filterBy=ulm");
    //         cy.title().should('eq', 'Orders-ULM');
    //         cy.intercept(routes._call.filter_pack_size + packsize + '*',)
    //             .as('searchRequest');
    //         cy.intercept(routes._call.ClearFilter + '*',)
    //             .as('clearFiltersRequest');
            
    //         cy.get('.filter-input > #packSize').type(packsize);
    //         cy.get('.p-inputgroup-addon').click();
    //         cy.wait('@searchRequest').then(({ response }) => {
    //             expect(response.statusCode).to.equal(200);
    //             if (response.body.items.length == 0) {
    //                 cy.log("The server return 0 result.All is fine")
    //                 cy.get('.p-datatable-footer > .p-d-flex').should('be.visible').and('include.text', 'No records found')
    //             } else {
    //                 cy.get(response.body.items).each(($item) => {
    //                     expect($item.packSize.toLowerCase()).to.contain(packsize.toLowerCase());
    //                 })
                
    //             }
    //         })
    
    //         cy.contains("Clear filters").should('be.visible').click();
    //         cy.get('.filter-input > #packSize').should('be.empty');
    //         cy.wait('@clearFiltersRequest').then(({ response }) => {
    //             expect(response.statusCode).to.equal(200);
    //         })
    //     })
    // });
    // context('Filter data using: Wholeslaer filter', () => {
    //     it('Brokered Ethical | Apply then Clear', () => {
    
    //         let wholesaler = getWholesaler();
            
    //         cy.intercept(routes._call._filter_wholesaler + wId + '*',).as('searchRequest');
    //         cy.intercept(routes._call.ClearFilter + '*',).as('clearFiltersRequest');
    //         cy.visit(Cypress.env("devURL") + "/app/orders/brokeredEthical?filterBy=brokeredEthical");
    //         cy.title().should('eq', 'Orders-Brokered Ethical');
    
    
    //         cy.selectWholeslaer(wholesaler)
    //         cy.get('[rte="1tc"] > .ng-valid > .p-dropdown > .p-dropdown-label')
    //             .should('have.text', wholesaler);
    
    //         cy.wait('@searchRequest').then(({ response }) => {
    //             expect(response.statusCode).to.equal(200);
                
    //             if (response.body.items.length == 0) {
    //                 cy.log("The server return 0 result.All is fine")
    //                 cy.get('.p-datatable-footer > .p-d-flex').should('be.visible').and('include.text', 'No records found')
    //             } else {
    //                 cy.get(response.body.items).each(($item) => {
    //                     expect($item.wholesaler).to.equal(wholesaler);
    //                 })
                
    //             }
                
                
                
    //         })
    
    //         cy.contains("Clear filters").should('be.visible').click();
    
    //         cy.get('[rte="1tc"] > .ng-valid > .p-dropdown > .p-dropdown-label').should('have.text', 'All');
    //         cy.wait('@clearFiltersRequest').then(({ response }) => {
    //             expect(response.statusCode).to.equal(200);
    //         })
    //     })
    //     it('Brokered OTC | Apply then Clear', () => {
    
    //         let wholesaler = getWholesaler();
    //         let wId = getWholesaledId(wholesaler);
    //         cy.intercept(routes._call._filter_wholesaler + wId + '*',).as('searchRequest');
    //         cy.intercept(routes._call.ClearFilter + '*',).as('clearFiltersRequest');
    //         cy.visit(Cypress.env("devURL") + "/app/orders/brokeredOtc?filterBy=brokeredOtc");
    //         cy.title().should('eq', 'Orders-Brokered OTC');
    
    
    //         cy.selectWholeslaer(wholesaler)
    //         cy.get('[rte="1tc"] > .ng-valid > .p-dropdown > .p-dropdown-label')
    //             .should('have.text', wholesaler);
    
    //         cy.wait('@searchRequest').then(({ response }) => {
    //             expect(response.statusCode).to.equal(200);
                
    //             if (response.body.items.length == 0) {
    //                 cy.log("The server return 0 result.All is fine")
    //                 cy.get('.p-datatable-footer > .p-d-flex').should('be.visible').and('include.text', 'No records found')
    //             } else {
    //                 cy.get(response.body.items).each(($item) => {
    //                     expect($item.wholesalerId).to.equal(wId);
    //                 })
                
    //             }
                
                
                
    //         })
    
    //         cy.contains("Clear filters").should('be.visible').click();
    
    //         cy.get('[rte="1tc"] > .ng-valid > .p-dropdown > .p-dropdown-label').should('have.text', 'All');
    //         cy.wait('@clearFiltersRequest').then(({ response }) => {
    //             expect(response.statusCode).to.equal(200);
    //         })
    //     })
    //     it('Second Line | Apply then Clear', () => {
    
    //         let wholesaler = getWholesaler();
    //         let wId = getWholesaledId(wholesaler);
    //         cy.intercept(routes._call._filter_wholesaler + wId + '*',).as('searchRequest');
    //         cy.intercept(routes._call.ClearFilter + '*',).as('clearFiltersRequest');
    //         cy.visit(Cypress.env("devURL") + "/app/orders/secondLine?filterBy=secondLine");
    //         cy.title().should('eq', 'Orders-Second Line');
    
    
    //         cy.selectWholeslaer(wholesaler)
    //         cy.get('[rte="1tc"] > .ng-valid > .p-dropdown > .p-dropdown-label')
    //             .should('have.text', wholesaler);
    
    //         cy.wait('@searchRequest').then(({ response }) => {
    //             expect(response.statusCode).to.equal(200);
                
    //             if (response.body.items.length == 0) {
    //                 cy.log("The server return 0 result.All is fine")
    //                 cy.get('.p-datatable-footer > .p-d-flex').should('be.visible').and('include.text', 'No records found')
    //             } else {
    //                 cy.get(response.body.items).each(($item) => {
    //                     expect($item.wholesalerId).to.equal(wId);
    //                 })
    //             }
                
                
                
    //         })
    
    //         cy.contains("Clear filters").should('be.visible').click();
    
    //         cy.get('[rte="1tc"] > .ng-valid > .p-dropdown > .p-dropdown-label').should('have.text', 'All');
    //         cy.wait('@clearFiltersRequest').then(({ response }) => {
    //             expect(response.statusCode).to.equal(200);
    //         })
    //     })
    //     it('ULM | Apply then Clear', () => {
    
    //         let wholesaler = getWholesaler();
    //         let wId = getWholesaledId(wholesaler);
    //         cy.intercept(routes._call._filter_wholesaler + wId + '*',).as('searchRequest');
    //         cy.intercept(routes._call.ClearFilter + '*',).as('clearFiltersRequest');
    //         cy.visit(Cypress.env("devURL") + "/app/orders/ulm?filterBy=ulm");
    //         cy.title().should('eq', 'Orders-ULM');
    
    
    //         cy.selectWholeslaer(wholesaler)
    //         cy.get('[rte="1tc"] > .ng-valid > .p-dropdown > .p-dropdown-label')
    //             .should('have.text', wholesaler);
    
    //         cy.wait('@searchRequest').then(({ response }) => {
    //             expect(response.statusCode).to.equal(200);
                
    //             if (response.body.items.length == 0) {
    //                 cy.log("The server return 0 result.All is fine")
    //                 cy.get('.p-datatable-footer > .p-d-flex').should('be.visible').and('include.text', 'No records found')
    //             } else {
    //                 cy.get(response.body.items).each(($item) => {
    //                     expect($item.wholesalerId).to.equal(wId);
    //                 })
                
    //             }
                
                
                
    //         })
    
    //         cy.contains("Clear filters").should('be.visible').click();
    
    //         cy.get('[rte="1tc"] > .ng-valid > .p-dropdown > .p-dropdown-label').should('have.text', 'All');
    //         cy.wait('@clearFiltersRequest').then(({ response }) => {
    //             expect(response.statusCode).to.equal(200);
    //         })
    //     })
    // });
    // context('Filter data using: Expected Delivery filter', () => {
    //     it('Brokered Ethical | Apply then Clear', () => {

    //         let delivery = getExpectedDelivery();
    //         if (delivery == 'In-Stock') {
    //             cy.intercept(routes._call.ClearFilter + '*',).as('searchRequest');
    //         } else {
    //             cy.intercept('/api/stock-product/products?skip=0&take=25&sortingDirection=1&sortingField=description&filters%5B0%5D.propertyName=expectedDelivery&filters%5B0%5D.value=' + 1 + '*',).as('searchRequest');

    //         }
            
    //         cy.visit(Cypress.env("devURL") + "/app/orders/brokeredEthical?filterBy=brokeredEthical");
    //         cy.title().should('eq', 'Orders-Brokered Ethical')

    //         cy.get("p-dropdown")
    //             .then(selects => {
    //                 const select = selects[2];
    //                 cy.wrap(select)
    //                     .click()
    //                     .get("p-dropdownitem")
    //                     .get(".ng-tns-c56-14")
    //                     .contains(new RegExp("^" + delivery + "$", "g"))
    //                     .then(item => {
    //                         cy.wrap(item).click({ force: true });
    //                     });
    //             });

    //         cy.get('[rte="1ti"] > .p-inputwrapper-filled > .p-dropdown > .p-dropdown-label').should('have.text', delivery);
    //         cy.wait('@searchRequest').then(({ response }) => {
    //             expect(response.statusCode).to.equal(200);

    //             if (response.body.items.length == 0) {
    //                 cy.log("The server return 0 result.All is fine")
    //                 cy.get('.p-datatable-footer > .p-d-flex')
    //                     .should('be.visible')
    //                     .and('include.text', 'No records found')
    //             } 
    //             else {
    //                 if (delivery == "In-Stock") {
    //                     cy.get(response.body.items).each(($item) => {
    //                         expect($item.inStock).to.equal(true);
    //                     })
    //                 }
    //                 else {
    //                     cy.get(response.body.items).each(($item) => {
    //                         expect($item.expectedDelivery).to.equal(1);
    //                     })
    //                 }
    //             }

    //             if (delivery == "In-Stock") {
    //                 cy.log("no clear button, and this is fine");
    //             } 
    //             else {
    //                 cy.contains("Clear filters")
    //                     .should('be.visible').click();
    //                 cy.get('[rte="1ti"] > .p-inputwrapper-filled > .p-dropdown > .p-dropdown-label')
    //                     .should('have.text', 'In-Stock');
    //                 cy.wait('@searchRequest').then(({ response }) => {
    //                     expect(response.statusCode).to.equal(200);
    //                 })
    //             }
    //         })
    //     });
    //     it('Brokered OTC | Apply then Clear', () => {

    //         let delivery = getExpectedDelivery();
    //         if (delivery == 'In-Stock') {
    //             cy.intercept(routes._call.ClearFilter + '*',).as('searchRequest');
    //         } else {
    //             cy.intercept('/api/stock-product/products?skip=0&take=25&sortingDirection=1&sortingField=description&filters%5B0%5D.propertyName=expectedDelivery&filters%5B0%5D.value=' + 1 + '*',).as('searchRequest');

    //         }
            
    //         cy.visit(Cypress.env("devURL") + "/app/orders/brokeredOtc?filterBy=brokeredOtc");
    //         cy.title().should('eq', 'Orders-Brokered OTC');

    //         cy.get("p-dropdown")
    //             .then(selects => {
    //                 const select = selects[2];
    //                 cy.wrap(select)
    //                     .click()
    //                     .get("p-dropdownitem")
    //                     .get(".ng-tns-c56-14")
    //                     .contains(new RegExp("^" + delivery + "$", "g"))
    //                     .then(item => {
    //                         cy.wrap(item).click({ force: true });
    //                     });
    //             });

    //         cy.get('[rte="1ti"] > .p-inputwrapper-filled > .p-dropdown > .p-dropdown-label').should('have.text', delivery);
    //         cy.wait('@searchRequest').then(({ response }) => {
    //             expect(response.statusCode).to.equal(200);

    //             if (response.body.items.length == 0) {
    //                 cy.log("The server return 0 result.All is fine")
    //                 cy.get('.p-datatable-footer > .p-d-flex')
    //                     .should('be.visible')
    //                     .and('include.text', 'No records found')
    //             } 
    //             else {
    //                 if (delivery == "In-Stock") {
    //                     cy.get(response.body.items).each(($item) => {
    //                         expect($item.inStock).to.equal(true);
    //                     })
    //                 }
    //                 else {
    //                     cy.get(response.body.items).each(($item) => {
    //                         expect($item.expectedDelivery).to.equal(1);
    //                     })
    //                 }
    //             }

    //             if (delivery == "In-Stock") {
    //                 cy.log("no clear button, and this is fine");
    //             } 
    //             else {
    //                 cy.contains("Clear filters")
    //                     .should('be.visible').click();
    //                 cy.get('[rte="1ti"] > .p-inputwrapper-filled > .p-dropdown > .p-dropdown-label')
    //                     .should('have.text', 'In-Stock');
    //                 cy.wait('@searchRequest').then(({ response }) => {
    //                     expect(response.statusCode).to.equal(200);
    //                 })
    //             }
    //         })
    //     });
    //     it('Second Line | Apply then Clear', () => {

    //         let delivery = getExpectedDelivery();
    //         if (delivery == 'In-Stock') {
    //             cy.intercept(routes._call.ClearFilter + '*',).as('searchRequest');
    //         } else {
    //             cy.intercept('/api/stock-product/products?skip=0&take=25&sortingDirection=1&sortingField=description&filters%5B0%5D.propertyName=expectedDelivery&filters%5B0%5D.value=' + 1 + '*',).as('searchRequest');

    //         }
            
    //         cy.visit(Cypress.env("devURL") + "/app/orders/secondLine?filterBy=secondLine");
    //         cy.title().should('eq', 'Orders-Second Line');

    //         cy.get("p-dropdown")
    //             .then(selects => {
    //                 const select = selects[2];
    //                 cy.wrap(select)
    //                     .click()
    //                     .get("p-dropdownitem")
    //                     .get(".ng-tns-c56-14")
    //                     .contains(new RegExp("^" + delivery + "$", "g"))
    //                     .then(item => {
    //                         cy.wrap(item).click({ force: true });
    //                     });
    //             });

    //         cy.get('[rte="1ti"] > .p-inputwrapper-filled > .p-dropdown > .p-dropdown-label').should('have.text', delivery);
    //         cy.wait('@searchRequest').then(({ response }) => {
    //             expect(response.statusCode).to.equal(200);

    //             if (response.body.items.length == 0) {
    //                 cy.log("The server return 0 result.All is fine")
    //                 cy.get('.p-datatable-footer > .p-d-flex')
    //                     .should('be.visible')
    //                     .and('include.text', 'No records found')
    //             } 
    //             else {
    //                 if (delivery == "In-Stock") {
    //                     cy.get(response.body.items).each(($item) => {
    //                         expect($item.inStock).to.equal(true);
    //                     })
    //                 }
    //                 else {
    //                     cy.get(response.body.items).each(($item) => {
    //                         expect($item.expectedDelivery).to.equal(1);
    //                     })
    //                 }
    //             }

    //             if (delivery == "In-Stock") {
    //                 cy.log("no clear button, and this is fine");
    //             } 
    //             else {
    //                 cy.contains("Clear filters")
    //                     .should('be.visible').click();
    //                 cy.get('[rte="1ti"] > .p-inputwrapper-filled > .p-dropdown > .p-dropdown-label')
    //                     .should('have.text', 'In-Stock');
    //                 cy.wait('@searchRequest').then(({ response }) => {
    //                     expect(response.statusCode).to.equal(200);
    //                 })
    //             }
    //         })
    //     });
    //     it('ULM | Apply then Clear', () => {

    //         let delivery = getExpectedDelivery();
    //         if (delivery == 'In-Stock') {
    //             cy.intercept(routes._call.ClearFilter + '*',).as('searchRequest');
    //         } else {
    //             cy.intercept('/api/stock-product/products?skip=0&take=25&sortingDirection=1&sortingField=description&filters%5B0%5D.propertyName=expectedDelivery&filters%5B0%5D.value=' + 1 + '*',).as('searchRequest');

    //         }
            
    //         cy.visit(Cypress.env("devURL") + "/app/orders/ulm?filterBy=ulm");
    //         cy.title().should('eq', 'Orders-ULM');

    //         cy.get("p-dropdown")
    //             .then(selects => {
    //                 const select = selects[2];
    //                 cy.wrap(select)
    //                     .click()
    //                     .get("p-dropdownitem")
    //                     .get(".ng-tns-c56-14")
    //                     .contains(new RegExp("^" + delivery + "$", "g"))
    //                     .then(item => {
    //                         cy.wrap(item).click({ force: true });
    //                     });
    //             });

    //         cy.get('[rte="1ti"] > .p-inputwrapper-filled > .p-dropdown > .p-dropdown-label').should('have.text', delivery);
    //         cy.wait('@searchRequest').then(({ response }) => {
    //             expect(response.statusCode).to.equal(200);

    //             if (response.body.items.length == 0) {
    //                 cy.log("The server return 0 result.All is fine")
    //                 cy.get('.p-datatable-footer > .p-d-flex')
    //                     .should('be.visible')
    //                     .and('include.text', 'No records found')
    //             } 
    //             else {
    //                 if (delivery == "In-Stock") {
    //                     cy.get(response.body.items).each(($item) => {
    //                         expect($item.inStock).to.equal(true);
    //                     })
    //                 }
    //                 else {
    //                     cy.get(response.body.items).each(($item) => {
    //                         expect($item.expectedDelivery).to.equal(1);
    //                     })
    //                 }
    //             }

    //             if (delivery == "In-Stock") {
    //                 cy.log("no clear button, and this is fine");
    //             } 
    //             else {
    //                 cy.contains("Clear filters")
    //                     .should('be.visible').click();
    //                 cy.get('[rte="1ti"] > .p-inputwrapper-filled > .p-dropdown > .p-dropdown-label')
    //                     .should('have.text', 'In-Stock');
    //                 cy.wait('@searchRequest').then(({ response }) => {
    //                     expect(response.statusCode).to.equal(200);
    //                 })
    //             }
    //         })
    //     });
    // });
    // context('Filter data using: text search filter(gmsCode)', () => {
    //     it('Brokered Ethical | Apply then Clear: text search filter(gmsCode)', () => {
    
    //         cy.intercept(_call._getPageDataBrokeredEthical + '*').as('pageLoaded');
    //         cy.intercept(_call._searchWithGMSCode + '*').as('searchRequest');
            
    //         cy.VisitBrokeredEthical();

    //         cy.wait('@pageLoaded').then(({ response }) => {
    //             expect(response.statusCode).to.equal(200);
                
    //             let i = randomItem();
    //             let ItemGmsCode = response.body.items[i].gmsCode;
    //             cy.log(ItemGmsCode);
    //             cy.wrap(ItemGmsCode).as('itemGmsCode');
    //         })

    //         cy.get('@itemGmsCode').then((gmsCode) => {
    //             searchBarEl.searchTxt().type(gmsCode);
    //             searchBarEl.searchBtn().click();
    //         })
    
    //         cy.wait('@searchRequest').then(({ response }) => {
    //             expect(response.statusCode).to.equal(200);
                
    //             cy.get('@itemGmsCode').then((gmsCode) => {
    //                 cy.get(response.body.items).each(($item) => {
    //                     expect($item.gmsCode.toLowerCase()).to.contain(gmsCode.toLowerCase());
    //                 })
    //             })
    //         })
    //     })
    //     it('Brokered OTC | Apply then Clear: text search filter(gmsCode)', () => {
    
    //         cy.intercept(_call._getPageDataBrokeredOTC + '*').as('pageLoaded');
    //         cy.intercept(_call._searchWithGMSCode + '*').as('searchRequest');
            
    //         cy.VisitBrokeredOTC();

    //         cy.wait('@pageLoaded').then(({ response }) => {
    //             expect(response.statusCode).to.equal(200);
                
    //             let i = randomItem();
    //             let ItemGmsCode = response.body.items[i].gmsCode;
    //             cy.log(ItemGmsCode);
    //             cy.wrap(ItemGmsCode).as('itemGmsCode');
    //         })

    //         cy.get('@itemGmsCode').then((gmsCode) => {
    //             searchBarEl.searchTxt().type(gmsCode);
    //             searchBarEl.searchBtn().click();
    //         })
    
    //         cy.wait('@searchRequest').then(({ response }) => {
    //             expect(response.statusCode).to.equal(200);
                
    //             cy.get('@itemGmsCode').then((gmsCode) => {
    //                 cy.get(response.body.items).each(($item) => {
    //                     expect($item.gmsCode.toLowerCase()).to.contain(gmsCode.toLowerCase());
    //                 })
    //             })
    //         })
    //     })
    //     it.only('Second Line | Apply then Clear: text search filter(gmsCode)', () => {
    
    //         cy.intercept(_call._getPageDataSecondLine + '*').as('pageLoaded');
    //         cy.intercept(_call._searchWithGMSCode + '*').as('searchRequest');
            
    //         cy.VisitSecondLine();

    //         cy.wait('@pageLoaded').then(({ response }) => {
    //             expect(response.statusCode).to.equal(200);
                
    //             let ItemGmsCode = gmscodefilter();

    //             function gmscodefilter(params) {
    //                 cy.get(response.body.items).each(($item) => {
    //                     let result = cy.get($item).filter('/\b\d{5}\b/g')
    //                     cy.log(result);
    //                     return result;
    //                 })
    //             }

    //             // let i = randomItem();
    //             // let ItemGmsCode = response.body.items[i].gmsCode;
                
    //             // cy.wrap(ItemGmsCode).as('itemGmsCode');
    //         })

    //         cy.get('@itemGmsCode').then((gmsCode) => {
    //             searchBarEl.searchTxt().type(gmsCode);
    //             searchBarEl.searchBtn().click();
    //         })
    
    //         cy.wait('@searchRequest').then(({ response }) => {
    //             expect(response.statusCode).to.equal(200);
                
    //             cy.get('@itemGmsCode').then((gmsCode) => {
    //                 cy.get(response.body.items).each(($item) => {
    //                     expect($item.gmsCode.toLowerCase()).to.contain(gmsCode.toLowerCase());
    //                 })
    //             })
    //         })
    //     })
    //     it('ULM | Apply then Clear: text search filter(gmsCode)', () => {
    
    //         cy.intercept(_call._getPageDataULM + '*').as('pageLoaded');
    //         cy.intercept(_call._searchWithGMSCode + '*').as('searchRequest');
            
    //         cy.VisitULM();

    //         cy.wait('@pageLoaded').then(({ response }) => {
    //             expect(response.statusCode).to.equal(200);
                
    //             let i = randomItem();
    //             let ItemGmsCode = response.body.items[i].gmsCode;
    //             cy.log(ItemGmsCode);
    //             cy.wrap(ItemGmsCode).as('itemGmsCode');
    //         })

    //         cy.get('@itemGmsCode').then((gmsCode) => {
    //             searchBarEl.searchTxt().type(gmsCode);
    //             searchBarEl.searchBtn().click();
    //         })
    
            
    //         cy.wait('@searchRequest').then(({ response }) => {
    //             expect(response.statusCode).to.equal(200);
                
    //             cy.get('@itemGmsCode').then((gmsCode) => {
    //                 cy.get(response.body.items).each(($item) => {
    //                      expect($item.gmsCode.toLowerCase()).to.contain(gmsCode.toLowerCase());
    //                 })
    //             })
    //         })
    //     })
    // });
    context('Filter data using: text search filter(description)', () => {
        
        it.only('Brokered Ethical | Apply then Clear: search by existing ItemDescription', () => {
    
            cy.intercept(_call._getPageDataBrokeredEthical + '*').as('pageLoaded');
            cy.intercept(_call._searchWithText + '*').as('searchRequest');
            
            cy.VisitBrokeredEthical();

            cy.wait('@pageLoaded').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
                
                let i = randomItem();
                
                let product {
                    test = response.body.items[i].description;
                }
                
                let description = response.body.items[i].description;
                let packsize = response.body.items[i].packSize;
                let instock = response.body.items[i].inStock;
                let qty = response.body.items[i].description;
                let expectedDelivery = response.body.items[i].description;
                let tradePrice = response.body.items[i].tradePrice;
                let wholesaler = response.body.items[i].wholesaler;
                let gmsCode = response.body.items[i].gmsCode;
                let packType = response.body.items[i].packType;
                let discount = response.body.items[i].discount;
                let netPrice = response.body.items[i].netPrice;
                let comment = response.body.items[i].comment;
                cy.log(description);
                cy.wrap(description).as('itemDescription');
            })

            cy.get('@itemDescription').then((description) => {
                searchBarEl.searchTxt().type(description);
                searchBarEl.searchBtn().click();
            })
    
            cy.wait('@searchRequest').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
                
                cy.get('@itemDescription').then((description) => {
                    cy.get(response.body.items).each(($item) => {
                        expect($item.description.toLowerCase()).to.contain(description.toLowerCase());
                        
                        // const texts = Cypress._.map($td, 'innerText')

                        const headings = ['Description', 'Pack\nSize', 'In\nStock', 'Qty', 'Expected\nDelivery', 'Trade\nPrice', 'Wholesaler', 'GMS\nCode', 'Pack Type', 'Discount', 'Net\nPrice', 'Comment']
                        cy.get('table thead tr th').map('innerText').should('deep.equal', headings);

                        cy.get('tbody').table().then(console.table)

                        cy.get('tbody')
                            .table()
                            .should('deep.equal', [
                            ['ALDACTONE TABS 25MG SPIRONOLACTONE', '50', '', '', 'FRIDAY', '€4.14', 'O’NEILLS', 'O’NEILLS', 'PENDING', 'EU PACK', '10.62%', '€3.70', '']
                            ])
                    })
                })
            })
        })
        it('Brokered OTC | Apply then Clear: search by existing ItemDescription', () => {
    
            cy.intercept(_call._getPageDataBrokeredOTC + '*').as('pageLoaded');
            cy.intercept(_call._searchWithText + '*').as('searchRequest');
            
            cy.VisitBrokeredOTC();

            cy.wait('@pageLoaded').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
                
                let i = randomItem();
                let description = response.body.items[i].description;
                cy.log(description);
                cy.wrap(description).as('itemDescription');
            })

            cy.get('@itemDescription').then((description) => {
                searchBarEl.searchTxt().type(description);
                searchBarEl.searchBtn().click();
            })
    
            cy.wait('@searchRequest').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
                
                cy.get('@itemDescription').then((description) => {
                    cy.get(response.body.items).each(($item) => {
                        expect($item.description.toLowerCase()).to.contain(description.toLowerCase());
                    })
                })
            })
        })
        it('Second Line | Apply then Clear: search by existing ItemDescription', () => {
    
            cy.intercept(_call._getPageDataSecondLine + '*').as('pageLoaded');
            cy.intercept(_call._searchWithText + '*').as('searchRequest');
            
            cy.VisitSecondLine();

            cy.wait('@pageLoaded').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
                
                let i = randomItem();
                let description = response.body.items[i].description;
                cy.log(description);
                cy.wrap(description).as('itemDescription');
            })

            cy.get('@itemDescription').then((description) => {
                searchBarEl.searchTxt().type(description);
                searchBarEl.searchBtn().click();
            })
    
            cy.wait('@searchRequest').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
                
                cy.get('@itemDescription').then((description) => {
                    cy.get(response.body.items).each(($item) => {
                        expect($item.description.toLowerCase()).to.contain(description.toLowerCase());
                    })
                })
            })
        })
        it('ULM | Apply then Clear: search by existing ItemDescription', () => {
    
            cy.intercept(_call._getPageDataULM + '*').as('pageLoaded');
            cy.intercept(_call._searchWithText + '*').as('searchRequest');
            
            cy.VisitULM();

            cy.wait('@pageLoaded').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
                
                let i = randomItem();
                let description = response.body.items[i].description;
                cy.log(description);
                cy.wrap(description).as('itemDescription');
            })

            cy.get('@itemDescription').then((description) => {
                searchBarEl.searchTxt().type(description);
                searchBarEl.searchBtn().click();
            })
    
            cy.wait('@searchRequest').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
                
                cy.get('@itemDescription').then((description) => {
                    cy.get(response.body.items).each(($item) => {
                        expect($item.description.toLowerCase()).to.contain(description.toLowerCase());
                    })
                })
            })
        })
    });
    // context('Filter combination', () => {
    //     it('Brokered Ethical | Apply then Clear', () => {
    
    //         // let value = getProductDescription();
    //         cy.intercept('api/stock-product/products?skip=0&take=25&sortingDirection=1&sortingField=description&filters%5B0%5D.propertyName=SearchString&filters%5B0%5D.value=ACERYCAL%25205%252F5MG%2520TABS%2520PERINDOPRIL%2520ARGININE%252FAMLO&filters%5B0%5D.$type=string&filters%5B0%5D.matchMode=0&filters%5B1%5D.propertyName=PackType&filters%5B1%5D.value=IRISH%2520PACK&filters%5B1%5D.$type=string&filters%5B1%5D.matchMode=4&filters%5B2%5D.propertyName=PackSize&filters%5B2%5D.value=30&filters%5B2%5D.$type=string&filters%5B2%5D.matchMode=0&filters%5B3%5D.propertyName=wholesalerId&filters%5B3%5D.value=4&filters%5B3%5D.$type=number&filters%5B3%5D.matchMode=0&filters%5B4%5D.propertyName=brokeredEthical&filters%5B4%5D.value=true&filters%5B4%5D.$type=boolean' + '*',
    //         ).as('searchRequest');
    //         cy.intercept(routes._call._getPageData)
    //         .as('pageLoaded');
    //         cy.visit(Cypress.env("devURL") + "/app/orders/brokeredEthical?filterBy=brokeredEthical");
    //         cy.title().should('eq', 'Orders-Brokered Ethical')

    //         cy.wait('@pageLoaded').then(({ response }) => {
    //             expect(response.statusCode).to.equal(200);
                
                
                    
                
    //             let packSize = response.body.items[5].packSize;
    //             let description = response.body.items[5].description;
    //             let packType = response.body.items[5].packType;
    //             let Wholeslaer = response.body.items[5].wholesaler;
                
    //             cy.wrap(packSize).as('packsize');
    //             cy.wrap(packType).as('packtype');
    //             cy.wrap(Wholeslaer).as('wholeslaer');
    //             cy.wrap(description).as('description');
    //         })

    //         cy.get('@wholeslaer').then((value) => {
                
    //             cy.selectWholeslaer(value);
    //         })
            
    //         cy.get('@description').then((value) => {
    //             cy.get('.p-inputgroup > .p-inputtext').type(value);
                
    //         })

    //         cy.get('@packsize').then((value) => {
    //             cy.get('.filter-input > #packSize').type(value);
                
    //         })

    //         cy.get('@packtype').then((value) => {
    //             cy.selectPackType(value);
                
    //         })

            
    
            
    //         cy.get('.p-inputgroup-addon').click();
    //         cy.wait('@searchRequest').then(({ response }) => {
    //             expect(response.statusCode).to.equal(200);
                
    //             if (response.body.items.length == 0) {
    //                 cy.log("The server return 0 result.All is fine")
    //                 cy.get('.p-datatable-footer > .p-d-flex').should('be.visible').and('include.text', 'No records found')
    //             } else {
                    
    //                 cy.get('@wholeslaer').then((value) => {
    //                     cy.get(response.body.items).each(($item) => {
    //                         expect($item.wholesaler.toLowerCase()).to.contain(value.toLowerCase());
    //                     })
                        
    //                 })
    //                 cy.get('@description').then((value) => {
    //                     cy.get(response.body.items).each(($item) => {
    //                         expect($item.description.toLowerCase()).to.contain(value.toLowerCase());
    //                     })
                        
    //                 })
    //                 cy.get('@packsize').then((value) => {
    //                     cy.get(response.body.items).each(($item) => {
    //                         expect($item.packSize.toLowerCase()).to.contain(value.toLowerCase());
    //                     })
                        
    //                 })
    //                 cy.get('@packtype').then((value) => {
    //                     cy.get(response.body.items).each(($item) => {
    //                         expect($item.packType.toLowerCase()).to.contain(value.toLowerCase());
    //                     })
                        
    //                 })
    //             }
    //         })
    
            
    
    
    //     })
    // });

    
});


function getWholesaler() {
    var wholeslaersList = ['United Drug', 'IMED', 'PCO', 'Lexon'];
    var wholeslaer = wholeslaersList[Math.floor(Math.random() * wholeslaersList.length)];
    return wholeslaer;
}
function getExpectedDelivery() {
    var deliveryList = ['In-Stock', 'Same Day Delivery'];
    var delivery = deliveryList[Math.floor(Math.random() * deliveryList.length)];
    return delivery;
}
function getPackType() {
    var packtypesList = ['BRAND', 'FRIDGE', 'GENERIC', 'OTC', 'ULM'];
    var packType = packtypesList[Math.floor(Math.random() * packtypesList.length)];
    return packType;
}
function getPackSize() {
    var packsizeList = ['30', '5ML', '5X3ML'];
    var packSize = packsizeList[Math.floor(Math.random() * packsizeList.length)];
    return packSize;
}

function getWholesaledId(wholesaler) {

    switch (wholesaler) {
        case "United Drug":
            return 1;
            break;
        case "PCO":
            return 2;
            break;
        case "Lexon":
            return 6;
            break;
        case "IMED":
            return 4;
            break;
        case "Clinigen":
            return 7;
            break;
        case "O’Neills":
            return 5;
            break;
        default:
            return 0;
            break;
    }
}


function visitOrderPage(value) {
    switch (value) {
        case "brokeredEthical":
                cy.visit(Cypress.env("devURL") + "/app/orders/brokeredEthical?filterBy=brokeredEthical");
                cy.title().should('eq', 'Orders-Brokered Ethical');
            break;
        case "brokeredOTC":
                cy.visit(Cypress.env("devURL") + "/app/orders/brokeredOtc?filterBy=brokeredOtc");
                cy.title().should('eq', 'Orders-Brokered OTC');
            break;
        case "secondLine":
                cy.visit(Cypress.env("devURL") + "/app/orders/secondLine?filterBy=secondLine");
                cy.title().should('eq', 'Orders-Second Line');
        break;
        case "ULM":
                cy.visit(Cypress.env("devURL") + "/app/orders/ulm?filterBy=ulm");
                cy.title().should('eq', 'Orders-ULM');
        break;
        default:
            break;
    }
}


// function checkResponseBody(value1, value2, value3) {
//     if (response.body.items.length == 0) {
//         cy.log("The server return 0 result.All is fine")
//         cy.get('.p-datatable-footer > .p-d-flex').should('be.visible').and('include.text', 'No records found')
//     } else {
//         cy.get(response.body.items).each(($item) => {
//             expect($item.${value1}.toLowerCase()).to.contain(varible.toLowerCase());
//         })
//     }
// }


function ClearFilter(element) {
    cy.contains("Clear filters").should('be.visible').click();
            searchBar.elements.packTypeLabel().should('have.text', 'All');
            
            cy.wait('@clearFiltersRequest').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
            })
}



function randomItem() { // min and max included 
    const rndInt = Math.floor(Math.random() * 24) + 0;
    return rndInt;
 }

