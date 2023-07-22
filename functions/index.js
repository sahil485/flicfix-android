const {onCustomEventPublished} = require("firebase-functions/v2/eventarc");
const logger = require("firebase-functions/logger");
const {onCall} = require("firebase-functions/v2/https");
const {initializeApp, cert} = require("firebase-admin/app");
const admin = require('firebase-admin');
const {getStorage} = require('firebase-admin/storage');
const scheduler = require('firebase-functions/v2/scheduler')

var serviceAccount = require('./serviceAccount.json');

const app = initializeApp({
    credential: cert(serviceAccount),
    storageBucket: 'flicfix.appspot.com'
});

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

exports.strorageCleanup = scheduler.onSchedule("0 0 * * * ", async(event) =>{
    const flicBucket = getStorage().bucket()
    const folder = 'editable/'
    const oneHourAgo = Date.now() - 60*60*1000
    const results = flicBucket.getFiles({
        prefix: folder
    })
    .then((res) => {
        const filesToDelete = []
        res[0].forEach((file) => {
            if(Date.parse(file.metadata.timeCreated) < parseInt(oneHourAgo.toString())) filesToDelete.push(file)
        })
        return Promise.all(filesToDelete.map((file) => file.delete()))
    })
    return results
});