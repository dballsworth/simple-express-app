// For reading in env vars from '.env' file
require('dotenv').config();
// Logging
const logger = require('pino')();
// Enable CORS
const cors = require('cors');

const express = require('express');
const serverless = require('serverless-http');


/*
 * Configuration
 * 
 * Externalized through environment variables, which may be set either in `.env` or on the system.
 */
// Calendar ID to read events from. Can be attained via the "Calendar ID" field in Google Calendar > Calendar Settings > Integrate Calendar
const CALENDAR_ID = process.env.CALENDAR_ID;
// This is configured in the Google Cloud Console under Credentials
const API_KEY = process.env.API_KEY;
// Number of events we'll fetch from the API; default to 10 if undefined
const NUM_EVENTS_TO_FETCH = process.env.NUM_EVENTS_TO_FETCH || 10;
// Logging verbosity, default to "info" (which is quiet as to not pollute server logs; "debug" is where we send event output)
const LOG_VERBOSITY = process.env.LOG_VERBOSITY || "info";
// HTTP Port to listen on; default to 3000
const HTTP_PORT = process.env.HTTP_PORT || 3000;
// Number of seconds between refreshing the cache
const SECONDS_BETWEEN_CACHE_REFRESH = process.env.SECONDS_BETWEEN_CACHE_REFRESH || 60;

/*
 * Constants
 */
const HEADER_CONTENT_TYPE = "Content-Type";
const MIME_TYPE_JSON = "application/json";

/*
 * Precondition checks
 */
if (CALENDAR_ID === undefined) {
  throw new Error("env var 'CALENDAR_ID' is required. Attain from Google Calendar > Calendar Settings > Integrate Calendar");
}
if (API_KEY === undefined) {
  throw new Error("env var 'API_KEY' is required. Attain from Google Cloud Console > Google API > Credentials");
}

/* 
 * Configure Logging
 */
logger.level = LOG_VERBOSITY;

/* 
 * Hold the calendar events
 */
var calendarEvents;

const app = express();
const router = express.Router();

let records = [];


router.get('/', (req, res) => {
  res.send('App is running..');
});

router.post('/add', (req, res) => {
  res.send('New record added.');
});

router.delete('/', (req, res) => {
  res.send('Deleted existing record');
});

router.put('/', (req, res) => {
  res.send('Updating existing record');
});


router.get('/demo', (req, res) => {
  res.json([
    {
      id: '001',
      name: 'Aayush',
    },
    {
      id: '002',
      name: 'rohit',
    },
    {
      id: '003',
      name: 'Mohit',
    },
  ]);
});

app.use('/.netlify/functions/api', router);
module.exports.handler = serverless(app);