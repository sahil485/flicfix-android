/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onCustomEventPublished} = require("firebase-functions/v2/eventarc");
// require("firebase-functions/logger/compat");
// const logger = require("firebase-functions/logger");
const {onCall} = require("firebase-functions/v2/https");
const {initializeApp} = require("firebase-admin/app");
const admin = require('firebase-admin');

const app = initializeApp();

exports.onimageresized = onCustomEventPublished(
    "firebase.extensions.storage-resize-images.v1.complete",
        (event) => {
            const payload = {
                data: {
                    path: event.data.outputs[0].outputFilePath
                },
                topic: 'image-resize-completion',
              };
              
            return admin.messaging().send(payload)
    });


// logger.info(event);
// logger.log(event.data.outputs[0].outputFilePath)

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
