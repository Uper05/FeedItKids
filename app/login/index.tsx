import { ImageBackground, Pressable, StyleSheet,Text,View,TextInput, Alert} from "react-native";
import { styles } from './styles';
import React, { useState } from "react";
import {router } from "expo-router";
import { FontAwesome6 } from '@expo/vector-icons';
// import login from './request_login';
import axios from 'axios';

import BGimage from "../../assets/BGlogin.png"
import { saveTokenToStorage, saveUserDataToStorage } from "./auth_user_data";

const Home = () =>{
    //constantes
    const [nometext, setNomeText] = useState('');
    const [senhatext, setSenhaText] = useState('');
    const [userData, setUserData] = useState(null);

    const handleLogin = async () => {
        try {
            const formData = new FormData();
            formData.append('username', nometext);
            formData.append('password', senhatext);


            const response = await axios.post('http://3.135.200.39:8000/auth/token', formData, {
                headers:{
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            });

            // Se a chamada for bem-sucedida, você pode lidar com a resposta aqui
            console.log('Token de acesso:', response.data.acess_token);
            const token = response.data.acess_token

            await saveTokenToStorage(token);

            fetchUserData(token);

            router.replace("/bichinho");

        } catch (error) {
            // Se houver um erro na chamada, exibir mensagem de erro
            console.error('Erro ao fazer login:', error);
            Alert.alert('Erro', 'Não foi possível fazer login. Verifique suas credenciais e tente novamente.');
        }
    };


    const fetchUserData = async (token:string) => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/auth/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setUserData(response.data);
            console.log('Dados do usuário:', response.data);
            const user_data = response.data

            await saveUserDataToStorage(user_data)
        } catch (error) {
            console.error('Erro ao buscar dados do usuário:', error);
        }
    };

    //página
    return(
        <View style={styles.container}>
            <ImageBackground source={BGimage} resizeMode="cover" style={styles.imagem}>
                <View style={styles.wrapMedico}>
                    <View style={styles.iconMedico}>
                        <Pressable
                        onPress={()=>router.replace("/loginMedico")}
                        style={({pressed})=>[
                            pressed?{backgroundColor:'#053C5E'}:{backgroundColor:'#5AA9E6'},
                            {marginLeft:10,marginRight:0},styles.pressableIcon]}>
                            <FontAwesome6 name="user-doctor" size={24} color="#053C5E" />
                        </Pressable>
                    </View>
                </View>
                <View style={styles.containerconfig}>

                    <Text style={styles.titulotexto}>
                        Feed it!
                    </Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        onChangeText={newText => setNomeText(newText)}
                        defaultValue={nometext}
                    />

                    <TextInput
                        secureTextEntry={true}
                        style={styles.input}
                        placeholder="Senha"
                        onChangeText={newText => setSenhaText(newText)}
                        defaultValue={senhatext}
                    />

                    <Pressable 
                        onPress={handleLogin}
                        style={({pressed}) => [
                            pressed ? {backgroundColor:'#0F118C'}:{backgroundColor: '#2A2CDF',},
                            styles.button]}>
                        <Text style={styles.buttontext}>Entrar</Text>
                    </Pressable>

                    <Text style={styles.texto} onPress={()=>router.replace("/cadastro")}>
                        Fazer Cadastro
                    </Text>             
                </View>
            </ImageBackground>
        </View>
    )
}

export default Home