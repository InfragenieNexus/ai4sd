var express = require('express');
const multer = require('multer');
var router = express.Router();
var path = require('path')
var { processArchitecture } = require('../scripts/processArchitecture');
var { parseInputFiles } = require('../scripts/parseInputFiles');
const fsPromises = require('fs/promises');


// configure storage engine and filename
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});

// intercept incoming requests on API,  and add workspace zip to req object:
const zip_filename = 'workspaceZip'
const uploadZipAdd = multer({
  storage: storage,
  limits: { fileSize: 100000000 } // 100MB file size limit
}).single(zip_filename);


//// ## ENDPOINTS

// endpoint for LLM queries
router.post('/', uploadZipAdd, async function(req, res, next) {

  // check if input contains necessary fields
  if (!validateInput(req)) { 
    return res.status(400).json({ error: 'no workspace zip provided' });
  }

  const zipFilePath = req.file.path; // path to uploaded zip file
  const extractDir = path.join('uploads/', 'unzipped'); // directory where to unzip files into

  try {
    const files = await parseInputFiles(zipFilePath, extractDir)
    const result = await processArchitecture(files)

    res.json({"output":result});

  } catch (error) {
      console.log("Error processing request:", error);
      res.status(500).json({ error: 'Error processing architectural analysis' });

  }
});

// ##aux funcs
// validate if input contains zip (docs or commits) to send to llm
function validateInput(req) {

  if (!req.file) {
      return false;
  }
  return true
}

module.exports = router;