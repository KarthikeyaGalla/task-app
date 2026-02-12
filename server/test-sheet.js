const path = require('path');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function testConnection() {
    console.log('1. Reading credentials...');
    try {
        const creds = require('./service-account.json');
        console.log('   - Email:', creds.client_email);
    } catch (e) {
        console.error('   ❌ Failed to read service-account.json');
        return;
    }

    console.log('\n2. Authenticating...');
    const serviceAccountAuth = new JWT({
        email: require('./service-account.json').client_email,
        key: require('./service-account.json').private_key,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(process.env.SPREADSHEET_ID, serviceAccountAuth);

    console.log('\n3. Loading Sheet Info...');
    console.log(`   Target Spreadsheet ID: ${process.env.SPREADSHEET_ID}`);
    try {
        await doc.loadInfo();
        console.log(`   ✅ Connected to: "${doc.title}"`);
    } catch (e) {
        console.error('   ❌ Failed to connect to Sheet. Make sure the email above is an Editor.');
        console.error('   Error:', e.message);
        return;
    }

    const sheet = doc.sheetsByIndex[0];
    console.log(`\n4. Checking Sheet "${sheet.title}"...`);

    try {
        await sheet.loadCells('A1:A1');
        const a1 = sheet.getCell(0, 0).value;
        console.log(`   - Cell A1 value: ${a1}`);

        if (!a1) {
            console.log('   - Sheet appears empty. initializing headers...');
            const headers = ['TaskId', 'TaskName', 'Description', 'Domain', 'Mode', 'Status', 'CreatedDate', 'DueDate'];
            await sheet.setHeaderRow(headers);
            console.log('   ✅ Headers set successfully.');
        } else {
            console.log('   - Headers appear to exist.');
        }

        console.log('\n✅ TEST COMPLETE: Backend can read/write to this Sheet.');
    } catch (e) {
        console.error('   ❌ Error manipulating sheet:', e.message);
    }
}

testConnection();
