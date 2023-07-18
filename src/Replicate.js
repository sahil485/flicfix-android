import Replicate from 'replicate'
import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
// import { REPLICATE_API_KEY } from '@env'
const REPLICATE_API_KEY = '2984b2678c0457b07d7b0ab3ac037fdafea66a84'

const ReplicateBtn = ({ setImgSize, setEditing, setPrompt, prompt, imageURL, URLChain, updateURLChain, URLChainInd, incrementURLChainInd, promptChain, updatePromptChain }) => {

    return (
        <View style={styles.btnContainer}>
            <TouchableOpacity style={styles.button}
                onPress={() => callReplicate( setImgSize, setEditing, setPrompt, prompt, imageURL, URLChain, updateURLChain, URLChainInd, incrementURLChainInd, promptChain, updatePromptChain )}>
                <Image source={require('../assets/submit.png')}
                    style={{ 
                        width: 45, 
                        height: 45
                     }}/>
            </TouchableOpacity>
        </View>
    )
}

export const callReplicate = async ( setImgSize, setEditing, setPrompt, prompt, imageURL, URLChain, updateURLChain, URLChainInd, incrementURLChainInd, promptChain, updatePromptChain, regenerating ) => {

    if(prompt == '') return
    const api_token = REPLICATE_API_KEY
    const replicate = new Replicate({
        auth: api_token
    })

    setEditing(true)
    console.log("Starting...")
    console.log("prompt", prompt)
    try
    {
        const model = "timothybrooks/instruct-pix2pix:30c1d0b916a6f8efce20493f5d61ee27491ab2a60437c13c588468b9810ec23f"
        const input = { image : imageURL, prompt : prompt }
        const output = await replicate.run(model, { input })
        console.log(output)
        
        //if the current one being edited is not the latest in the chain, add this as the next in the chain and erase the rest
        
        setEditing(false)
        if(URLChainInd < URLChain.length - 1)
        {
            updateURLChain([...URLChain.slice(0, URLChainInd+1), output[0]])
            if(!regenerating)
            {
                updatePromptChain([...promptChain.slice(0, URLChainInd+1), prompt])
            }
        }

        else 
        {
            updateURLChain([...URLChain, output[0]])
            if(!regenerating) updatePromptChain([...promptChain, prompt])
        }
        incrementURLChainInd(URLChainInd+1)
        setPrompt("")
        Image.getSize(output[0], (width, height) => {
            console.log("edited" , width)
            console.log('edited', height)
            setImgSize({width: width, height: height})
        })
    }
    catch(e)
    {
        console.log("Editing unsuccessful", e)
        setEditing(false)
    }
}

const styles = StyleSheet.create({
    button: 
    {
        backgroundColor: '#a5d1f3',
        height: '100%',
        width: '100%',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'black',
        paddingLeft: 5
    },
    btnContainer: 
    {
        width: '100%',
        height: '100%',
        marginLeft: 10
    }
})

export default ReplicateBtn

