import "cypress-map";
import { Wholesalers, headings } from "../../../support/enums";
import { APIRequests } from "../../../page-objects/api-routes";
import { sql } from "../../../services/sqlScriptsService";
import {
  toCheckPricesDiscountsInTheTable,
  toCheckTableHeaders,
} from "../../../services/pharmacySettingsService";

const pharmacyId = Cypress.env("pharmacyId");
const wholesalerId = Wholesalers.UD.Id;

describe("Show UD Prices and Discounts and Show Second Line Prices and Discounts", () => {
  before(() => {
    sql.cleanUpShoppingCart(pharmacyId);
    cy.clearAllCookies();
  });

  beforeEach(() => {
    cy.on("uncaught:exception", (err, runnable) => {
      return false;
    });
    cy.intercept(APIRequests.request._getShoppingCart).as(
      "getShoppingCartItems"
    );
    cy.intercept(APIRequests.request._getPageDataBrokeredEthical + "*").as(
      "pageLoad"
    );
    cy.intercept(APIRequests.request._getPageDataBrokeredOTC + "*").as(
      "pageLoad"
    );
    cy.intercept(APIRequests.request._getPageDataSecondLine + "*").as(
      "pageLoad"
    );
    cy.intercept(APIRequests.request._getPageDataULM + "*").as("pageLoad");
  });

  afterEach(() => {
    cy.signOut();
  });

  after(() => {
    //revert settings
    sql.toUpdatePharmacyPricesDiscounts(1, 1, pharmacyId);
  });

  it('If "Show UD Prices and Discounts" = false and "Show Second Line Prices and Discounts" = false 0:0 | All Pages', () => {
    sql.toUpdatePharmacyPricesDiscounts(0, 0, pharmacyId);
    cy.fixture("main").then((data) => {
      cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
    });

    cy.visitPage("Brokered Ethical");
    toCheckPricesDiscountsInTheTable(
      headings.brokeredEthical,
      "deep",
      wholesalerId
    );

    cy.visitPage("Brokered OTC");
    toCheckPricesDiscountsInTheTable(
      headings.brokeredOTC,
      "deep",
      wholesalerId
    );

    cy.visitPage("Second Line");
    toCheckTableHeaders(headings.secondLine);

    cy.visitPage("ULM");
    toCheckTableHeaders(headings.ulm);
  });

  it('If "Show UD Prices and Discounts" = true and "Show Second Line Prices and Discounts" = false 1:0 | Pages', () => {
    cy.toUpdatePharmacyPricesDiscounts(1, 0, pharmacyId);

    cy.fixture("main").then((data) => {
      cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
    });

    cy.visitPage("Brokered Ethical");
    toCheckPricesDiscountsInTheTable(
      headings.brokeredEthical,
      "not",
      wholesalerId
    );

    cy.visitPage("Brokered OTC");
    toCheckPricesDiscountsInTheTable(headings.brokeredOTC, "not", wholesalerId);

    cy.visitPage("Second Line");
    toCheckTableHeaders(headings.secondLine);

    cy.visitPage("ULM");
    toCheckTableHeaders(headings.ulm);
  });

  it('If "Show UD Prices and Discounts" = true and "Show Second Line Prices and Discounts" = false 1:1 | Pages', () => {
    cy.toUpdatePharmacyPricesDiscounts(1, 1, pharmacyId);

    cy.fixture("main").then((data) => {
      cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
    });

    cy.visitPage("Brokered Ethical");
    toCheckPricesDiscountsInTheTable(
      headings.brokeredEthical,
      "not",
      wholesalerId
    );

    cy.visitPage("Brokered OTC");
    toCheckPricesDiscountsInTheTable(headings.brokeredOTC, "not", wholesalerId);

    cy.visitPage("Second Line");
    toCheckTableHeaders(headings.brokeredEthical);

    cy.visitPage("ULM");
    toCheckTableHeaders(headings.ulm);
  });

  // it('"Show UD Prices and Discounts" and "Show Second Line Prices and Discounts" | Shopping Cart', () => {

  // });
});
