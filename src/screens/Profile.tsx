import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import {
  Center,
  Heading,
  ScrollView,
  Skeleton,
  Text,
  useToast,
  VStack,
} from 'native-base';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, TouchableOpacity } from 'react-native';
import { api } from 'src/service/api';
import * as yup from 'yup';

import userPhotoDefaultPng from '@assets/userPhotoDefault.png';
import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { ScreenHeader } from '@components/ScreenHeader';
import { UserPhoto } from '@components/UserPhoto';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '@hooks/useAuth';
import { AppError } from '@utils/AppError';

const PHOTO_SIZE = 33;

type FormDataProps = {
  name: string;
  email?: string;
  old_password?: string;
  password?: string | null;
  password_confirmation?: string | null;
};

const profileSchema = yup.object({
  name: yup.string().required('Informe o novo nome'),
  password: yup
    .string()
    .nullable()
    .min(6, 'A senha deve ter pelo menos 6 caracteres.')
    .transform((value) => (!!value ? value : null)),
  password_confirmation: yup
    .string()
    .nullable()
    .transform((value) => (!!value ? value : null))
    .when('password', {
      is: (field: any) => field,
      then: (schema) =>
        schema
          .nullable()
          .required('Informe a confirmação da senha')
          .transform((value) => (!!value ? value : null)),
    })
    .oneOf(
      [yup.ref('password'), null],
      'A confirmação deve ser igual a nova senha.'
    ),
});

export function Profile() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [photoIsLoading, setPhotoIsLoading] = useState(false);

  const toast = useToast();
  const { user, updateUserProfile } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    defaultValues: {
      name: user.name,
      email: user.email,
    },
    resolver: yupResolver(profileSchema),
  });

  async function handleUserPhotoSelect() {
    try {
      setPhotoIsLoading(true);
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      });
      if (photoSelected.canceled) {
        return;
      }

      const fileExtention = photoSelected.assets[0].uri.split('.').pop();

      const photoFile = {
        name: `${user.name}.${fileExtention}`.toLowerCase(),
        uri: photoSelected.assets[0].uri,
        type: `${photoSelected.assets[0].type}/${fileExtention}`,
      } as any;

      const userPhotoUploadForm = new FormData();
      userPhotoUploadForm.append('avatar', photoFile);

      const avatarUpdatedResponse = await api.patch(
        '/users/avatar',
        userPhotoUploadForm,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      const userUpdated = user;
      userUpdated.avatar = avatarUpdatedResponse.data.avatar;

      updateUserProfile(userUpdated);

      toast.show({
        title: 'A imagem foi atualizada!',
        placement: 'top',
        bgColor: 'green.700',
      });

      if (photoSelected.assets[0].uri) {
        const photoInfo = (await FileSystem.getInfoAsync(
          photoSelected.assets[0].uri
        )) as FileSystem.FileInfo;

        if (photoInfo.size && photoInfo.size / 1024 / 1024 > 5) {
          return toast.show({
            title: 'Escolha uma imagem de até 5MB máximos',
            placement: 'top',
            bgColor: 'red.500',
          });
          // Alert.alert('Escolha uma imagem de até 5MB máximos');
        }
      } else {
        Alert.alert('Não foi possível obter a imagem');
      }
    } catch (error) {
      Alert.alert('Não foi possível atualizar a imagem');
    } finally {
      setPhotoIsLoading(false);
    }
  }

  async function handleProfileUpdate(data: FormDataProps) {
    try {
      setIsUpdating(true);

      await api.put('/users', data);

      const userUpdated = user;
      userUpdated.name = data.name;

      await updateUserProfile(userUpdated);

      toast.show({
        title: 'Perfil atualizado con sucesso!',
        placement: 'top',
        bgColor: 'green.700',
      });
    } catch (error) {
      const isAppError = error instanceof AppError;

      const title = isAppError
        ? error.message
        : 'Não foi possível alterar as informações. Por favor, tente novamente mais tarde';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsUpdating(false);
    }
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
              source={
                user.avatar
                  ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` }
                  : userPhotoDefaultPng
              }
              alt="Imagem do usuário"
            />
          )}

          <TouchableOpacity onPress={handleUserPhotoSelect}>
            <Text fontFamily="heading" color="green.500" mt={3} mb={8}>
              Alterar foto
            </Text>
          </TouchableOpacity>

          <Controller
            name="name"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Input
                placeholder="Nome"
                bgColor="gray.600"
                value={value}
                onChangeText={onChange}
                errorMessage={errors.name?.message}
              />
            )}
          />
          <Controller
            name="email"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Input
                placeholder="E-mail"
                bgColor="gray.600"
                value={value}
                onChangeText={onChange}
                isDisabled
              />
            )}
          />
        </Center>

        <VStack px={10} mt={12} mb={9}>
          <Heading fontFamily={'heading'} fontSize="md" color="gray.200" mb={2}>
            Alterar senha
          </Heading>

          <Controller
            name="old_password"
            control={control}
            render={({ field: { onChange } }) => (
              <Input
                bgColor="gray.600"
                placeholder="Senha antiga"
                onChangeText={onChange}
                secureTextEntry
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            render={({ field: { onChange } }) => (
              <Input
                bgColor="gray.600"
                placeholder="Nova senha"
                onChangeText={onChange}
                secureTextEntry
                errorMessage={errors.password?.message}
              />
            )}
          />
          <Controller
            name="password_confirmation"
            control={control}
            render={({ field: { onChange } }) => (
              <Input
                bgColor="gray.600"
                placeholder="Confirme a senha"
                onChangeText={onChange}
                secureTextEntry
                errorMessage={errors.password_confirmation?.message}
              />
            )}
          />

          <Button
            title="Atualizar"
            mt={4}
            onPress={handleSubmit(handleProfileUpdate)}
            isLoading={isUpdating}
          />
        </VStack>
      </ScrollView>
    </VStack>
  );
}
