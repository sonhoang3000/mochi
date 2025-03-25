import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

import AllCommentsScreen from '../screens/AllCommentsScreen';
import ChatScreen from '../screens/ChatScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import Explore from '../screens/Explore';
import FollowersScreen from '../screens/FollowersScreen';
import FollowingScreen from '../screens/FollowingScreen';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import MessageListScreen from '../screens/MessageListScreen';
import NoticeScreen from '../screens/NoticeScreen';
import PostDetail from '../screens/PostDetail';
import ProfileScreen from '../screens/ProfileScreen';
import RegisterScreen from '../screens/RegisterScreen';
import StoryProfile from '../screens/StoryProfile';
import SuggestedScreen from '../screens/SuggestedScreen';
import UploadScreen from '../screens/UploadScreen';
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#FF69B4', // Màu hồng (Hot Pink)
      tabBarInactiveTintColor: 'gray',
    }}
  >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{ tabBarIcon: ({ color, size }) => (<Icon name="home" size={size} color={color} />) }}
    />
    <Tab.Screen
      name="Suggested"
      component={SuggestedScreen}
      options={{ tabBarIcon: ({ color, size }) => (<Icon name="user-plus" size={size} color={color} />) }}
    />
    <Tab.Screen
      name="Upload"
      component={UploadScreen}
      options={{ tabBarIcon: ({ color, size }) => (<Icon name="plus-square" size={size} color={color} />) }}
    />
    <Tab.Screen
      name="Explore"
      component={Explore}
      options={{ tabBarIcon: ({ color, size }) => (<Icon name="user" size={size} color={color} />) }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{ tabBarIcon: ({ color, size }) => (<Icon name="user" size={size} color={color} />) }}
    />
  </Tab.Navigator>

);

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, gestureEnabled: true, gestureDirection: 'horizontal', }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="HomeTabs" component={TabNavigator} />
        <Stack.Screen name="Upload" component={UploadScreen} options={{ headerShown: false, gestureEnabled: true, }} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false, gestureEnabled: true, }} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ headerShown: false, gestureEnabled: true, }} />
        <Stack.Screen name="AllCommentsScreen" component={AllCommentsScreen} options={{ headerShown: false, gestureEnabled: true, }} />
        <Stack.Screen name="FollowersScreen" component={FollowersScreen} options={{ headerShown: false, gestureEnabled: true, }} />
        <Stack.Screen name="FollowingScreen" component={FollowingScreen} options={{ headerShown: false, gestureEnabled: true, }} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ headerShown: false, gestureEnabled: true, }} />
        <Stack.Screen name="Messageslist" component={MessageListScreen} options={{ headerShown: false, gestureEnabled: true, }} />
        <Stack.Screen name="StoryProfile" component={StoryProfile} options={{ headerShown: false, gestureEnabled: true, }} />
        <Stack.Screen name="PostDetail" component={PostDetail} options={{ headerShown: false, gestureEnabled: true, }} />
        <Stack.Screen name="NoticeScreen" component={NoticeScreen} options={{ headerShown: false, gestureEnabled: true, }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
