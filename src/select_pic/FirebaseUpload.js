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
import { firebase } from '@react-native-firebase/functions';

const FirebaseUpload = ({ cameraRollURI, setImgSize, updateURLChain, togglePhotoSelection, setFirebaseRef }) => {

    const [uploading, setUploading] = useState(false)

    const imgName = cameraRollURI.split("/")[cameraRollURI.split("/").length - 1]
    const reference =  storage().ref(imgName);

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    const uploadImg = async () => {
        setUploading(true)
        console.log("Firebase")
        console.log(imgName)

        const pathToFile = cameraRollURI
        // uploads file
        const editedRef = `/editable/${imgName.split(".")[0]}_400x400.${imgName.split(".")[1]}`

        await reference.putFile(pathToFile)
            .then(() => delay(2000))
            .then(() => {
                console.log(1)
                setFirebaseRef(editedRef)
                return storage().ref(editedRef).getDownloadURL()
            })
            .then(async (url) => {
                await Image.getSize(url, (width, height) => {
                    console.log(2)
                    console.log(url)
                    console.log(width, height)
                    setImgSize({width: width, height: height})
                })
                return url
            })
            .then((url) => {
                console.log(3)
                updateURLChain([url])
            })
            .then(() => {
                console.log(4)
                togglePhotoSelection(false)
            })
            .catch(e => console.log(e))

    }



    return (
        <View style={styles.container}>
            {uploading ? (
                <ActivityIndicator size="large" color="black" />
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
    select: 
    {
        backgroundColor: '#a5d1f3',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        borderRadius: 8,
        width: 80,
        marginTop: 10,
        // marginBottom: 10
    }
});

export default FirebaseUpload