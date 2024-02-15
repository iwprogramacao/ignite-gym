import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { AuthRoutes } from './auth.routes';
import { Box, useTheme } from 'native-base';
import { AppRoutes } from './app.routes';
import { useContext } from 'react';
import { AuthContext } from '@contexts/AuthContext';
import { useAuth } from '@hooks/useAuth';

export function Routes() {
  const { colors } = useTheme();

  const { user } = useAuth();
  console.log(user);

  const theme = DefaultTheme;
  theme.colors.background = colors.gray[700];

  return (
    <Box flex={1} bgColor="gray.700">
      <NavigationContainer theme={theme}>
        <AuthRoutes />
      </NavigationContainer>
    </Box>
  );
}
