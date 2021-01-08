import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

const MessageReceiver = (props) => {
    return (
        <>
            <View style={styles.container}>
                <Text style={styles.textMessage}>{props.textMessage}</Text>
            </View >
        </>
    )
}

export default MessageReceiver

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F1F1F1',
        width: '80%',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 7,
        justifyContent: 'center',
        paddingLeft: 5,
        marginBottom: 8,
        padding: 5
    },
    textMessage: {
        flexWrap: 'wrap',
        color: 'black',
    }
})