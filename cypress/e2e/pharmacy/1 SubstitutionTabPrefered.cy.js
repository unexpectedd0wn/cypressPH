const dayjs = require("dayjs");
import shoppingCart, { getPrefredInStock } from "../../pages/shoppingCart";
import routes from "../../pages/routes";

describe('Substitution Tab states for UD prefered', () => {
    /*
    
    IMPORTANT NOTES:    
    Tests for the manual run ONLY, not for the CI        
    Before the test, to find the Brokered group with the 1 prefered item for the test Pharmacy
    and next best(make sure Group is not blocked)
    AND 
    Set variables for test: 
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
    // let addItemDateTime = dayjs();
    let Ballina = "Ballina";
    let Dublin = "Dublin";
    let Limerick = "Limerick";
    let StockNote, ExpectedDelivery, preferedExpectedDelivery, nextbestExpectedDelivery;

    
    before(() => {
        cy.CleanUpShoppingCart(pharmacyId);
        cy.AddItemToSubstitutionTab(preferedId, pharmacyId, IPUcode);
        cy.clearAllCookies();
    });

    afterEach(() => {
        cy.screenshot()
        cy.Logout();
        cy.clearAllCookies();
    });

    context('Ballina -> Dublin', () => {

        it('B->D_Test_01.01', () => {
            /*
            +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         NO        |        NO        |        NO        |        YES        |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.updatePharmacy(1, beforeCutOffTime, 3, 1, pharmacyId);
            cy.updateStockProducts(0, 0, 0, preferedId);
            cy.updateStockProducts(0, 1, 0, nextBestId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                StockNote = OOS_OOS_Message(Ballina, Dublin);
                ExpectedDelivery = 'Next Day';
                cy.SubstitutionState_type1(StockNote,
                    preferedDescription,
                    nextBestDescription,
                    ExpectedDelivery
                )
            });
        });

        it('B->D_Test_01.02', () => {
            /*
            +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         NO        |        NO        |        NO        |        NO         |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.updateStockProducts(0, 0, 0, preferedId);
            cy.updateStockProducts(0, 0, 0, nextBestId);
            cy.updatePharmacy(1, beforeCutOffTime, 3, 1, pharmacyId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                StockNote = OOS_OOS_Message(Ballina, Dublin);
                cy.SubstitutionState_type2(StockNote, preferedDescription)
            });
        });

        it('B->D_Test_01.03', () => {
            /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         NO        |        NO        |        YES        |        NO        |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.updateStockProducts(0, 0, 0, preferedId);
            cy.updateStockProducts(1, 0, 0, nextBestId);
            cy.updatePharmacy(1, beforeCutOffTime, 3, 1, pharmacyId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                StockNote = OOS_OOS_Message(Ballina, Dublin)
                ExpectedDelivery = 'Same Day';
                cy.SubstitutionState_type1(StockNote, preferedDescription, nextBestDescription, ExpectedDelivery)
            });
        });

        it('B->D_Test_01.04', () => {
            /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         YES        |        NO        |        NO        |        NO        |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.updateStockProducts(1, 0, 0, preferedId);
            cy.updateStockProducts(0, 0, 0, nextBestId);
            cy.updatePharmacy(1, beforeCutOffTime, 3, 1, pharmacyId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                StockNote = BackInStock_Message(Ballina);
                ExpectedDelivery = 'Same Day';
                cy.SubstitutionState_type3(StockNote, preferedDescription, ExpectedDelivery)
            });
        });

        it('B->D_Test_01.05', () => {
            /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         NO        |        YES       |        YES       |        NO         |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.updateStockProducts(0, 1, 0, preferedId);
            cy.updateStockProducts(1, 0, 0, nextBestId);
            cy.updatePharmacy(1, beforeCutOffTime, 3, 1, pharmacyId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
                
                StockNote = OOS_BackInStock_Message(Ballina, Dublin);
                preferedExpectedDelivery = 'Next Day';
                nextbestExpectedDelivery = 'Same Day'
                cy.SubstitutionState_type4(StockNote, preferedDescription, nextBestDescription, preferedExpectedDelivery, nextbestExpectedDelivery)
            });
        });

        it('B->D_Test_01.06', () => {
            /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         NO        |        YES       |        NO        |        NO         |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.updateStockProducts(0, 1, 0, preferedId);
            cy.updateStockProducts(0, 0, 0, nextBestId);
            cy.updatePharmacy(1, beforeCutOffTime, 3, 1, pharmacyId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
                
                StockNote = OOS_BackInStock_Message(Ballina, Dublin);
                ExpectedDelivery = 'Next Day';
                cy.SubstitutionState_type3(StockNote, preferedDescription, ExpectedDelivery)
            });
        });

        it('B->D_Test_01.07', () => {
            /*
            +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      NO       |                   |        YES       |                  |                   |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.updateStockProducts(0, 1, 0, preferedId);
            cy.updateStockProducts(0, 0, 0, nextBestId);
            cy.updatePharmacy(1, afterCutOffTime, 3, 1, pharmacyId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
                
                StockNote = BackInStock_Message(Dublin);
                ExpectedDelivery = 'Next Day';
                cy.SubstitutionState_type3(StockNote, preferedDescription, ExpectedDelivery)
            });
        });

        it('B->D_Test_01.08', () => {
            /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      NO       |                   |        NO        |                  |        YES        |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.updateStockProducts(0, 0, 0, preferedId);
            cy.updateStockProducts(0, 1, 0, nextBestId);
            cy.updatePharmacy(1, afterCutOffTime, 3, 1, pharmacyId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                StockNote = OOS_Message(Dublin);
                ExpectedDelivery = 'Next Day';
                cy.SubstitutionState_type1(StockNote, preferedDescription, nextBestDescription, ExpectedDelivery)
            });
        });

        it('B->D_Test_01.09', () => {
            /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      NO       |                   |        NO        |                  |        NO         |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.updateStockProducts(0, 0, 0, preferedId);
            cy.updateStockProducts(0, 0, 0, nextBestId);
            cy.updatePharmacy(1, afterCutOffTime, 3, 1, pharmacyId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                StockNote = OOS_Message(Dublin);
                cy.SubstitutionState_type2(StockNote, preferedDescription)
            });
        });
    })

    context('Dublin -> Dublin', () => {

        it('D->D_Test_02.01', () => {
            /*
            +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         NO        |        NO        |        NO        |        YES        |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.updateStockProducts(0, 0, 0, preferedId);
            cy.updateStockProducts(0, 1, 0, nextBestId);
            cy.updatePharmacy(1, beforeCutOffTime, 1, 1, pharmacyId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                StockNote = OOS_Message(Dublin);
                ExpectedDelivery = 'Same Day';
                cy.SubstitutionState_type1(StockNote,
                    preferedDescription,
                    nextBestDescription,
                    ExpectedDelivery
                )
            });
        });

        it('D->D_Test_02.02', () => {
            /*
            +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         NO        |        NO        |        NO        |        NO         |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.updateStockProducts(0, 0, 0, preferedId);
            cy.updateStockProducts(0, 0, 0, nextBestId);
            cy.updatePharmacy(1, beforeCutOffTime, 1, 1, pharmacyId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                StockNote = OOS_Message(Dublin);
                cy.SubstitutionState_type2(StockNote, preferedDescription)
            });
        });

        it('D->D_Test_02.04', () => {
            /*
              +---------------+-------------------+------------------+------------------+-------------------+
             | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
             |               |       local       |      cutOff      |       local      |       cutOff      |
             +---------------+-------------------+------------------+------------------+-------------------+
             |      YES      |         YES        |        NO        |        NO        |        NO        |
             +---------------+-------------------+------------------+------------------+-------------------+
             */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.updateStockProducts(0, 1, 0, preferedId);
            cy.updateStockProducts(0, 0, 0, nextBestId);
            cy.updatePharmacy(1, beforeCutOffTime, 1, 1, pharmacyId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                StockNote = BackInStock_Message(Dublin);
                ExpectedDelivery = 'Same Day';
                cy.SubstitutionState_type3(StockNote, preferedDescription, ExpectedDelivery)
            });
        });

        it('D->D_Test_02.07', () => {
            /*
            +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      NO       |                   |        YES       |                  |                   |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.updateStockProducts(0, 1, 0, preferedId);
            cy.updateStockProducts(0, 0, 0, nextBestId);
            cy.updatePharmacy(1, afterCutOffTime, 1, 1, pharmacyId);
            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                StockNote = BackInStock_Message(Dublin);
                ExpectedDelivery = 'Next Day';
                cy.SubstitutionState_type3(StockNote, preferedDescription, ExpectedDelivery)
            });
        });

        it('D->D_Test_02.08', () => {
            /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      NO       |                   |        NO        |                  |        YES        |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.updateStockProducts(0, 0, 0, preferedId);
            cy.updateStockProducts(0, 1, 0, nextBestId);
            cy.updatePharmacy(1, afterCutOffTime, 1, 1, pharmacyId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                StockNote = OOS_Message(Dublin);
                ExpectedDelivery = 'Next Day';
                cy.SubstitutionState_type1(StockNote, preferedDescription, nextBestDescription, ExpectedDelivery)
            });
        });

        it('D->D_Test_02.09', () => {
            /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      NO       |                   |        NO        |                  |        NO         |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.updateStockProducts(0, 0, 0, preferedId);
            cy.updateStockProducts(0, 0, 0, nextBestId);
            cy.updatePharmacy(1, afterCutOffTime, 1, 1, pharmacyId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                StockNote = OOS_Message(Dublin);
                cy.SubstitutionState_type2(StockNote, preferedDescription)
            });
        });
    })

    context('Limerick -> Dublin', () => {

        it('L->D_Test_03.01', () => {
            /*
            +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         NO        |        NO        |        NO        |        YES        |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.updatePharmacy(1, beforeCutOffTime, 2, 1, pharmacyId);
            cy.updateStockProducts(0, 0, 0, preferedId);
            cy.updateStockProducts(0, 1, 0, nextBestId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                StockNote = OOS_OOS_Message(Limerick, Dublin);
                ExpectedDelivery = 'Next Day';
                cy.SubstitutionState_type1(StockNote,
                    preferedDescription,
                    nextBestDescription,
                    ExpectedDelivery
                )
            });
        });

        it('L->D_Test_03.02', () => {
            /*
            +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         NO        |        NO        |        NO        |        NO         |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.updateStockProducts(0, 0, 0, preferedId);
            cy.updateStockProducts(0, 0, 0, nextBestId);
            cy.updatePharmacy(1, beforeCutOffTime, 2, 1, pharmacyId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });
            
            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                StockNote = OOS_OOS_Message(Limerick, Dublin);
                cy.SubstitutionState_type2(StockNote, preferedDescription)
            });
        });

        it('L->D_Test_03.03', () => {
            /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         NO        |        NO        |        YES        |        NO        |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.updateStockProducts(0, 0, 0, preferedId);
            cy.updateStockProducts(0, 0, 1, nextBestId);
            cy.updatePharmacy(1, beforeCutOffTime, 2, 1, pharmacyId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });
            
            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                StockNote = OOS_OOS_Message(Limerick, Dublin);
                ExpectedDelivery = 'Same Day';
                cy.SubstitutionState_type1(StockNote, preferedDescription, nextBestDescription, ExpectedDelivery)
            });
        });

        it('L->D_Test_03.04', () => {
            /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         YES        |        NO        |        NO        |        NO        |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.updateStockProducts(0, 0, 1, preferedId);
            cy.updateStockProducts(0, 0, 0, nextBestId);
            cy.updatePharmacy(1, beforeCutOffTime, 2, 1, pharmacyId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });
            
            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
                
                StockNote = BackInStock_Message(Limerick);
                ExpectedDelivery = 'Same Day';
                cy.SubstitutionState_type3(StockNote, preferedDescription, ExpectedDelivery)
            });
        });

            it('L->D_Test_03.05', () => {
                /*
                +---------------+-------------------+------------------+------------------+-------------------+
                | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
                |               |       local       |      cutOff      |       local      |       cutOff      |
                +---------------+-------------------+------------------+------------------+-------------------+
                |      YES      |         NO        |        YES       |        YES       |        NO         |
                +---------------+-------------------+------------------+------------------+-------------------+
                */
                cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
                cy.updateStockProducts(0, 1, 0, preferedId);
                cy.updateStockProducts(0, 0, 2, nextBestId);
                cy.updatePharmacy(1, beforeCutOffTime, 2, 1, pharmacyId);

                cy.fixture("main").then(data => {
                    cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
                });
                
                cy.wait('@getShoppingCartItems').then(({ response }) => {
                    expect(response.statusCode).to.equal(200);
                    
                    StockNote = OOS_BackInStock_Message(Limerick, Dublin);
                    preferedExpectedDelivery = 'Next Day';
                    nextbestExpectedDelivery = 'Same Day'
                    cy.SubstitutionState_type4(StockNote, preferedDescription, nextBestDescription, preferedExpectedDelivery, nextbestExpectedDelivery)
                });
            });
        
        it('L->D_Test_03.06', () => {
            /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         NO        |        YES       |        NO        |        NO         |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.updateStockProducts(0, 1, 0, preferedId);
            cy.updateStockProducts(0, 0, 0, nextBestId);
            cy.updatePharmacy(1, beforeCutOffTime, 2, 1, pharmacyId);
            
            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
                
                StockNote = OOS_BackInStock_Message(Limerick, Dublin);
                ExpectedDelivery = 'Next Day';
                cy.SubstitutionState_type3(StockNote, preferedDescription, ExpectedDelivery)
            });
        });
        
        it('L->D_Test_03.07', () => {
            /*
            +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      NO       |                   |        YES       |                  |                   |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.updateStockProducts(0, 1, 0, preferedId);
            cy.updateStockProducts(0, 0, 0, nextBestId);
            cy.updatePharmacy(1, afterCutOffTime, 2, 1, pharmacyId);
            
            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

           cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
                
                StockNote = BackInStock_Message(Dublin);
                ExpectedDelivery = 'Next Day';
                cy.SubstitutionState_type3(StockNote, preferedDescription, ExpectedDelivery)
            });
        });
        
        it('L->D_Test_03.08', () => {
            /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      NO       |                   |        NO        |                  |        YES        |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.updateStockProducts(0, 0, 0, preferedId);
            cy.updateStockProducts(0, 1, 0, nextBestId);
            cy.updatePharmacy(1, afterCutOffTime, 2, 1, pharmacyId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });
            
            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                StockNote = OOS_Message(Dublin);
                ExpectedDelivery = 'Next Day';
                cy.SubstitutionState_type1(StockNote, preferedDescription, nextBestDescription, ExpectedDelivery)
            });
        });
        
        it('L->D_Test_03.09', () => {
            /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      NO       |                   |        NO        |                  |        NO         |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.updateStockProducts(0, 0, 0, preferedId);
            cy.updateStockProducts(0, 0, 0, nextBestId);
            cy.updatePharmacy(1, afterCutOffTime, 2, 1, pharmacyId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
                
                StockNote = OOS_Message(Dublin);
                cy.SubstitutionState_type2(StockNote, preferedDescription)
            });
        });
    })

    context('Ballina -> Ballina', () => {

        it('B->B_Test_04.01', () => {
            /*
            +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         NO        |        NO        |        NO        |        YES        |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.updatePharmacy(1, beforeCutOffTime, 3, 3, pharmacyId);
            cy.updateStockProducts(0, 0, 0, preferedId);
            cy.updateStockProducts(1, 0, 0, nextBestId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                StockNote = OOS_Message(Ballina);
                ExpectedDelivery = 'Same Day';
                cy.SubstitutionState_type1(StockNote,
                    preferedDescription,
                    nextBestDescription,
                    ExpectedDelivery
                )
            });
        });

        it('B->B_Test_04.02', () => {
            /*
            +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         NO        |        NO        |        NO        |        NO         |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.updateStockProducts(0, 0, 0, preferedId);
            cy.updateStockProducts(0, 0, 0, nextBestId);
            cy.updatePharmacy(1, beforeCutOffTime, 3, 3, pharmacyId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });
            
            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                StockNote = OOS_Message(Ballina);
                cy.SubstitutionState_type2(StockNote, preferedDescription)
            });
        });

        it('B->B_Test_04.03', () => {
            /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         NO        |        NO        |        YES        |        NO        |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.updateStockProducts(0, 0, 0, preferedId);
            cy.updateStockProducts(1, 0, 0, nextBestId);
            cy.updatePharmacy(1, beforeCutOffTime, 3, 3, pharmacyId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });
            
            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                StockNote = OOS_Message(Ballina);
                ExpectedDelivery = 'Same Day';
                cy.SubstitutionState_type1(StockNote, preferedDescription, nextBestDescription, ExpectedDelivery)
            });
        });

        it('B->B_Test_04.04', () => {
            /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         YES        |        NO        |        NO        |        NO        |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.updateStockProducts(1, 0, 0, preferedId);
            cy.updateStockProducts(0, 0, 0, nextBestId);
            cy.updatePharmacy(1, beforeCutOffTime, 3, 3, pharmacyId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });
            
            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
                
                StockNote = BackInStock_Message(Ballina);
                ExpectedDelivery = 'Same Day';
                cy.SubstitutionState_type3(StockNote, preferedDescription, ExpectedDelivery)
            });
        });
        it('B->B_Test_04.05', () => {
            /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         NO        |        YES       |        YES       |        NO         |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.updateStockProducts(1, 0, 0, preferedId);
            cy.updateStockProducts(1, 0, 0, nextBestId);
            cy.updatePharmacy(1, beforeCutOffTime, 3, 3, pharmacyId);
            
            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
                
                StockNote = BackInStock_Message(Ballina);
                ExpectedDelivery = 'Same Day';
                cy.SubstitutionState_type3(StockNote, preferedDescription, ExpectedDelivery)
            });
        });
        
        it('B->B_Test_04.06', () => {
            /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         NO        |        YES       |        NO        |        NO         |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.updateStockProducts(1, 0, 0, preferedId);
            cy.updateStockProducts(0, 0, 0, nextBestId);
            cy.updatePharmacy(1, beforeCutOffTime, 3, 3, pharmacyId);
            
            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
                
                StockNote = BackInStock_Message(Ballina);
                ExpectedDelivery = 'Same Day';
                cy.SubstitutionState_type3(StockNote, preferedDescription, ExpectedDelivery)
            });
        });
        
        it('B->B_Test_04.07', () => {
            /*
            +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      NO       |                   |        YES       |                  |                   |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.updateStockProducts(1, 0, 0, preferedId);
            cy.updateStockProducts(0, 0, 0, nextBestId);
            cy.updatePharmacy(1, afterCutOffTime, 3, 3, pharmacyId);
            
            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

           cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
                
                StockNote = BackInStock_Message(Ballina);
                ExpectedDelivery = 'Next Day';
                cy.SubstitutionState_type3(StockNote, preferedDescription, ExpectedDelivery)
            });
        });
        
        it('B->B_Test_04.08', () => {
            /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      NO       |                   |        NO        |                  |        YES        |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.updateStockProducts(0, 0, 0, preferedId);
            cy.updateStockProducts(1, 0, 0, nextBestId);
            cy.updatePharmacy(1, afterCutOffTime, 3, 3, pharmacyId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });
            
            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                StockNote = OOS_Message(Ballina);
                ExpectedDelivery = 'Next Day';
                cy.SubstitutionState_type1(StockNote, preferedDescription, nextBestDescription, ExpectedDelivery)
            });
        });
        
        it('B->B_Test_04.09', () => {
            /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      NO       |                   |        NO        |                  |        NO         |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.updateStockProducts(0, 0, 0, preferedId);
            cy.updateStockProducts(0, 0, 0, nextBestId);
            cy.updatePharmacy(1, afterCutOffTime, 3, 3, pharmacyId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
                
                StockNote = OOS_Message(Ballina);
                cy.SubstitutionState_type2(StockNote, preferedDescription)
            });
        });
    })
    context('Ballina -> Ballina(Dublin)', () => {

        it('B->B_Test_05.01', () => {
            /*
            +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         NO        |        NO        |        NO        |        YES        |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.updatePharmacy(1, beforeCutOffTime, 3, 3, pharmacyId);
            cy.updateStockProducts(0, 0, 0, preferedId);
            cy.updateStockProducts(0, 1, 0, nextBestId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                StockNote = OOS_Message(Ballina);
                ExpectedDelivery = 'Next Day';
                cy.SubstitutionState_type1(StockNote,
                    preferedDescription,
                    nextBestDescription,
                    ExpectedDelivery
                )
            });
        });
        it('B->B_Test_05.05', () => {
            /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         NO        |        YES       |        YES       |        NO         |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.updateStockProducts(0, 1, 0, preferedId);
            cy.updateStockProducts(1, 0, 0, nextBestId);
            cy.updatePharmacy(1, beforeCutOffTime, 3, 3, pharmacyId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                StockNote = BackInStock_Message(Ballina);
                preferedExpectedDelivery = 'Next Day';
                nextbestExpectedDelivery = 'Same Day';
                cy.SubstitutionState_type4(StockNote, preferedDescription, nextBestDescription, preferedExpectedDelivery, nextbestExpectedDelivery)
                
            });
        });

        it('B->B_Test_04.06', () => {
            /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         NO        |        YES       |        NO        |        NO         |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.updateStockProducts(0, 1, 0, preferedId);
            cy.updateStockProducts(0, 0, 0, nextBestId);
            cy.updatePharmacy(1, beforeCutOffTime, 3, 3, pharmacyId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                StockNote = BackInStock_Message(Ballina);
                ExpectedDelivery = 'Next Day';
                cy.SubstitutionState_type3(StockNote, preferedDescription, ExpectedDelivery)
            });
        });

        it('B->B_Test_04.07', () => {
            /*
            +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      NO       |                   |        YES       |                  |                   |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.updateStockProducts(0, 1, 0, preferedId);
            cy.updateStockProducts(0, 0, 0, nextBestId);
            cy.updatePharmacy(1, afterCutOffTime, 3, 3, pharmacyId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                StockNote = BackInStock_Message(Ballina);
                ExpectedDelivery = 'Next Day';
                cy.SubstitutionState_type3(StockNote, preferedDescription, ExpectedDelivery)
            });
        });

        it('B->B_Test_04.08', () => {
            /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Prefered InStock  | Prefered InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      NO       |                   |        NO        |                  |        YES        |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
            cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
            cy.updateStockProducts(0, 0, 0, preferedId);
            cy.updateStockProducts(0, 1, 0, nextBestId);
            cy.updatePharmacy(1, afterCutOffTime, 3, 3, pharmacyId);

            cy.fixture("main").then(data => {
                cy.Login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });

            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                StockNote = OOS_Message(Ballina);
                ExpectedDelivery = 'Next Day';
                cy.SubstitutionState_type1(StockNote, preferedDescription, nextBestDescription, ExpectedDelivery)
            });
        });
    })
});




function OOS_Message(depot) {
    let message = ` Out of Stock ${depot} `;
    return message;
}

function BackInStock_Message(depot) {
    let message = ` Back In Stock ${depot} `;
    return message;
}

function OOS_OOS_Message(depotMain, depotCutoff) {
    let message = `Out of Stock ${depotMain},  Out of Stock ${depotCutoff} `;
    return message;
}

function OOS_BackInStock_Message(depotMain, depotCutoff) {
    let message = `Out of Stock ${depotMain},  Back In Stock ${depotCutoff} `;
    return message;
}
