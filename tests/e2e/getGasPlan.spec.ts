import { test, expect, request } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { PricingPage } from '../../pages/PricingPage';

test('Get gas plan pdf for address', async ({ page }) => {
  const pricingPage = new PricingPage(page);

  await pricingPage.goto();
  await pricingPage.searchAddress('17 Bolinda Rd Balwyn North');
  await pricingPage.selectAddressOption('17 Bolinda Road, BALWYN NORTH VIC');
  
  await pricingPage.waitForResults();
  
  await pricingPage.verifyEnergyTypeVisible('Natural gas');
  await pricingPage.verifyEnergyTypeVisible('Electricity');
  
  await pricingPage.uncheckEnergyType('Electricity');

  await pricingPage.verifyEnergyTypeVisible('Natural gas');
  await pricingPage.verifyEnergyTypeVisible('Natural gas');

  const [planDetailsTab, pdfResponse] = await Promise.all([
    page.waitForEvent('popup'),
    page.waitForResponse(resp => resp.url().endsWith('.pdf') && resp.status() === 200),
    page.getByRole('link', { name: 'Origin Basic' }).first().click(),
  ]);

  expect(planDetailsTab).toBeTruthy();
  expect(pdfResponse.ok()).toBeTruthy();
  const pdfUrl = pdfResponse.url();

  // Download PDF
  const apiContext = await request.newContext();
  const downloadResponse = await apiContext.get(pdfUrl);
  const pdfBuffer = await downloadResponse.body();

  // Save PDF to downloads folder
  const pdfDir = path.join(__dirname, 'downloads');
  const pdfPath = path.join(pdfDir, 'gas-plan-details.pdf');
  fs.writeFileSync(pdfPath, pdfBuffer);
  console.log('PDF saved to:', pdfPath);
});