import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { AuthRoutes } from './auth.routes';
import { Box, useTheme } from 'native-base';
import { AppRoutes } from './app.routes';
import { useAuth } from '@hooks/useAuth';
import { Loading } from '@components/Loading';

export function Routes() {
  const { colors } = useTheme();

  const { user, isLoadingStorageUserData } = useAuth();

  const theme = DefaultTheme;
  theme.colors.background = colors.gray[700];

  if (isLoadingStorageUserData) {
    return <Loading />;
  }

  return (
    <Box flex={1} bgColor="gray.700">
      <NavigationContainer theme={theme}>
        {user.id ? <AppRoutes /> : <AuthRoutes />}
      </NavigationContainer>
    </Box>
  );
}
