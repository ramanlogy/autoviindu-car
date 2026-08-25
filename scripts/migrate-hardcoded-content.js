/**
 * scripts/migrate-hardcoded-content.js
 * One-off migration: pulls the hardcoded NEWS/REVIEWS/UPCOMING/PAST arrays
 * out of public/newsandreviews.html and public/events.html and writes them
 * into backend/site-content/{news,reviews,events}.json, so the CMS
 * (SiteContent table, edited via /dashboard and /cms) becomes the source
 * of truth instead of hand-edited HTML.
 *
 * Run once: node scripts/migrate-hardcoded-content.js
 * Then push into the DB with: node scripts/seed-site-content.js
 */
const fs = require('fs');
const path = require('path');

const WM = (f) => `https://commons.wikimedia.org/wiki/Special:FilePath/${f}`;

function extractBlock(source, startMarker, endMarker) {
  const start = source.indexOf(startMarker);
  if (start === -1) throw new Error(`Marker not found: ${startMarker}`);
  const end = source.indexOf(endMarker, start);
  if (end === -1) throw new Error(`End marker not found after ${startMarker}: ${endMarker}`);
  return source.slice(start, end + endMarker.length);
}

function evalArray(varName, code) {
  // code is a full `let NAME = [ ... ];` statement — evaluate it with WM in scope
  // and return the resulting array.
  const fn = new Function('WM', `${code}\nreturn ${varName};`);
  return fn(WM);
}

function withDefaults(item) {
  return Object.assign({ photos: [], published: true }, item);
}

function readJson(fp) {
  return JSON.parse(fs.readFileSync(fp, 'utf-8'));
}

function writeJson(fp, data) {
  fs.writeFileSync(fp, JSON.stringify(data, null, 2) + '\n');
  console.log('Wrote', path.relative(process.cwd(), fp));
}

function main() {
  const root = path.join(__dirname, '..');
  const newsReviewsHtml = fs.readFileSync(path.join(root, 'public/newsandreviews.html'), 'utf-8');
  const eventsHtml = fs.readFileSync(path.join(root, 'public/events.html'), 'utf-8');

  const newsCode = extractBlock(newsReviewsHtml, 'let NEWS = [', '];');
  const reviewsCode = extractBlock(newsReviewsHtml, 'let REVIEWS = [', '];');
  const upcomingCode = extractBlock(eventsHtml, 'let UPCOMING = [', '];');
  const pastCode = extractBlock(eventsHtml, 'let PAST = [', '];');

  const NEWS = evalArray('NEWS', newsCode).map(withDefaults);
  const REVIEWS = evalArray('REVIEWS', reviewsCode).map(withDefaults);
  const UPCOMING = evalArray('UPCOMING', upcomingCode).map(withDefaults);
  const PAST = evalArray('PAST', pastCode).map(withDefaults);

  console.log(`Extracted ${NEWS.length} news, ${REVIEWS.length} reviews, ${UPCOMING.length} upcoming events, ${PAST.length} past events.`);

  const contentDir = path.join(root, 'backend/site-content');

  const newsJsonPath = path.join(contentDir, 'news.json');
  const newsJson = readJson(newsJsonPath);
  newsJson.items = NEWS;
  writeJson(newsJsonPath, newsJson);

  const reviewsJsonPath = path.join(contentDir, 'reviews.json');
  const reviewsJson = readJson(reviewsJsonPath);
  reviewsJson.items = REVIEWS;
  writeJson(reviewsJsonPath, reviewsJson);

  const eventsJsonPath = path.join(contentDir, 'events.json');
  const eventsJson = readJson(eventsJsonPath);
  eventsJson.upcoming = UPCOMING;
  eventsJson.past = PAST;
  writeJson(eventsJsonPath, eventsJson);

  console.log('\nDone. Now run: node scripts/seed-site-content.js');
}

main();
