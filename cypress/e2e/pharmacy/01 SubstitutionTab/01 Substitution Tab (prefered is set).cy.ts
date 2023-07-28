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

describe("Substitution Tab states for UD items where preferred is set", () => {
  /*
    
    IMPORTANT NOTES:    
    Tests for the manual run ONLY, not for the CI        
    Before the test, to find the Brokered group with the 1 preferred item for the test Pharmacy
    and next best item(make sure Group is not blocked!)
    Set variables for test: 
            1. preferredId from StockProducts.Id
            2. nextBestId from StockProducts.Id
            3. preferredDescription from StockProducts.Description
            4. nextBestDescription Description from StockProducts.Description
            5. ipuCode: for the Preferred from StockProducts.IpuCode

        fot the future, will be replaced for auto Pre setup
    */
  const pharmacyId = Cypress.env("pharmacyId");
  const preferredId = 27405;
  const preferredDescription =
    "ATORVASTATIN FC  TABS 40MG (ACTAVIS) ATORVASTATIN";
  const nextBestId = 27694;
  const nextBestDescription = "ATORVASTATIN TABS 10MG (PFIZER) ATORVASTATIN";
  const ipuCode = 5099627279192;
  const currentDateTime = dayjs()
    .subtract(2, "hour")
    .format("YYYY-MM-DD HH:mm:ss:SSS");

  before(() => {
    sql.cleanUpShoppingCart(pharmacyId);
    sql.addItemToSubstitutionTab(
      preferredId,
      pharmacyId,
      ipuCode,
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

  after(() => {
    //need to add command, to set Pharmacy settings to default state
  });

  context("Ballina -> Dublin", () => {
    it.only("01.01", () => {
      /*
            +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Preferred InStock  | Preferred InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         NO        |        NO        |        NO        |        YES        |
            +---------------+-------------------+------------------+------------------+-------------------+
            */

      sql.updatePharmacy(
        useCutOff.yes,
        cutOffTime.before,
        localDepot.Ballina,
        cutoffDepot.Dublin,
        pharmacyId
      );
      sql.updateUDStockProductStock(0, 0, 0, preferredId);
      sql.updateUDStockProductStock(0, 1, 0, nextBestId);

      cy.fixture("main").then((data) => {
        cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
      });

      cy.wait("@getShoppingCartItems").then(({ response }) => {
        expect(response.statusCode).to.equal(200);

        SubstitutionTab.state_PreferredToNextBest(
          SubstitutionTab.OOS_OOS_Message(depot.Ballina, depot.Dublin),
          preferredDescription,
          nextBestDescription,
          expectedDelivery.NextDay
        );
      });
    });

    it("01.02", () => {
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
      sql.updateUDStockProductStock(0, 0, 0, preferredId);
      sql.updateUDStockProductStock(0, 0, 0, nextBestId);

      cy.fixture("main").then((data) => {
        cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
      });

      cy.wait("@getShoppingCartItems").then(({ response }) => {
        expect(response.statusCode).to.equal(200);

        SubstitutionTab.state_PreferredNoOrder(
          SubstitutionTab.OOS_OOS_Message(depot.Ballina, depot.Dublin),
          preferredDescription
        );
      });
    });

    it("01.03", () => {
      /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Preferred InStock  | Preferred InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         NO        |        NO        |        YES        |        NO        |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
      sql.updatePharmacy(
        useCutOff.yes,
        cutOffTime.before,
        localDepot.Ballina,
        cutoffDepot.Dublin,
        pharmacyId
      );
      sql.updateUDStockProductStock(0, 0, 0, preferredId);
      sql.updateUDStockProductStock(1, 0, 0, nextBestId);

      cy.fixture("main").then((data) => {
        cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
      });

      cy.wait("@getShoppingCartItems").then(({ response }) => {
        expect(response.statusCode).to.equal(200);

        SubstitutionTab.state_PreferredToNextBest(
          SubstitutionTab.OOS_OOS_Message(depot.Ballina, depot.Dublin),
          preferredDescription,
          nextBestDescription,
          expectedDelivery.SameDay
        );
      });
    });

    it("01.04", () => {
      /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Preferred InStock  | Preferred InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         YES        |        NO        |        NO        |        NO        |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
      sql.updateUDStockProductStock(1, 0, 0, preferredId);
      sql.updateUDStockProductStock(0, 0, 0, nextBestId);
      sql.updatePharmacy(
        useCutOff.yes,
        cutOffTime.before,
        localDepot.Ballina,
        cutoffDepot.Dublin,
        pharmacyId
      );

      cy.fixture("main").then((data) => {
        cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
      });

      cy.wait("@getShoppingCartItems").then(({ response }) => {
        expect(response.statusCode).to.equal(200);

        SubstitutionTab.state_PreferredOrder(
          SubstitutionTab.BackInStock_Message(depot.Ballina),
          preferredDescription,
          expectedDelivery.SameDay
        );
      });
    });

    it("01.05", () => {
      /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Preferred InStock  | Preferred InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         NO        |        YES       |        YES       |        NO         |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
      sql.updateUDStockProductStock(0, 1, 0, preferredId);
      sql.updateUDStockProductStock(1, 0, 0, nextBestId);
      sql.updatePharmacy(
        useCutOff.yes,
        cutOffTime.before,
        localDepot.Ballina,
        cutoffDepot.Dublin,
        pharmacyId
      );

      cy.fixture("main").then((data) => {
        cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
      });

      cy.wait("@getShoppingCartItems").then(({ response }) => {
        expect(response.statusCode).to.equal(200);

        SubstitutionTab.state_SelectOptionPreferredNextBest(
          SubstitutionTab.OOS_BackInStock_Message(depot.Ballina, depot.Dublin),
          preferredDescription,
          nextBestDescription,
          expectedDelivery.NextDay,
          expectedDelivery.SameDay
        );
      });
    });

    it("01.06", () => {
      /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Preferred InStock  | Preferred InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         NO        |        YES       |        NO        |        NO         |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
      sql.updateUDStockProductStock(0, 1, 0, preferredId);
      sql.updateUDStockProductStock(0, 0, 0, nextBestId);
      sql.updatePharmacy(
        useCutOff.yes,
        cutOffTime.before,
        localDepot.Ballina,
        cutoffDepot.Dublin,
        pharmacyId
      );

      cy.fixture("main").then((data) => {
        cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
      });

      cy.wait("@getShoppingCartItems").then(({ response }) => {
        expect(response.statusCode).to.equal(200);

        SubstitutionTab.state_PreferredOrder(
          SubstitutionTab.OOS_BackInStock_Message(depot.Ballina, depot.Dublin),
          preferredDescription,
          expectedDelivery.NextDay
        );
      });
    });

    it("01.07", () => {
      /*
            +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Preferred InStock  | Preferred InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      NO       |                   |        YES       |                  |                   |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
      sql.updateUDStockProductStock(0, 1, 0, preferredId);
      sql.updateUDStockProductStock(0, 0, 0, nextBestId);
      sql.updatePharmacy(
        useCutOff.yes,
        cutOffTime.after,
        localDepot.Ballina,
        cutoffDepot.Dublin,
        pharmacyId
      );

      cy.fixture("main").then((data) => {
        cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
      });

      cy.wait("@getShoppingCartItems").then(({ response }) => {
        expect(response.statusCode).to.equal(200);

        SubstitutionTab.state_PreferredOrder(
          SubstitutionTab.BackInStock_Message(depot.Dublin),
          preferredDescription,
          expectedDelivery.NextDay
        );
      });
    });

    it("01.08", () => {
      /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Preferred InStock  | Preferred InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      NO       |                   |        NO        |                  |        YES        |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
      sql.updateUDStockProductStock(0, 0, 0, preferredId);
      sql.updateUDStockProductStock(0, 1, 0, nextBestId);
      sql.updatePharmacy(
        useCutOff.yes,
        cutOffTime.after,
        localDepot.Ballina,
        cutoffDepot.Dublin,
        pharmacyId
      );

      cy.fixture("main").then((data) => {
        cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
      });

      cy.wait("@getShoppingCartItems").then(({ response }) => {
        expect(response.statusCode).to.equal(200);

        SubstitutionTab.state_PreferredToNextBest(
          SubstitutionTab.OOS_Message(depot.Dublin),
          preferredDescription,
          nextBestDescription,
          expectedDelivery.NextDay
        );
      });
    });

    it("01.09", () => {
      /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Preferred InStock  | Preferred InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      NO       |                   |        NO        |                  |        NO         |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
      sql.updateUDStockProductStock(0, 0, 0, preferredId);
      sql.updateUDStockProductStock(0, 0, 0, nextBestId);
      sql.updatePharmacy(
        useCutOff.yes,
        cutOffTime.after,
        localDepot.Ballina,
        cutoffDepot.Dublin,
        pharmacyId
      );

      cy.fixture("main").then((data) => {
        cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
      });

      cy.wait("@getShoppingCartItems").then(({ response }) => {
        expect(response.statusCode).to.equal(200);

        SubstitutionTab.state_PreferredNoOrder(
          SubstitutionTab.OOS_Message(depot.Dublin),
          preferredDescription
        );
      });
    });
  });

  context("Dublin -> Dublin", () => {
    it("02.01", () => {
      /*
            +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Preferred InStock  | Preferred InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         NO        |        NO        |        NO        |        YES        |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
      sql.updateUDStockProductStock(0, 0, 0, preferredId);
      sql.updateUDStockProductStock(0, 1, 0, nextBestId);
      sql.updatePharmacy(
        useCutOff.yes,
        cutOffTime.before,
        localDepot.Dublin,
        cutoffDepot.Dublin,
        pharmacyId
      );

      cy.fixture("main").then((data) => {
        cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
      });

      cy.wait("@getShoppingCartItems").then(({ response }) => {
        expect(response.statusCode).to.equal(200);

        SubstitutionTab.state_PreferredToNextBest(
          SubstitutionTab.OOS_Message(depot.Dublin),
          preferredDescription,
          nextBestDescription,
          expectedDelivery.SameDay
        );
      });
    });

    it("02.02", () => {
      /*
            +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Preferred InStock  | Preferred InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         NO        |        NO        |        NO        |        NO         |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
      sql.updateUDStockProductStock(0, 0, 0, preferredId);
      sql.updateUDStockProductStock(0, 0, 0, nextBestId);
      sql.updatePharmacy(
        useCutOff.yes,
        cutOffTime.before,
        localDepot.Dublin,
        cutoffDepot.Dublin,
        pharmacyId
      );

      cy.fixture("main").then((data) => {
        cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
      });

      cy.wait("@getShoppingCartItems").then(({ response }) => {
        expect(response.statusCode).to.equal(200);

        SubstitutionTab.state_PreferredNoOrder(
          SubstitutionTab.OOS_Message(depot.Dublin),
          preferredDescription
        );
      });
    });

    it("02.04", () => {
      /*
              +---------------+-------------------+------------------+------------------+-------------------+
             | Before cutOff | Preferred InStock  | Preferred InStock | NextBest InStock | NextBest InStock  |
             |               |       local       |      cutOff      |       local      |       cutOff      |
             +---------------+-------------------+------------------+------------------+-------------------+
             |      YES      |         YES        |        NO        |        NO        |        NO        |
             +---------------+-------------------+------------------+------------------+-------------------+
             */
      sql.updateUDStockProductStock(0, 1, 0, preferredId);
      sql.updateUDStockProductStock(0, 0, 0, nextBestId);
      sql.updatePharmacy(
        useCutOff.yes,
        cutOffTime.before,
        localDepot.Dublin,
        cutoffDepot.Dublin,
        pharmacyId
      );

      cy.fixture("main").then((data) => {
        cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
      });

      cy.wait("@getShoppingCartItems").then(({ response }) => {
        expect(response.statusCode).to.equal(200);

        SubstitutionTab.state_PreferredOrder(
          SubstitutionTab.BackInStock_Message(depot.Dublin),
          preferredDescription,
          expectedDelivery.SameDay
        );
      });
    });

    it("02.07", () => {
      /*
            +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Preferred InStock  | Preferred InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      NO       |                   |        YES       |                  |                   |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
      sql.updateUDStockProductStock(0, 1, 0, preferredId);
      sql.updateUDStockProductStock(0, 0, 0, nextBestId);
      sql.updatePharmacy(
        useCutOff.yes,
        cutOffTime.after,
        localDepot.Dublin,
        cutoffDepot.Dublin,
        pharmacyId
      );

      cy.fixture("main").then((data) => {
        cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
      });

      cy.wait("@getShoppingCartItems").then(({ response }) => {
        expect(response.statusCode).to.equal(200);

        SubstitutionTab.state_PreferredOrder(
          SubstitutionTab.BackInStock_Message(depot.Dublin),
          preferredDescription,
          expectedDelivery.NextDay
        );
      });
    });

    it("02.08", () => {
      /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Preferred InStock  | Preferred InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      NO       |                   |        NO        |                  |        YES        |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
      sql.updateUDStockProductStock(0, 0, 0, preferredId);
      sql.updateUDStockProductStock(0, 1, 0, nextBestId);
      sql.updatePharmacy(
        useCutOff.yes,
        cutOffTime.after,
        localDepot.Dublin,
        cutoffDepot.Dublin,
        pharmacyId
      );

      cy.fixture("main").then((data) => {
        cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
      });

      cy.wait("@getShoppingCartItems").then(({ response }) => {
        expect(response.statusCode).to.equal(200);

        SubstitutionTab.state_PreferredToNextBest(
          SubstitutionTab.OOS_Message(depot.Dublin),
          preferredDescription,
          nextBestDescription,
          expectedDelivery.NextDay
        );
      });
    });

    it("02.09", () => {
      /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Preferred InStock  | Preferred InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      NO       |                   |        NO        |                  |        NO         |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
      sql.updateUDStockProductStock(0, 0, 0, preferredId);
      sql.updateUDStockProductStock(0, 0, 0, nextBestId);
      sql.updatePharmacy(
        useCutOff.yes,
        cutOffTime.after,
        localDepot.Dublin,
        cutoffDepot.Dublin,
        pharmacyId
      );

      cy.fixture("main").then((data) => {
        cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
      });

      cy.wait("@getShoppingCartItems").then(({ response }) => {
        expect(response.statusCode).to.equal(200);

        SubstitutionTab.state_PreferredNoOrder(
          SubstitutionTab.OOS_Message(depot.Dublin),
          preferredDescription
        );
      });
    });
  });

  context("Limerick -> Dublin", () => {
    it("03.01", () => {
      /*
            +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Preferred InStock  | Preferred InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         NO        |        NO        |        NO        |        YES        |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
      sql.updatePharmacy(
        useCutOff.yes,
        cutOffTime.before,
        localDepot.Limerick,
        cutoffDepot.Dublin,
        pharmacyId
      );
      sql.updateUDStockProductStock(0, 0, 0, preferredId);
      sql.updateUDStockProductStock(0, 1, 0, nextBestId);

      cy.fixture("main").then((data) => {
        cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
      });

      cy.wait("@getShoppingCartItems").then(({ response }) => {
        expect(response.statusCode).to.equal(200);

        SubstitutionTab.state_PreferredToNextBest(
          SubstitutionTab.OOS_OOS_Message(depot.Limerick, depot.Dublin),
          preferredDescription,
          nextBestDescription,
          expectedDelivery.NextDay
        );
      });
    });

    it("03.02", () => {
      /*
            +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Preferred InStock  | Preferred InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         NO        |        NO        |        NO        |        NO         |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
      sql.updateUDStockProductStock(0, 0, 0, preferredId);
      sql.updateUDStockProductStock(0, 0, 0, nextBestId);
      sql.updatePharmacy(
        useCutOff.yes,
        cutOffTime.before,
        localDepot.Limerick,
        cutoffDepot.Dublin,
        pharmacyId
      );

      cy.fixture("main").then((data) => {
        cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
      });

      cy.wait("@getShoppingCartItems").then(({ response }) => {
        expect(response.statusCode).to.equal(200);

        SubstitutionTab.state_PreferredNoOrder(
          SubstitutionTab.OOS_OOS_Message(depot.Limerick, depot.Dublin),
          preferredDescription
        );
      });
    });

    it("03.03", () => {
      /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Preferred InStock  | Preferred InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         NO        |        NO        |        YES        |        NO        |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
      sql.updateUDStockProductStock(0, 0, 0, preferredId);
      sql.updateUDStockProductStock(0, 0, 1, nextBestId);
      sql.updatePharmacy(
        useCutOff.yes,
        cutOffTime.before,
        localDepot.Limerick,
        cutoffDepot.Dublin,
        pharmacyId
      );

      cy.fixture("main").then((data) => {
        cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
      });

      cy.wait("@getShoppingCartItems").then(({ response }) => {
        expect(response.statusCode).to.equal(200);

        SubstitutionTab.state_PreferredToNextBest(
          SubstitutionTab.OOS_OOS_Message(depot.Limerick, depot.Dublin),
          preferredDescription,
          nextBestDescription,
          expectedDelivery.SameDay
        );
      });
    });

    it("03.04", () => {
      /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Preferred InStock  | Preferred InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         YES        |        NO        |        NO        |        NO        |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
      sql.updateUDStockProductStock(0, 0, 1, preferredId);
      sql.updateUDStockProductStock(0, 0, 0, nextBestId);
      sql.updatePharmacy(
        useCutOff.yes,
        cutOffTime.before,
        localDepot.Limerick,
        cutoffDepot.Dublin,
        pharmacyId
      );

      cy.fixture("main").then((data) => {
        cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
      });

      cy.wait("@getShoppingCartItems").then(({ response }) => {
        expect(response.statusCode).to.equal(200);

        SubstitutionTab.state_PreferredOrder(
          SubstitutionTab.BackInStock_Message(depot.Limerick),
          preferredDescription,
          expectedDelivery.SameDay
        );
      });
    });

    it("03.05", () => {
      /*
            +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Preferred InStock  | Preferred InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         NO        |        YES       |        YES       |        NO         |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
      sql.updateUDStockProductStock(0, 1, 0, preferredId);
      sql.updateUDStockProductStock(0, 0, 1, nextBestId);
      sql.updatePharmacy(
        useCutOff.yes,
        cutOffTime.before,
        localDepot.Limerick,
        cutoffDepot.Dublin,
        pharmacyId
      );

      cy.fixture("main").then((data) => {
        cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
      });

      cy.wait("@getShoppingCartItems").then(({ response }) => {
        expect(response.statusCode).to.equal(200);

        SubstitutionTab.state_SelectOptionPreferredNextBest(
          SubstitutionTab.OOS_BackInStock_Message(depot.Limerick, depot.Dublin),
          preferredDescription,
          nextBestDescription,
          expectedDelivery.NextDay,
          expectedDelivery.SameDay
        );
      });
    });

    it("03.06", () => {
      /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Preferred InStock  | Preferred InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         NO        |        YES       |        NO        |        NO         |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
      sql.updateUDStockProductStock(0, 1, 0, preferredId);
      sql.updateUDStockProductStock(0, 0, 0, nextBestId);
      sql.updatePharmacy(
        useCutOff.yes,
        cutOffTime.before,
        localDepot.Limerick,
        cutoffDepot.Dublin,
        pharmacyId
      );

      cy.fixture("main").then((data) => {
        cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
      });

      cy.wait("@getShoppingCartItems").then(({ response }) => {
        expect(response.statusCode).to.equal(200);

        SubstitutionTab.state_PreferredOrder(
          SubstitutionTab.OOS_BackInStock_Message(depot.Limerick, depot.Dublin),
          preferredDescription,
          expectedDelivery.NextDay
        );
      });
    });

    it("03.07", () => {
      /*
            +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Preferred InStock  | Preferred InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      NO       |                   |        YES       |                  |                   |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
      sql.updateUDStockProductStock(0, 1, 0, preferredId);
      sql.updateUDStockProductStock(0, 0, 0, nextBestId);
      sql.updatePharmacy(
        useCutOff.yes,
        cutOffTime.after,
        localDepot.Limerick,
        cutoffDepot.Dublin,
        pharmacyId
      );

      cy.fixture("main").then((data) => {
        cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
      });

      cy.wait("@getShoppingCartItems").then(({ response }) => {
        expect(response.statusCode).to.equal(200);

        SubstitutionTab.state_PreferredOrder(
          SubstitutionTab.BackInStock_Message(depot.Dublin),
          preferredDescription,
          expectedDelivery.NextDay
        );
      });
    });

    it("03.08", () => {
      /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Preferred InStock  | Preferred InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      NO       |                   |        NO        |                  |        YES        |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
      sql.updateUDStockProductStock(0, 0, 0, preferredId);
      sql.updateUDStockProductStock(0, 1, 0, nextBestId);
      sql.updatePharmacy(
        useCutOff.yes,
        cutOffTime.after,
        localDepot.Limerick,
        cutoffDepot.Dublin,
        pharmacyId
      );

      cy.fixture("main").then((data) => {
        cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
      });

      cy.wait("@getShoppingCartItems").then(({ response }) => {
        expect(response.statusCode).to.equal(200);

        SubstitutionTab.state_PreferredToNextBest(
          SubstitutionTab.OOS_Message(depot.Dublin),
          preferredDescription,
          nextBestDescription,
          expectedDelivery.NextDay
        );
      });
    });

    it("03.09", () => {
      /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Preferred InStock  | Preferred InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      NO       |                   |        NO        |                  |        NO         |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
      sql.updateUDStockProductStock(0, 0, 0, preferredId);
      sql.updateUDStockProductStock(0, 0, 0, nextBestId);
      sql.updatePharmacy(
        useCutOff.yes,
        cutOffTime.after,
        localDepot.Limerick,
        cutoffDepot.Dublin,
        pharmacyId
      );

      cy.fixture("main").then((data) => {
        cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
      });

      cy.wait("@getShoppingCartItems").then(({ response }) => {
        expect(response.statusCode).to.equal(200);

        SubstitutionTab.state_PreferredNoOrder(
          SubstitutionTab.OOS_Message(depot.Dublin),
          preferredDescription
        );
      });
    });
  });

  context("Ballina -> Ballina", () => {
    it("04.01", () => {
      /*
            +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Preferred InStock  | Preferred InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         NO        |        NO        |        NO        |        YES        |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
      sql.updatePharmacy(
        useCutOff.yes,
        cutOffTime.before,
        localDepot.Ballina,
        cutoffDepot.Ballina,
        pharmacyId
      );
      sql.updateUDStockProductStock(0, 0, 0, preferredId);
      sql.updateUDStockProductStock(1, 0, 0, nextBestId);

      cy.fixture("main").then((data) => {
        cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
      });

      cy.wait("@getShoppingCartItems").then(({ response }) => {
        expect(response.statusCode).to.equal(200);

        SubstitutionTab.state_PreferredToNextBest(
          SubstitutionTab.OOS_Message(depot.Ballina),
          preferredDescription,
          nextBestDescription,
          expectedDelivery.SameDay
        );
      });
    });

    it("04.02", () => {
      /*
            +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Preferred InStock  | Preferred InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         NO        |        NO        |        NO        |        NO         |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
      sql.updateUDStockProductStock(0, 0, 0, preferredId);
      sql.updateUDStockProductStock(0, 0, 0, nextBestId);
      sql.updatePharmacy(
        useCutOff.yes,
        cutOffTime.before,
        localDepot.Ballina,
        cutoffDepot.Ballina,
        pharmacyId
      );

      cy.fixture("main").then((data) => {
        cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
      });

      cy.wait("@getShoppingCartItems").then(({ response }) => {
        expect(response.statusCode).to.equal(200);

        SubstitutionTab.state_PreferredNoOrder(
          SubstitutionTab.OOS_Message(depot.Ballina),
          preferredDescription
        );
      });
    });

    it("04.03", () => {
      /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Preferred InStock  | Preferred InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         NO        |        NO        |        YES        |        NO        |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
      sql.updateUDStockProductStock(0, 0, 0, preferredId);
      sql.updateUDStockProductStock(1, 0, 0, nextBestId);
      sql.updatePharmacy(
        useCutOff.yes,
        cutOffTime.before,
        localDepot.Ballina,
        cutoffDepot.Ballina,
        pharmacyId
      );

      cy.fixture("main").then((data) => {
        cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
      });

      cy.wait("@getShoppingCartItems").then(({ response }) => {
        expect(response.statusCode).to.equal(200);

        SubstitutionTab.state_PreferredToNextBest(
          SubstitutionTab.OOS_Message(depot.Ballina),
          preferredDescription,
          nextBestDescription,
          expectedDelivery.SameDay
        );
      });
    });

    it("04.04", () => {
      /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Preferred InStock  | Preferred InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         YES        |        NO        |        NO        |        NO        |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
      sql.updateUDStockProductStock(1, 0, 0, preferredId);
      sql.updateUDStockProductStock(0, 0, 0, nextBestId);
      sql.updatePharmacy(
        useCutOff.yes,
        cutOffTime.before,
        localDepot.Ballina,
        cutoffDepot.Ballina,
        pharmacyId
      );

      cy.fixture("main").then((data) => {
        cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
      });

      cy.wait("@getShoppingCartItems").then(({ response }) => {
        expect(response.statusCode).to.equal(200);

        SubstitutionTab.state_PreferredOrder(
          SubstitutionTab.BackInStock_Message(depot.Ballina),
          preferredDescription,
          expectedDelivery.SameDay
        );
      });
    });
    it("04.05", () => {
      /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Preferred InStock  | Preferred InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         NO        |        YES       |        YES       |        NO         |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
      sql.updateUDStockProductStock(1, 0, 0, preferredId);
      sql.updateUDStockProductStock(1, 0, 0, nextBestId);
      sql.updatePharmacy(
        useCutOff.yes,
        cutOffTime.before,
        localDepot.Ballina,
        cutoffDepot.Ballina,
        pharmacyId
      );

      cy.fixture("main").then((data) => {
        cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
      });

      cy.wait("@getShoppingCartItems").then(({ response }) => {
        expect(response.statusCode).to.equal(200);

        SubstitutionTab.state_PreferredOrder(
          SubstitutionTab.BackInStock_Message(depot.Ballina),
          preferredDescription,
          expectedDelivery.SameDay
        );
      });
    });

    it("04.06", () => {
      /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Preferred InStock  | Preferred InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         NO        |        YES       |        NO        |        NO         |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
      sql.updateUDStockProductStock(1, 0, 0, preferredId);
      sql.updateUDStockProductStock(0, 0, 0, nextBestId);
      sql.updatePharmacy(
        useCutOff.yes,
        cutOffTime.before,
        localDepot.Ballina,
        cutoffDepot.Ballina,
        pharmacyId
      );

      cy.fixture("main").then((data) => {
        cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
      });

      cy.wait("@getShoppingCartItems").then(({ response }) => {
        expect(response.statusCode).to.equal(200);

        SubstitutionTab.state_PreferredOrder(
          SubstitutionTab.BackInStock_Message(depot.Ballina),
          preferredDescription,
          expectedDelivery.SameDay
        );
      });
    });

    it("04.07", () => {
      /*
            +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Preferred InStock  | Preferred InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      NO       |                   |        YES       |                  |                   |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
      sql.updateUDStockProductStock(1, 0, 0, preferredId);
      sql.updateUDStockProductStock(0, 0, 0, nextBestId);
      sql.updatePharmacy(
        useCutOff.yes,
        cutOffTime.after,
        localDepot.Ballina,
        cutoffDepot.Ballina,
        pharmacyId
      );

      cy.fixture("main").then((data) => {
        cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
      });

      cy.wait("@getShoppingCartItems").then(({ response }) => {
        expect(response.statusCode).to.equal(200);

        SubstitutionTab.state_PreferredOrder(
          SubstitutionTab.BackInStock_Message(depot.Ballina),
          preferredDescription,
          expectedDelivery.NextDay
        );
      });
    });

    it("04.08", () => {
      /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Preferred InStock  | Preferred InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      NO       |                   |        NO        |                  |        YES        |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
      sql.updateUDStockProductStock(0, 0, 0, preferredId);
      sql.updateUDStockProductStock(1, 0, 0, nextBestId);
      sql.updatePharmacy(
        useCutOff.yes,
        cutOffTime.after,
        localDepot.Ballina,
        cutoffDepot.Ballina,
        pharmacyId
      );

      cy.fixture("main").then((data) => {
        cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
      });

      cy.wait("@getShoppingCartItems").then(({ response }) => {
        expect(response.statusCode).to.equal(200);

        SubstitutionTab.state_PreferredToNextBest(
          SubstitutionTab.OOS_Message(depot.Ballina),
          preferredDescription,
          nextBestDescription,
          expectedDelivery.NextDay
        );
      });
    });

    it("04.09", () => {
      /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Preferred InStock  | Preferred InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      NO       |                   |        NO        |                  |        NO         |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
      sql.updateUDStockProductStock(0, 0, 0, preferredId);
      sql.updateUDStockProductStock(0, 0, 0, nextBestId);
      sql.updatePharmacy(
        useCutOff.yes,
        cutOffTime.after,
        localDepot.Ballina,
        cutoffDepot.Ballina,
        pharmacyId
      );

      cy.fixture("main").then((data) => {
        cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
      });

      cy.wait("@getShoppingCartItems").then(({ response }) => {
        expect(response.statusCode).to.equal(200);

        SubstitutionTab.state_PreferredNoOrder(
          SubstitutionTab.OOS_Message(depot.Ballina),
          preferredDescription
        );
      });
    });
  });
  context("Ballina -> Ballina(Dublin)", () => {
    it("05.01", () => {
      /*
            +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Preferred InStock  | Preferred InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         NO        |        NO        |        NO        |        YES        |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
      sql.updatePharmacy(
        useCutOff.yes,
        cutOffTime.before,
        localDepot.Ballina,
        cutoffDepot.Ballina,
        pharmacyId
      );
      sql.updateUDStockProductStock(0, 0, 0, preferredId);
      sql.updateUDStockProductStock(0, 1, 0, nextBestId);

      cy.fixture("main").then((data) => {
        cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
      });

      cy.wait("@getShoppingCartItems").then(({ response }) => {
        expect(response.statusCode).to.equal(200);

        SubstitutionTab.state_PreferredToNextBest(
          SubstitutionTab.OOS_Message(depot.Ballina),
          preferredDescription,
          nextBestDescription,
          expectedDelivery.NextDay
        );
      });
    });
    it("05.05", () => {
      /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Preferred InStock  | Preferred InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         NO        |        YES       |        YES       |        NO         |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
      sql.updateUDStockProductStock(0, 1, 0, preferredId);
      sql.updateUDStockProductStock(1, 0, 0, nextBestId);
      sql.updatePharmacy(
        useCutOff.yes,
        cutOffTime.before,
        localDepot.Ballina,
        cutoffDepot.Ballina,
        pharmacyId
      );

      cy.fixture("main").then((data) => {
        cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
      });

      cy.wait("@getShoppingCartItems").then(({ response }) => {
        expect(response.statusCode).to.equal(200);

        SubstitutionTab.state_SelectOptionPreferredNextBest(
          SubstitutionTab.BackInStock_Message(depot.Ballina),
          preferredDescription,
          nextBestDescription,
          expectedDelivery.NextDay,
          expectedDelivery.SameDay
        );
      });
    });

    it("04.06", () => {
      /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Preferred InStock  | Preferred InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      YES      |         NO        |        YES       |        NO        |        NO         |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
      sql.updateUDStockProductStock(0, 1, 0, preferredId);
      sql.updateUDStockProductStock(0, 0, 0, nextBestId);
      sql.updatePharmacy(
        useCutOff.yes,
        cutOffTime.before,
        localDepot.Ballina,
        cutoffDepot.Ballina,
        pharmacyId
      );

      cy.fixture("main").then((data) => {
        cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
      });

      cy.wait("@getShoppingCartItems").then(({ response }) => {
        expect(response.statusCode).to.equal(200);

        SubstitutionTab.state_PreferredOrder(
          SubstitutionTab.BackInStock_Message(depot.Ballina),
          preferredDescription,
          expectedDelivery.NextDay
        );
      });
    });

    it("04.07", () => {
      /*
            +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Preferred InStock  | Preferred InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      NO       |                   |        YES       |                  |                   |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
      sql.updateUDStockProductStock(0, 1, 0, preferredId);
      sql.updateUDStockProductStock(0, 0, 0, nextBestId);
      sql.updatePharmacy(
        useCutOff.yes,
        cutOffTime.after,
        localDepot.Ballina,
        cutoffDepot.Ballina,
        pharmacyId
      );

      cy.fixture("main").then((data) => {
        cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
      });

      cy.wait("@getShoppingCartItems").then(({ response }) => {
        expect(response.statusCode).to.equal(200);

        SubstitutionTab.state_PreferredOrder(
          SubstitutionTab.BackInStock_Message(depot.Ballina),
          preferredDescription,
          expectedDelivery.NextDay
        );
      });
    });

    it("04.08", () => {
      /*
             +---------------+-------------------+------------------+------------------+-------------------+
            | Before cutOff | Preferred InStock  | Preferred InStock | NextBest InStock | NextBest InStock  |
            |               |       local       |      cutOff      |       local      |       cutOff      |
            +---------------+-------------------+------------------+------------------+-------------------+
            |      NO       |                   |        NO        |                  |        YES        |
            +---------------+-------------------+------------------+------------------+-------------------+
            */
      sql.updateUDStockProductStock(0, 0, 0, preferredId);
      sql.updateUDStockProductStock(0, 1, 0, nextBestId);
      sql.updatePharmacy(
        useCutOff.yes,
        cutOffTime.after,
        localDepot.Ballina,
        cutoffDepot.Ballina,
        pharmacyId
      );

      cy.fixture("main").then((data) => {
        cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
      });

      cy.wait("@getShoppingCartItems").then(({ response }) => {
        expect(response.statusCode).to.equal(200);

        SubstitutionTab.state_PreferredToNextBest(
          SubstitutionTab.OOS_Message(depot.Ballina),
          preferredDescription,
          nextBestDescription,
          expectedDelivery.NextDay
        );
      });
    });
  });
});
