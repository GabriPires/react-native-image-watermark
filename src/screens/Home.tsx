import { useNavigation } from '@react-navigation/native'
import { Pressable, StyleSheet, Text, View } from 'react-native'

export function Home() {
  const { navigate } = useNavigation()

  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={() => navigate('camera')}>
        <Text style={styles.buttonText}>Ir para câmera</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#e54',
    justifyContent: 'center',
    padding: 10,
  },
  buttonText: {
    color: '#fff',
  },
  container: {
    alignItems: 'center',
    backgroundColor: '#1f1f1f',
    flex: 1,
    justifyContent: 'center',
  },
})
