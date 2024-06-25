import { ActivityIndicator, Button, KeyboardAvoidingView, SafeAreaView, StyleSheet, Text, TextInput, View, ScrollView } from "react-native";
import Header from "./_components/Header";
import Footer from "./_components/Footer";
import { useState } from "react";
import { Dialog, Icon } from "@rneui/themed";
import axios from "axios";
import { HostUri } from "./_components/HostUri";
import * as SecureStore from 'expo-secure-store';

export default function changePassword()
{

    const [oldPass, setOldPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [confirmPass, setConfirmPass] = useState("");

    const [showOldPass, setShowOldPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [showConfPass, setShowConfPass] = useState(false);
    const [showPop, setShowPop] = useState(false);

    const [loading, setLoading] = useState(false);
    const [responseText, setResponseText] = useState("");

    const resetForm = () => {
        setOldPass("");
        setNewPass("");
        setConfirmPass("");
    }
    const toggleCangePass = () => {
        setShowPop(!showPop);
    }

    const changePassHandler = async () => {
        setShowPop(false);
        setLoading(true);
        let formData = new FormData();
        formData.append('current_password', oldPass);
        formData.append('new_password', newPass);
        formData.append('confirm_password', confirmPass);
        await SecureStore.getItemAsync('secured_token').then((token) => {
            axios({
              method: "post",
              url: HostUri+'changePassword',
              headers: {
                "content-Type": 'multipart/form-data',
                "Authorization" : `Bearer ${token}`,
              },
              data : formData,
            }).then(function (response) {
                 // berhasil
                 setLoading(false);
                 setResponseText('Ganti Password Berhasil');
                 resetForm();
              }).catch(function (error) {
                // masuk ke server tapi return error (unautorized dll)
                if (error.response) {
                 setLoading(false);
                //gagal login
                if(error.response.data.message == 'Unauthenticated.' || error.response.data.message == 'Unauthorized')
                {
                    SecureStore.deleteItemAsync('secured_token');
                    SecureStore.deleteItemAsync('secured_name');
                    router.replace('/');
                }
                else if(error.response.data.message == 'Password tidak sesuai'){
                    setResponseText('Password tidak sesuai !!');
                }else if(error.response.data.message == 'fail validator')
                {
                    alert(error.response.data.data.error);
                }else{
                    alert('Unknown error Please Contact Adminstrator')

                }
                //   console.error(error.response.data);
                //   console.error(error.response.status);
                //   console.error(error.response.headers);
                } else if (error.request) {
                 setLoading(false);
                // ga konek ke server
                  alert('Check Koneksi anda !')
                  console.error(error.request);
                } else {
                 setLoading(false);
                  // error yang ga di sangka2
                  console.error("Error", error.message);
                }
            });
        });
    }

   return(
    <SafeAreaView style={styles.container}>
        <Dialog isVisible={loading} overlayStyle={{backgroundColor:'rgba(52, 52, 52, 0.5)' }}>
            <ActivityIndicator />
        </Dialog>
        <View style={styles.headerContainer}>
            <Header title="Ganti Password"/>
        </View>
        <ScrollView>
            <Text style={{ fontSize:16, color:'red', alignSelf:'center', marginVertical:10 }}>{responseText}</Text>
            <KeyboardAvoidingView behavior='padding' style={{ flex:2, flexDirection:'row', padding:10, marginVertical:10 }}>
                <View style={{ flex:1 }}>
                    <View style={{ marginVertical:5 }}>
                        <Text>Password Lama</Text>
                        <View style={styles.inputView}>
                            <TextInput style={styles.inputMerah } onChangeText={(val)=>setOldPass(val)} secureTextEntry={!showOldPass}/>
                            <Icon type="entypo" name={showOldPass ? 'eye' : 'eye-with-line'} color="grey" size={20} style={{ marginRight:20 }} onPress={()=>{setShowOldPass(!showOldPass)}}/>
                        </View>
                    </View>
                    <View style={{ marginVertical:5 }}>
                        <Text>Password Baru</Text>
                        <View style={styles.inputView}>
                            <TextInput style={styles.inputMerah } onChangeText={(val)=>setNewPass(val)} secureTextEntry={!showNewPass}/>
                            <Icon type="entypo" name={showNewPass ? 'eye' : 'eye-with-line'} color="grey" size={20} style={{ marginRight:20 }} onPress={()=>{setShowNewPass(!showNewPass)}}/>
                        </View>
                    </View>
                    <View style={{ marginVertical:5 }}>
                        <Text>Konfirmasi Password Baru</Text>
                        <View style={styles.inputView}>
                            <TextInput style={styles.inputMerah } onChangeText={(val)=>setConfirmPass(val)} secureTextEntry={!showConfPass}/>
                            <Icon type="entypo" name={showConfPass ? 'eye' : 'eye-with-line'} color="grey" size={20} style={{ marginRight:20 }} onPress={()=>{setShowConfPass(!showConfPass)}}/>
                        </View>
                    </View>
                    <View style={{ marginVertical:5 }}>
                        <Button onPress={toggleCangePass} color='red' title="Ganti Password" />
                    </View>
                </View>
            </KeyboardAvoidingView>
        </ScrollView>
        <Footer/>
        <Dialog
            isVisible={showPop}
            onBackdropPress={toggleCangePass}
        >
        <Dialog.Title title="Warning !!" titleStyle={{color:'red'}}/>
        <Text>Anda yakin ingin Ganti Password?</Text>
        <Dialog.Actions>
          <Dialog.Button title="Ganti" onPress={() => changePassHandler()} titleStyle={{color:'red'} }/>
          <Dialog.Button title="Cancel" onPress={toggleCangePass}/>
        </Dialog.Actions>
      </Dialog>
    </SafeAreaView>
   ) 
}

const styles = StyleSheet.create({
    container : {
        flex: 1
    },
    headerContainer : {
        height:'10%'
    },
    inputMerah : {
        height: 50,
        flex: 1,
        padding: 10,
        marginLeft: 20,
    },
    inputView: {
        // flex: 1,
        flexDirection: "row",
        // backgroundColor: "white",
        borderColor :'red',
        borderRadius: 10,
        borderWidth:1,
        height: 40,
        margin: 10,
        alignItems: "center",
      },
});