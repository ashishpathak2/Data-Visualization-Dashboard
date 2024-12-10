const {fetchGoogleSheetData} = require("../utils/fetchGoogleSheet")

const handleGoogleSheetData = async (req, res) => {
  try {
    // Fetch data from Google Sheets
    const result = await fetchGoogleSheetData({ 
      age:req.cookies.age, 
      gender:req.cookies.gender, 
      fromDate:req.cookies.fromDate, 
      toDate:req.cookies.toDate 
    });

    // Handle successful response
    if (result.status === 200) {
      if (!Array.isArray(result.data)) {
        return res.status(500).json({ message: "Invalid data format received from Google Sheets" });
      }
      return res.json(result.data);
    }

    // Handle custom errors returned by fetchGoogleSheetData
    return res.status(result.status).json({ message: result.message });
  } catch (error) {
    console.error("Error fetching Google Sheets data:", error);

    // Send generic error response
    res.status(500).json({ message: "An unexpected error occurred while fetching data" });
  }
};

const handleDataFilter = async (req, res) => {
  try {
    const { age, gender, fromDate, toDate } = req.query;

    // Fetch filtered data
    const responseObj = await fetchGoogleSheetData({ age, gender, fromDate, toDate });

    if (responseObj.status === 200) {
      // Store the filter values in cookies
      res.cookie('age', age || '', { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: false });
      res.cookie('gender', gender || '', { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: false });
      res.cookie('fromDate', fromDate || '', { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: false });
      res.cookie('toDate', toDate || '', { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: false });

      // Render the page with filtered data
      res.render('index', { 
        data: JSON.stringify(responseObj.data), 
        age, 
        gender, 
        fromDate, 
        toDate 
      });
    } else {
      // Handle error responses
      res.status(responseObj.status).send(responseObj.message || "An error occurred.");
    }
  } catch (error) {
    console.error("Error during data fetching:", error);
    res.status(500).send("Internal Server Error");
  }
};






const handleVisualdataPage = (req, res) => {
  const age = req.cookies.age || '';
  const gender = req.cookies.gender || '';
  const fromDate = req.cookies.fromDate || '';
  const toDate = req.cookies.toDate || '';

  res.render('index', { 
    data: "[]", 
    age, 
    gender, 
    fromDate, 
    toDate 
  });
};


module.exports = { handleGoogleSheetData, handleVisualdataPage ,handleDataFilter };
