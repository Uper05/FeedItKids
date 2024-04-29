import * as React from 'react';
import { StyleSheet,Button, View, Text,Image, ImageBackground, Modal, Pressable,} from 'react-native';
import {router} from "expo-router";
import { useState,useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Empty from "../../assets/Empty.png"
import MagmaSlime from "../../assets/MagmaSlime.png";
import IceSlime from "../../assets/IceSlime.png"
import BGimage from "../../assets/BGimage.png"



function Bichinho() {
  const [seletorVisivel,setSeletorVisivel] = useState(false);
  const [baseImageIndex, setBaseImageIndex] = useState(Empty);
  let escolhaBichinho = false;

  const abrirSeletor = ()=>{
    setSeletorVisivel(true);
  }
  const fecharSeletor = ()=>{
    setSeletorVisivel(false);
  }

  const escolherBichinho = (index: any)=>{
    setBaseImageIndex(index);
    saveBaseImageIndex(index)
    fecharSeletor()
  }

  const saveBaseImageIndex = async (index:any) => {
    try {
      await AsyncStorage.setItem('baseImageIndex', index.toString());
    } catch (error) {
      console.error('Erro ao salvar imagem base:', error);
    }
  };

  useEffect(() => {
    const loadBaseImage = async () => {
      try {
        const savedIndex = await AsyncStorage.getItem('baseImageIndex');
        if (savedIndex !== null) {
          setBaseImageIndex(parseInt(savedIndex));
        }
      } catch (error) {
        console.error('Erro ao carregar imagem base:', error);
      }
    };
    loadBaseImage();
  }, []);

  return (
    <ImageBackground source={BGimage} resizeMode="cover" style={styles.imagem}>
      <View style={styles.container}>
        <View style={styles.containerB}>
          <Image style={styles.imagemBichinho} source={baseImageIndex}/>
        </View>
      </View>
      <View style={styles.containerBottom}>
        
      </View>
      <View>
        <Modal
            animationType='slide'
            transparent={true}
            visible={seletorVisivel || baseImageIndex === Empty}
            onRequestClose={fecharSeletor}>
              <View style={styles.containerSeletor}>
                <View style={styles.conteudoSeletor}>
                  <View style={styles.row}>
                    <Pressable
                      onPress={()=>escolherBichinho(MagmaSlime)}
                      style={({pressed})=>[
                        pressed?{backgroundColor:'green',borderColor:'lightgreen'}:{backgroundColor:'white',borderColor:'lightgreen'},
                        styles.pressableSeletor
                      ]}
                    >
                      <Image style={styles.imagemSeletor} source={MagmaSlime}></Image>
                    </Pressable>
                    <Pressable
                      onPress={()=>escolherBichinho(IceSlime)}
                      style={({pressed})=>[
                        pressed?{backgroundColor:'green',borderColor:'lightgreen'}:{backgroundColor:'white',borderColor:'lightgreen'},
                        styles.pressableSeletor
                      ]}
                    >
                      <Image style={styles.imagemSeletor} source={IceSlime}></Image>
                    </Pressable>
                  </View>
                </View>
              </View>
        </Modal>
      </View>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent:'flex-end',
    },
    containerB: {
      height:350,
      width:350,
      alignItems: 'center',
      justifyContent:'center',
      marginBottom:12,
    },
    containerBottom: {
      flex: 1,
      justifyContent:'flex-end',
      backgroundColor:'lightblue',
      maxWidth:'auto',
      maxHeight:275,
    },
    containerSeletor:{
      flex:1,
      justifyContent:'center',
      alignItems:'center',
      backgroundColor:'rgba(0,0,0,0.5)',
      maxWidth:'auto',
      maxHeight:'auto',
    },
    conteudoSeletor:{
      padding:20,
    },
    pressableSeletor:{
      width:150,
      height:150,
      margin:5,
      alignItems:'center',
      borderWidth:5,
      borderRadius:25,
    },
    imagemSeletor:{
      flex:1,
      objectFit: 'contain',
      width: '95%',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    imagemBichinho: {
      flex: 1,
      width: '90%',
      objectFit: 'contain',
    },
    imagem: {
      flex: 1,
      width: '100%',
      height: '100%',
      resizeMode: "cover",
      justifyContent: 'center',
    },
  });

  export default Bichinho;