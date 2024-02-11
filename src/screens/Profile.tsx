import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { ScreenHeader } from '@components/ScreenHeader';
import { UserPhoto } from '@components/UserPhoto';
import {
  Center,
  ScrollView,
  Text,
  VStack,
  Skeleton,
  Heading,
} from 'native-base';
import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const PHOTO_SIZE = 33;

export function Profile() {
  const [photoIsLoading, setPhotoIsLoading] = useState(false);

  async function handleUserPhotoSelect() {
    await ImagePicker.launchImageLibraryAsync();
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />

      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        <Center mt={6} px={10}>
          {photoIsLoading ? (
            <Skeleton
              w={PHOTO_SIZE}
              h={PHOTO_SIZE}
              rounded="full"
              startColor="gray.500"
              endColor="gray.400"
            />
          ) : (
            <UserPhoto
              size={PHOTO_SIZE}
              source={{ uri: 'https://github.com/iwprogramacao.png' }}
              alt="Imagem do usuário"
            />
          )}

          <TouchableOpacity onPress={handleUserPhotoSelect}>
            <Text fontFamily="heading" color="green.500" mt={3} mb={8}>
              Alterar foto
            </Text>
          </TouchableOpacity>

          <Input placeholder="Nome" bgColor="gray.600" />
          <Input placeholder="E-mail" bgColor="gray.600" isDisabled />
        </Center>

        <VStack px={10} mt={12} mb={9}>
          <Heading fontFamily={'heading'} fontSize="md" color="gray.200" mb={2}>
            Alterar senha
          </Heading>

          <Input
            bgColor="gray.600"
            placeholder="Senha antiga"
            secureTextEntry
          />
          <Input bgColor="gray.600" placeholder="Nova senha" secureTextEntry />
          <Input
            bgColor="gray.600"
            placeholder="Confirme a nova senha"
            secureTextEntry
          />
          <Button title="Atualizar" mt={4} />
        </VStack>
      </ScrollView>
    </VStack>
  );
}
