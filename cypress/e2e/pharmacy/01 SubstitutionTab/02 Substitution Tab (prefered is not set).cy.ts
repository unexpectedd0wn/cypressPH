const dayjs = require("dayjs");
import { APIRequests } from "../../../page-objects/api-routes";
import { SubstitutionTab } from "../../../page-objects/substitution-tab";
import {
  expectedDelivery,
  depot,
  cutOffTime,
  useCutOff,
  localDepot,
  cutoffDepot,
} from "../../../support/enums";
import { sql } from "../../../services/sqlScriptsService";

describe("Substitution Tab state checks when no Preferred set in the Brokered group", () => {
  /*
    VERY IMPORTANT NOTES:    
    Tests for the manual run ONLY, not for the CI        
    Before the test, to find the Brokered group with the 2 items BestPrice product and nextBestPrice product
    and in the group should not be set preferred item for the test Pharmacy
    and make sure Group is not blocked
    
    Set variables for test: 
            1. preferredId from StockProducts.Id
            2. nextBestId from StockProducts.Id
            3. preferredDescription from StockProducts.Description
            4. nextBestDescription Description from StockProducts.Description
            5. ipuCode: for the Preferred from StockProducts.IpuCode
    */

  const pharmacyId = Cypress.env("pharmacyId");
  const OrderedId = 27405;
  const OrderedDescription =
    "ATORVASTATIN FC  TABS 40MG (ACTAVIS) ATORVASTATIN";
  const bestPriceItemId = 27694;
  const bestPriceItemDescription =
    "ATORVASTATIN TABS 10MG (PFIZER) ATORVASTATIN";
  const orderedIPUcode = 5099627279192;
  const currentDateTime = dayjs().format("YYYY-MM-DD HH:mm:ss:SSS");

  before(() => {
    sql.cleanUpShoppingCart(pharmacyId);
    sql.addItemToSubstitutionTab(
      OrderedId,
      pharmacyId,
      orderedIPUcode,
      currentDateTime
    );
    cy.clearAllCookies();
  });
  beforeEach(() => {
    cy.intercept(APIRequests.request._getShoppingCart).as(
      "getShoppingCartItems"
    );
  });

  afterEach(() => {
    cy.screenshot();
    cy.signOut();
    cy.clearAllCookies();
  });

  context("Ballina -> Dublin", () => {
    it("06.01", () => {
      /*
            +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Preferred InStock  | Preferred InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         NO        |        NO        |        NO        |        NO         |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
      sql.updatePharmacy(
        useCutOff.yes,
        cutOffTime.before,
        localDepot.Ballina,
        cutoffDepot.Dublin,
        pharmacyId
      );
      sql.updateUDStockProductStock(0, 0, 0, OrderedId);
      sql.updateUDStockProductStock(0, 0, 0, bestPriceItemId);

      cy.fixture("main").then((data) => {
        cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
      });

      cy.wait("@getShoppingCartItems").then(({ response }) => {
        expect(response.statusCode).to.equal(200);

        SubstitutionTab.state_PreferredNoOrder(
          SubstitutionTab.OOS_OOS_Message(depot.Ballina, depot.Dublin),
          OrderedDescription
        );
      });
    });

    it("06.02", () => {
      /*
            +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Preferred InStock  | Preferred InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |        YES        |       YES        |       YES        |       YES         |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
      sql.updatePharmacy(
        useCutOff.yes,
        cutOffTime.before,
        localDepot.Ballina,
        cutoffDepot.Dublin,
        pharmacyId
      );
      sql.updateUDStockProductStock(1, 1, 0, OrderedId);
      sql.updateUDStockProductStock(1, 1, 0, bestPriceItemId);

      cy.fixture("main").then((data) => {
        cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
      });

      cy.wait("@getShoppingCartItems").then(({ response }) => {
        expect(response.statusCode).to.equal(200);

        SubstitutionTab.state_PreferredOrder(
          SubstitutionTab.BackInStock_Message(depot.Ballina),
          bestPriceItemDescription,
          expectedDelivery.SameDay
        );
      });
    });

    it("06.03", () => {
      /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Preferred InStock  | Preferred InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         YES       |        NO        |        YES        |        NO        |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
      sql.updatePharmacy(
        useCutOff.yes,
        cutOffTime.before,
        localDepot.Ballina,
        cutoffDepot.Dublin,
        pharmacyId
      );
      sql.updateUDStockProductStock(1, 0, 0, OrderedId);
      sql.updateUDStockProductStock(1, 0, 0, bestPriceItemId);

      cy.fixture("main").then((data) => {
        cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
      });

      cy.wait("@getShoppingCartItems").then(({ response }) => {
        expect(response.statusCode).to.equal(200);

        SubstitutionTab.state_PreferredOrder(
          SubstitutionTab.BackInStock_Message(depot.Ballina),
          bestPriceItemDescription,
          expectedDelivery.SameDay
        );
      });
    });

    it("06.04", () => {
      /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Preferred InStock  | Preferred InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         NO        |        YES       |        NO        |        YES        |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
      sql.updatePharmacy(
        useCutOff.yes,
        cutOffTime.before,
        localDepot.Ballina,
        cutoffDepot.Dublin,
        pharmacyId
      );
      sql.updateUDStockProductStock(0, 1, 0, OrderedId);
      sql.updateUDStockProductStock(0, 1, 0, bestPriceItemId);

      cy.fixture("main").then((data) => {
        cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
      });

      cy.wait("@getShoppingCartItems").then(({ response }) => {
        expect(response.statusCode).to.equal(200);

        SubstitutionTab.state_PreferredOrder(
          SubstitutionTab.OOS_BackInStock_Message(depot.Ballina, depot.Dublin),
          bestPriceItemDescription,
          expectedDelivery.NextDay
        );
      });
    });

    it("06.05", () => {
      /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Preferred InStock  | Preferred InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      NO       |         YES       |        YES       |        YES       |        YES        |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
      sql.updatePharmacy(
        useCutOff.yes,
        cutOffTime.after,
        localDepot.Ballina,
        cutoffDepot.Dublin,
        pharmacyId
      );
      sql.updateUDStockProductStock(1, 1, 0, OrderedId);
      sql.updateUDStockProductStock(1, 1, 0, bestPriceItemId);

      cy.fixture("main").then((data) => {
        cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
      });

      cy.wait("@getShoppingCartItems").then(({ response }) => {
        expect(response.statusCode).to.equal(200);

        SubstitutionTab.state_PreferredOrder(
          SubstitutionTab.BackInStock_Message(depot.Dublin),
          bestPriceItemDescription,
          expectedDelivery.NextDay
        );
      });
    });

    it("06.06", () => {
      /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Preferred InStock  | Preferred InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      NO       |         NO        |        YES       |        NO        |        YES        |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
      sql.updatePharmacy(
        useCutOff.yes,
        cutOffTime.after,
        localDepot.Ballina,
        cutoffDepot.Dublin,
        pharmacyId
      );
      sql.updateUDStockProductStock(0, 1, 0, OrderedId);
      sql.updateUDStockProductStock(0, 1, 0, bestPriceItemId);

      cy.fixture("main").then((data) => {
        cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
      });

      cy.wait("@getShoppingCartItems").then(({ response }) => {
        expect(response.statusCode).to.equal(200);

        SubstitutionTab.state_PreferredOrder(
          SubstitutionTab.BackInStock_Message(depot.Dublin),
          bestPriceItemDescription,
          expectedDelivery.NextDay
        );
      });
    });

    it("06.07", () => {
      /*
            +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Preferred InStock  | Preferred InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      NO       |         NO        |        NO        |        NO        |       NO          |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
      sql.updatePharmacy(
        useCutOff.yes,
        cutOffTime.after,
        localDepot.Ballina,
        cutoffDepot.Dublin,
        pharmacyId
      );
      sql.updateUDStockProductStock(0, 0, 0, OrderedId);
      sql.updateUDStockProductStock(0, 0, 0, bestPriceItemId);

      cy.fixture("main").then((data) => {
        cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
      });

      cy.wait("@getShoppingCartItems").then(({ response }) => {
        expect(response.statusCode).to.equal(200);

        SubstitutionTab.state_PreferredNoOrder(
          SubstitutionTab.OOS_Message(depot.Dublin),
          OrderedDescription
        );
      });
    });
  });

  context("Dublin -> Dublin", () => {
    it("07.01", () => {
      /*
            +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Preferred InStock  | Preferred InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         NO        |        NO        |        NO        |        NO         |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
      sql.updatePharmacy(
        useCutOff.yes,
        cutOffTime.before,
        localDepot.Dublin,
        cutoffDepot.Dublin,
        pharmacyId
      );
      sql.updateUDStockProductStock(0, 0, 0, OrderedId);
      sql.updateUDStockProductStock(0, 0, 0, bestPriceItemId);

      cy.fixture("main").then((data) => {
        cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
      });

      cy.wait("@getShoppingCartItems").then(({ response }) => {
        expect(response.statusCode).to.equal(200);

        SubstitutionTab.state_PreferredNoOrder(
          SubstitutionTab.OOS_Message(depot.Dublin),
          OrderedDescription
        );
      });
    });

    it("07.02", () => {
      /*
            +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Preferred InStock  | Preferred InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |        YES        |       YES        |       YES        |       YES         |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
      sql.updatePharmacy(
        useCutOff.yes,
        cutOffTime.before,
        localDepot.Dublin,
        cutoffDepot.Dublin,
        pharmacyId
      );
      sql.updateUDStockProductStock(0, 1, 0, OrderedId);
      sql.updateUDStockProductStock(0, 1, 0, bestPriceItemId);

      cy.fixture("main").then((data) => {
        cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
      });

      cy.wait("@getShoppingCartItems").then(({ response }) => {
        expect(response.statusCode).to.equal(200);

        SubstitutionTab.state_PreferredOrder(
          SubstitutionTab.BackInStock_Message(depot.Dublin),
          bestPriceItemDescription,
          expectedDelivery.SameDay
        );
      });
    });

    it("07.05", () => {
      /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Preferred InStock  | Preferred InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      NO       |         YES       |        YES       |        YES       |        YES        |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
      sql.updatePharmacy(
        useCutOff.yes,
        cutOffTime.after,
        localDepot.Dublin,
        cutoffDepot.Dublin,
        pharmacyId
      );
      sql.updateUDStockProductStock(0, 1, 0, OrderedId);
      sql.updateUDStockProductStock(0, 1, 0, bestPriceItemId);

      cy.fixture("main").then((data) => {
        cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
      });

      cy.wait("@getShoppingCartItems").then(({ response }) => {
        expect(response.statusCode).to.equal(200);

        SubstitutionTab.state_PreferredOrder(
          SubstitutionTab.BackInStock_Message(depot.Dublin),
          bestPriceItemDescription,
          expectedDelivery.NextDay
        );
      });
    });

    it("07.07", () => {
      /*
            +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Preferred InStock  | Preferred InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      NO       |         NO        |        NO        |        NO        |       NO          |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
      sql.updatePharmacy(
        useCutOff.yes,
        cutOffTime.after,
        localDepot.Dublin,
        cutoffDepot.Dublin,
        pharmacyId
      );
      sql.updateUDStockProductStock(0, 0, 0, OrderedId);
      sql.updateUDStockProductStock(0, 0, 0, bestPriceItemId);

      cy.fixture("main").then((data) => {
        cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
      });

      cy.wait("@getShoppingCartItems").then(({ response }) => {
        expect(response.statusCode).to.equal(200);

        SubstitutionTab.state_PreferredNoOrder(
          SubstitutionTab.OOS_Message(depot.Dublin),
          OrderedDescription
        );
      });
    });
  });
});
