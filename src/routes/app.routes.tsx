import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Camera } from '../screens/Camera'
import { Home } from '../screens/Home'

const { Navigator, Screen } = createNativeStackNavigator()

export function AppRoutes() {
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Screen name="home" component={Home} />
      <Screen name="camera" component={Camera} />
    </Navigator>
  )
}
