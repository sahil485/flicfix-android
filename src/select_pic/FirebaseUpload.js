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
        console.log("Firebase")
        console.log(imgName)

        const pathToFile = cameraRollURI
        // uploads file

        const { state } = await reference.putFile(pathToFile)
        console.log(state)


        // .then((editedRef) => {
        //     console.log(1)
        //     setFirebaseRef(editedRef)
        //     return storage().ref(editedRef).getDownloadURL()
        // })
        // .then(async (url) => {
        //     await Image.getSize(url, (width, height) => {
        //         console.log(2)
        //         console.log(url)
        //         console.log(width, height)
        //         setImgSize({width: width, height: height})
        //     })
        //     return url
        // })
        // .then((url) => {
        //     console.log(3)
        //     updateURLChain([url])
        //     togglePhotoSelection(false)
        // })
        // .catch(e => console.log(e))
    }

    useEffect(() => {
        console.log("listening")
        const hello = messaging().onMessage( (message) => {
            console.log("MESSAGE", message.data)
            setEditedPath(message.data.path)
        })
        // return hello 
    }, [])

    useEffect(() => {
        console.log("starting here")
        if(editedPath != "")
        {
            setFirebaseRef(editedPath)
            storage().ref(editedPath).getDownloadURL()
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
                togglePhotoSelection(false)
            })
            .catch(e => console.log(e))
        }
    }, [editedPath])


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