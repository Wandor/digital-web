/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars
import { faker } from '@faker-js/faker';

const BASE_URL = 'http://localhost:3000';
const BACKEND_URL = 'http://localhost:8000';

describe('Loan Products end to end test', () => {
  it('User Can Create Loan Products', () => {
    /* User logs in */
    cy.visit(`${BASE_URL}`);
    cy.findByRole('textbox', { name: /email address/i }).type('raphael.opiyo@opentechglobal.co.ke');
    cy.findByLabelText(/password/i).type('Kenya.2021!');
    cy.findByRole('button', { name: /sign in/i }).click();
    cy.intercept(
      {
        method: 'GET',
        url: `${BACKEND_URL}/api/v1/users/email/${Buffer.from('raphael.opiyo@opentechglobal.co.ke').toString('base64')}`,
      },
    ).as('getUserData');
    cy.wait(['@getUserData']);
    cy.visit(`${BASE_URL}/app/loan-products`);
    cy.wait(2000);

    // loan product details
    cy.findByRole('button', { name: /new loan product/i }).click();
    cy.get('#name').type(`test ${faker.random.word()}`);
    cy.get('#GLAccount').type('LOAN').findByText('LOAN').click();
    cy.get('#interestGLAccount').type('LOAN').findByText('LOAN').click();
    cy.get('#interestCalculationMethod').select('Reducing Balance');
    cy.get('#paymentFrequency').select('Monthly');
    cy.get('#minimumGuarantors').type('5');
    cy.get('#maximumTerm').type('20');
    cy.get('#minimumTerm').type('10');
    cy.get('#gracePeriod').type('10');
    cy.findByText(/accept prepayment/i).click();
    cy.findByText(/loan secured/i).click();
    cy.findByText(/is enabled/i).click();
    cy.findByRole('button', { name: /next/i }).click();

    // Graduated scale
    cy.get('#minimumAmount').type('200');
    cy.get('#maximumAmount').type('1000');
    cy.get('#interestRateChargeType').select('Percentage');
    cy.get('#interestRateValue').type('8');
    cy.get('#accrueFrequency').select('Monthly');
    cy.findByRole('button', { name: /add another/i }).click();
    cy.findByRole('button', { name: /next/i }).click();

    // Fees and penalties
    cy.get('#selectedFees > div:nth-child(1)');
    cy.get('#selectedPenalties').click();
    cy.findByRole('button', { name: /next/i }).click();

    // confirm and save
    cy.findByRole('button', { name: /save/i }).click();

    cy.url().should('contain', '/app/loan-products');
  });

  it('User Can View Savings Product', () => {
    cy.visit(`${BASE_URL}/app/loan-products`);
    cy.wait(2000);
    cy.get(`#root > div > div:nth-child(2) > div:nth-child(2) > div > div > 
    div:nth-child(2) > div > div > div > table > tbody > tr:nth-child(1) > 
    td:nth-child(11) > div > button:nth-child(1) > span:nth-child(1) > svg`).click({ force: true });
    cy.url().should('contain', '/app/view-loan-product/');
    cy.findByRole('button', { name: /next/i }).click();
    cy.findByRole('button', { name: /next/i }).click();
    cy.findByRole('button', { name: /next/i }).click();
    cy.findByRole('button', { name: /cancel/i }).click();
    cy.url().should('contain', '/app/loan-products');
  });

  it('User Can Edit Savings Product', () => {
    cy.visit(`${BASE_URL}/app/loan-products`);
    cy.wait(2000);
    cy.get(`#root > div > div:nth-child(2) > div:nth-child(2) > div > div > 
    div:nth-child(2) > div > div > div > table > tbody > tr:nth-child(1) > 
    td:nth-child(11) > div > button:nth-child(2) > span:nth-child(1) > svg`).click({ force: true });
    cy.url().should('contain', '/app/edit-loan-product/');
    cy.get('#name').clear().type(`test ${faker.random.word()}`);
    cy.findByRole('button', { name: /next/i }).click();
    cy.findByRole('button', { name: /next/i }).click();
    cy.findByRole('button', { name: /next/i }).click();
    cy.findByRole('button', { name: /update/i }).click();
    cy.url().should('contain', '/app/loan-products');
  });

  it('User Can Change Savings Product Status', () => {
    cy.visit(`${BASE_URL}/app/loan-products`);
    cy.wait(2000);
    cy.get(`#root > div > div:nth-child(2) > div:nth-child(2) > div > div > 
    div:nth-child(2) > div > div > div > table > tbody > tr:nth-child(1) > 
    td:nth-child(11) > div > button:nth-child(3) > span:nth-child(1) > svg`).click({ force: true });
    cy.wait(1000);
    cy.findByRole('link', { name: /proceed!/i }).click();
    cy.url().should('contain', '/app/loan-products');
  });
});
