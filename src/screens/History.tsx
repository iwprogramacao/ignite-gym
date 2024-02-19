import { HistoryCard } from '@components/HistoryCard';
import { Loading } from '@components/Loading';
import { ScreenHeader } from '@components/ScreenHeader';
import { HistoryByDayDTO } from '@dtos/HistoryByDayDTO';
import { useFocusEffect } from '@react-navigation/native';
import { AppError } from '@utils/AppError';
import { Heading, SectionList, Text, VStack, useToast } from 'native-base';
import { useCallback, useState } from 'react';
import { api } from 'src/service/api';

export function History() {
  const [exercises, setExercises] = useState<HistoryByDayDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const toast = useToast();

  async function fetchHistory() {
    try {
      setIsLoading(true);

      const response = await api.get('/history');
      console.log(response.data);

      setExercises(response.data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : 'Não foi possível carregar o histórico.';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchHistory();
    }, [])
  );

  return (
    <VStack flex={1}>
      <ScreenHeader title="Histórico de Exercícios" />
      {isLoading ? (
        <Loading />
      ) : (
        <SectionList
          sections={exercises}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <HistoryCard />}
          renderSectionHeader={({ section }) => (
            <VStack bgColor="gray.700">
              <Heading color="gray.200" fontSize="lg" w="full" mt={10} mb={3}>
                {section.title}
              </Heading>
            </VStack>
          )}
          ListEmptyComponent={() => (
            <Text color="gray.100" textAlign="center">
              Não há exercícios registrados ainda. {'\n'} Vamos treinar hoje?
            </Text>
          )}
          contentContainerStyle={
            exercises.length === 0 && { flex: 1, justifyContent: 'center' }
          }
          showsVerticalScrollIndicator={false}
          px={8}
        />
      )}
    </VStack>
  );
}
