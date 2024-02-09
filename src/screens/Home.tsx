import { ExerciseGroup } from '@components/ExerciseGroup';
import { HomeHeader } from '@components/HomeHeader';
import { FlatList, HStack, VStack } from 'native-base';
import { useState } from 'react';

export function Home() {
  const [groupSelected, setGroupSelected] = useState('costas');
  const [groups, setGroups] = useState([
    'costas',
    'ombros',
    'bíceps',
    'tríceps',
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
            isActive={groupSelected === item}
            onPress={() => setGroupSelected(item)}
          />
        )}
      />
    </VStack>
  );
}
