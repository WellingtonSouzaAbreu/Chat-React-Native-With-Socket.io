import React, { Component } from 'react'
import { ScrollView, Modal, View, Text, StyleSheet, TextInput, TouchableOpacity, StatusBar, FlatList } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import Icon from 'react-native-vector-icons/FontAwesome'

import socketIOClient from "socket.io-client"
const socket = socketIOClient('http://192.168.2.183:1000')

import MessageSender from './components/MessageSender.js'
import MessageReceiver from './components/MessageReceiver.js'

const initialState = {
    user: '',
    messages: [],
    message: '',
    executeDidMountAgain: true,

    modalVisibility: true
}


class App extends Component {
    state = { ...initialState }

    componentDidMount() {

        if (this.state.executeDidMountAgain) {
            this.setState({ executeDidMountAgain: false })

            socket.on('previousMessage', (messages) => {
                this.setState({ messages })
            })
        }

        socket.on('receivedMessage', message => {
            // console.log('receivedMessage: ' + message)
            let messages = [...this.state.messages]
            messages.push(message)

            console.log(messages)

            this.setState({ messages })
        })
    }

    setUser = () => {
        if (this.state.user) {
            AsyncStorage.setItem('user', this.state.user)
            this.setState({ modalVisibility: false })
        }
    }

    renderMessages = () => {
        return (
            this.state.messages.map(msg => {
                if (msg.author === this.state.user) {
                    return <MessageSender textMessage={msg.message} />
                } else {
                    return <MessageReceiver textMessage={msg.message} />
                }
            })
        )
    }

    sendMessage = () => {
        if (this.state.message) {
            let messages = [...this.state.messages]

            let message = {
                id: `${Math.random()}`,
                message: this.state.message,
                author: this.state.user
            }

            messages.push(message)
            socket.emit('sendMessage', message)

            this.setState({ messages: messages, message: '' })
        }
    }

    scroolView = () => {
        this.refs.flat.scrollToEnd({ animated: true })
    }

    render() {
        return (
            <View style={styles.container}>

                <Modal visible={this.state.modalVisibility}
                    animationType='slide' transparent={true}
                    style={styles.modal}>
                    <View style={styles.modalContainer}>
                        <View style={styles.offset}></View>
                        <View style={styles.addUser}>
                            <Text style={styles.modalTitle}>Informe seu nome</Text>
                            <TextInput value={this.state.user}
                                onChangeText={name => this.setState({ user: name })}
                                style={styles.nameInput}>
                            </TextInput>
                            <TouchableOpacity style={styles.button} onPress={this.setUser}>
                                <Text style={styles.buttonText}>OK</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.offset}></View>
                    </View>
                </Modal>

                <StatusBar style="auto" />

                <View style={styles.displayMessages}>
                    {/* <FlatList
                        onChangeText={() => console.log('New Item')}
                        data={this.state.messages}
                        keyExtractor={msg => `${msg.id}`}
                        renderItem={this.renderMessages}  >

                    </FlatList> */}


                    <ScrollView ref={'flat'} onContentSizeChange={this.scroolView}>
                        {this.renderMessages()}
                    </ScrollView>


                </View>
                <View style={styles.inputArea}>
                    <TextInput placeholder='Digite uma mensagem...' style={styles.inputMessage}
                        onFocus={this.scroolView}
                        onChangeText={message => this.setState({ message })}
                        keyboardType='default' value={this.state.message}>

                    </TextInput>
                    <TouchableOpacity style={styles.sendButton} onPress={this.sendMessage}>
                        <Icon style={styles.sendIcon} name='arrow-right' size={25} color='#000' />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

export default App

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10
    },
    modalContainer: {
        flex: 1,
    },
    offset: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)'
    },
    addUser: {
        backgroundColor: '#228AB5',
        alignItems: 'center'
    },
    modalTitle: {
        fontSize: 17,
        color: 'white'
    },
    nameInput: {
        borderWidth: 2,
        borderRadius: 5,
        borderColor: 'white',
        fontSize: 20,
        color: 'white',
        paddingLeft: 8,
        width: '70%',
        padding: 10
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        padding: 10,
        backgroundColor: 'skyblue',
        width: 80,
        height: 30,
        marginBottom: 10,
        borderWidth: 4,
        borderColor: 'white'
    },
    buttonText: {
        color: 'white',
        padding: 10
    },

    displayMessages: {
        flex: 9,
        borderWidth: 1,
        borderColor: 'ghostwhite',
        borderRadius: 5,
        padding: 10
    },
    inputArea: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 10,
        alignItems: 'center'
    },
    inputMessage: {
        flex: 1,
        marginVertical: 30,
        fontSize: 18,
        height: 50,
        width: 50,
        borderRadius: 10,
        marginRight: 8,
        paddingLeft: 10,
        borderWidth: 1,
        borderColor: 'lightgray',
    },
    sendButton: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        width: 50,
        borderRadius: 30,
        backgroundColor: 'black'
    },
    sendIcon: {
        color: 'white'
    }
});