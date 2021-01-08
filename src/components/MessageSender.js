import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

const MessageSender = (props) => {
    return (
        <>
            <View style={styles.container}>
                <Text style={styles.textMessage}>{props.textMessage}</Text>
            </View >
        </>
    )
}

export default MessageSender

const styles = StyleSheet.create({
    container: {
        alignSelf: 'flex-end',
        backgroundColor: '#C6EFD4',
        width: '80%',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 7,
        paddingHorizontal: 8,
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