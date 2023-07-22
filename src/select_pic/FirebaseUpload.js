import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';

import storage from '@react-native-firebase/storage'
import messaging from '@react-native-firebase/messaging'

const FirebaseUpload = ({ cameraRollURI, setImgSize, updateURLChain, togglePhotoSelection, setFirebaseRef }) => {

    const [uploading, setUploading] = useState(false)
    const [editedPath, setEditedPath] = useState("")

    const imgName = cameraRollURI.split("/")[cameraRollURI.split("/").length - 1]
    const reference =  storage().ref(imgName);

    const uploadImg = async () => {
        setUploading(true)

        const pathToFile = cameraRollURI
        await reference.putFile(pathToFile) //upload file to firebase
    }

    //listener for Eventarc channel 
    useEffect(() => {
        messaging().onMessage( (message) => {
            setEditedPath(message.data.path)
        })
    }, [cameraRollURI])

    //after resize is complete, process the edited image
    useEffect(() => {
        if(editedPath != "")
        {
            setFirebaseRef(editedPath)
            storage().ref(editedPath).getDownloadURL()
            .then(async (url) => {
                await Image.getSize(url, (width, height) => {
                    setImgSize({width: width, height: height})
                })
                return url
            })
            .then((url) => {
                updateURLChain([url])
                togglePhotoSelection(false)
            })
            .catch(e => console.log(e)) //make this an error notification if needed
        }
    }, [editedPath])


    return (
        <View style={styles.container}>
            {uploading ? (
                <View style={styles.processing}>
                    <ActivityIndicator size="large" color="black" />
                    <Text style={{color: 'black', fontSize: 15}}>Processing...</Text>
                </View>
            ) : (
                <TouchableOpacity style={styles.select} onPress={uploadImg}>
                    <Text style={{color: 'black', fontSize: 15}}>Select</Text>
                </TouchableOpacity>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container:
    {
        alignSelf: 'center',
        overflow: 'scroll',
    },
    processing:
    {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    select: 
    {
        backgroundColor: '#a5d1f3',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        borderRadius: 8,
        width: 80,
        marginTop: 10
    }
});

export default FirebaseUpload