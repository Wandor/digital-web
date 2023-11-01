/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { faker } from '@faker-js/faker';
import moment from 'moment';

const BASE_URL = 'http://localhost:3000';
const BACKEND_URL = 'http://localhost:8000';

describe('Follow Up Notes test', () => {
  it('User Can View Customer Follow Up Notes', () => {
    cy.visit(`${BASE_URL}`);
    cy.findByRole('textbox', { name: /Email Address/i }).type(
      'makena.mugendi@opentechglobal.co.ke',
    );
    cy.findByLabelText(/password/i).type('Nshangika@3450');
    cy.findByRole('button', { name: /sign in/i }).click();

    cy.intercept(
      {
        method: 'GET',
        url: `${BACKEND_URL}/api/v1/users/email/${Buffer.from('makena.mugendi@opentechglobal.co.ke').toString('base64')}`,
      },
    ).as('getUserData');
    cy.wait(['@getUserData']);
    cy.visit(`${BASE_URL}/app/follow-up-cases/1`);
    cy.wait(10000);
    cy.get('#root > div > div:nth-child(2) > div:nth-child(3) > div > div:nth-child(2) > div:nth-child(2) > div > div > div > table > tbody > tr:nth-child(6) > td:nth-child(12) > div > button:nth-child(2) > span:nth-child(1) > svg > path').click({ force: true });
    cy.url().should('contain', '/app/customer-followup-notes/');
    cy.wait(5000);
  });

  it('User can Create Follow-Up Note', () => {
    cy.visit(`${BASE_URL}/app/follow-up-cases/1`);
    cy.wait(8000);
    cy.get('#root > div > div:nth-child(2) > div:nth-child(3) > div > div:nth-child(2) > div:nth-child(2) > div > div > div > table > tbody > tr:nth-child(1) > td:nth-child(12) > div > button:nth-child(1) > span:nth-child(1) > svg').click({ force: true });
    cy.url().should('contain', '/app/create-follow-up-note/');
    cy.wait(10000);

    cy.get('#callResult').select('Connected');
    cy.get('#callStatus').select('Successful');
    cy.get('#callStatusAction').select('Promise to Pay');
    cy.get('#partyResponse').select('Set Agreement');
    cy.get('#ptpAmount').type('5000');
    cy.get('#ptpDate').type(moment(new Date()).format('DD/MM/YYYY hh:mm A'));
    cy.get('#comment').type(`test ${faker.random.word()}`);
    cy.get('#sendMessage').select('No');
    cy.findByRole('button', { name: /save/i }).click();

    // cy.url().should('contain', '/app/follow-up-cases/1');
    cy.wait(2000);
    cy.get('#root > div > div:nth-child(2) > div:nth-child(3) > div > div:nth-child(2) > div:nth-child(2) > div > div > div > table > tbody > tr:nth-child(1) > td:nth-child(12) > div > button:nth-child(3) > span:nth-child(1) > svg').click({ force: true });
    cy.url().should('contain', '/app/customer-allocations/');
    cy.wait(2000);
  });
});
