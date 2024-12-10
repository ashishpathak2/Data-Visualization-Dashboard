const express = require('express');
const router = express.Router();
const {handleGoogleSheetData,handleVisualdataPage,handleDataFilter } = require('../src/controllers/fileDataController');
const {isAuthenticated} = require("../src/middleware/isAuthenticated")
const {setLoggedUserName} = require("../src/middleware/setLoggedUserName")

// GET home page
router.get('/main', isAuthenticated,setLoggedUserName ,handleVisualdataPage)

router.get("/filterdata",isAuthenticated,setLoggedUserName,handleDataFilter)

// Endpoint to fetch Excel data
router.get('/data', isAuthenticated,handleGoogleSheetData);


















module.exports = router;
