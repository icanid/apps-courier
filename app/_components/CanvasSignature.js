import { useRef, useState } from "react";
import { Alert, Button, Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import SignatureScreen from 'react-native-signature-canvas';

const CanvasSignature = (props) => {
    const returnSign = props.returnSign;
  const ref = useRef();
  
  const handleOK = (signature) => {
    // console.log(signature);
    returnSign(signature);
  };

  const handleClear = () => {
    ref.current.clearSignature();
  };

  const handleEmpty = () => {
    alert('Dibutuhkan Tanda Tangan untuk Melanjutkan !!')
  }

  const handleData = (data)=>{
    // console.log(data);
  }
  const handleSave = () => {
    Alert.alert(
        'Simpan Tanda Tangan ?',
        '',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text : 'Simpan',
            // onPress: () => updateAwb(data,choice, alasan),
            onPress: () => ref.current.readSignature(),
            style : 'default'
          }
        ],
        {
          cancelable: true,
        },
      );
  }

  let padstyle = `.m-signature-pad {
    margin:auto; 
    top: 0; 
    height:'500px'
  }
  body,html { 
    position:relative; 
  }`

  const imgWidth = Dimensions.get.width;
  const imgHeight = 300;
  const style = `.m-signature-pad {margin:3px} 
                .m-signature-pad--body {border: none;}
                .m-signature-pad--footer {display: none; margin: 0px;}
                .save {
                    display: none;
                }
                .clear {
                    display: none;
                }
                body,html {
                width: ${imgWidth}px; height: ${imgHeight}px;
            }`;
  
  return (
    <SafeAreaView style={{ flex:1}}>
    <Text style={{ alignSelf:"center", margin:10, fontSize:18, color:'red', fontWeight:'bold'  }}>Tanda Tangan</Text>
    <View style={{ width: imgWidth, height: imgHeight, alignItems:'center' }}>
        <SignatureScreen
            ref={ref}
            //   onEnd={handleEnd}
            onOK={handleOK}
            onEmpty={handleEmpty}
            // onClear={handleClear}
              onGetData={handleData}
            //   autoClear={true}
            //   descriptionText={text}
            bgWidth={imgWidth}
            bgHeight={imgHeight}
            webStyle={style}
            />
    </View>
    <View style={{ flexDirection:'row' }}>
        <TouchableOpacity style={{ flex:1, margin:5, backgroundColor:'grey', padding:10, alignItems:'center', borderRadius:5 }} onPress={() => {ref.current.undo()}}><Text style={{ color:'white' }}>Clear</Text></TouchableOpacity>
        <TouchableOpacity style={{ flex:1, margin:5, backgroundColor:'red', padding:10, alignItems:'center', borderRadius:5 }} onPress={()=>handleSave()}><Text style={{ color:'white' }}>Save</Text></TouchableOpacity>
    </View>
    </SafeAreaView>
  );
};
  
  const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        height: 250,
        padding: 10,
      },
      row: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
          borderBottomColor: '#f2f2f2',
          paddingBottom: 5
        },
        textSign: {
          color: 'deepskyblue',
          fontWeight: 'bold',
          height:'10%'
        },
        text: {
          color: '#fff',
          fontWeight: '900',
        },
        textInput: {
          paddingVertical: 10,
          textAlign: 'center'
        },
        setButton: {
          backgroundColor: 'deepskyblue',
          textAlign: 'center',
          fontWeight: '900',
          color: '#fff',
          marginHorizontal: 10,
          paddingVertical: 15,
          paddingHorizontal: 10,
          borderRadius: 5,
        }
      });

export default CanvasSignature;