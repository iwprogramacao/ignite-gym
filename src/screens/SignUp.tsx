import { Center, Heading, Image, Text, VStack, ScrollView } from 'native-base';
import BackgroundImg from '@assets/background.png';
import LogoSvg from '@assets/logo.svg';
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { useNavigation } from '@react-navigation/native';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { api } from 'src/service/api';
import axios from 'axios';
import { Alert } from 'react-native';

type FormDataProps = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

const signUpSchema = yup.object({
  name: yup.string().required('Informe um nome para continuar.'),
  email: yup
    .string()
    .required('Informe um e-mail para continuar.')
    .email('Deve ser um e-mail válido.')
    .min(6, 'A senha deve conter pelo menos 6 caracteres.'),
  password: yup
    .string()
    .required('Informe uma senha para continuar.')
    .min(6, 'A senha deve conter pelo menos 6 caracteres.'),
  password_confirmation: yup
    .string()
    .required('Repita a senha aqui para continuar.')
    .oneOf([yup.ref('password')], 'As senhas devem ser iguais.'),
});

export function SignUp() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(signUpSchema),
  });
  const navigation = useNavigation();

  function handleGoBack() {
    navigation.goBack();
  }

  async function handleSignUp({ name, email, password }: FormDataProps) {
    /* const response = await fetch('http://127.0.0.1:3333/users', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();
    console.log(data); */
    /* await fetch('http://127.0.0.1:3333/users', {
    
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data)); 
      */
    try {
      const response = await api.post('/users', { name, email, password });
      console.log(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return Alert.alert(error.response?.data.message);
      }
      // console.log(error);
    }
  }

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
      }}
      showsVerticalScrollIndicator={false}
    >
      <VStack flex={1} px={10}>
        <Image
          source={BackgroundImg}
          defaultSource={BackgroundImg}
          alt="Pessoas treinando"
          resizeMode="contain"
          position="absolute"
        />
        <Center my={24}>
          <LogoSvg />
          <Text color="gray.100" fontSize="sm">
            Treine sua mente e corpo!
          </Text>
        </Center>

        <Center>
          <Heading color="gray.100" fontSize="xl" mb={6} fontFamily="heading">
            Crie sua conta
          </Heading>

          {/* {errors.name && <Text color="gray.100">{errors.name.message}</Text>} Exemplo de mensagem de erro de validação */}
          <Controller
            name="name"
            // rules={{   Validação sem yup
            //   required: 'Informe um  nome para continuar.',
            // }}
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Nome"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.name?.message}
              />
            )}
          />
          {/* {errors.email && <Text color="gray.100">{errors.email.message}</Text>} */}
          <Controller
            name="email"
            // rules={{
            //   required: 'Informe um e-mail para continuar.',
            //   pattern: {
            //     value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            //     message: 'E-mail inválido',
            //   },
            // }}
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="E-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.email?.message}
              />
            )}
          />
          <Controller
            name="password"
            // rules={{
            //   required: 'Informe uma senha para continuar.',
            // }}
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Senha"
                secureTextEntry
                onChangeText={onChange}
                value={value}
                errorMessage={errors.password?.message}
              />
            )}
          />
          <Controller
            name="password_confirmation"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Confirme a senha"
                secureTextEntry
                onChangeText={onChange}
                value={value}
                onSubmitEditing={handleSubmit(handleSignUp)}
                returnKeyType="send"
                errorMessage={errors.password_confirmation?.message}
              />
            )}
          />
        </Center>

        <Button title="Criar e acessar" onPress={handleSubmit(handleSignUp)} />

        <Button
          title="Voltar ao login"
          variant="outline"
          mt={24}
          onPress={handleGoBack}
        />
      </VStack>
    </ScrollView>
  );
}
