import {test} from '@playwright/test';

const userCookies = [
  'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIwRnczbjZFUVM4bXpFMTI2QUZKeDEiLCJpYXQiOjE3MzM5NTkyMDksIm5hbWUiOiJyb2NpYm90MSIsInJvbGUiOiJjcmV3IiwiZXhwIjoxODIwMzU5MjEwfQ._KK8Zyf5qV6ICCR2qrPyh_-G15hTm_XKnXrzUKOlB28',
  'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIwRnczbjZFUVM4bXpFMTI2QUZKeDAiLCJpYXQiOjE3MzMyOTc5MTUsInJvbGUiOiJjcmV3IiwibmFtZSI6InJvY2lib3QiLCJleHAiOjE4MTk2OTc5MTV9.mmBeGC_r6y1p3YFqnMN5fRmwm5dBAOHBJVPVHIfOSNA',
  'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIwRnczbjZFUVM4bXpFMTI2QUZKeDIiLCJpYXQiOjE3MzM5NTkyNzUsIm5hbWUiOiJyb2NpYm90MiIsInJvbGUiOiJjcmV3IiwiZXhwIjoxODIwMzU5Mjc1fQ.qGQTHFmnPyfAu3xGlWyEuSREcnwcZCKwyiW9ckRrPZY',
  'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIwRnczbjZFUVM4bXpFMTI2QUZKeDMiLCJpYXQiOjE3MzM5NzQwMDIsIm5hbWUiOiJyb2NpYm90MyIsInJvbGUiOiJjcmV3IiwiZXhwIjoxODIwMzc0MDA0fQ.dpXsIDlMzNUlQpWY0c3Vh1hrBo36hNDmsXHyy59NhaQ',
  'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIwRnczbjZFUVM4bXpFMTI2QUZKeDQiLCJpYXQiOjE3MzM5NzM5NDUsIm5hbWUiOiJyb2NpYm90NCIsInJvbGUiOiJjcmV3IiwiZXhwIjoxODIwMzczOTQ1fQ.MDaVc59EXXDpiUbod2cJ3GwcJhAJ5KJa88CuuWT4P2o',
];
test('loadtest', async ({page, browser, context}) => {
  test.setTimeout(700000);
  await page.context().addCookies([
    {
      name: 'jwt',
      value: userCookies[Math.floor(Math.random() * userCookies.length)],
      domain: 'bugs-sandbox.rocicorp.dev',
      path: '/',
      expires: -1,
      httpOnly: false,
    },
  ]);
  const testID = Math.random().toString(36).substring(2, 8);
  //const DELAY_START = 120000;
  const DELAY_START = 1000;
  const DELAY_PER_ITERATION = 4800;
  const NUM_ITERATIONS = 10;
  const delay = Math.random() * DELAY_START;
  console.log(`Delaying for ${delay}ms to create jitter`);
  await page.waitForTimeout(delay);
  await page.goto('https://bugs-sandbox.rocicorp.dev/');
  await page.getByLabel('VISITOR PASSWORD').click();
  await page.getByLabel('VISITOR PASSWORD').fill('zql');
  await page.getByLabel('VISITOR PASSWORD').press('Enter');

  const start = Date.now();

  await page.waitForSelector('.issue-list .row');
  console.log(`First issue rendered in ${Date.now() - start}ms`);
  const cgID = await page.evaluate('window.z.clientGroupID');

  for (let i = 0; i < NUM_ITERATIONS; i++) {
    const iterationStart = Date.now();
    console.log(cgID, `Iteration: ${i}`);
    await page.waitForSelector('.issue-list .row');
    if (i % 2 === 0) {
      await openAndCommentOnNewIssue(
        page,
        'Test Issue',
        'This is a test comment',
        i === 0,
      );
    }
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
    await page.evaluate(() => {
      window.scrollTo({
        top: document.body.scrollHeight + 1000000,
        behavior: 'smooth',
      });
    });


    console.log(cgID, `Finished iteration in ${Date.now() - iterationStart}ms`);
    await page.goBack();
    await page.waitForTimeout(DELAY_PER_ITERATION);
  }
  await context.close();
  await page.close();
  await browser.close();
  let elapsed = Date.now() - start;
  elapsed = elapsed - DELAY_PER_ITERATION * NUM_ITERATIONS;
  console.log(
    `${cgID} loadtest completed in ${(elapsed / 1000).toFixed(2)} secs`,
  );
  console.log(testID, `Ending Test`);
  console.log(cgID, `Done`);
});

