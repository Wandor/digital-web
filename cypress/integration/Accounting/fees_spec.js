/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars
import { faker } from '@faker-js/faker';

const BASE_URL = 'http://localhost:3000';
const BACKEND_URL = 'http://localhost:8000';

describe('Fees end to end test', () => {
  it('User can create fee', () => {
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
    cy.visit(`${BASE_URL}/app/fees`);
    cy.wait(2000);

    // fee information
    cy.findByRole('button', { name: /new fee/i }).click();
    cy.get('#name').type(`test ${faker.random.word()}`);
    cy.get('#category').select('Savings');
    cy.get('#feeRecoveryMethod').select('Upfront');
    cy.get('#feeRecoveryAccount').select('Savings Account');
    cy.findByText(/enable fee/i).click();
    cy.findByRole('button', { name: /next/i }).click();

    // Graduated scale
    cy.get('#lowerLimit').type('100');
    cy.get('#upperLimit').type('200');
    cy.get('#chargeType').select('Percentage');
    cy.get('#value').type('10');
    cy.findByRole('button', { name: /add another/i }).click();
    cy.findByRole('button', { name: /next/i }).click();

    // fee splits
    cy.get('#chartOfAccount').type('LOAN').findByText('LOAN').click();
    cy.get('#feeSplitName').type('FeeSplit Test');
    cy.get('#percentage').type('100');
    cy.findByRole('button', { name: /add another/i }).click();
    cy.findByRole('button', { name: /next/i }).click();

    // confirm and save
    cy.findByRole('button', { name: /save/i }).click();

    cy.url().should('contain', '/app/fees');
  });

  it('User can view fee', () => {
    cy.visit(`${BASE_URL}/app/fees`);
    cy.wait(2000);
    cy.get(`#root > div > div:nth-child(2) > div:nth-child(2) > div > div >
    div:nth-child(2) > div > div > div > table > tbody > tr:nth-child(1) >
    td:nth-child(6) > div > button:nth-child(1) > span:nth-child(1) > svg > path`).click({ force: true });
    cy.url().should('contain', '/app/view-fee/');
    cy.findByRole('button', { name: /next/i }).click();
    cy.findByRole('button', { name: /next/i }).click();
    cy.findByRole('button', { name: /next/i }).click();
    cy.findByRole('button', { name: /cancel/i }).click();
    cy.url().should('contain', '/app/fees');
  });

  it('User can Edit fee', () => {
    cy.visit(`${BASE_URL}/app/fees`);
    cy.wait(2000);
    cy.get(`#root > div > div:nth-child(2) > div:nth-child(2) > div > div > 
    div:nth-child(2) > div > div > div > table > tbody > tr:nth-child(1) > 
    td:nth-child(6) > div > button:nth-child(2) > span:nth-child(1) > svg`).click({ force: true });
    cy.url().should('contain', '/app/edit-fee/');
    cy.get('#name').clear().type(`test ${faker.random.word()}`);
    cy.findByRole('button', { name: /next/i }).click();
    cy.findByRole('button', { name: /next/i }).click();
    cy.findByRole('button', { name: /next/i }).click();
    cy.findByRole('button', { name: /update/i }).click();
    cy.url().should('contain', '/app/fees');
  });

  it('User can change fee status', () => {
    cy.visit(`${BASE_URL}/app/fees`);
    cy.wait(2000);
    cy.get(`#root > div > div:nth-child(2) > div:nth-child(2) > div > div >
     div:nth-child(2) > div > div > div > table > tbody > tr:nth-child(1) > 
     td:nth-child(6) > div > button:nth-child(3) > span:nth-child(1) > svg`).click({ force: true });
    cy.wait(1000);
    cy.findByRole('link', { name: /proceed!/i }).click();
    cy.url().should('contain', '/app/fees');
  });
});
