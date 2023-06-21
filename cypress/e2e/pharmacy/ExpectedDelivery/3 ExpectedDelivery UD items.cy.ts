import { APIRequests } from "../../../page-objects/api-routes";
import { OrderPage } from "../../../page-objects/order-page";
import { SearchBar } from "../../../page-objects/search-bar";
import { ShoppingCart } from "../../../page-objects/shopping-cart";
import {
    expectedDelivery,
    cutOffTime,
    useCutOff,
    localaDepot,
    cutoffDepot,
    Wholesalers
} from "../../../support/enums";

const wholesaler = Wholesalers.UD.Name;
const pharmacyId = Cypress.env("pharmacyId");

function visitPageOpenCart() {
    cy.visit(Cypress.env("devURL"));
    cy.wait('@getShoppingCartItems').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
        ShoppingCart.elements.openShoppingCart().should('exist').click();
    });
}

describe('Expected Delivery in the Shopping Cart and On the Order page', () => {

    before(() => {
        cy.cleanUpShoppingCart(pharmacyId);
        cy.fixture("main").then(data => {
            cy.signInCreateSession(data.pharmacyUserEmail, data.pharmacyUserPassword);
        });
        cy.getItemAndAddItToShoppingCart(wholesaler, pharmacyId);

        
    });

    beforeEach(() => {
        cy.intercept(APIRequests.request._getShoppingcart).as('getShoppingCartItems');

        cy.fixture("main").then(data => {
            cy.signInCreateSession(data.pharmacyUserEmail, data.pharmacyUserPassword);
        });
    });

    context('Local Depo: Limerick -> Cut-off Depo: Dublin', () => {
        
        it.only('Case 01', () => {
            cy.updatePharmacy(useCutOff.yes, cutOffTime.before, localaDepot.Limerick, cutoffDepot.Dublin, pharmacyId);
            cy.updateUDStockProductStock(0, 0, 1, Cypress.env("item.Id"));
            visitPageOpenCart();
            ShoppingCart.checkCartCard(
                wholesaler,
                expectedDelivery.SameDay,
                Cypress.env('item.Description'),
                Cypress.env('item.PackSize'),
                Cypress.env('item.PackType'),
                Cypress.env('item.NetPrice'),
                Cypress.env('item.Discount'))
            SearchBar.toSearchInTheGlobalSearch(Cypress.env('item.IPUcode'));
            OrderPage.toCheckExpectedDeliberyInTheGrid('InStock', expectedDelivery.SameDay.toUpperCase());
        });

        it('Case 02', () => {
            cy.updatePharmacy(useCutOff.yes, cutOffTime.before, localaDepot.Limerick, cutoffDepot.Dublin, pharmacyId);
            cy.updateUDStockProductStock(1, 0, 0, Cypress.env("item.Id"));

            visitPageOpenCart();
            ShoppingCart.state_OOSShoppingCart(Cypress.env('item.Description'));
            SearchBar.toSearchInTheGlobalSearch(Cypress.env('item.IPUcode'));
            OrderPage.toCheckExpectedDeliberyInTheGrid('OOS', expectedDelivery.empty);
        });
        it.only('Case 03', () => {
            cy.updatePharmacy(useCutOff.yes, cutOffTime.before, localaDepot.Limerick, cutoffDepot.Dublin, pharmacyId);
            cy.updateUDStockProductStock(0, 1, 0, Cypress.env("item.Id"));
            visitPageOpenCart();
            ShoppingCart.checkCartCard(
                wholesaler,
                expectedDelivery.NextDay,
                Cypress.env('item.Description'),
                Cypress.env('item.PackSize'),
                Cypress.env('item.PackType'),
                Cypress.env('item.NetPrice'),
                Cypress.env('item.Discount'))
            SearchBar.toSearchInTheGlobalSearch(Cypress.env('item.IPUcode'));
            OrderPage.toCheckExpectedDeliberyInTheGrid('InStock', expectedDelivery.NextDay.toUpperCase());
        });
        it('Case 04', () => {
            cy.updatePharmacy(useCutOff.yes, cutOffTime.after, localaDepot.Limerick, cutoffDepot.Dublin, pharmacyId);
            cy.updateUDStockProductStock(0, 0, 1, Cypress.env("item.Id"));

            visitPageOpenCart();
            ShoppingCart.state_OOSShoppingCart(Cypress.env('item.Description'));
            SearchBar.toSearchInTheGlobalSearch(Cypress.env('item.IPUcode'));
            OrderPage.toCheckExpectedDeliberyInTheGrid('OOS', expectedDelivery.empty);
        });
        it('Case 05', () => {
            cy.updatePharmacy(useCutOff.yes, cutOffTime.after, localaDepot.Limerick, cutoffDepot.Dublin, pharmacyId);
            cy.updateUDStockProductStock(1, 0, 0, Cypress.env("item.Id"));

            visitPageOpenCart();
            ShoppingCart.state_OOSShoppingCart(Cypress.env('item.Description'));
            SearchBar.toSearchInTheGlobalSearch(Cypress.env('item.IPUcode'));
            OrderPage.toCheckExpectedDeliberyInTheGrid('OOS', expectedDelivery.empty);
        });
        it('Case 06', () => {
            cy.updatePharmacy(useCutOff.yes, cutOffTime.after, localaDepot.Limerick, cutoffDepot.Dublin, pharmacyId);
            cy.updateUDStockProductStock(0, 1, 0, Cypress.env("item.Id"));

            visitPageOpenCart();
            ShoppingCart.checkCartCard(
                wholesaler,
                expectedDelivery.NextDay,
                Cypress.env('item.Description'),
                Cypress.env('item.PackSize'),
                Cypress.env('item.PackType'),
                Cypress.env('item.NetPrice'),
                Cypress.env('item.Discount'))
            SearchBar.toSearchInTheGlobalSearch(Cypress.env('item.IPUcode'));
            OrderPage.toCheckExpectedDeliberyInTheGrid('InStock', expectedDelivery.NextDay.toUpperCase());
        });
        it('Case 07', () => {
            cy.updatePharmacy(useCutOff.no, cutOffTime.null, localaDepot.Limerick, cutoffDepot.Dublin, pharmacyId);
            cy.updateUDStockProductStock(0, 0, 1, Cypress.env("item.Id"));

            visitPageOpenCart();
            ShoppingCart.state_OOSShoppingCart(Cypress.env('item.Description'));
            SearchBar.toSearchInTheGlobalSearch(Cypress.env('item.IPUcode'));
            OrderPage.toCheckExpectedDeliberyInTheGrid('OOS', expectedDelivery.empty);
        });
        it('Case 08', () => {
            cy.updatePharmacy(useCutOff.no, cutOffTime.null, localaDepot.Limerick, cutoffDepot.Dublin, pharmacyId);
            cy.updateUDStockProductStock(1, 0, 0, Cypress.env("item.Id"));

            visitPageOpenCart();
            ShoppingCart.state_OOSShoppingCart(Cypress.env('item.Description'));
            SearchBar.toSearchInTheGlobalSearch(Cypress.env('item.IPUcode'));
            OrderPage.toCheckExpectedDeliberyInTheGrid('OOS', expectedDelivery.empty);
        });
        it('Case 09', () => {
            cy.updatePharmacy(useCutOff.no, cutOffTime.null, localaDepot.Limerick, cutoffDepot.Dublin, pharmacyId);
            cy.updateUDStockProductStock(0, 1, 0, Cypress.env("item.Id"));

            visitPageOpenCart();
            ShoppingCart.checkCartCard(
                wholesaler,
                expectedDelivery.NextDay,
                Cypress.env('item.Description'),
                Cypress.env('item.PackSize'),
                Cypress.env('item.PackType'),
                Cypress.env('item.NetPrice'),
                Cypress.env('item.Discount'))
            SearchBar.toSearchInTheGlobalSearch(Cypress.env('item.IPUcode'));
            OrderPage.toCheckExpectedDeliberyInTheGrid('InStock', expectedDelivery.NextDay.toUpperCase());
        });
    });
    context('Local Depo: Limerick -> Cut-off Depo: Ballina', () => {
        it('Case 10', () => {
            cy.updatePharmacy(useCutOff.yes, cutOffTime.before, localaDepot.Limerick, cutoffDepot.Ballina, pharmacyId);
            cy.updateUDStockProductStock(0, 0, 1, Cypress.env("item.Id"));

            visitPageOpenCart();
            ShoppingCart.checkCartCard(
                wholesaler,
                expectedDelivery.SameDay,
                Cypress.env('item.Description'),
                Cypress.env('item.PackSize'),
                Cypress.env('item.PackType'),
                Cypress.env('item.NetPrice'),
                Cypress.env('item.Discount'))
            SearchBar.toSearchInTheGlobalSearch(Cypress.env('item.IPUcode'));
            OrderPage.toCheckExpectedDeliberyInTheGrid('InStock', expectedDelivery.SameDay.toUpperCase());
        });
        it('Case 11', () => {
            cy.updatePharmacy(useCutOff.yes, cutOffTime.before, localaDepot.Limerick, cutoffDepot.Ballina, pharmacyId);
            cy.updateUDStockProductStock(1, 0, 0, Cypress.env("item.Id"));

            visitPageOpenCart();
            ShoppingCart.checkCartCard(
                wholesaler,
                expectedDelivery.NextDay,
                Cypress.env('item.Description'),
                Cypress.env('item.PackSize'),
                Cypress.env('item.PackType'),
                Cypress.env('item.NetPrice'),
                Cypress.env('item.Discount'))
            SearchBar.toSearchInTheGlobalSearch(Cypress.env('item.IPUcode'));
            OrderPage.toCheckExpectedDeliberyInTheGrid('InStock', expectedDelivery.NextDay.toUpperCase());
        });
        it('Case 12', () => {
            cy.updatePharmacy(useCutOff.yes, cutOffTime.before, localaDepot.Limerick, cutoffDepot.Ballina, pharmacyId);
            cy.updateUDStockProductStock(0, 1, 0, Cypress.env("item.Id"));

            visitPageOpenCart();
            ShoppingCart.state_OOSShoppingCart(Cypress.env('item.Description'));
            SearchBar.toSearchInTheGlobalSearch(Cypress.env('item.IPUcode'));
            OrderPage.toCheckExpectedDeliberyInTheGrid('OOS', expectedDelivery.empty);
        });
        it('Case 13', () => {
            cy.updatePharmacy(useCutOff.yes, cutOffTime.after, localaDepot.Limerick, cutoffDepot.Ballina, pharmacyId);
            cy.updateUDStockProductStock(0, 0, 1, Cypress.env("item.Id"));

            visitPageOpenCart();
            ShoppingCart.state_OOSShoppingCart(Cypress.env('item.Description'));
            SearchBar.toSearchInTheGlobalSearch(Cypress.env('item.IPUcode'));
            OrderPage.toCheckExpectedDeliberyInTheGrid('OOS', expectedDelivery.empty);
        });
        it('Case 14', () => {
            cy.updatePharmacy(useCutOff.yes, cutOffTime.after, localaDepot.Limerick, cutoffDepot.Ballina, pharmacyId);
            cy.updateUDStockProductStock(1, 0, 0, Cypress.env("item.Id"));

            visitPageOpenCart();
            ShoppingCart.checkCartCard(
                wholesaler,
                expectedDelivery.NextDay,
                Cypress.env('item.Description'),
                Cypress.env('item.PackSize'),
                Cypress.env('item.PackType'),
                Cypress.env('item.NetPrice'),
                Cypress.env('item.Discount'))
            SearchBar.toSearchInTheGlobalSearch(Cypress.env('item.IPUcode'));
            OrderPage.toCheckExpectedDeliberyInTheGrid('InStock', expectedDelivery.NextDay.toUpperCase());
        });
        it('Case 15', () => {
            cy.updatePharmacy(useCutOff.yes, cutOffTime.after, localaDepot.Limerick, cutoffDepot.Ballina, pharmacyId);
            cy.updateUDStockProductStock(0, 1, 0, Cypress.env("item.Id"));

            visitPageOpenCart();
            ShoppingCart.state_OOSShoppingCart(Cypress.env('item.Description'));
            SearchBar.toSearchInTheGlobalSearch(Cypress.env('item.IPUcode'));
            OrderPage.toCheckExpectedDeliberyInTheGrid('OOS', expectedDelivery.empty);
        });

        it('Case 16', () => {
            cy.updatePharmacy(useCutOff.no, cutOffTime.null, localaDepot.Limerick, cutoffDepot.Ballina, pharmacyId);
            cy.updateUDStockProductStock(0, 0, 1, Cypress.env("item.Id"));

            visitPageOpenCart();
            ShoppingCart.state_OOSShoppingCart(Cypress.env('item.Description'));
            SearchBar.toSearchInTheGlobalSearch(Cypress.env('item.IPUcode'));
            OrderPage.toCheckExpectedDeliberyInTheGrid('OOS', expectedDelivery.empty);
        });

        it('Case 17', () => {
            cy.updatePharmacy(useCutOff.no, cutOffTime.null, localaDepot.Limerick, cutoffDepot.Ballina, pharmacyId);
            cy.updateUDStockProductStock(1, 0, 0, Cypress.env("item.Id"));

            visitPageOpenCart();
            ShoppingCart.state_OOSShoppingCart(Cypress.env('item.Description'));
            SearchBar.toSearchInTheGlobalSearch(Cypress.env('item.IPUcode'));
            OrderPage.toCheckExpectedDeliberyInTheGrid('OOS', expectedDelivery.empty);
        });

        it('Case 18', () => {
            cy.updatePharmacy(useCutOff.no, cutOffTime.null, localaDepot.Limerick, cutoffDepot.Ballina, pharmacyId);
            cy.updateUDStockProductStock(0, 1, 0, Cypress.env("item.Id"));

            visitPageOpenCart();
            ShoppingCart.checkCartCard(
                wholesaler,
                expectedDelivery.NextDay,
                Cypress.env('item.Description'),
                Cypress.env('item.PackSize'),
                Cypress.env('item.PackType'),
                Cypress.env('item.NetPrice'),
                Cypress.env('item.Discount'))
            SearchBar.toSearchInTheGlobalSearch(Cypress.env('item.IPUcode'));
            OrderPage.toCheckExpectedDeliberyInTheGrid('InStock', expectedDelivery.NextDay.toUpperCase());
        });
    });
    context('Local Depo: Dublin -> Cut-off Depo: Dublin', () => {
        it('Case 19', () => {
            cy.updatePharmacy(useCutOff.yes, cutOffTime.before, localaDepot.Dublin, cutoffDepot.Dublin, pharmacyId);
            cy.updateUDStockProductStock(0, 0, 1, Cypress.env("item.Id"));

            visitPageOpenCart();
            ShoppingCart.state_OOSShoppingCart(Cypress.env('item.Description'));
            SearchBar.toSearchInTheGlobalSearch(Cypress.env('item.IPUcode'));
            OrderPage.toCheckExpectedDeliberyInTheGrid('OOS', expectedDelivery.empty);
        });

        it('Case 20', () => {
            cy.updatePharmacy(useCutOff.yes, cutOffTime.before, localaDepot.Dublin, cutoffDepot.Dublin, pharmacyId);
            cy.updateUDStockProductStock(1, 0, 0, Cypress.env("item.Id"));

            visitPageOpenCart();
            ShoppingCart.state_OOSShoppingCart(Cypress.env('item.Description'));
            SearchBar.toSearchInTheGlobalSearch(Cypress.env('item.IPUcode'));
            OrderPage.toCheckExpectedDeliberyInTheGrid('OOS', expectedDelivery.empty);
        });
        it('Case 21', () => {
            cy.updatePharmacy(useCutOff.yes, cutOffTime.before, localaDepot.Dublin, cutoffDepot.Dublin, pharmacyId);
            cy.updateUDStockProductStock(0, 1, 0, Cypress.env("item.Id"));

            visitPageOpenCart();
            ShoppingCart.checkCartCard(
                wholesaler,
                expectedDelivery.SameDay,
                Cypress.env('item.Description'),
                Cypress.env('item.PackSize'),
                Cypress.env('item.PackType'),
                Cypress.env('item.NetPrice'),
                Cypress.env('item.Discount'))
            SearchBar.toSearchInTheGlobalSearch(Cypress.env('item.IPUcode'));
            OrderPage.toCheckExpectedDeliberyInTheGrid('InStock', expectedDelivery.SameDay.toUpperCase());
        });
        it('Case 22', () => {
            cy.updatePharmacy(useCutOff.yes, cutOffTime.after, localaDepot.Dublin, cutoffDepot.Dublin, pharmacyId);
            cy.updateUDStockProductStock(0, 0, 1, Cypress.env("item.Id"));

            visitPageOpenCart();
            ShoppingCart.state_OOSShoppingCart(Cypress.env('item.Description'));
            SearchBar.toSearchInTheGlobalSearch(Cypress.env('item.IPUcode'));
            OrderPage.toCheckExpectedDeliberyInTheGrid('OOS', expectedDelivery.empty);
        });
        it('Case 23', () => {
            cy.updatePharmacy(useCutOff.yes, cutOffTime.after, localaDepot.Dublin, cutoffDepot.Dublin, pharmacyId);
            cy.updateUDStockProductStock(1, 0, 0, Cypress.env("item.Id"));

            visitPageOpenCart();
            ShoppingCart.state_OOSShoppingCart(Cypress.env('item.Description'));
            SearchBar.toSearchInTheGlobalSearch(Cypress.env('item.IPUcode'));
            OrderPage.toCheckExpectedDeliberyInTheGrid('OOS', expectedDelivery.empty);
        });
        it('Case 24', () => {
            cy.updatePharmacy(useCutOff.yes, cutOffTime.after, localaDepot.Dublin, cutoffDepot.Dublin, pharmacyId);
            cy.updateUDStockProductStock(0, 1, 0, Cypress.env("item.Id"));

            visitPageOpenCart();
            ShoppingCart.checkCartCard(
                wholesaler,
                expectedDelivery.NextDay,
                Cypress.env('item.Description'),
                Cypress.env('item.PackSize'),
                Cypress.env('item.PackType'),
                Cypress.env('item.NetPrice'),
                Cypress.env('item.Discount'))
            SearchBar.toSearchInTheGlobalSearch(Cypress.env('item.IPUcode'));
            OrderPage.toCheckExpectedDeliberyInTheGrid('InStock', expectedDelivery.NextDay.toUpperCase());
        });
        it('Case 25', () => {
            cy.updatePharmacy(useCutOff.no, cutOffTime.null, localaDepot.Dublin, cutoffDepot.Dublin, pharmacyId);
            cy.updateUDStockProductStock(0, 0, 1, Cypress.env("item.Id"));

            visitPageOpenCart();
            ShoppingCart.state_OOSShoppingCart(Cypress.env('item.Description'));
            SearchBar.toSearchInTheGlobalSearch(Cypress.env('item.IPUcode'));
            OrderPage.toCheckExpectedDeliberyInTheGrid('OOS', expectedDelivery.empty);
        });
        it('Case 26', () => {
            cy.updatePharmacy(useCutOff.no, cutOffTime.null, localaDepot.Dublin, cutoffDepot.Dublin, pharmacyId);
            cy.updateUDStockProductStock(1, 0, 0, Cypress.env("item.Id"));

            visitPageOpenCart();
            ShoppingCart.state_OOSShoppingCart(Cypress.env('item.Description'));
            SearchBar.toSearchInTheGlobalSearch(Cypress.env('item.IPUcode'));
            OrderPage.toCheckExpectedDeliberyInTheGrid('OOS', expectedDelivery.empty);
        });
        it('Case 27', () => {
            cy.updatePharmacy(useCutOff.no, cutOffTime.null, localaDepot.Dublin, cutoffDepot.Dublin, pharmacyId);
            cy.updateUDStockProductStock(0, 1, 0, Cypress.env("item.Id"));

            visitPageOpenCart();
            ShoppingCart.checkCartCard(
                wholesaler,
                expectedDelivery.NextDay,
                Cypress.env('item.Description'),
                Cypress.env('item.PackSize'),
                Cypress.env('item.PackType'),
                Cypress.env('item.NetPrice'),
                Cypress.env('item.Discount'))
            SearchBar.toSearchInTheGlobalSearch(Cypress.env('item.IPUcode'));
            OrderPage.toCheckExpectedDeliberyInTheGrid('InStock', expectedDelivery.NextDay.toUpperCase());
        });
    });
    context('Local Depo: Dublin -> Cut-off Depo: Ballina', () => {
        it('Case 28', () => {
            cy.updatePharmacy(useCutOff.yes, cutOffTime.before, localaDepot.Dublin, cutoffDepot.Ballina, pharmacyId);
            cy.updateUDStockProductStock(0, 0, 1, Cypress.env("item.Id"));

            visitPageOpenCart();
            ShoppingCart.state_OOSShoppingCart(Cypress.env('item.Description'));
            SearchBar.toSearchInTheGlobalSearch(Cypress.env('item.IPUcode'));
            OrderPage.toCheckExpectedDeliberyInTheGrid('OOS', expectedDelivery.empty);
        });

        it('Case 29', () => {
            cy.updatePharmacy(useCutOff.yes, cutOffTime.before, localaDepot.Dublin, cutoffDepot.Ballina, pharmacyId);
            cy.updateUDStockProductStock(1, 0, 0, Cypress.env("item.Id"));

            visitPageOpenCart();
            ShoppingCart.checkCartCard(
                wholesaler,
                expectedDelivery.NextDay,
                Cypress.env('item.Description'),
                Cypress.env('item.PackSize'),
                Cypress.env('item.PackType'),
                Cypress.env('item.NetPrice'),
                Cypress.env('item.Discount'))
            SearchBar.toSearchInTheGlobalSearch(Cypress.env('item.IPUcode'));
            OrderPage.toCheckExpectedDeliberyInTheGrid('InStock', expectedDelivery.NextDay.toUpperCase());
        });
        it('Case 30', () => {
            cy.updatePharmacy(useCutOff.yes, cutOffTime.before, localaDepot.Dublin, cutoffDepot.Ballina, pharmacyId);
            cy.updateUDStockProductStock(0, 1, 0, Cypress.env("item.Id"));

            visitPageOpenCart();
            ShoppingCart.checkCartCard(
                wholesaler,
                expectedDelivery.SameDay,
                Cypress.env('item.Description'),
                Cypress.env('item.PackSize'),
                Cypress.env('item.PackType'),
                Cypress.env('item.NetPrice'),
                Cypress.env('item.Discount'))
            SearchBar.toSearchInTheGlobalSearch(Cypress.env('item.IPUcode'));
            OrderPage.toCheckExpectedDeliberyInTheGrid('InStock', expectedDelivery.SameDay.toUpperCase());
        });
        it('Case 31', () => {
            cy.updatePharmacy(useCutOff.yes, cutOffTime.after, localaDepot.Dublin, cutoffDepot.Ballina, pharmacyId);
            cy.updateUDStockProductStock(0, 0, 1, Cypress.env("item.Id"));

            visitPageOpenCart();
            ShoppingCart.state_OOSShoppingCart(Cypress.env('item.Description'));
            SearchBar.toSearchInTheGlobalSearch(Cypress.env('item.IPUcode'));
            OrderPage.toCheckExpectedDeliberyInTheGrid('OOS', expectedDelivery.empty);
        });
        it('Case 32', () => {
            cy.updatePharmacy(useCutOff.yes, cutOffTime.after, localaDepot.Dublin, cutoffDepot.Ballina, pharmacyId);
            cy.updateUDStockProductStock(1, 0, 0, Cypress.env("item.Id"));

            visitPageOpenCart();
            ShoppingCart.checkCartCard(
                wholesaler,
                expectedDelivery.NextDay,
                Cypress.env('item.Description'),
                Cypress.env('item.PackSize'),
                Cypress.env('item.PackType'),
                Cypress.env('item.NetPrice'),
                Cypress.env('item.Discount'))
            SearchBar.toSearchInTheGlobalSearch(Cypress.env('item.IPUcode'));
            OrderPage.toCheckExpectedDeliberyInTheGrid('InStock', expectedDelivery.NextDay.toUpperCase());
        });
        it('Case 33', () => {
            cy.updatePharmacy(useCutOff.yes, cutOffTime.after, localaDepot.Dublin, cutoffDepot.Ballina, pharmacyId);
            cy.updateUDStockProductStock(0, 1, 0, Cypress.env("item.Id"));

            visitPageOpenCart();
            ShoppingCart.state_OOSShoppingCart(Cypress.env('item.Description'));
            SearchBar.toSearchInTheGlobalSearch(Cypress.env('item.IPUcode'));
            OrderPage.toCheckExpectedDeliberyInTheGrid('OOS', expectedDelivery.empty);
        });
        it('Case 34', () => {
            cy.updatePharmacy(useCutOff.no, cutOffTime.null, localaDepot.Dublin, cutoffDepot.Ballina, pharmacyId);
            cy.updateUDStockProductStock(0, 0, 1, Cypress.env("item.Id"));

            visitPageOpenCart();
            ShoppingCart.state_OOSShoppingCart(Cypress.env('item.Description'));
            SearchBar.toSearchInTheGlobalSearch(Cypress.env('item.IPUcode'));
            OrderPage.toCheckExpectedDeliberyInTheGrid('OOS', expectedDelivery.empty);
        });
        it('Case 35', () => {
            cy.updatePharmacy(useCutOff.no, cutOffTime.null, localaDepot.Dublin, cutoffDepot.Ballina, pharmacyId);
            cy.updateUDStockProductStock(1, 0, 0, Cypress.env("item.Id"));

            visitPageOpenCart();
            ShoppingCart.state_OOSShoppingCart(Cypress.env('item.Description'));
            SearchBar.toSearchInTheGlobalSearch(Cypress.env('item.IPUcode'));
            OrderPage.toCheckExpectedDeliberyInTheGrid('OOS', expectedDelivery.empty);
        });
        it('Case 36', () => {
            cy.updatePharmacy(useCutOff.no, cutOffTime.null, localaDepot.Dublin, cutoffDepot.Ballina, pharmacyId);
            cy.updateUDStockProductStock(0, 1, 0, Cypress.env("item.Id"));

            visitPageOpenCart();
            ShoppingCart.checkCartCard(
                wholesaler,
                expectedDelivery.NextDay,
                Cypress.env('item.Description'),
                Cypress.env('item.PackSize'),
                Cypress.env('item.PackType'),
                Cypress.env('item.NetPrice'),
                Cypress.env('item.Discount'))
            SearchBar.toSearchInTheGlobalSearch(Cypress.env('item.IPUcode'));
            OrderPage.toCheckExpectedDeliberyInTheGrid('InStock', expectedDelivery.NextDay.toUpperCase());
        });
    });
});
