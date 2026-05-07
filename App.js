import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Image, Alert } from 'react-native';
import { useRef, useState, useEffect } from 'react';

//Importar o sistema de camera
import { CameraView, useCameraPermissions } from 'expo-camera';

//Importar a biblioteca para salvar a foto na galeria
import * as MediaLibrary from "expo-media-library"

export default function App() {
  //Estado de permissao da camera
  const [permissaoCam, requestPermissaoCam] = useCameraPermissions()

  //Estado de permissao da galeria(biblioteca de midia)
  const [permissaoMedia, requestPermissaoMedia] = MediaLibrary.usePermissions()

  //Referência da câmera(acesso direto ao componente)
  const cameraRef = useRef(null)

  //Estado para salvar a foto tirada(capturada)
  const [foto, setFoto] = useState(null)


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

  return (
    <View style={styles.container}>
      {!foto ? (
        <>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing='back'
          />
          <Button
            title='Tirar uma foto'
            onPress={tirarFoto}
          />
        </>
      ):(
        <>
          <Image source={{uri:foto.uri}} style={styles.preview}/>
          <Button title='Tirar Outra Foto' onPress={()=>setFoto(null)}/>
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
