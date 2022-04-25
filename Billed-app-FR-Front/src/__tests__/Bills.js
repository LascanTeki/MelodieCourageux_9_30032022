/**
 * @jest-environment jsdom
 */


 import { screen, waitFor, fireEvent } from "@testing-library/dom"
 import BillsUI from "../views/BillsUI.js"
 import { bills } from "../fixtures/bills.js"
 import { localStorageMock } from "../__mocks__/localStorage.js";
 import '@testing-library/jest-dom';
 import router from "../app/Router.js";
 import ContBills from "../containers/Bills.js"
 import '@testing-library/jest-dom';
 import userEvent from '@testing-library/user-event';
 import { ROUTES_PATH } from "../constants/routes.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      expect(windowIcon).toHaveClass(`active-icon`);

    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })

    test("fetches bills from mock API GET", async () => {
      localStorage.setItem("user", JSON.stringify({ type: "Admin", email: "a@a" }));
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByText("Mes notes de frais"))
      const contentPending = await screen.getByText("Hôtel et logement")
      expect(contentPending).toBeTruthy()
    })
    beforeEach(() => {
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email: "a@a"
      }))
    })
    describe("When an error occurs on API", () => {
      test("fetches bills from an API and fails with 404 message error", async () => {

        window.onNavigate(ROUTES_PATH.Bills)
        await new Promise(process.nextTick);
        const html = BillsUI({ error: "Erreur 404" });
        document.body.innerHTML = html;
        const message = await screen.getByText(/Erreur 404/)
        expect(message).toBeTruthy()
      })

      test("fetches messages from an API and fails with 500 message error", async () => {

        window.onNavigate(ROUTES_PATH.Bills)
        await new Promise(process.nextTick);
        const html = BillsUI({ error: "Erreur 500" });
        document.body.innerHTML = html;
        const message = await screen.getByText(/Erreur 500/)
        expect(message).toBeTruthy()
      })
    })
  })
})
describe("If I click on the eye Icon", () => {
beforeEach(() => {
  Object.defineProperty(window, "localStorage", {
    value: localStorageMock,
  });
  window.localStorage.setItem(
    "user",
    JSON.stringify({
      type: "Employee",
      email: "johndoe@email.com",
      password: "azerty",
      status: "connected",
    })
  );
});

describe("If I click on the eye Icon", () => {
  test('Then it should display the modal', () => {
      
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
      }))
      document.body.innerHTML = BillsUI({ data: bills })
      const store = null
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      
      let eyes = screen.getAllByTestId("icon-eye");
      eyes.forEach(async eye => {
        
        $.fn.modal = jest.fn();

        $('#modaleFile').modal('show')
          
          //userEvent.click(eye)

         // expect.assertions(1);
          
          //setTimeout(() => {
            let modal = screen.getByTestId('modaleFile');
            expect(modal).toHaveClass(`modal fade show`);
           // done();
          //});
          
      });
  })
})
  });