/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars
import { faker } from '@faker-js/faker';

const BASE_URL = 'http://localhost:3000';
const BACKEND_URL = 'http://localhost:8000';

describe('GL Account Mapping End To End Test', () => {
  it('User Can Create GL Account Mapping', () => {
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
    cy.visit(`${BASE_URL}/app/gl-mappings`);
    cy.wait(2000);

    cy.findByRole('button', { name: /create gl mapping/i }).click();
    cy.get('#systemTransactionCode').select('Mpesa Disbursement');
    cy.get('#chartOfAccount').type('LOAN').findByText('LOAN').click();
    cy.findByRole('button', { name: /save/i }).click();
    // cy.url().should('contain', '/app/gl-mappings');
  });

  it('User Can View GL Account Mapping', () => {
    cy.visit(`${BASE_URL}/app/gl-mappings`);
    cy.wait(2000);
    cy.get(`#root > div > div:nth-child(2) > div:nth-child(2) > div > div > 
    div:nth-child(2) > div > div > div > table > tbody > tr:nth-child(1) > 
    td:nth-child(4) > div > button:nth-child(1) > span:nth-child(1) > svg`).click({ force: true });
    cy.url().should('contain', '/app/view-gl-mapping/');
    cy.findByRole('button', { name: /cancel/i }).click();
    cy.url().should('contain', '/app/gl-mappings');
  });

  it('User Can Edit GL Account Mapping', () => {
    cy.visit(`${BASE_URL}/app/gl-mappings`);
    cy.wait(2000);
    cy.get(`#root > div > div:nth-child(2) > div:nth-child(2) > div > div > 
    div:nth-child(2) > div > div > div > table > tbody > tr:nth-child(1) > 
    td:nth-child(4) > div > button:nth-child(2) > span:nth-child(1) > svg`).click({ force: true });
    cy.url().should('contain', '/app/edit-gl-mapping/');
    cy.findByRole('button', { name: /update/i }).click();
    cy.url().should('contain', '/app/gl-mappings');
  });

  it('User Can Change GL Account Mapping Status', () => {
    cy.visit(`${BASE_URL}/app/gl-mappings`);
    cy.wait(2000);
    cy.get(`#root > div > div:nth-child(2) > div:nth-child(2) > div > div > 
    div:nth-child(2) > div > div > div > table > tbody > tr:nth-child(1) > 
    td:nth-child(4) > div > button:nth-child(3) > span:nth-child(1) > svg`).click({ force: true });
    cy.wait(1000);
    cy.findByRole('link', { name: /proceed!/i }).click();
    cy.url().should('contain', '/app/gl-mappings');
  });
});
