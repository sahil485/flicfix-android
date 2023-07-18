import React, { useState } from 'react';
import {
    View,
    Image,
    StyleSheet,
} from 'react-native';

const ImageCont = ({ imgSize, imgLink, needToPick }) => {
    
    return (
        <>
            {(imgLink && imgSize) ? (
                <View style = {styles.imgContainer}>
                    <Image style={{ aspectRatio : imgSize.width/imgSize.height, width: '95%', justifyContent : 'center', borderRadius: 20 }} source={{uri: imgLink}}/>
                </View>
                ) : ( null )}

            {needToPick ? (
                <View style = {styles.imgContainer}>
                    <Image resizeMode={'contain'} style={{ aspectRatio : 210/171, width: '100%', justifyContent : 'center', borderRadius: 20, backgroundColor: 'transparent' }} source={require('../assets/upload.png')}/>
                </View>
                ) : ( null )}
        </>
    )
}

const styles = StyleSheet.create({
    imgContainer: 
    {
        display: 'flex', 
        flexDirection: 'column',
        width: '100%',
        alignItems : 'center',
        marginVertical: 20
    }
});

export default ImageCont