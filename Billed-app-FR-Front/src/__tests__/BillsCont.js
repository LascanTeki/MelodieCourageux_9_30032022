import { screen, fireEvent } from "@testing-library/dom";
import "@testing-library/jest-dom";
import BillsUI from "../views/BillsUI.js";
import Bills from "../containers/Bills.js";
import { bills } from "../fixtures/bills.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import Router from "../app/Router.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";

describe("Given I am connected as an employee", () => {
  describe("Given that the page is loading", () => {
    test("Then it should display loading page", () => {
      const html = BillsUI({ loading: true });
      document.body.innerHTML = html;
      expect(screen.getAllByText("Loading...")).toBeTruthy();
    });
  });
  describe("Given there is an error", () => {
    test("Then it should display loading page", () => {
      const html = BillsUI({ error: true });
      document.body.innerHTML = html;
      expect(screen.getAllByText("Erreur")).toBeTruthy();
    });
  });
  describe("Given that I am on Bills Page", () => {
    beforeEach(() => {
      Object.defineProperty(screen, "localStorage", {
        value: localStorageMock,
      });
      screen.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
          email: "johndoe@email.com",
          password: "azerty",
          status: "connected",
        })
      );
    });
    test("Then it should display the bills page", () => {
      const html = BillsUI({ data: bills });
      document.body.innerHTML = html;

      expect(screen.getByText("Mes notes de frais")).toBeTruthy;
    });
    test("Then bill icon in vertical layout should be highlighted", () => {
      document.body.innerHTML = '<div id="root"></div>';
      const mockBills = jest.fn(() => {
        return {
          get: jest.fn().mockResolvedValue(bills),
        };
      });
      firestore.bills = mockBills;
      Router();
      screen.onNavigate(ROUTES_PATH["Bills"]);
      const icon = screen.getByTestId("icon-window");
      expect(icon).toHaveClass("active-icon");
    });
    test("Then bills should be ordered from earliest to latest", () => {
      const html = BillsUI({ data: bills });
      document.body.innerHTML = html;
      const dates = screen
        .getAllByText(
          /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
        )
        .map(a => a.innerHTML);
      const antiChrono = (a, b) => (a < b ? 1 : -1);
      const datesSorted = [...dates].sort(antiChrono);
      expect(dates).toEqual(datesSorted);
    });
    describe("When i click on the new bill button", () => {
      test("Then it should open the new bill page", () => {
        const html = BillsUI({ data: bills });
        document.body.innerHTML = html;

        const onNavigate = pathname => {
          document.body.innerHTML = ROUTES({ pathname });
        };

        const bill = new Bills({
          document,
          onNavigate,
          localStorage: screen.localStorage,
          firestore: null,
        });

        const button = screen.getByTestId("btn-new-bill");
        const handleClickNewBill = jest.fn(bill.handleClickNewBill);
        button.addEventListener("click", handleClickNewBill);
        fireEvent.click(button);
        expect(handleClickNewBill).toHaveBeenCalled();
        expect(screen.getAllByText("Envoyer une note de frais")).toBeTruthy();
      });
    });
    describe("When i click on the eye icon", () => {
      test("It should open the modal", () => {
        const html = BillsUI({ data: bills });
        document.body.innerHTML = html;

        const bill = new Bills({
          document,
          onNavigate: null,
          localStorage: screen.localStorage,
          firestore: null,
        });

        $.fn.modal = jest.fn();

        const iconEye = screen.getAllByTestId("icon-eye");
        const handleClickIconEye = jest.fn(bill.handleClickIconEye);

        iconEye.forEach(icon => {
          icon.addEventListener("click", handleClickIconEye(icon));
          fireEvent.click(icon);
          expect(handleClickIconEye).toHaveBeenCalled();
          const modalWindow = document.getElementById("modaleFile");
          expect(modalWindow).toBeTruthy();
        });
      });
    });
    describe("When i click the disconnect button", () => {
      test("It should return to the login page", () => {
        const html = BillsUI({ data: bills });
        document.body.innerHTML = html;

        const onNavigate = pathname => {
          const html = ROUTES({ pathname, data: [] });
          document.body.innerHTML = html;
        };

        const bill = new Bills({
          document,
          localStorage: screen.localStorage,
          onNavigate,
          firestore: null,
        });

        const button = screen.getByTestId("icon-disconnect");
        fireEvent.click(button);

        const form = screen.getByTestId("form-employee");
        expect(form).toBeTruthy();
      });
    });
  });
});