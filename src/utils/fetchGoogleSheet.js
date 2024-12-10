const { google } = require('googleapis');
const sheets = google.sheets('v4');

// Initialize GoogleAuth using environment variable
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.SERVICE_ACCOUNT_KEY),
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

const fetchGoogleSheetData = async ({ age = '', gender = '', fromDate = '', toDate = '' } = {}) => {
  try {
    const client = await auth.getClient();

    const spreadsheetId = '1l7GstWHc69HPV0irSdvoMIyHgtufUPKsbtCiNw7IKR0';
    const range = 'Sheet3';

    const response = await sheets.spreadsheets.values.get({
      auth: client,
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return { status: 404, message: 'No data found in the sheet.' };
    }

    const headers = rows[0];
    const data = rows.slice(1).map((row) =>
      headers.reduce((obj, header, index) => {
        obj[header] = row[index] || null;
        return obj;
      }, {})
    );

    // Convert fromDate and toDate to Date objects if provided
    const fromDateObj = fromDate ? new Date(fromDate) : null;
    const toDateObj = toDate ? new Date(toDate) : null;

    // Filter the data based on query parameters
    const filteredData = data.filter((row) => {
      let matches = true;

      // Filter by Age
      if (age && row['Age'] && !row['Age'].includes(age)) {
        matches = false;
      }

      // Filter by Gender
      if (gender && row['Gender'] && row['Gender'].toLowerCase() !== gender.toLowerCase()) {
        matches = false;
      }

      // Filter by Date Range
      if (fromDateObj || toDateObj) {
        const dateParts = row['Day'] ? row['Day'].split('/') : null;

        if (!dateParts || dateParts.length !== 3) {
          matches = false;
        } else {
          // Convert date to yyyy-MM-dd format
          const rowDate = new Date(
            `${dateParts[2]}-${dateParts[1].padStart(2, '0')}-${dateParts[0].padStart(2, '0')}`
          );
          if (isNaN(rowDate)) {
            matches = false;
          } else {
            // Include dates within or equal to the range
            if (
              (fromDateObj && rowDate < fromDateObj) || // Before start date
              (toDateObj && rowDate > toDateObj)       // After end date
            ) {
              matches = false; // Exclude dates outside the range
            }
          }
        }
      }

      return matches;
    });

    return { status: 200, data: filteredData };
  } catch (error) {
    console.error('Error accessing Google Sheets:', error.message);
    return { status: 500, message: 'Error accessing Google Sheets.' };
  }
};

module.exports = {
  fetchGoogleSheetData,
};
