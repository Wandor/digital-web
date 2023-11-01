/* eslint-disable max-len */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { faker } from '@faker-js/faker';

const BASE_URL = 'http://localhost:3000';
const BACKEND_URL = 'http://localhost:8000';

describe('Credit Admin Dashboard test', () => {
  it('User Can View Credit Admin Dashboard', () => {
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
    cy.visit(`${BASE_URL}/app/credit-dashboard`);
    cy.wait(7000);
  });

  it('User Can View Call Center Dashboard', () => {
    cy.visit(`${BASE_URL}/app/call-centre`);
    cy.wait(5000);
  });

  it('User Can View SMS Analytics Dashboard', () => {
    cy.visit(`${BASE_URL}/app/sms-dashboard`);
    cy.wait(5000);
  });

  it('User Can View Voice Analytics Dashboard', () => {
    cy.visit(`${BASE_URL}/app/voice-dashboard`);
    cy.wait(5000);
  });
});
