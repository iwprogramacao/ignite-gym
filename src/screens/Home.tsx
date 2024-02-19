import { ExerciseCard } from '@components/ExerciseCard';
import { ExerciseGroup } from '@components/ExerciseGroup';
import { HomeHeader } from '@components/HomeHeader';
import { Loading } from '@components/Loading';
import { ExerciseDTO } from '@dtos/ExerciseDTO';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { AppError } from '@utils/AppError';
import { FlatList, HStack, Heading, Text, VStack, useToast } from 'native-base';
import { useCallback, useEffect, useState } from 'react';
import { api } from 'src/service/api';

export function Home() {
  const [groupSelected, setGroupSelected] = useState('antebraço');
  const [groups, setGroups] = useState<string[]>([]);
  const [exercicios, setExercicios] = useState<ExerciseDTO[]>([]);
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);

  function handleOpenExerciseDetails(exerciseId: string) {
    navigation.navigate('exercise', { exerciseId });
  }

  async function fetchGroups() {
    try {
      const response = await api.get('/groups');

      setGroups(response.data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : 'Não foi possível carregar os grupos musculares.';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    }
  }

  async function fetchExercisesByGroup() {
    try {
      setIsLoading(true);

      const response = await api.get(`/exercises/bygroup/${groupSelected}`);

      setExercicios(response.data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : 'Não foi possível carregar os exercícios.';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchGroups();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchExercisesByGroup();
    }, [groupSelected])
  );

  return (
    <VStack flex={1}>
      <HomeHeader />

      <FlatList
        data={groups}
        horizontal
        showsVerticalScrollIndicator={false}
        _contentContainerStyle={{ px: 8 }}
        my={10}
        maxH={10}
        minH={10}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <ExerciseGroup
            name={item}
            isActive={groupSelected.toLocaleUpperCase() === item.toUpperCase()}
            onPress={() => setGroupSelected(item)}
          />
        )}
      />

      {!isLoading ? (
        <VStack flex={1} px={8} mb={5}>
          <HStack justifyContent="space-between">
            <Heading color="gray.200" fontSize="md" fontFamily="heading">
              Exercícios
            </Heading>

            <Text color="gray.200" fontSize="sm">
              {exercicios.length}
            </Text>
          </HStack>

          <FlatList
            data={exercicios}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ExerciseCard
                onPress={() => handleOpenExerciseDetails(item.id)}
                data={item}
              />
            )}
            showsVerticalScrollIndicator={false}
            _contentContainerStyle={{ paddingBottom: 20 }}
          />
        </VStack>
      ) : (
        <Loading />
      )}
    </VStack>
  );
}
