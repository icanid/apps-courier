import { Dialog } from "@rneui/themed";
import axios from "axios";
import { useState } from "react";
import { ActivityIndicator, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { HostUri } from "./_components/HostUri";
import { router } from "expo-router";

export default function forgotPassword() {

    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [err, setErr] = useState('');

    const resetHandler = async () => {
        setLoading(true);
        await axios.post(
            HostUri+'forgotpassword',
            { email: email},
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            },
            ).then(function (response) {
              // berhasil
              // console.log(response);
              setLoading(false);
              setErr('Berhasil ! Silahkan Periksa Email anda !');
            }).catch(function (error) {
              // masuk ke server tapi return error (unautorized dll)
              if (error.response) {
                //gagal login
                setLoading(false);
                if(error.response.data.message){
                    setErr(error.response.data.data.error);
                }else{
                    alert('Gagal Reset Password !');
                }
                // console.error(error.response.data);
                // console.error(error.response.status);
                // console.error(error.response.headers);
              } else if (error.request) {
                // ga konek ke server
                setLoading(false);
                alert('Check Koneksi anda !')
                console.error(error.request);
              } else {
                setLoading(false);
                // error yang ga di sangka2
                alert('Fatal error 404')
                console.error("Error", error.message);
              }
          });
    }

    return(
        <SafeAreaView style={styles.container}>
            <Dialog isVisible={loading} overlayStyle={{backgroundColor:'rgba(52, 52, 52, 0.5)' }}>
                <ActivityIndicator />
            </Dialog>
            <StatusBar style="auto" />
            <Text style={{ color:'white', fontWeight:'bold', fontSize:24, margin:15 }}>Reset Password</Text>
            {
                err &&
                <Text style={{ color:'white', fontWeight:'bold', marginBottom:10 }}>{err}</Text>
            }
            <View style={styles.inputView}>
                <TextInput
                keyboardType="email-address"
                style={styles.TextInput}
                placeholder="Email"
                placeholderTextColor="#003f5c"
                onChangeText={(mail) => setEmail(mail)}
                />
            </View>
            <TouchableOpacity style={styles.loginBtn} onPress={()=>{resetHandler()}}>
                <Text style={styles.loginText}>Kirim Email</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{marginTop:10 }} onPress={()=>{router.push('/')}}>
                <Text style={{ color:'white', fontWeight:'bold'  }}>Kembali</Text>
            </TouchableOpacity>   
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  
    container: {
      flex: 1,
      backgroundColor: "#ff0000",
      alignItems: "center",
      justifyContent: "center",
    },

    inputView: {
        // flex: 1,
        flexDirection: "row",
        backgroundColor: "white",
        borderRadius: 10,
        width: "80%",
        height: 40,
        marginBottom: 20,
        alignItems: "center",
      },
    
      TextInput: {
        height: 50,
        flex: 1,
        padding: 10,
        marginLeft: 20,
      },
      loginBtn: {
        width: "60%",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
        backgroundColor: "white",
        borderColor:'black'
      },
});