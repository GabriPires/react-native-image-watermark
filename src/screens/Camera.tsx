import { CameraCapturedPicture, Camera as ExpoCamera } from 'expo-camera'
import { useRef, useState } from 'react'
import { Button, Image, Pressable, StyleSheet, View } from 'react-native'
import Marker, { Position } from 'react-native-image-marker'

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

    await addWatermarkAndSave(picture)
  }

  async function addWatermarkAndSave(picture: CameraCapturedPicture) {
    try {
      Marker.markText({
        backgroundImage: {
          src: picture.uri,
        },
        watermarkTexts: [
          {
            text: 'Hello World\nThis is my watermark',
            positionOptions: {
              position: Position.bottomRight,
            },
            style: {
              color: '#ffffff',
              shadowStyle: {
                color: '#000000',
                dx: 0,
                dy: 1,
                radius: 2,
              },
            },
          },
        ],
      }).then((uri) => {
        Marker.markImage({
          backgroundImage: {
            src: `file://${uri}`,
          },
          watermarkImages: [
            {
              src: 'https://i.pinimg.com/originals/1c/c9/36/1cc936353a99784491557c68a5b2e292.jpg',
              scale: 0.1,
              position: {
                position: Position.bottomLeft,
              },
            },
          ],
        }).then((uri) => {
          setFinalPicture(`file://${uri}`)
        })
      })
    } catch (error) {
      console.log(error)
    }
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
