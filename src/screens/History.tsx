import { HistoryCard } from '@components/HistoryCard';
import { ScreenHeader } from '@components/ScreenHeader';
import { Heading, SectionList, Text, VStack } from 'native-base';
import { useState } from 'react';

export function History() {
  const [exercises, setExercises] = useState([
    { title: '26.09.22', data: ['Puxada frontal', 'Remada unilateral'] },
    { title: '27.09.22', data: ['Puxada frontal'] },
  ]);
  return (
    <VStack flex={1}>
      <ScreenHeader title="Histórico de Exercícios" />

      <SectionList
        sections={exercises}
        keyExtractor={(item) => item}
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
    </VStack>
  );
}
