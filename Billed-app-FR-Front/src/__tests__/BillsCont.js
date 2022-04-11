/**
 * @jest-environment jsdom
 */
import { screen, waitFor } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import '@testing-library/jest-dom';
import router from "../app/Router.js";
import userEvent from '@testing-library/user-event'
import { handleClickIconEye } from "../containers/Bills.js"
import store from "../app/Store.js"
import '@testing-library/jest-dom';
jest.mock('../containers/Bills.js');
import Logout from "./Logout.js"



describe("If I click on the New Bill button", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
            type: 'Employee'
        }))
        const root = document.createElement("div")
        root.setAttribute("id", "root")
        document.body.append(root)
        router()
        document.body.innerHTML = BillsUI({ data: bills })

    })
    test("Then the NewBill page should load", () => {

    })
})
describe("If I click on the eye Icon", () => {
    test('Then it should display the modal', () => {
        let container = screen.getByTestId('cont')
        const mockFn = jest.fn();
        mockFn();
        expect(mockFn).toHaveBeenCalled();
        let eye = container.querySelector('#eye')
        console.log(eye.outerHTML);
        jest.mock(handleClickIconEye(eye))
        expect(handleClickIconEye).toHaveBeenCalled();
        let modal = screen.getByTestId('modaleFile')
        setTimeout(() => {
            expect(modal).toHaveClass(`modal fade show`)} , 1500);
        
    })
})