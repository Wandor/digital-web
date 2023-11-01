/* eslint-disable max-len */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { faker } from '@faker-js/faker';

const BASE_URL = 'http://localhost:3000';
const BACKEND_URL = 'http://localhost:8000';

describe('RO Dashboard test', () => {
  it('User Can View RO Dashboard', () => {
    cy.visit(`${BASE_URL}`);
    cy.findByRole('textbox', { name: /Email Address/i }).type(
      'jonniesaba@gmail.com',
    );
    cy.findByLabelText(/password/i).type('0742551985');
    cy.findByRole('button', { name: /sign in/i }).click();
    cy.intercept(
      {
        method: 'GET',
        url: `${BACKEND_URL}/api/v1/users/email/${Buffer.from('jonniesaba@gmail.com').toString('base64')}`,
      },
    ).as('getUserData');
    cy.wait(['@getUserData']);
    cy.visit(`${BASE_URL}/app/ro-dashboard`);
    cy.wait(7000);
  });
});
