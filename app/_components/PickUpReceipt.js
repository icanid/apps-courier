import React, { useState } from 'react';
import {View, StyleSheet, Text, TextInput, TouchableOpacity, Image,  SafeAreaView, KeyboardAvoidingView } from 'react-native';

const PickUpReceipt = (props) => {

    const sender = props.sender;
    const total = props.total;
    const weight = props.weight;
    const img = props.img;
    const onCreate = props.onCreate;
    const onBack = props.onBack;

    const [name, setName] = useState('');
    const [hp, setHp] = useState('');

    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.box}>
                <View style={{ flex:1, padding:20 }}>
                    <View style={{ flex:0.5 }}>
                        <Text style={{ flex : 1, textAlign:'center', textAlignVertical:'center', fontWeight:'bold' }}>TANDA TERIMA PICKUP</Text>
                    </View>
                    <View style={{ flex:1 }}>
                        <View style={{ flex:1, flexDirection:'row' }}>
                            <Text >Pengirim</Text>
                            <Text style={{ marginHorizontal:10 }}>:</Text>
                            <Text>{ sender }</Text>
                        </View>
                        <View style={{ flex:1, flexDirection:'row' }}>
                            <Text>Jumlah Paket</Text>
                            <Text style={{ marginHorizontal:10 }}>:</Text>
                            <Text>{ total }</Text>
                        </View>
                        <View style={{ flex:1, flexDirection:'row' }}>
                            <Text>Estimasi Berat</Text>
                            <Text style={{ marginHorizontal:10 }}>:</Text>
                            <Text> { weight } Gram</Text>
                        </View>
                    </View>
                    
                    <View style={{ flex:2, alignItems:'center', marginVertical:10 }}>
                        <Image
                            source={img}
                            style={{
                                flex : 1,
                                resizeMode : 'contain'
                            }}
                        />
                    </View>

                    <KeyboardAvoidingView behavior='padding' style={{ flex:2, flexDirection:'row' }}>
                        <View style={{ flex:1 }}>
                            <View>
                                <Text>Diserahkan Oleh :</Text>
                                <TextInput style={styles.inputMerah } onChangeText={(val)=>setName(val)}/>
                            </View>
                            <View>
                                <Text>No HP :</Text>
                                <TextInput style={styles.inputMerah } onChangeText={(val)=>setHp(val)} keyboardType='numeric'/>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                    <View style={{ flex:0.5, flexDirection:'row' }}>
                        <TouchableOpacity style={styles.buttonMerah} onPress={()=>onCreate(name, hp)}>
                            <Text style={{ flex:1, textAlign:'center', textAlignVertical:'center', fontWeight:'bold', color:'white'}}>Buat Tanda Terima</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonMerah}  onPress={()=>onBack()}>
                            <Text style={{ flex:1, textAlign:'center', textAlignVertical:'center', fontWeight:'bold', color:'white'}}>Kembali</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )

}

const styles = StyleSheet.create({
    container : {
        flex : 1
    },
    box : {
        flex:1,
        flexDirection:'column',
        borderColor:'red',
        borderWidth:5,
        margin:10,
        shadowOpacity:1
    },
    inputMerah : {
        borderWidth : 1,
        marginVertical: 5,
        marginRight: 5,
        borderColor:'red',
        padding:5
    },
    buttonMerah : {
        flex:1,
        borderWidth : 1,
        backgroundColor:'red',
        borderColor:'white',
        borderRadius:10,
        margin:2
    }
});
    
export default PickUpReceipt;