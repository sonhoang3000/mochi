import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { PostProvider } from './src/context/PostContext';
import { SocketProvider } from './src/context/SocketContext';
import AppNavigator from './src/navigation/AppNavigator';
import Toast from 'react-native-toast-message';
import { MenuProvider } from 'react-native-popup-menu';

const App = () => {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <SocketProvider>
          <PostProvider>
            <MenuProvider>
              <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
                <AppNavigator />
                <Toast />
              </SafeAreaView>
            </MenuProvider>
          </PostProvider>
        </SocketProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default App;
