
import dotenv from 'dotenv';
import { google } from 'googleapis';
import path from 'path';

// Load .env from project root
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const { GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SHEET_ID } = process.env;

async function testSheets() {
    console.log("Checking Google Sheets Configuration...");

    if (!GOOGLE_SERVICE_ACCOUNT_EMAIL) {
        console.error("❌ GOOGLE_SERVICE_ACCOUNT_EMAIL is missing in .env");
        return;
    }
    if (!GOOGLE_PRIVATE_KEY) {
        console.error("❌ GOOGLE_PRIVATE_KEY is missing in .env");
        return;
    }
    if (!GOOGLE_SHEET_ID) {
        console.error("❌ GOOGLE_SHEET_ID is missing in .env");
        return;
    }

    console.log(`✅ Email found: ${GOOGLE_SERVICE_ACCOUNT_EMAIL}`);
    console.log(`✅ Sheet ID found: ${GOOGLE_SHEET_ID}`);
    console.log(`✅ Private Key found (length: ${GOOGLE_PRIVATE_KEY.length})`);

    try {
        // Format key similar to the actual application code
        const privateKey = GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n').replace(/^["']|["']$/g, '').trim();

        const auth = new google.auth.JWT(
            GOOGLE_SERVICE_ACCOUNT_EMAIL,
            undefined,
            privateKey,
            ['https://www.googleapis.com/auth/spreadsheets']
        );

        const sheets = google.sheets({ version: 'v4', auth });

        console.log("Attempting to append test data...");

        const response = await sheets.spreadsheets.values.append({
            spreadsheetId: GOOGLE_SHEET_ID,
            range: 'Sheet1!A:B',
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [
                    ['test-script@example.com', new Date().toISOString(), 'Test Script Verification']
                ]
            }
        });

        console.log("✅ Success! Appended dummy data to Google Sheet.");
        console.log("Response:", response.status, response.statusText);

    } catch (error) {
        console.error("❌ Failed to append to Google Sheet.");
        console.error("Error Message:", error.message);
        // console.error(error); // Uncomment for full error if needed
    }
}

testSheets();
