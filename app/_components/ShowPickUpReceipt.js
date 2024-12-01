import React, { useState } from 'react';
import {View, StyleSheet, Text, Image, TouchableOpacity} from 'react-native';
import { HostImgCorporate } from './HostUri';

const ShowPickUpReceipt = (props) => {

    const sender = props.sender;
    const total = props.total;
    const weight = props.weight;
    const img = props.img;
    const name = props.name;
    const hp = props.hp;
    const [zoom, setZoom] = useState(false);
    const uriImage = HostImgCorporate+img;

    const zoomHanlder = () => {
        setZoom(!zoom);
    }

    return(
        <View style={styles.container}>
        { zoom &&
            <TouchableOpacity style={styles.zoomImg} onPress={()=>{zoomHanlder()}}>
            <Image
            source={{uri: uriImage }}
            style={{
                height:400,
                width:400,
                resizeMode : 'contain',
                alignSelf:'center',
            }}
            />
            </TouchableOpacity>
        }
        { !zoom &&
            <View style={styles.box}>
                <View style={{ flex:1, padding:20 }}>
                    <View style={{ flex:1 }}>
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
                    
                    <TouchableOpacity style={{ flex:2, alignItems:'center', marginVertical:10 }} onPress={()=>{zoomHanlder()}}>
                        <Image
                        source={{uri: uriImage }}
                        style={{
                            // flex : 1,
                            height:'100%',
                            width:'100%',
                            resizeMode : 'contain'
                        }}
                        />
                    </TouchableOpacity>

                    <View style={{ flex:2, flexDirection:'row' }}>
                        <View style={{ flex:3 }}>
                            <View>
                                <Text>Diserahkan Oleh :</Text>
                                <Text>{name}</Text>
                            </View>
                            <View>
                                <Text>No HP :</Text>
                                <Text>{hp}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
            }
        </View>
    )

}

const styles = StyleSheet.create({
    container : {
        // flex : 1,
        height:'90%',
        // verticalAlign:'middle',
        // ver
        // marginHorizontal:20,
        marginVertical:0,
    },
    box : {
        flex:1,
        flexDirection:'column',
        borderColor:'red',
        borderWidth:5,
        margin:10,
        shadowOpacity:1
    },
    zoomImg : {
        flex:1,
        margin:10,
        alignSelf:'center',
        verticalAlign:'middle'
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
    
export default ShowPickUpReceipt;