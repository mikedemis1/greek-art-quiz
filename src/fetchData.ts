import axios from 'axios';
import * as cron from 'node-cron';
import * as fs from 'fs';

// URL of the data source (Replace with actual API)
const DATA_SOURCE_URL = 'C:\\Users\\miked\\Desktop\\task1\\greek-art-quiz\\procced json file';

// File to store the last fetched data (For validation & persistence)
const DATA_STORAGE_FILE = 'data.json';

// ✅ Function to validate the structure of fetched data
function validateData(data: any): boolean {
  if (!Array.isArray(data)) {
    console.error("Data is not an array.");
    return false;
  }

  for (const item of data) {
    if (
      typeof item !== 'object' ||
      !item.name || !item.period || !item.type
    ) {
      console.error("Invalid item structure:", item);
      return false;
    }
  }

  return true;
}

// Function to fetch updated data
async function fetchData(): Promise<void> {
  try {
    console.log(`[${new Date().toISOString()}] Fetching data...`);

    // Fetch data from the external API
    const response = await axios.get(DATA_SOURCE_URL);

    if (response.status === 200) {
      const newData = response.data;

      // ✅ Validate the fetched data
      if (!validateData(newData)) {
        console.error("Fetched data failed validation.");
        return;
      }

      // Validate & integrate the fetched data
      const isUpdated = await integrateData(newData);

      if (isUpdated) {
        console.log(`[${new Date().toISOString()}] Data successfully updated.`);
      } else {
        console.log(`[${new Date().toISOString()}] No new updates found.`);
      }
    } else {
      console.error(`Error: Received status ${response.status} from API`);
    }
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error fetching data:`, error);
  }
}

// Function to integrate new data while maintaining integrity
async function integrateData(newData: any): Promise<boolean> {
  try {
    let existingData: any = [];

    // Load existing data if the file exists
    if (fs.existsSync(DATA_STORAGE_FILE)) {
      const fileContent = fs.readFileSync(DATA_STORAGE_FILE, 'utf8');
      existingData = JSON.parse(fileContent);
    }

    // Check if the fetched data is different from existing data
    if (JSON.stringify(existingData) !== JSON.stringify(newData)) {
      // Write new data to storage
      fs.writeFileSync(DATA_STORAGE_FILE, JSON.stringify(newData, null, 2));
      return true; // Data updated
    }

    return false; // No changes detected
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error integrating data:`, error);
    return false;
  }
}

// Schedule the task to run daily at midnight
cron.schedule('0 0 * * *', () => {
  console.log(`[${new Date().toISOString()}] Running scheduled data fetch...`);
  fetchData();
});

// Run fetch once on startup
fetchData();
