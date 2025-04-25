import fs from 'fs';
import fetch from 'node-fetch';
import path from 'path';
import { parse } from 'csv-parse';
import { stringify } from 'csv-stringify';

const INPUT_FILE = path.join(__dirname, 'data', 'urls.csv');
const OUTPUT_FILE = path.join(__dirname, 'archived_results.csv');
const WAYBACK_SAVE_API = 'https://web.archive.org/save/';

interface ArchiveResult {
  original_url: string;
  archive_url: string;
  status: string;
}

async function archiveUrl(url: string): Promise<ArchiveResult> {
  try {
    const encodedUrl = encodeURIComponent(url);
    const saveUrl = WAYBACK_SAVE_API + encodedUrl;
    const response = await fetch(saveUrl, { method: 'GET', redirect: 'manual' });

    if (response.status === 200 || response.status === 302) {
      const contentLocation = response.headers.get('content-location');
      if (contentLocation) {
        const archiveLink = `https://web.archive.org${contentLocation}`;
        return { original_url: url, archive_url: archiveLink, status: 'Success' };
      }
    }
    return { original_url: url, archive_url: '', status: `Failed with status ${response.status}` };
  } catch (err: any) {
    return { original_url: url, archive_url: '', status: `Error: ${err.message}` };
  }
}

async function main() {
  const results: ArchiveResult[] = [];

  const input = fs.createReadStream(INPUT_FILE);
  const parser = input.pipe(parse({ columns: true }));

  for await (const record of parser) {
    const url = record.url.trim();
    console.log(`Archiving: ${url}`);
    const result = await archiveUrl(url);
    results.push(result);
    await new Promise((r) => setTimeout(r, 5000)); // Delay to avoid rate limiting
  }

  stringify(results, { header: true }, (err, output) => {
    if (err) throw err;
    fs.writeFileSync(OUTPUT_FILE, output);
    console.log(`Finished. Results saved to ${OUTPUT_FILE}`);
  });
}

main();
