import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Image, Alert } from 'react-native';
import { useRef, useState, useEffect } from 'react';

//Importar o sistema de camera
import { CameraView, useCameraPermissions } from 'expo-camera';

//Importar a biblioteca para salvar a foto na galeria
import * as MediaLibrary from "expo-media-library"

//Importa o compartilhamento de foto
import * as Sharing from "expo-sharing"

export default function App() {
  //Estado de permissao da camera
  const [permissaoCam, requestPermissaoCam] = useCameraPermissions()

  //Estado de permissao da galeria(biblioteca de midia)
  const [permissaoMedia, requestPermissaoMedia] = MediaLibrary.usePermissions()

  //Referência da câmera(acesso direto ao componente)
  const cameraRef = useRef(null)

  //Estado para salvar a foto tirada(capturada)
  const [foto, setFoto] = useState(null)

  //Estado para alternar entre as cameras
  const[isFrontCamera,setIsFrontCamera]=useState(false)

  //Estado para o flash
  const[flashLigado,setFlashLigado]=useState(false)

  //Estado para configurar se foi escaneado cod de barras
  const[scaneado,setScaneado]=useState(false)


  //useEffect para solicitar a permissão da câmera
  //Enquando a permissão da camera nao estiver carregada
  if (!permissaoCam) {
    return <View />
  }

  //Incluindo um botao para liberar permissao
  if (!permissaoCam.granted) {
    return (
      <View style={styles.container}>
        <Text>Permissão da câmera não concedida</Text>
        <Button
          title='Permitir'
          onPress={requestPermissaoCam}
        />
      </View>
    )
  }

  //Função para tirar foto
  const tirarFoto = async () => {
    if (cameraRef.current) {
      const dadoFoto = await cameraRef.current.takePictureAsync()//Captura a imagem atual
      //Armazena a foto no estado
      setFoto(dadoFoto)
    }
  }

  //Função para salvar foto na galeria
  const salvarFoto = async()=>{
    if(foto?.uri){
      try{
        await MediaLibrary.createAssetAsync(foto.uri)//Salva na galeria
        Alert.alert("Sucesso","Foto Armazenada na galeria")
        setFoto(null)//Reseta o estado
      }catch(error){

      }
    }
  }

  //Função para alternar entre as cameras
  const alternarCamera = ()=>{
    setIsFrontCamera((prev)=>!prev)
  }

  //Função para alternar o flash
  const alternarFlash = ()=>{
    setFlashLigado((prev)=>!prev)
  }

  //Função para compartihar foto
  const compartilharFoto = async()=>{
    if(foto?.uri && await Sharing.isAvailableAsync()){
      await Sharing.shareAsync(foto.uri)
    }else{
      Alert.alert("Error","Compartilhamento não disponível")
    }
  }

  return (
    <View style={styles.container}>
      {!foto ? (
        <>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing={isFrontCamera?"front":"back"}
            flash={flashLigado?"on":"off"}
            //enableTorch={flashLigado}
            onBarcodeScanned={({type,data})=>{
                if(!scaneado){
                  setScaneado(true)
                  Alert.alert("Código Detectado",`Tipo:${type}\nValor:${data}`)
                }
            }}
          />
          <Button
            title='Tirar uma foto'
            onPress={tirarFoto}
          />
          <Button 
            title='Alternar Camera'
            onPress={alternarCamera}
          />
          <Button 
            title={flashLigado?"Desligar Flash":"Ligar Flash"}
            onPress={alternarFlash}
          />
          {scaneado&&(
            <Button title='Escanear Novamente' onPress={()=>setScaneado(false)}/>
          )}
        </>
      ):(
        <>
          <Image source={{uri:foto.uri}} style={styles.preview}/>
          <Button title='Tirar Outra Foto' onPress={()=>setFoto(null)}/>
          <Button title='Salvar Foto' onPress={salvarFoto}/>
          <Button title='Compartilhar Foto' onPress={compartilharFoto}/>
        </>
      )}


      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    width: 300,
    height: 300
  },
  preview:{
     width: 300,
    height: 300
  }
});
