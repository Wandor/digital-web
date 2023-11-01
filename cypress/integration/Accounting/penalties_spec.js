/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars
import { faker } from '@faker-js/faker';

const BASE_URL = 'http://localhost:3000';
const BACKEND_URL = 'http://localhost:8000';

describe('Penalties End To End Test', () => {
  it('User Can Create Penalties', () => {
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
    cy.visit(`${BASE_URL}/app/penalties`);
    cy.wait(2000);

    // penalty information
    cy.findByRole('button', { name: /new penalty/i }).click();
    cy.get('#name').type(`test ${faker.random.word()}`);
    cy.get('#gracePeriod').type('10');
    cy.get('#category').select('Savings');
    cy.get('#chargeType').select('Percentage');
    cy.get('#value').type('10');
    cy.get('#recoveryMethod').select('Outstanding Principal * No. Of Late Days * PenaltyRate');
    cy.findByText(/enable penalty/i).click();
    cy.findByText(/apply working days/i).click();
    cy.findByRole('button', { name: /save/i }).click();
    cy.url().should('contain', '/app/penalties');
  });

  it('User Can View Penalty', () => {
    cy.visit(`${BASE_URL}/app/penalties`);
    cy.wait(2000);
    cy.get(`#root > div > div:nth-child(2) > div:nth-child(2) > div > div >
     div:nth-child(2) > div > div > div > table > tbody > tr:nth-child(1) >
      td:nth-child(9) > div > button:nth-child(1) > span:nth-child(1) > svg > circle`).click({ force: true });
    cy.url().should('contain', '/app/view-penalty/');
    cy.findByRole('button', { name: /cancel/i }).click();
    cy.url().should('contain', '/app/penalties');
  });

  it('User Can Edit Penalty', () => {
    cy.visit(`${BASE_URL}/app/penalties`);
    cy.wait(2000);
    cy.get(`#root > div > div:nth-child(2) > div:nth-child(2) > div > div > 
    div:nth-child(2) > div > div > div > table > tbody > tr:nth-child(1) > 
    td:nth-child(9) > div > button:nth-child(2) > span:nth-child(1) > svg`).click({ force: true });
    cy.url().should('contain', '/app/edit-penalty/');
    cy.get('#name').clear().type(`test ${faker.random.word()}`);
    cy.findByRole('button', { name: /update/i }).click();
    cy.url().should('contain', '/app/penalties');
  });

  it('User Can Change Penalty Status', () => {
    cy.visit(`${BASE_URL}/app/penalties`);
    cy.wait(2000);
    cy.get(`#root > div > div:nth-child(2) > div:nth-child(2) > div > div > 
    div:nth-child(2) > div > div > div > table > tbody > tr:nth-child(1) > 
    td:nth-child(9) > div > button:nth-child(3) > span:nth-child(1) > svg`).click({ force: true });
    cy.wait(1000);
    cy.findByRole('link', { name: /proceed!/i }).click();
    cy.url().should('contain', '/app/penalties');
  });
});
