const dayjs = require("dayjs");
import shoppingCart, { getPrefredInStock } from "../../pages/shoppingCart";
import routes from "../../pages/routes";

describe('Substitution Tab checks', () => {
    /*
    
    IMPORTANT NOTES:    
            
    Before the test, to find the Brokered group with the 1 prefered item and next best(make sure Group is not blocked)
    AND 
    please set variables for test: 
            1. preferedId from StockProducts.Id
            2. nextBestId from StockProducts.Id
            3. preferedDescription from StockProducts.Description
            4. nextBestDescription Description from StockProducts.Description
            5. IPUcode: for the Prefered from StockProducts.IpuCode
    */
    
    let preferedId = 27405;
    let preferedDescription = " ATORVASTATIN FC  TABS 40MG (ACTAVIS) ATORVASTATIN ";
    let nextBestId = 27694;
    let nextBestDescription = "ATORVASTATIN TABS 10MG (PFIZER) ATORVASTATIN";
    let IPUcode = 5099627279192;
    let pharmacyId = Cypress.env("pharmacyId");
    let beforeCutOffTime = "'23:59:00.0000000'";
    let afterCutOffTime = "'00:01:00.0000000'";
    // let addItemDateTime = dayjs;
    let Ballina = "Ballina";
    let Dublin = "Dublin";
    let Limerick = "Limerick";

    
    before(() => {
        cy.CleanUpShoppingCart(pharmacyId);
        cy.AddItemToSubstitutionTab(preferedId, pharmacyId, IPUcode);
        cy.clearAllCookies();
        cy.clearAllLocalStorage();
        
    });

    beforeEach(() => {
        
        cy.fixture("main").then(data => {
            cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
        });
        
        
    });

    afterEach(() => {
        cy.Logout();
        cy.clearAllCookies();
        cy.clearAllLocalStorage();
        
        
        
    });

    context('Ballina -> Dublin', () => {
       
        it('Test 01.01', () => {
            /*
            Conditions:
            +--------------+----------------+-----------------+----------------+-----------------+
            | beforeCutOff | PFInStockLocal | PFInStockCutOff | NBInStockLocal | NBInStockCutOff |
            +--------------+----------------+-----------------+----------------+-----------------+
            | 1            | 0              | 0               | 0              | 1               |
            +--------------+----------------+-----------------+----------------+-----------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');

            //set the conditions
            cy.updatePharmacy(1, beforeCutOffTime, 3, 1, 411);
            cy.updateStockProducts(0, 0, 0, preferedId);
            cy.updateStockProducts(0, 1, 0, nextBestId);
            
            

            cy.visit(Cypress.env("devURL"));
            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                //Expected
                let StockNote = `Out of Stock ${Ballina},  Out of Stock ${Dublin} `;
                let ExpectedDelivery = 'Next Day';

                //Check the Substitution Tab state
                cy.SubstitutionState_type1(StockNote, 
                    preferedDescription, 
                    nextBestDescription, 
                    ExpectedDelivery)
            });
        });
        
        it('Test 01.02', () => {
            /*
            +--------------+----------------+-----------------+----------------+-----------------+
            | beforeCutOff | PFInStockLocal | PFInStockCutOff | NBInStockLocal | NBInStockCutOff |
            +--------------+----------------+-----------------+----------------+-----------------+
            | 1            | 0              | 0               | 0              | 0               |
            +--------------+----------------+-----------------+----------------+-----------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.updateStockProducts(0,0,0,preferedId);
            cy.updateStockProducts(0,0,0,nextBestId);
            cy.updatePharmacy(1,beforeCutOffTime,3,1,411);
            
            cy.visit(Cypress.env("devURL"));
            
            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                let StockNote = `Out of Stock Ballina,  Out of Stock Dublin `;
                cy.SubstitutionState_type2(StockNote, preferedDescription)
            });
        });
        
        it('Test 01.03', () => {
            /*
            +--------------+----------------+-----------------+----------------+-----------------+
            | beforeCutOff | PFInStockLocal | PFInStockCutOff | NBInStockLocal | NBInStockCutOff |
            +--------------+----------------+-----------------+----------------+-----------------+
            | 1            | 0              | 0               | 1              | 0               |
            +--------------+----------------+-----------------+----------------+-----------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.updateStockProducts(0,0,0,preferedId);
            cy.updateStockProducts(1,0,0,nextBestId);
            cy.updatePharmacy(1,beforeCutOffTime,3,1,411);
            
            cy.visit(Cypress.env("devURL"));
            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                let StockNote = `Out of Stock Ballina,  Out of Stock Dublin `;
                let ExpectedDelivery = 'Same Day';
                cy.SubstitutionState_type1(StockNote, preferedDescription, nextBestDescription, ExpectedDelivery )
            });
        });
        
        it('Test 01.04', () => {
            /*
            +--------------+----------------+-----------------+----------------+-----------------+
            | beforeCutOff | PFInStockLocal | PFInStockCutOff | NBInStockLocal | NBInStockCutOff |
            +--------------+----------------+-----------------+----------------+-----------------+
            | 1            | 1              | 0               | 0              | 0               |
            +--------------+----------------+-----------------+----------------+-----------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.updateStockProducts(1,0,0,preferedId);
            cy.updateStockProducts(0,0,0,nextBestId);
            cy.updatePharmacy(1,beforeCutOffTime,3,1,411);
            
            cy.visit(Cypress.env("devURL"));
            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
                let StockNote = ' Back In Stock Ballina ';
                let ExpectedDelivery = 'Same Day';
                cy.SubstitutionState_type3(StockNote, preferedDescription, ExpectedDelivery)
            });
        });
        it('Test 01.06', () => {
            /*
            +--------------+----------------+-----------------+----------------+-----------------+
            | beforeCutOff | PFInStockLocal | PFInStockCutOff | NBInStockLocal | NBInStockCutOff |
            +--------------+----------------+-----------------+----------------+-----------------+
            | 1            | 0              | 1               | 0              | 0               |
            +--------------+----------------+-----------------+----------------+-----------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.updateStockProducts(0,1,0,preferedId);
            cy.updateStockProducts(0,0,0,nextBestId);
            cy.updatePharmacy(1,beforeCutOffTime,3,1,411);
            
            cy.visit(Cypress.env("devURL"));
            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
                let StockNote = 'Out of Stock Ballina,  Back In Stock Dublin ';
                let ExpectedDelivery = 'Next Day';
                cy.SubstitutionState_type3(StockNote, preferedDescription, ExpectedDelivery)
            });
        });
        it('Test 01.07', () => {
            /*
            +--------------+----------------+-----------------+----------------+-----------------+
            | beforeCutOff | PFInStockLocal | PFInStockCutOff | NBInStockLocal | NBInStockCutOff |
            +--------------+----------------+-----------------+----------------+-----------------+
            | 0            |                | 1               |                |                 |
            +--------------+----------------+-----------------+----------------+-----------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.updateStockProducts(0,1,0,preferedId);
            cy.updateStockProducts(0,0,0,nextBestId);
            cy.updatePharmacy(1,afterCutOffTime,3,1,411);
            
            cy.visit(Cypress.env("devURL"));
            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
                let StockNote = 'Out of Stock Ballina,  Back In Stock Dublin ';
                let ExpectedDelivery = 'Next Day';
                cy.SubstitutionState_type3(StockNote, preferedDescription, ExpectedDelivery)
            });
        });
        it('Test 01.08', () => {
            
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            
            cy.updateStockProducts(0,0,0,preferedId);
            cy.updateStockProducts(0,1,0,nextBestId);
            cy.updatePharmacy(1,afterCutOffTime,3,1,411);
            
            
            
            
            cy.visit(Cypress.env("devURL"));
            
            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
            });

            let StockNote = ` Out of Stock Dublin `;
            let ExpectedDelivery = 'Next Day';
            

            cy.SubstitutionState_type1(StockNote, preferedDescription, nextBestDescription, ExpectedDelivery )
            
            
            
        });
        //pain!does not work
        it('Test 01.09', () => {
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.updateStockProducts(0,0,0,preferedId);
            cy.updateStockProducts(0,0,0,nextBestId);
            cy.updatePharmacy(1,afterCutOffTime,3,1,411);
            
            
            cy.visit(Cypress.env("devURL"));
            
            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
                let StockNote = ` Out of Stock Dublin `;
            
                cy.SubstitutionState_type2(StockNote, preferedDescription)
            });

           
            
        });

        
    })

    context('Dublin -> Dublin', () => {
        // it('Test 01.01', () => {
        //     /*
        //     Conditions:
        //     +--------------+----------------+-----------------+----------------+-----------------+
        //     | beforeCutOff | PFInStockLocal | PFInStockCutOff | NBInStockLocal | NBInStockCutOff |
        //     +--------------+----------------+-----------------+----------------+-----------------+
        //     | 1            | 0              | 0               | 0              | 1               |
        //     +--------------+----------------+-----------------+----------------+-----------------+
        //     */
        //     cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');

        //     //set the conditions
        //     cy.updateStockProducts(0, 0, 0, preferedId);
        //     cy.updateStockProducts(0, 1, 0, nextBestId);
        //     cy.updatePharmacy(1, beforeCutOffTime, 1, 1, 411);


        //     cy.visit(Cypress.env("devURL"));
        //     cy.wait('@getShoppingCartItems').then(({ response }) => {
        //         expect(response.statusCode).to.equal(200);

        //         //Expected
        //         let StockNote = ` Out of Stock ${Dublin} `;
        //         let ExpectedDelivery = 'Same Day';

        //         //Check the Substitution Tab state
        //         cy.SubstitutionState_type1(StockNote, 
        //             preferedDescription, 
        //             nextBestDescription, 
        //             ExpectedDelivery)
        //     });
        // });
        
        // it('Test 01.02', () => {
        //     /*
        //     +--------------+----------------+-----------------+----------------+-----------------+
        //     | beforeCutOff | PFInStockLocal | PFInStockCutOff | NBInStockLocal | NBInStockCutOff |
        //     +--------------+----------------+-----------------+----------------+-----------------+
        //     | 1            | 0              | 0               | 0              | 0               |
        //     +--------------+----------------+-----------------+----------------+-----------------+
        //     */
        //     cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
        //     cy.updateStockProducts(0,0,0,preferedId);
        //     cy.updateStockProducts(0,0,0,nextBestId);
        //     cy.updatePharmacy(1,beforeCutOffTime,1,1,411);
            
        //     cy.visit(Cypress.env("devURL"));
            
        //     cy.wait('@getShoppingCartItems').then(({ response }) => {
        //         expect(response.statusCode).to.equal(200);

        //         let StockNote = ` Out of Stock ${Dublin} `;
        //         cy.SubstitutionState_type2(StockNote, preferedDescription)
        //     });
        // });
        // it('Test 01.04', () => {
        //     /*
        //     +--------------+----------------+-----------------+----------------+-----------------+
        //     | beforeCutOff | PFInStockLocal | PFInStockCutOff | NBInStockLocal | NBInStockCutOff |
        //     +--------------+----------------+-----------------+----------------+-----------------+
        //     | 1            | 1              | 0               | 0              | 0               |
        //     +--------------+----------------+-----------------+----------------+-----------------+
        //     */
        //     cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
        //     cy.updateStockProducts(0,1,0,preferedId);
        //     cy.updateStockProducts(0,0,0,nextBestId);
        //     cy.updatePharmacy(1,beforeCutOffTime,1,1,411);
            
        //     cy.visit(Cypress.env("devURL"));
        //     cy.wait('@getShoppingCartItems').then(({ response }) => {
        //         expect(response.statusCode).to.equal(200);
        //         let StockNote = `  Back In Stock ${Ballina}  `;
        //         let ExpectedDelivery = 'Same Day';
        //         cy.SubstitutionState_type3(StockNote, preferedDescription, ExpectedDelivery)
        //     });
        // });

        // it('Test 01.07', () => {
        //     /*
        //     +--------------+----------------+-----------------+----------------+-----------------+
        //     | beforeCutOff | PFInStockLocal | PFInStockCutOff | NBInStockLocal | NBInStockCutOff |
        //     +--------------+----------------+-----------------+----------------+-----------------+
        //     | 0            |                | 1               |                |                 |
        //     +--------------+----------------+-----------------+----------------+-----------------+
        //     */
        //     cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
        //     cy.updateStockProducts(0,1,0,preferedId);
        //     cy.updateStockProducts(0,0,0,nextBestId);
        //     cy.updatePharmacy(1,afterCutOffTime,1,1,411);
            
        //     cy.visit(Cypress.env("devURL"));
        //     cy.wait('@getShoppingCartItems').then(({ response }) => {
        //         expect(response.statusCode).to.equal(200);
        //         let StockNote = 'Out of Stock Ballina,  Back In Stock Dublin ';
        //         let ExpectedDelivery = 'Next Day';
        //         cy.SubstitutionState_type3(StockNote, preferedDescription, ExpectedDelivery)
        //     });
        // });
        // it('Test 01.08', () => {
            
        //     cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            
        //     cy.updateStockProducts(0,0,0,preferedId);
        //     cy.updateStockProducts(0,1,0,nextBestId);
        //     cy.updatePharmacy(1,afterCutOffTime,1,1,411);
            
            
            
            
        //     cy.visit(Cypress.env("devURL"));
            
        //     cy.wait('@getShoppingCartItems').then(({ response }) => {
        //         expect(response.statusCode).to.equal(200);
        //     });

        //     let StockNote = `Out of Stock Ballina,  Out of Stock Dublin `;
        //     let ExpectedDelivery = 'Next Day';
            

        //     cy.SubstitutionState_type1(StockNote, preferedDescription, nextBestDescription, ExpectedDelivery )
            
            
            
        // });
        
    })
});