async function waitForIssueList(page) {
  await page.waitForFunction(() => {
    const issues = document.querySelectorAll('.issue-list .row');
    return issues.length > 1;
  });
}

async function checkIssueExists(page, title: string) {
  //scroll tho the end of issue list
  await page.evaluate(() => {
    window.scrollTo({
      top: document.body.scrollHeight + 1000000,
      behavior: 'smooth',
    });
  });
  return await page.locator('.issue-list .row', {
    hasText: title
  }).count() > 0;
}

async function navigateToAll(page) {
  await page.locator('.nav-item', { hasText: 'All' }).click();
}

// async function createNewIssueIfNotExists(page, title: string, description: string) {
//   await waitForIssueList(page);
  
//   if (!(await checkIssueExists(page, title))) {
//     console.log(`Creating new issue: ${title}`);
//     await page.getByRole('button', { name: 'New Issue' }).click();
//     await page.locator('.new-issue-title').fill(title);
//     await page.locator('.new-issue-description').fill(description);
//     await page.getByRole('button', { name: 'Save Issue' }).click();
//     await page.waitForSelector('.modal', { state: 'hidden' });
//   } else {
//     console.log(`Issue "${title}" already exists, skipping creation`);
//   }
  
//   await navigateToAll(page);
// }

async function selectRandomEmoji(page) {
  await page.waitForSelector('.emoji-menu');
  const emojiButtons = page.locator('.emoji-menu .emoji');
  const count = await emojiButtons.count();
  const randomIndex = Math.floor(Math.random() * count);
  await emojiButtons.nth(randomIndex).click();
}

async function openAndCommentOnNewIssue(page, issueTitle: string, comment: string, isFirst: boolean) {
  await page.locator('.nav-item', {hasText: 'All'}).click();
  await waitForIssueList(page);
  
  if (!(await checkIssueExists(page, issueTitle))) {
    console.log(`Issue "${issueTitle}" does not exist, skipping`);
    return;
  }

  await page.locator('.issue-list .row', { hasText: issueTitle }).first().scrollIntoViewIfNeeded();
  await page.locator('.issue-list .row', { hasText: issueTitle }).first().click();
  // time how long this takes to show up 
  if (isFirst) {
    const start = Date.now();
    await page.waitForSelector('[class^="_commentItem"]');
    const elapsed = Date.now() - start;
    console.log(`Issue "${issueTitle}" took ${elapsed}ms to load`);
  } else {
    await page.waitForSelector('[class^="_commentItem"]');
  }
  const comments = page.locator('[class^="_commentItem"]');
  await page.locator('.comment-input').scrollIntoViewIfNeeded();
  await page.locator('.comment-input').fill(comment);
  
  await page.locator('.add-emoji-button').first().click();
  await selectRandomEmoji(page);
  
  await page.getByRole('button', { name: 'Add Comment' }).click();
  

  const commentCount = await comments.count();
  const randomCommentIndex = Math.floor(Math.random() * commentCount);
  
  console.log("comment count:", commentCount);
  const randomComment = await comments.nth(randomCommentIndex).locator('.add-emoji-button');
  await randomComment.scrollIntoViewIfNeeded();
  await randomComment.first().click();
  await selectRandomEmoji(page);
  await navigateToAll(page);
}
