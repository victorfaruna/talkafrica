
import { env } from '$env/dynamic/private';
import { db } from '$lib/server/db';
import { sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    // Check Google Sheets Config
    const googleConfig = {
        email: !!env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        key: !!env.GOOGLE_PRIVATE_KEY,
        sheetId: !!env.GOOGLE_SHEET_ID,
        keyLength: env.GOOGLE_PRIVATE_KEY ? env.GOOGLE_PRIVATE_KEY.length : 0
    };

    // Check Gemini Config
    const geminiConfig = {
        apiKey: !!env.GEMINI_API_KEY
    };

    // Check DB Connection
    let dbStatus = 'unknown';
    try {
        await db.execute(sql`SELECT 1`);
        dbStatus = 'connected';
    } catch (e: any) {
        dbStatus = `error: ${e.message}`;
    }

    return {
        check: {
            google: googleConfig,
            gemini: geminiConfig,
            db: dbStatus,
            envPreview: {
                sheetId: env.GOOGLE_SHEET_ID ? `${env.GOOGLE_SHEET_ID.slice(0, 5)}...` : 'missing',
                email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL ? env.GOOGLE_SERVICE_ACCOUNT_EMAIL : 'missing'
            }
        }
    };
};
