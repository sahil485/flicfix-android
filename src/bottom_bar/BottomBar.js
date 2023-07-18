import styles from "./styles";
import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
} from 'react-native';

const BottomBar = ({ disabled, startRecording, stopRecording, regenerate, prev, next, save }) => {

    return (
        <>
            <View style={styles.container}>
                <View style={styles.button}>
                    <TouchableOpacity disabled={disabled} style={{ alignItems: 'center', justifyContent: 'center' }} onPress={prev} >
                        <Image 
                            source={require('../../assets/back.png')}
                            resizeMode='contain'
                            style={{
                                width: 25,
                                height: 25,
                                marginTop: 7
                            }}/>
                        <Text style={{ fontSize: 12, color: 'black' }}>
                            Previous
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.button}>
                    <TouchableOpacity disabled={disabled} style={{ alignItems: 'center', justifyContent: 'center' }} onPress={regenerate} >
                        <Image 
                            source={require('../../assets/regen.png')}
                            resizeMode='contain'
                            style={{
                                width: 25,
                                height: 25,
                                marginTop: 7
                            }}/>
                        <Text style={{ fontSize: 12, color: 'black' }}>
                            Retry
                        </Text>
                    </TouchableOpacity>
                </View>    

                <View style={styles.middleIcon}>
                    <TouchableOpacity disabled={disabled} style={{ alignItems: 'center', justifyContent: 'center', width: 60, height: 60, borderRadius: 30, backgroundColor : '#a5d1f3'}}
                        onLongPress={startRecording}
                        delayLongPress={150}
                        onPressOut={stopRecording}
                        >
                        <Image 
                            source={require('../../assets/mic.png')}
                            resizeMode='contain'
                            style={{
                                width: 40,
                                height: 40,
                            }}/>
                    </TouchableOpacity>
                </View>    

                <View style={styles.button}>
                    <TouchableOpacity disabled={disabled} style={{ alignItems: 'center', justifyContent: 'center' }} onPress={save}>
                        <Image 
                            source={require('../../assets/save.png')}
                            resizeMode='contain'
                            style={{
                                width: 25,
                                height: 25,
                                marginTop: 7
                            }}/>
                        <Text style={{ fontSize: 12, color: 'black' }}>
                            Save
                        </Text>
                    </TouchableOpacity>
                </View>    

                <View style={styles.button}>
                    <TouchableOpacity disabled={disabled} style={{ alignItems: 'center', justifyContent: 'center' }} onPress={next}>
                        <Image 
                            source={require('../../assets/forward.png')}
                            resizeMode='contain'
                            style={{
                                width: 25,
                                height: 25,
                                marginTop: 7
                            }}/>
                        <Text style={{ fontSize: 12, color: 'black' }}>
                            {'   '}Next{'   '}
                        </Text>
                    </TouchableOpacity>
                </View>                                    
            </View>
        </>
    )
}

export default BottomBar