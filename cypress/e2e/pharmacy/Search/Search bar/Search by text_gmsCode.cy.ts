import { getRandomNumber } from "../../../../support/commonService";
import { APIRequests } from "../../../../page-objects/api-routes";
import { Search, SearchBar } from "../../../../page-objects/search-bar";

describe('', () => {

        before(() => {
            cy.fixture("main").then(data => {
                cy.signInCreateSession(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });
        });
        it('Brokered Ethical | Apply then Clear: text search filter(gmsCode)', () => {
    
            cy.intercept(APIRequests.request._getPageDataBrokeredEthical + '*').as('pageLoaded');
            cy.intercept(APIRequests.request._searchWithGMSCode + '*').as('searchRequest');
            
            cy.visitPage("Brokered Ethical");

            cy.wait('@pageLoaded').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
                
                let i = getRandomNumber();
                let ItemGmsCode = response.body.items[i].gmsCode;
                cy.log(ItemGmsCode);
                cy.wrap(ItemGmsCode).as('itemGmsCode');
            })

            cy.get('@itemGmsCode').then((gmsCode) => {
                
                SearchBar.searchByText(gmsCode);
            })
    
            cy.wait('@searchRequest').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
                
                cy.get('@itemGmsCode').then((gmsCode) => {
                    cy.get(response.body.items).each(($item: any) => {
                        expect($item.gmsCode.toLowerCase()).to.contain(gmsCode.toLowerCase());
                    })
                })
            })
        })
        it.only('Brokered OTC | Apply then Clear: text search filter(gmsCode)', () => {
    
            cy.intercept(APIRequests.request._getPageDataBrokeredOTC + '*').as('pageLoaded');
            cy.intercept(APIRequests.request._searchWithGMSCode + '*').as('searchRequest');
            
            cy.visitPage("Brokered OTC");

            cy.wait('@pageLoaded').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
                
                let i = getRandomNumber();
                let ItemGmsCode = response.body.items[i].gmsCode;
                cy.log(ItemGmsCode);
                cy.wrap(ItemGmsCode).as('itemGmsCode');
            })

            cy.get('@itemGmsCode').then((gmsCode) => {
                
                SearchBar.searchByText(gmsCode);
            })
    
            cy.wait('@searchRequest').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
                
                cy.get('@itemGmsCode').then((gmsCode) => {
                    cy.get(response.body.items).each(($item: any) => {
                        expect($item.gmsCode.toLowerCase()).to.contain(gmsCode.toLowerCase());
                    })
                })
            })
        })
        // it.only('Second Line | Apply then Clear: text search filter(gmsCode)', () => {
    
        //     cy.intercept(_call._getPageDataSecondLine + '*').as('pageLoaded');
        //     cy.intercept(_call._searchWithGMSCode + '*').as('searchRequest');
            
        //     cy.VisitSecondLine();

        //     cy.wait('@pageLoaded').then(({ response }) => {
        //         expect(response.statusCode).to.equal(200);
                
        //         let ItemGmsCode = gmscodefilter();

        //         function gmscodefilter(params) {
        //             cy.get(response.body.items).each(($item) => {
        //                 let result = cy.get($item).filter('/\b\d{5}\b/g')
        //                 cy.log(result);
        //                 return result;
        //             })
        //         }

        //         // let i = randomItem();
        //         // let ItemGmsCode = response.body.items[i].gmsCode;
                
        //         // cy.wrap(ItemGmsCode).as('itemGmsCode');
        //     })

        //     cy.get('@itemGmsCode').then((gmsCode) => {
        //         searchBarEl.searchTxt().type(gmsCode);
        //         searchBarEl.searchBtn().click();
        //     })
    
        //     cy.wait('@searchRequest').then(({ response }) => {
        //         expect(response.statusCode).to.equal(200);
                
        //         cy.get('@itemGmsCode').then((gmsCode) => {
        //             cy.get(response.body.items).each(($item) => {
        //                 expect($item.gmsCode.toLowerCase()).to.contain(gmsCode.toLowerCase());
        //             })
        //         })
        //     })
        // })
        // it('ULM | Apply then Clear: text search filter(gmsCode)', () => {
    
        //     cy.intercept(_call._getPageDataULM + '*').as('pageLoaded');
        //     cy.intercept(_call._searchWithGMSCode + '*').as('searchRequest');
            
        //     cy.VisitULM();

        //     cy.wait('@pageLoaded').then(({ response }) => {
        //         expect(response.statusCode).to.equal(200);
                
        //         let i = randomItem();
        //         let ItemGmsCode = response.body.items[i].gmsCode;
        //         cy.log(ItemGmsCode);
        //         cy.wrap(ItemGmsCode).as('itemGmsCode');
        //     })

        //     cy.get('@itemGmsCode').then((gmsCode) => {
        //         searchBarEl.searchTxt().type(gmsCode);
        //         searchBarEl.searchBtn().click();
        //     })
    
            
        //     cy.wait('@searchRequest').then(({ response }) => {
        //         expect(response.statusCode).to.equal(200);
                
        //         cy.get('@itemGmsCode').then((gmsCode) => {
        //             cy.get(response.body.items).each(($item) => {
        //                  expect($item.gmsCode.toLowerCase()).to.contain(gmsCode.toLowerCase());
        //             })
        //         })
        //     })
        // })
    });