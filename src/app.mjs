// Create clients and set shared const values outside of the handler.

// Create a DocumentClient that represents the query to add an item
import { DynamoDBClient, ResourceNotFoundException } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, PutCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

// Get the DynamoDB table name from environment variables
const businessNameTable = process.env.BUSINESS_NAME_TABLE;
const adTextTable = process.env.AD_TEXT_TABLE;
const backlinksTable = process.env.BACKLINKS_TABLE;

const adTextArray = [
    "Happy Hour Hustle! Dive in between 4-6 PM for half-off cocktails. Why limit happiness to an hour?",
    "Ladies' Night Extravaganza! Every Friday night, ladies enjoy their first cocktail on the house. Cheers to girl power!",
    "Mug Club Magic! Join our exclusive club. Buy a mug, and every refill gets a discount. Your personal mug awaits!",
    "Wine Down Wednesdays! Midweek blues? Unwind with 25% off all wine bottles. Sip, relax, repeat.",
    "Sunday Funday Fiesta! Special deals all day! Pair it with live sports on the big screen. Sundays just got better!",
    "Flight Night Delight! Curious about craft beers? Sample four for the price of three every Thursday. Explore and adore!",
];

const businessNamesArray = [
    "Happy Hour Haven",
    "Mug Club Manor",
    "Sunday Funday Sanctuary",
    "Flight Night Lounge",
    "Fiesta House",
    "Sip & Savor",
    "Vino Vista Lounge",
    "Lady Luxe Lounge",
];

const backlinksArray = [
    "random-website0.com",
    "random-website1.com",
    "random-website2.com",
    "random-website3.com",
    "random-website4.com",
    "random-website5.com",
];

/**
 * 
 * @param {Number} x - lower bound inclusive
 * @param {Number} y - upper bound inclusive
 * @returns {Number} random number between x,y inclusive
 */
function getRandomNumberBetween(x, y) {
    // Use Math.floor() to make sure the result is an integer
    return Math.floor(Math.random() * (y - x + 1)) + x;
}
// const axios = require('axios')
// const url = 'http://checkip.amazonaws.com/';
let response;

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */
export const lambdaHandler = async (event, context) => {
    console.info('received:', event);
    if (event.httpMethod === 'GET') {
        if (event.resource === '/ad') {
            console.log("********** If statement: GET /ad *************");

            const businessNameId = getRandomNumberBetween(0, businessNamesArray.length - 1);
            const adTextId = getRandomNumberBetween(0, adTextArray.length - 1);
            const backlinkId = getRandomNumberBetween(0, backlinksArray.length - 1);
            const allowedDomain = '*';

            console.log("businessNameId: ", businessNameId);
            console.log("adTextId: ", adTextId);
            console.log("backlinkId: ", backlinkId);

            try {
                var businessName = businessNamesArray[businessNameId];
                var adText = adTextArray[adTextId];
                var backlink = backlinksArray[backlinkId];
            } catch (err) {
                console.log("Error", err);
            }

            const response = {
                'statusCode': 200,
                headers: {
                    "Access-Control-Allow-Origin": allowedDomain, // Specify the domain you want to allow
                },
                'body': JSON.stringify(
                    {
                        "businessName": businessName,
                        "textBody": adText,
                        "backlink": backlink
                    })
            };
            return response

        } else {
            const response = {
                'statusCode': 200,
                'body': JSON.stringify(
                    { 'message': 'path not supported' }
                )
            };
            return response
        }
    } else {
        const response = {
            'statusCode': 200,
            'body': JSON.stringify(
                { 'message': 'only GET supported' }
            )
        };
        return response
    }
};
