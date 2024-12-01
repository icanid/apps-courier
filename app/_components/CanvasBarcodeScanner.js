import { CameraView, useCameraPermissions } from 'expo-camera';
import { useEffect, useState } from 'react';
import { Alert, BackHandler, Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CanvasBarcodeScanner(props) {
  const setOpenCamera= props.setOpenCamera;
  const returnValue = props.returnValue;
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [awbs, setAwbs] = useState([]);
  const [lastScanned, setLastScanned] = useState(null);
  const [doubleScanned, setdoubleScanned] = useState(null);

    useEffect(() => {
        const backAction = () => {
            Alert.alert('Konfirmasi Kembali', 'Yakin akan kembali ke home? (input akan terhapus)', [
                {
                    text: 'Cancel',
                    onPress: () => null,
                    style: 'cancel',
                },
                {text: 'YES', onPress: () => {
                    setOpenCamera(false);
                }},
                ]);
                return true;
        };
    
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction,
        );
    
        return () => backHandler.remove();
    }, []);

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>Butuh Ijin Akses Kamera !</Text>
        <Button onPress={requestPermission} title="Beri Ijin" />
      </View>
    );
  }

  const scannedAwb = (val) => {
    if(awbs.includes(val.data)){
      setdoubleScanned(val.data);
      setLastScanned(null);
    }else{
        setAwbs([
            ...awbs, val.data
        ]);
        setdoubleScanned(null);
        setLastScanned(val.data);
    }
  }

  const assignHandler = () => {
    console.log(awbs);
    returnValue(awbs);
    setOpenCamera(false);
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing}
       barcodeScannerSettings={{
        barcodeTypes: [ 
          //  'code39',
           'code128',
          //  'upc_a',
          //  'upc_e',
        ],
      }}
      onBarcodeScanned = {(val)=>{scannedAwb(val)}}
      animateShutter={false}
      >
        <View style={styles.buttonContainer}>
          {/* <TouchableOpacity style={styles.button} onPress={()=> {setOpenCamera(false)}}> */}
          <TouchableOpacity style={styles.button} onPress={()=> {assignHandler()}}>
            <Text style={styles.text}>Selesai</Text>
          </TouchableOpacity>
        </View>
        <View>
          {
            lastScanned &&
            <Text style={{ color:'white', fontWeight:'bold' }}>{lastScanned} berhasil discan</Text>
          }
          {
            doubleScanned &&
            <Text style={{ color:'white', fontWeight:'bold' }}>{doubleScanned} sudah ada di list</Text>
          }
          </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});