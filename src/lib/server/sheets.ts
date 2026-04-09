import { google } from 'googleapis';
// @ts-ignore
import { env } from '$env/dynamic/private';
const { GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SHEET_ID } = env;

export async function appendToSheet(email: string) {
    // Check if configuration is present
    if (!GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY || !GOOGLE_SHEET_ID) {
        console.warn('Google Sheets configuration missing. Skipping sheet update.');
        return false;
    }

    try {
        const auth = new google.auth.JWT({
            email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
            key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n').replace(/^["']|["']$/g, '').trim(), // Fix newlines and remove extra quotes/spaces
            scopes: ['https://www.googleapis.com/auth/spreadsheets']
        });

        const sheets = google.sheets({ version: 'v4', auth });

        await sheets.spreadsheets.values.append({
            spreadsheetId: GOOGLE_SHEET_ID,
            range: 'Sheet1!A:B', // Assumes Sheet1, columns A and B
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [
                    [email, new Date().toISOString()] // Data to append: Email, Timestamp
                ]
            }
        });

        return true;
    } catch (error) {
        console.error('Failed to append to Google Sheet:', error);
        return false;
    }
}
