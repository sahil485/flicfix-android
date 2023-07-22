import React from 'react';
import { View, Dimensions, PermissionsAndroid } from 'react-native';
import { containerPadding } from '../App';
import CameraRollPicker from 'react-native-camera-roll-picker'

const SelectImage = ({ setCameraRollURI}) => {

    const windowWidth = Dimensions.get('window').width;

    return (
        <>
            <View style={{ height: '86%' }}>
                <CameraRollPicker callback={(selected) => {
                    try {
                        setCameraRollURI(selected[0].uri)
                    }
                    catch (e) {
                        console.log("Image unselected...");
                    }
                }} 
                
                backgroundColor={'black'}
                containerWidth={windowWidth-2*containerPadding}
                selectSingleItem={true}
                maximum={1}
                imagesPerRow={3}
                initialNumToRender={1}
                groupTypes="All"
                />
            </View>
        </>
    )
}

export default SelectImage