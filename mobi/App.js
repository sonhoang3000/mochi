import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { PostProvider } from './src/context/PostContext';
<<<<<<< HEAD
=======
import { SocketProvider } from './src/context/SocketContext';
>>>>>>> 0082e97b985bedc0ff2c23e46d2be1efcc35b6ea
import AppNavigator from './src/navigation/AppNavigator';
import Toast from 'react-native-toast-message';
import { MenuProvider } from 'react-native-popup-menu';

const App = () => {
  return (
    <SafeAreaProvider>
      <AuthProvider>
<<<<<<< HEAD
        <PostProvider>
          <MenuProvider>
            <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
              <AppNavigator />
              <Toast />
            </SafeAreaView>
          </MenuProvider>
        </PostProvider>
=======
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
>>>>>>> 0082e97b985bedc0ff2c23e46d2be1efcc35b6ea
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
