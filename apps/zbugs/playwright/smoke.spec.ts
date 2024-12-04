import {test} from '@playwright/test';

test('loadtest', async ({page, browser, context}) => {
  test.setTimeout(700000);
  await page.context().addCookies([
    {
      name: 'jwt',
      value:
        'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIwRnczbjZFUVM4bXpFMTI2QUZKeDAiLCJpYXQiOjE3MzMyOTc5MTUsInJvbGUiOiJjcmV3IiwibmFtZSI6InJvY2lib3QiLCJleHAiOjE4MTk2OTc5MTV9.mmBeGC_r6y1p3YFqnMN5fRmwm5dBAOHBJVPVHIfOSNA',
      domain: 'bugs-sandbox.rocicorp.dev',
      path: '/',
      expires: -1,
      httpOnly: false,
    },
  ]);
  const testID = Math.random().toString(36).substring(2, 8);

  await page.goto('https://bugs-sandbox.rocicorp.dev/');
  await page.getByLabel('VISITOR PASSWORD').click();
  await page.getByLabel('VISITOR PASSWORD').fill('zql');
  await page.getByLabel('VISITOR PASSWORD').press('Enter');

  const DELAY_START = 120000;
  const DELAY_PER_ITERATION = 10000;
  const NUM_ITERATIONS = 30;

  const delay = Math.random() * DELAY_START;
  await page.waitForTimeout(delay);

  const start = Date.now();
  const cgID = await page.evaluate('window.z.clientGroupID');
  console.log(cgID, `Delaying for ${delay}ms to create jitter`);


  for (let i = 0; i < NUM_ITERATIONS; i++) {
    console.log(cgID, `Iteration: ${i}`);
    await page.waitForSelector('.issue-list .row');
    console.log(cgID, 'Filtering by open');
    await page.locator('.nav-item', {hasText: 'Open'}).click();
    console.log(cgID, 'Filtering by closed');
    await page.locator('.nav-item', {hasText: 'Closed'}).click();
    console.log(cgID, 'Filtering by all');
    await page.locator('.nav-item', {hasText: 'All'}).click();
    await page.locator('.add-filter').click();
    await page.getByText('Filtered by:+ Filter').click();
    await page.getByRole('button', {name: '+ Filter'}).click();
    // select creator
    await page.locator('div.add-filter-modal > div:nth-child(1)').click();

    let elm = await page.locator(
      `#options-listbox > li:nth-child(${Math.floor(Math.random() * 5) + 2})`,
    );

    console.log(cgID, `Filtering by ${await elm.allTextContents()}`);
    await elm.click();
    await page.getByRole('button', {name: '+ Filter'}).click();
    // select assignee
    await page.locator('div.add-filter-modal > div:nth-child(2)').click();
    elm = await page.locator(
      `#options-listbox > li:nth-child(${Math.floor(Math.random() * 5) + 2})`,
    );

    console.log(cgID, `Filtering by ${await elm.allTextContents()}`);
    await elm.click();
    console.log(cgID, 'Removing user filter');
    await page
      .locator('.list-view-filter-container .pill.user')
      .first()
      .click();
    console.log(cgID, 'Removing label filter');
    await page.locator('.list-view-filter-container .pill.user').last().click();
    await page.locator('.nav-item', {hasText: 'All'}).click();
    await page
      .locator(
        `.issue-list .row:nth-child(${Math.floor(Math.random() * 5) + 1}) > a`,
      )
      .click();
    await page
      .locator('.issue-sidebar .sidebar-item:first-child button')
      .click();
    await page
      .locator(
        '.issue-sidebar .sidebar-item:first-child #options-listbox > li:nth-child(2)',
      )
      .click();
    await page
      .locator('.issue-sidebar .sidebar-item:first-child button')
      .click();
    await page
      .locator(
        '.issue-sidebar .sidebar-item:first-child #options-listbox > li:nth-child(2)',
      )
      .click();
    await page.goBack();
    await page.waitForTimeout(DELAY_PER_ITERATION);

  }
  await context.close();
  await page.close();
  await browser.close();
  let elapsed = Date.now() - start;
  elapsed = elapsed - DELAY_PER_ITERATION * NUM_ITERATIONS;
  console.log(`${cgID} loadtest completed in ${(elapsed / 1000).toFixed(2)} secs`);
  console.log(testID, `Ending Test`);
  console.log(cgID, `Done`);
});
