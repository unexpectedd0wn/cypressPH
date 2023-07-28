import { APIRequests } from "../../../page-objects/api-routes";
import { Wholesalers } from "../../../support/enums";
import {
  toCheckResponseIsUDOnly,
  checkNoPIitemsOnThePages,
} from "../../../services/pharmacySettingsService";
import { sql } from "../../../services/sqlScriptsService";

const pharmacyId = Cypress.env("pharmacyId");

interface TestCase {
  page: string;
  wholesaler: string;
}

const testCase: TestCase[] = [
  { page: "Brokered Ethical", wholesaler: Wholesalers.UD.Name },
  { page: "Brokered OTC", wholesaler: Wholesalers.UD.Name },
  { page: "Second Line", wholesaler: Wholesalers.UD.Name },
  { page: "ULM", wholesaler: Wholesalers.UD.secondName }, //On the ULM page no UD items, but system shows ELEMENTS items, which is originaly UD
];

describe("Use parallels = false on the pages", () => {
  before(() => {
    sql.cleanUpShoppingCart(pharmacyId);
    sql.updatePharmacySetUseGreys(0, pharmacyId);
  });

  beforeEach(() => {
    cy.on("uncaught:exception", (err, runnable) => {
      return false;
    });

    cy.intercept("/api/stock-product/products?skip=" + "*").as("pageLoads");
    cy.intercept(APIRequests.request._filter_wholesaler + "*").as("pageLoaded");

    cy.fixture("main").then((data) => {
      cy.signInCreateSession(data.pharmacyUserEmail, data.pharmacyUserPassword);
    });
  });

  after(() => {
    //Retrieve the Pharmacy settings
    sql.updatePharmacySetUseGreys(1, pharmacyId);
  });

  for (const { page, wholesaler } of testCase) {
    it("Use Parallels = false | Items on the pages", () => {
      cy.visitPage(page);
      toCheckResponseIsUDOnly(wholesaler);
    });

    it("Use Parallels = false | Filter apply", () => {
      cy.visitPage(page);
      checkNoPIitemsOnThePages();
    });
  }
});
