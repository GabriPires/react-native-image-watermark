import { Camera as ExpoCamera } from 'expo-camera'
import { useRef, useState } from 'react'
import { Button, Image, Pressable, StyleSheet, View } from 'react-native'

export function Camera() {
  const [finalPicture, setFinalPicture] = useState<string | null>(null)
  const [isCameraReady, setIsCameraReady] = useState(false)

  const camera = useRef<ExpoCamera>(null)

  const [permission, requestPermission] = ExpoCamera.useCameraPermissions()

  async function handleTakePicture() {
    if (!camera.current) {
      return
    }

    const picture = await camera.current.takePictureAsync({
      exif: true,
    })

    console.log(picture)
  }

  if (!permission?.granted) {
    return (
      <View style={styles.container}>
        <Button
          onPress={() => requestPermission()}
          title="Permitir acesso à câmera"
        />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {finalPicture ? (
        <Image
          source={{ uri: finalPicture }}
          style={styles.image}
          alt="Foto tirada pela câmera"
        />
      ) : (
        <ExpoCamera
          ref={camera}
          style={styles.camera}
          autoFocus
          onCameraReady={() => setIsCameraReady(true)}
        >
          <Pressable
            style={styles.button}
            onPress={handleTakePicture}
            disabled={!isCameraReady}
          />
        </ExpoCamera>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#e54',
    borderColor: '#fff',
    borderRadius: 35,
    borderWidth: 6,
    height: 70,
    marginBottom: 40,
    width: 70,
  },
  camera: {
    alignItems: 'center',
    height: '70%',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#1f1f1f',
    flex: 1,
    justifyContent: 'center',
  },
  image: { flex: 1, resizeMode: 'contain' },
})
