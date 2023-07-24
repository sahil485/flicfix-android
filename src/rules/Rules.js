import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    PermissionsAndroid,
    Image
} from 'react-native';

import Modal from 'react-native-modal';

const RulesModal = ({ visible, setVisible, requestPermission }) => {
    return (
        <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'left' }}>
            <Modal style = {{ height: '100vh', overflow: 'scroll', backgroundColor: '#695c82', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', borderRadius: 15 }} isVisible={visible}>
                <ScrollView persistentScrollbar={true} stickyHeaderIndices={[0]}>
                <View style= {{ backgroundColor: '#695c82', width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', marginTop: 5, paddingRight: 5}}>
                    <TouchableOpacity style={{ backgroundColor: '#9e9e9e', alignItems: 'center', borderWidth: 2, borderColor: '#9e9e9e', borderRadius: 15, alignSelf: 'flex-end'}} 
                                onPress={() => {setVisible(false)}}>
                        <Text style={{paddingVertical: 0, paddingHorizontal: 5, color: 'white', fontWeight: 'bold', fontSize: 15}}>X</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ marginTop: 10, marginLeft: 10 }}>
                    <Text style={{ fontSize: 25, fontWeight: 'bold' }}>Welcome to Flicfix!</Text>
                </View>
                <View style={{ marginTop: 30, marginHorizontal: 10 }}>
                    <Text style={{ fontSize: 20 }}>If you were unable to enable the permissions we prompted for when you first opened the app, click here:</Text>
                    <TouchableOpacity style={{ borderColor: 'white', borderWidth: 1, alignSelf: 'center', marginTop: 7 }} onPress={() => {
                        requestPermission(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
                        requestPermission(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE)}}>
                            <Text style = {{ padding: 5}}>Enable Permissions</Text>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 15, marginTop: 7 }}>(If no popup appears you're all set!)</Text>
                </View>
                <View style={{ marginTop: 30, marginHorizontal: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Text style={{ fontSize: 20, alignSelf: 'flex-start' }}>Next, select an image to edit from your camera roll by clicking this icon:</Text>
                    <Image 
                            source={require('../../assets/upload.png')}
                            resizeMode='contain'
                            style={{
                                backgroundColor: 'white',
                                width: 100,
                                height: 100,
                                borderColor: 'white', 
                                borderRadius: 20,
                                marginTop: 7
                            }}/>
                </View>
                <View style={{ marginTop: 15, marginHorizontal: 10, display: 'flex', flexDirection: 'column', alignItems: 'center'  }}>
                    <Text style={{ fontSize: 20 }}>After a few seconds, you'll see your image on the screen. Hold down the blue microphone icon in the center of the bottom bar and say the edits you wish to make while keeping it pressed. You will see your words appear in the black text box.</Text>
                    <View style={{ backgroundColor: '#a5d1f3', borderRadius: 50, marginTop: 10}}>
                        <Image 
                                source={require('../../assets/mic.png')}
                                resizeMode='contain'
                                style={{
                                    width: 90,
                                    height: 90,
                                    borderColor: '#a5d1f3',
                                    marginVertical: 7
                                }}/>
                    </View>
                </View>
                <View style={{ marginTop: 15, marginHorizontal: 10, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <Text style={{ fontSize: 20 }}>Finally, click the black arrow next to the text box to start editing. Editing usually takes less than 10 seconds, but can take up to a minute.</Text>
                    <View style={{ backgroundColor: '#a5d1f3', borderRadius:25, marginTop: 10, display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                        <Image 
                                source={require('../../assets/submit.png')}
                                resizeMode='contain'
                                style={{
                                    width: 80,
                                    height: 80,
                                    borderColor: '#a5d1f3',
                                }}/>
                    </View>
                </View>
                <View style={{ marginTop: 15, marginHorizontal: 10, marginBottom: 10 }}>
                    <Text style={{ fontSize: 20 }}>Upon completion, you will see your edited photo. You can save it, regenerate it, or go back and forth between edits as you wish using the bottom bar!</Text>
                </View>
                </ScrollView>
            </Modal>
        </View>
    )
}

export default RulesModal