import 'dotenv/config';
import { google } from 'googleapis';

async function verifySheets() {
    console.log("--- Google Sheets Diagnostic ---");

    // 1. Check Env Vars
    const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const key = process.env.GOOGLE_PRIVATE_KEY;
    const sheetId = process.env.GOOGLE_SHEET_ID;

    if (!email || !key || !sheetId) {
        console.error("❌ Missing environment variables!");
        console.log(`Email: ${email ? 'OK' : 'MISSING'}`);
        console.log(`Key: ${key ? 'OK' : 'MISSING'}`);
        console.log(`Sheet ID: ${sheetId ? 'OK' : 'MISSING'}`);
        return;
    }

    console.log(`✅ Environment variables found.`);
    console.log(`📧 Service Account: ${email}`);
    console.log(`📄 Sheet ID: ${sheetId}`);

    // 2. Validate Key Format
    let processedKey = key;
    // Simple cleaning logic matching server code
    try {
        if (key.includes('\\n')) processedKey = key.replace(/\\n/g, '\n');
        processedKey = processedKey.replace(/^["']|["']$/g, '').trim();
    } catch (e) {
        console.error("❌ Error processing key:", e.message);
        return;
    }

    const hasBegin = processedKey.includes('-----BEGIN PRIVATE KEY-----');
    const hasEnd = processedKey.includes('-----END PRIVATE KEY-----');

    if (!hasBegin || !hasEnd) {
        console.error("❌ Invalid Key Format!");
        console.log(`Starts with BEGIN: ${hasBegin}`);
        console.log(`Ends with END: ${hasEnd}`);
        console.log(`Key start: ${JSON.stringify(processedKey.substring(0, 50))}`);
        console.log(`Key end: ${JSON.stringify(processedKey.slice(-50))}`);
        return;
    }
    console.log("✅ Key format looks valid.");

    // 3. Test Auth & Append
    try {
        console.log("🔄 Attempting to authenticate...");
        const auth = new google.auth.JWT({
            email: email,
            key: processedKey,
            scopes: ['https://www.googleapis.com/auth/spreadsheets']
        });

        await auth.authorize();
        console.log("✅ Authentication successful!");

        const sheets = google.sheets({ version: 'v4', auth });
        console.log("🔄 Attempting to write to sheet...");

        await sheets.spreadsheets.values.append({
            spreadsheetId: sheetId,
            range: 'Sheet1!A:B',
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [['Diagnostic Test', new Date().toISOString()]]
            }
        });
        console.log("✅ Successfully appended row to Google Sheet!");

    } catch (error) {
        console.error("❌ Operation Failed:", error.message);
        if (error.code === 403 || error.code === 404) {
            console.log("\n⚠️  POSSIBLE CAUSE: Permissions");
            console.log(`Please ensure the email '${email}' is added as an 'Editor' to the Google Sheet.`);
        }
    }
}

verifySheets();
