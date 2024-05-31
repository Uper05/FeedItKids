import * as React from 'react';
import { styles } from './styles';
import * as ImagePicker from 'expo-image-picker';
import {View, Text,Image, ImageBackground, Modal, Pressable, Animated, FlatList,} from 'react-native';
import * as Progress from 'react-native-progress';
import { useState,useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Checkbox from 'expo-checkbox';
import { objectives, Objective } from './objectives';
import {router} from "expo-router";

//assets
import Empty from "../../assets/Empty.png"
import MagmaSlime from "../../assets/MagmaSlime.png";
import IceSlime from "../../assets/IceSlime.png"
import ElectricSlime from "../../assets/EletricSlime.png"
import PlantSlime from "../../assets/PlantSlime.png"
import BGimage from "../../assets/BGbichinho.png"
import slimeIcon from "../../assets/SlimeLogo.png"
import { Entypo } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';


function Bichinho() {
  //variáveis
  let pontos = 2000;
  let varAlimentacao = 0.5;
  let varEnergia = 0.6;
  let varFelicidade = 1;
  let varResistencia = 0.9;

  //CÓDIGO SIDEBAR
  const [sidebarAnimation] = useState(new Animated.Value(-300));
  const [sideVisivel, setSideVisivel] = useState(false);

  useEffect(() => {
    if (sideVisivel) {
      Animated.timing(sidebarAnimation, {
        toValue: 0,
        duration: 300, // Duração da animação
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(sidebarAnimation, {
        toValue: -300,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  },);

  //métodos
  const abrirSide=()=>{
    setSideVisivel(true);
  }
  const fecharSide=()=>{
    setSideVisivel(false);
  }

  //cCÓDIGO SELETOR
  //constantes
  const [seletorVisivel,setSeletorVisivel] = useState(false);
  const [baseImageIndex, setBaseImageIndex] = useState(Empty);

  //métodos
  const abrirSeletor = ()=>{
    setSeletorVisivel(true);
  }
  const fecharSeletor = ()=>{
    setSeletorVisivel(false);
  }

  //CODIGO INFO
  //constantes
  const [infoVisivel, setInfoVisivel] = useState(false);

  //métodos
  const abrirInfo = ()=> {
    setInfoVisivel(true);
  }
  const fecharInfo = () =>{
    setInfoVisivel(false);
  }

  //CODIGO MASCOTE E IMAGEM
  const escolherBichinho = (index: any)=>{
    setBaseImageIndex(index);
    saveBaseImageIndex(index);
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

  //CÓDIGO CAMERA
  //constantes
  const [imagemURI, setImagemURI] = useState();
  //método
  const tirarFoto = async() => {
    const foto = await ImagePicker.launchCameraAsync({
      base64: true,
      quality: 1, // Qualidade da imagem de 0 a 1
    });
    
    if (!foto.canceled) {
      //segundo um pessoal do github, esse é um problema do VScode
      //https://github.com/expo/expo/issues/6407
      setImagemURI(foto.base64);
    }
  }

  //CODIGO OBJETIVOS?
  const [activeObjectives, setActiveObjectives] = useState<Objective[]>([]);

  useEffect(() => {
    // Carrega os três primeiros objetivos ao iniciar
    setActiveObjectives(objectives.slice(0, 3));
  }, []);

  const completeObjective = (id: number) => {
    const newObjectives = activeObjectives.filter(obj => obj.id !== id);
    const nextObjective = objectives.find(obj => 
      !newObjectives.includes(obj) && 
      !activeObjectives.includes(obj)
    );
    
    if (nextObjective) {
      newObjectives.push(nextObjective);
    }

    setActiveObjectives(newObjectives);
  };

    const renderObjective = ({ item }: { item: Objective }) => (
    <View style={styles.objectiveContainer}>
      <Checkbox
        value={false}
        onValueChange={() => completeObjective(item.id)}
      />
      <Text style={styles.objectiveText}>{item.name}</Text>
    </View>
  );

  //PÁGINA
  return (
    <ImageBackground source={BGimage} resizeMode='cover' style={styles.imagem}>
      {/* SideBar*/}
      <Animated.View style={[styles.sidebar, { transform: [{ translateX: sidebarAnimation }] }]}>
            <View style={styles.sidebarTop}>
              <Pressable
                onPress={fecharSide}
                style={({pressed})=>[
                  pressed?{backgroundColor:'#053C5E'}:{backgroundColor:'#5AA9E6'},
                  styles.pressableIcon]}>
                <AntDesign name="caretleft" size={24} color="white" />
              </Pressable>
            </View>
            <View style={styles.objectivesContainer}>
              <Text style={styles.objectivesHeader}>Meus Objetivos</Text>
              <FlatList
                data={activeObjectives}
                renderItem={renderObjective}
                keyExtractor={(item) => item.id.toString()}
              />
            </View>   
      </Animated.View>
      <View style={styles.wrapTop}>
        <View style={styles.containerIcon}>
          <View style={styles.row}>
            {/* MENU */}
            <Pressable
              onPress={abrirSide}
              style={({pressed})=>[
                pressed?{backgroundColor:'#053C5E'}:{backgroundColor:'#5AA9E6'},
                {marginLeft:10,marginRight:0},
                styles.pressableIcon]}>
              <Entypo name="menu" size={44} color="white" />
            </Pressable>
            {/* SELETOR */}
            <Pressable
              onPress={abrirSeletor}
              style={({pressed})=>[
                pressed?{backgroundColor:'#053C5E'}:{backgroundColor:'#5AA9E6'},
                styles.pressableIcon]}>
              <Image style={styles.iconImage} source={slimeIcon}/>
            </Pressable>
            {/* INFO */}
            <Pressable 
              onPress={abrirInfo}
              style={({pressed}) => [
                  pressed ? {backgroundColor:'#053C5E'}:{backgroundColor: '#5AA9E6',},
                  styles.pressableIcon]}>
              <Feather name="info" size={44} color="white" />
            </Pressable>
          </View>
      </View>

      </View>
      <View style={styles.container}>
        <View style={styles.containerBixo}>
          <Image style={styles.imagemBichinho} source={baseImageIndex}/>
        </View>
      </View>
      <View style={styles.wrapBottom}>
        <View style={styles.containerBottom}>
          <View style={styles.row}>
              {/* BARRA DE STATUS */}
              <View style={styles.conteudoBottomStatus}>
                <Text style={styles.textBarra}> Alimentação Saudável</Text>
                  <Progress.Bar progress={varAlimentacao} color='green' width={250} unfilledColor='red' borderColor='#053C5E' height={15}/>
                <Text style={styles.textBarra}> Energia</Text>
                  <Progress.Bar progress={varEnergia} color='green' width={250} unfilledColor='red' borderColor='#053C5E' height={15}/>
                <Text style={styles.textBarra}> Felicidade</Text>
                  <Progress.Bar progress={varFelicidade} color='green' width={250} unfilledColor='red' borderColor='#053C5E' height={15}/>
                <Text style={styles.textBarra}> Resistência</Text>
                  <Progress.Bar progress={varResistencia} color='green' width={250} unfilledColor='red' borderColor='#053C5E' height={15}/>
              </View>
              {/* CÂMERA */}
              <View style={styles.conteudoBottomCamera}>
                  <Pressable
                    onPress={tirarFoto}
                    style={({pressed})=>[
                      pressed?{backgroundColor:'#053C5E'}:{backgroundColor:'#5AA9E6'},
                      styles.pressableCamera]}>
                    <Entypo name="camera" size={72} color="white" />
                  </Pressable>
              </View>
          </View>
        </View>
      </View>

      {/* MODAL DO SELETOR */}
      <View>
        <Modal animationType='fade' transparent={true}
            visible={seletorVisivel || baseImageIndex === Empty}
            onRequestClose={fecharSeletor}>
                <View style={styles.containerSeletor}>
                  <View style={styles.conteudoSeletor}>
                    <View style={styles.containerTituloSeletor}>
                      <Text style={styles.tituloSeletor}>
                        Escolha seu Bichinho!
                      </Text>
                    </View>
                    <View style={styles.row}>
                      <Pressable
                        onPress={()=>escolherBichinho(MagmaSlime)}
                        style={({pressed})=>[
                          pressed?{backgroundColor:'green',borderColor:'lightgreen'}:{backgroundColor:'white',borderColor:'lightgreen'},
                          styles.pressableSeletor]}>
                        <Image style={styles.imagemSeletor} source={MagmaSlime}></Image>
                      </Pressable>
                      <Pressable
                        onPress={()=>escolherBichinho(IceSlime)}
                        style={({pressed})=>[
                          pressed?{backgroundColor:'green',borderColor:'lightgreen'}:{backgroundColor:'white',borderColor:'lightgreen'},
                          styles.pressableSeletor]}>
                        <Image style={styles.imagemSeletor} source={IceSlime}></Image>
                      </Pressable>
                    </View>
                    <View style={styles.row}>
                      <Pressable
                        onPress={()=>escolherBichinho(PlantSlime)}
                        disabled={pontos<400}
                        style={({pressed})=>[
                          pressed?{backgroundColor:'green',borderColor:'lightgreen'}:{backgroundColor:'white',borderColor:'lightgreen'},
                          (pontos<400?{backgroundColor: 'darkgrey',borderColor: 'red' }:{}),
                          styles.pressableSeletor]}>
                        <Image style={styles.imagemSeletor} source={pontos<400?slimeIcon:PlantSlime}></Image>
                      </Pressable>
                      <Pressable
                        onPress={()=>escolherBichinho(ElectricSlime)}
                        disabled={pontos<600}
                        style={({pressed})=>[
                          pressed?{backgroundColor:'green',borderColor:'lightgreen'}:{backgroundColor:'white',borderColor:'lightgreen'},
                          (pontos<600?{backgroundColor: 'darkgrey',borderColor: 'red' }:{}),
                          styles.pressableSeletor]}>
                        <Image style={styles.imagemSeletor} source={pontos<600?slimeIcon:ElectricSlime}></Image>
                      </Pressable>
                    </View>
                  </View>
                </View>
        </Modal>
      </View>
      {/* MODAL DA INFO */}
      <View>
        <Modal animationType='fade'
        visible={infoVisivel}
        transparent={true} onRequestClose={fecharInfo}>
            <View style={styles.containerInfo}>
              <Text style={({color: 'white', textAlign: 'center', padding: 20})}>
                  Como jogar?{"\n"}{"\n"}
                  Alimente seu bichinho com a câmera. Clique no botão azul ao lado das barrinhas abaixo para abrir a câmera, escaneie uma comida que você tenha em casa e alimente o mascote de acordo com o valor nutricional da comida!{"\n"}{"\n"}
                  Ganhe pontos fazendo missões toda semana. Clique no botão acima na esquerda para acessar a barra lateral e confira as missões, complete-as clicando no quadrado ao lado para checar e ganhar pontos!{"\n"}{"\n"}
                  Desbloqueie novos bichinhos. Os bichinhos são desbloqueados ao atingir um número de pontos, clique no ícone bloqueado para ganhar o novo mascote e, caso não tenha pontos suficientes, conclua mais missões.
              </Text>
              <Pressable 
                        onPress={fecharInfo}
                        style={({pressed}) => [
                            pressed ? {backgroundColor:'#053C5E'}:{backgroundColor:'#5AA9E6'}, styles.botaoInfo]}>
                        <Text style = {({color:'white'})}>Fechar</Text>
                    </Pressable>
            </View>
        </Modal>
      </View>
    </ImageBackground>
  );
}


  export default Bichinho;