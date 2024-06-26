import * as React from 'react';
import { styles } from './styles';
import * as ImagePicker from 'expo-image-picker';
import {View, Text,Image, ImageBackground, Modal, Pressable, Animated, FlatList, Alert, Platform,} from 'react-native';
import * as Progress from 'react-native-progress';
import { useState,useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Checkbox from 'expo-checkbox';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import CustomCheckbox from './custom_check_box';
import { getUserIdFromStorage } from '../login/auth_user_data'

//assets
import Empty from "../../assets/Empty.png"
import MagmaSlime from "../../assets/MagmaSlime.png"
import IceSlime from "../../assets/IceSlime.png"
import ElectricSlime from "../../assets/EletricSlime.png"
import PlantSlime from "../../assets/PlantSlime.png"
import BGimage from "../../assets/BGbichinho.png"
import slimeIcon from "../../assets/SlimeLogo.png"
import { Entypo } from '@expo/vector-icons'
import { Feather } from '@expo/vector-icons'
import { AntDesign } from '@expo/vector-icons'


export type Objective = {
  id_objetivo: number;
  descricao: string;
  pontuacao: number;
  status: boolean;
};

function Bichinho() {

  const [status, setStatus] = useState({
    varAlimentacao: 0,
    varEnergia: 0,
    varFelicidade: 0,
    varForca: 0,
  });

  const [pontos, setPontos] = useState(0);

  const [activeObjectives, setActiveObjectives] = useState<Objective[]>([]);
  const [checkedObjectives, setCheckedObjectives] = useState<number[]>([]); 


  const fetchStatusAnimal = async () => {
    try {

      const userId = await getUserIdFromStorage(); // Obtém o ID do usuário
      const response = await axios.get(`http://127.0.0.1:8000/status_animal/status_animal/${userId}`);

      const status = response.data;
      // Atualizar o estado com os valores recebidos do back-end
      setStatus({
        varAlimentacao: status.alimentacao_saudavel,
        varEnergia: status.energia,
        varFelicidade: status.felicidade,
        varForca: status.forca,
      });
    } catch (error) {
      console.error('Erro ao buscar status animal:', error);
    }
  };

  const fetchPontuacao = async () => {
    try {
      const userId = await getUserIdFromStorage(); // Obtém o ID do usuário
      const response = await axios.get(`http://127.0.0.1:8000/usuarios/usuarios/${userId}`);
      const usuario = response.data;

      // Atualizar o estado com a pontuação recebida do back-end
      setPontos(usuario.pontuacao_total);
    } catch (error) {
      console.error('Erro ao buscar pontuação do usuário:', error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchStatusAnimal();
      fetchPontuacao();
    }, 30000); // Atualiza a cada 30 segundos (30000 milissegundos)
  
    // Limpa o intervalo quando o componente é desmontado
    return () => clearInterval(interval);
  }, []);

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

  // //CÓDIGO CAMERA
  // constantes
// Tipos para ImagePicker e Axios
interface ImageInfo {
  uri: string;
}
const [imagemURI, setImagemURI] = useState<string | null>(null);

// Método para tirar foto
const tirarFoto = async () => {
  const result = await ImagePicker.launchCameraAsync({
    quality: 1, // Qualidade da imagem de 0 a 1
  });

  if (!result.canceled) {
    const { uri } = result.assets[0];  // Acessa a URI da primeira imagem capturada
    setImagemURI(uri);
    await enviarImagem(uri);
  }
};

// Método para enviar imagem com Axios
const enviarImagem = async (uri: string) => {
  try {
    const formData = new FormData();
    const userId = await getUserIdFromStorage(); 

    if (Platform.OS === 'web') {
      const response = await fetch(uri);
      const blob = await response.blob();
      formData.append('image', blob, 'photo.jpg');
    } else {
      const nomeArquivo = uri.split('/').pop() || 'photo.jpg';
      const tipoArquivo = nomeArquivo.split('.').pop() || 'jpg';

      formData.append('image', {
        uri: uri,
        name: nomeArquivo,
        type: `image/${tipoArquivo}`,
      } as any); // Aqui o `as any` é necessário por causa da tipagem de FormData.append no React Native
    }

    const response = await axios.post(`http://3.135.200.39:8000/process_image/process_image/`, formData, {
      params: {
        id_usuario: userId
      },
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    console.log('Imagem enviada com sucesso:', response.data);
    Alert.alert('Sucesso', 'Imagem enviada com sucesso!');
  } catch (error) {
    console.error('Erro ao enviar a imagem:', error);
    Alert.alert('Erro', 'Não foi possível enviar a imagem.');
  }
};


const fetchObjectives = async () => {
  try {
    const limit = 5; // Defina o limite desejado aqui
    const response = await axios.get(`http://3.135.200.39:8000/fila_objetivos/objetivos_limit/?limit=${limit}`);
    setActiveObjectives(response.data);
  } catch (error) {
    console.error('Erro ao buscar objetivos:', error);
  }
};

const removeObjective = async () => {
  try {
    const userId = await getUserIdFromStorage();
    await axios.delete('http://3.135.200.39:8000/fila_objetivos/objetivos/', {
      params: {
        id_usuario: userId
      }
    });
    fetchObjectives();
  } catch (error) {
    console.error('Erro ao remover objetivo:', error);
  }
};

const completeObjective = async (id: number) => {
  try {
    await removeObjective();
    setCheckedObjectives([...checkedObjectives, id]); // Adiciona o ID do objetivo marcado ao array
  } catch (error) {
    console.error('Erro ao completar objetivo:', error);
  }
};

useEffect(() => {
  fetchStatusAnimal();
  fetchPontuacao();
  fetchObjectives();

  const interval = setInterval(() => {
    fetchStatusAnimal();
    fetchPontuacao();
    fetchObjectives();
  }, 60000); // Atualiza a cada 1 minuto (60000 milissegundos)

  return () => clearInterval(interval);
}, []);

const renderObjective = ({ item }: { item: Objective }) => (
  <View style={styles.objectiveContainer}>
    <CustomCheckbox
      value={checkedObjectives.includes(item.id_objetivo)}
      onValueChange={() => completeObjective(item.id_objetivo)}
      color={checkedObjectives.includes(item.id_objetivo) ? '#055f0e' : undefined}
      style={{ }} // Ajuste o estilo conforme necessário
    />
    <Text style={styles.objectiveText}>{item.descricao}</Text>
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
            {/* Objetivos */}
            <View style={styles.objectivesContainer}>
            <Text style={styles.objectivesHeader}>Pontos: {pontos}</Text>
              <Text style={styles.objectivesHeader}>Meus Objetivos</Text>
              <FlatList
                data={activeObjectives}
                renderItem={renderObjective}
                keyExtractor={(item) => item.id_objetivo.toString()}
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
                  <Progress.Bar progress={status.varAlimentacao} color='green' width={250} unfilledColor='red' borderColor='#053C5E' height={15}/>
                <Text style={styles.textBarra}> Energia</Text>
                  <Progress.Bar progress={status.varEnergia} color='green' width={250} unfilledColor='red' borderColor='#053C5E' height={15}/>
                <Text style={styles.textBarra}> Felicidade</Text>
                  <Progress.Bar progress={status.varFelicidade} color='green' width={250} unfilledColor='red' borderColor='#053C5E' height={15}/>
                <Text style={styles.textBarra}> Resistência</Text>
                  <Progress.Bar progress={status.varForca} color='green' width={250} unfilledColor='red' borderColor='#053C5E' height={15}/>
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

function onPress() {
  throw new Error('Function not implemented.');
}
