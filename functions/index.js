const {onCustomEventPublished} = require("firebase-functions/v2/eventarc");
const logger = require("firebase-functions/logger");
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