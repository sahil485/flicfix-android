import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    PermissionsAndroid,
    Alert
} from 'react-native';

import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import RNFetchBlob from 'rn-fetch-blob'
import Voice from '@react-native-community/voice';
import ReplicateBtn from './Replicate';
import { callReplicate } from './Replicate';
import ImageCont from './ImageCont'
import SelectImage from './select_pic/SelectImage';
import FirebaseUpload from './select_pic/FirebaseUpload';
import BottomBar from './bottom_bar/BottomBar';

import storage from '@react-native-firebase/storage';
import messaging from '@react-native-firebase/messaging'

export const containerPadding = 20

const App = () => {
    const [prompt, setPrompt] = useState('');
    const [isEditing, setEditing] = useState(false)
    const [imgSize, setImgSize] = useState(null)
    const [cameraRollURI, setCameraRollURI] = useState("")
    const [URLChain, updateURLChain] = useState([])
    const [promptChain, updatePromptChain] = useState(["Original"])
    const [URLChainInd, incrementURLChainInd] = useState(0)
    const [showPhotoSelection, togglePhotoSelection] = useState(false)
    const [firebaseRef, setFirebaseRef] = useState("")

    const speechStartHandler = e => {
        console.log('speechStart successful', e);
    };

    const speechPartialResultsHandler = e => {
        const text = e.value[0];
        setPrompt(text);
    };

    const speechResultsHandler = e => {
        const text = e.value[0];
        setPrompt(text)
    }

    const startRecording = async () => {
        try 
        {
            await Voice.start('en-Us');
        } 
        catch(error) 
        {
            console.log('error', error);
        }
    };

    const stopRecording = () => {
        Voice.stop()
            .then(console.log("Done recording speech... "))
            .then(Voice.destroy())
            .then(Voice.removeAllListeners())
    }

    const regenerateImg = async() => {

        if(URLChainInd == 0) return

        const regen_prompt = promptChain[URLChainInd]
        const regen_base_URL = URLChain[URLChainInd - 1]
        const regen_ind = URLChainInd - 1
        await callReplicate( setImgSize, setEditing, setPrompt, regen_prompt, regen_base_URL, URLChain, updateURLChain, regen_ind, incrementURLChainInd, incrementURLChainInd, promptChain, true )
    }

    // const prevScreen = (exit = false) => {
    function prevScreen(exit = false){
        if(URLChainInd == 0 || exit)
        {
            Alert.alert(
                "Return to Photo Selection?",
                "All unsaved photo edits will be deleted",
                [
                    {
                        text: 'Ok',
                        onPress: () => 
                        {
                            updateURLChain([])
                            try
                            {
                                storage().ref(firebaseRef).delete()
                                setFirebaseRef("")
                                console.log("deleted from firebase")
                                incrementURLChainInd(0)
                            }
                            catch(e)
                            {
                                console.log(e)
                            }
                        },
                        style: 'cancel',
                    },
                    {
                        text: 'Cancel',
                        style: 'cancel'
                    }
                  ],
            )
        }
        else if(URLChainInd > 0) incrementURLChainInd(URLChainInd - 1)
    }

    const nextScreen = () => {
        if(URLChainInd < URLChain.length - 1) incrementURLChainInd(URLChainInd + 1)
        else console.log("cant")
    }

    const saveImg = () => {
        function save() {
            RNFetchBlob.config({
                fileCache: true,
                appendExt: 'jpg',
              })
                .fetch('GET', URLChain[URLChainInd])
                .then(res => {
                    CameraRoll.save(res.data, 'photo')
                })
        }

        if(URLChainInd == 0)
        {
            Alert.alert(
                "Save as duplicate?",
                "This image is already in your Camera Roll",
                [
                    {
                        text: "Save",
                        onPress: () => save(),
                        style: 'cancel'
                    },
                    {
                        text: "Cancel",
                        style: 'cancel'
                    }
                ]
            )
        }
        else save()
    }

    const requestPermission = async (permission) => {
        try {
            const granted = await PermissionsAndroid.check(permission)
            if(!granted) 
            {
                await PermissionsAndroid.request(permission)
            }
        }
        catch (e) {
            console.warn(e)
        }
    }
    
    useEffect(() => {
        Voice.onSpeechStart = speechStartHandler;
        Voice.onSpeechPartialResults = speechPartialResultsHandler;
        Voice.onSpeechResults = speechResultsHandler;
    }, []);

    useEffect(() => {
        requestPermission(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
        requestPermission(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE)
        requestPermission(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO)
        requestPermission(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS)
        messaging().subscribeToTopic("image-resize-completion").then(() => console.log("subscribed to topic image-resize-completion"))
    }, [])

    return (
        <View style={{...styles.container, justifyContent: (!showPhotoSelection && !(URLChain.length <= 0)) ? 'flex-start' : 'center'}}>
            <View style={{ alignItems : 'center'}}>
                {(showPhotoSelection || URLChainInd > 0) ? (
                    <View style={{ display: 'flex', width: '100%', alignItems: 'flex-end', height: '4%'}}>
                        <TouchableOpacity style={{ backgroundColor: '#9e9e9e', alignItems: 'center', borderWidth: 2, borderColor: '#9e9e9e', borderRadius: 15, marginRight: 0}} 
                            onPress={() => {
                                if(URLChain.length > 0) prevScreen(true)
                                else togglePhotoSelection(false)
                            }}>
                            <Text style={{paddingVertical: 0, paddingHorizontal: 5, color: 'white', fontWeight: 'bold', fontSize: 13}}>X</Text>
                        </TouchableOpacity>
                    </View>
                ) : (null)}
                {URLChain.length > 0 ? (
                    <>
                        <ImageCont edited = {URLChain.length > 1} imgSize = {imgSize} 
                            imgLink = {URLChain[URLChainInd]} incrementURLChainInd={incrementURLChainInd}
                        />
                    </>
                ) : (
                    <>
                        {showPhotoSelection ? (
                            <>
                                <Text style = {{ color: 'black', alignSelf: 'center'}}>Select Image From Camera Roll: </Text>
                                <SelectImage setCameraRollURI = {setCameraRollURI}/>
                                <FirebaseUpload cameraRollURI = {cameraRollURI}
                                                setImgSize={setImgSize} 
                                                updateURLChain={updateURLChain}
                                                togglePhotoSelection={togglePhotoSelection}
                                                setFirebaseRef={setFirebaseRef}
                                                />
                            </>
                        ) 
                        :
                        (
                            <TouchableOpacity style={styles.placeholder} 
                                onPress={() => {togglePhotoSelection(true)}
                            }>
                                <ImageCont needToPick={true} />
                                <Text style={{ color: 'black', fontSize: 17, paddingBottom: 5 }}>Click to Select Photo</Text>
                            </TouchableOpacity>
                        )}
                    </>
                )}
                {!showPhotoSelection && !(URLChain.length <= 0)  ? (
                    <View style={styles.textInputCont}>
                        <View style={styles.textInputBox} disabled={URLChain.length <= 0}>
                            <TextInput
                                value={prompt}
                                multiline={true}
                                placeholder= {URLChain.length > 0 ? "Prompt:" : ""}
                                onChangeText={text => setPrompt(text)}
                                style = {{ width: '90%', overflow: 'scroll' }}
                            />
                            {prompt ? (
                                <TouchableOpacity disabled={URLChain.length <= 0} onPress={() => setPrompt("")} 
                                    style={styles.clearPrompt}>
                                    <Text style={{ fontSize:20, color: 'white' }}>X</Text>
                                </TouchableOpacity>
                                    ) : ( null )}
                        </View>
                        <View disabled={URLChain.length <= 0} style={{ width: '15%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                            {isEditing ? (
                                <ActivityIndicator size="large" color="black" />
                                ) : (
                                <ReplicateBtn
                                    setImgSize = {setImgSize} 
                                    setEditing = {setEditing} 
                                    setPrompt = {setPrompt} 
                                    prompt={prompt} 
                                    imageURL = {URLChain[URLChainInd]}
                                    URLChain = {URLChain}
                                    updateURLChain = {updateURLChain}
                                    URLChainInd = {URLChainInd}
                                    incrementURLChainInd = {incrementURLChainInd}
                                    promptChain = {promptChain}
                                    updatePromptChain = {updatePromptChain}
                                />
                            )}
                        </View>
                    </View>
                ) : (null)}
                </View>
            {!showPhotoSelection && !(URLChain.length <= 0) ? (
                <BottomBar ind={URLChainInd} startRecording={startRecording} stopRecording={stopRecording} regenerate={regenerateImg} prev={prevScreen} next={nextScreen} save={saveImg}/>
            ) : (null)}
        </View>
    );
};

const styles = StyleSheet.create({
    container: 
    {
        flex: 1,
        backgroundColor: '#fff',
        padding: containerPadding,
        display: 'flex',
        flexDirection: 'column',
        // justifyContent: 'center'
    },
    imgContainer: 
    {
        display: 'flex', 
        flexDirection: 'column',
        width: '100%',
        height: '70%',
        alignItems : 'center',
        marginVertical: 20
    },
    headingText: 
    {
        alignSelf: 'center',
        marginVertical: 20,
        fontWeight: 'bold',
        fontSize: 26,
        color: '#000000'
    },

    textInputCont: 
    {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginTop: 10,
        height: 60
    },

    textInputBox: 
    {
        flexDirection: 'row',
        height: '100%',
        width: '80%',
        backgroundColor: 'black',
        borderRadius: 20,
        paddingVertical: 5,
        paddingHorizontal: 16,
        alignItems: 'center'
    },
    clearPrompt:{
        position: 'absolute',
        right: 20,
        alignItems: 'center', 
        justifyContents: 'center',
        width: 20,
        borderRadius : 10,
        backgroundColor :'black' 
    },
    placeholder: {
        width: '85%',
        // height: '50%',
        display: 'flex', 
        flexDirection: 'column',
        borderWidth: 3,
        borderRadius: 20,
        borderColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        borderStyle: 'dashed',
        marginTop: 10
    },
    uploadIcon: {
        width: '90%',
        height: '90%',
    },
});

export default App;