/* eslint-disable max-len */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { faker } from '@faker-js/faker';

const BASE_URL = 'http://localhost:3000';
const BACKEND_URL = 'http://localhost:8000';
const followUpUploadDir = './cypress/upload/samplePTPUploadFile(19).xlsx';

describe('Customer Follow Up Allocations test', () => {
  it('User can Bulk Allocate Cases', () => {
    cy.visit(`${BASE_URL}`);
    // cy.findByRole('button', { name: /proceed with password/i }).click();
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
    cy.visit(`${BASE_URL}/app/follow-up-allocation`);
    cy.wait(2000);
    cy.findByRole('button', { name: /bulk allocation/i }).click();

    cy.get('#branchid').select('MACHAKOS');
    cy.get('#bulkallocationStatus').select('Allocated');
    cy.get('#currentAllocatedAgent').select('PURITY MAINA');
    cy.get('#allocatedUserId').select('JOSEANNAH MWENDE');

    // confirm and save
    cy.findByRole('button', { name: /allocate/i }).click();

    cy.url().should('contain', '/app/follow-up-allocation');
    cy.wait(2000);
  });

  it('User Can Shuffle Agents Portfolio', () => {
    cy.visit(`${BASE_URL}/app/follow-up-allocation`);
    cy.wait(2000);
    cy.findByRole('button', { name: /shuffle agents/i }).click();
    cy.get('#currentAllocatedUserId').select('PURITY MAINA');
    cy.get('#newAllocatedUserId').select('JOSEANNAH MWENDE');

    cy.findByRole('button', { name: /add/i }).click();

    cy.get('#currentAllocatedUserId').select('JOSEANNAH MWENDE');
    cy.get('#newAllocatedUserId').select('PURITY MAINA');
    cy.findByRole('button', { name: /shuffle/i }).click();
    cy.url().should('contain', '/app/follow-up-allocation');
    cy.wait(2000);
  });

  it('User Can Upload Follow Up Cases', () => {
    cy.visit(`${BASE_URL}/app/follow-up-allocation`);
    // cy.wait(['@getCases']);
    cy.wait(5000);
    cy.findByRole('button', { name: /upload cases/i }).click();
    cy.get('#ptpUploadExcel').selectFile(followUpUploadDir, { action: 'drag-drop' });
    cy.findByRole('button', { name: /upload/i }).click();
    cy.url().should('contain', '/app/follow-up-allocation');
    cy.wait(2000);
  });
});
