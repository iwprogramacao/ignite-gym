import { ExerciseCard } from '@components/ExerciseCard';
import { ExerciseGroup } from '@components/ExerciseGroup';
import { HomeHeader } from '@components/HomeHeader';
import { FlatList, HStack, Heading, Text, VStack } from 'native-base';
import { useState } from 'react';

export function Home() {
  const [groupSelected, setGroupSelected] = useState('costas');
  const [groups, setGroups] = useState([
    'costas',
    'ombros',
    'bíceps',
    'tríceps',
  ]);
  const [exercicios, setExercicios] = useState([
    'Puxada frontal',
    'Remada Curvada',
    'Remada unilateral',
    'Levantamento terra',
  ]);

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
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <ExerciseGroup
            name={item}
            isActive={groupSelected.toLocaleUpperCase() === item.toUpperCase()}
            onPress={() => setGroupSelected(item)}
          />
        )}
      />

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
          keyExtractor={(item) => item}
          renderItem={({ item }) => <ExerciseCard />}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{ paddingBottom: 20 }}
        />
      </VStack>
    </VStack>
  );
}
