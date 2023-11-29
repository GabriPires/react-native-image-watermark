import { CameraCapturedPicture, Camera as ExpoCamera } from 'expo-camera'
import * as MediaLibrary from 'expo-media-library'
import { useRef, useState } from 'react'
import { Button, Image, Pressable, StyleSheet, Text, View } from 'react-native'
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
    const { uri } = picture

    try {
      Marker.markText({
        backgroundImage: {
          src: uri,
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
              scale: 0.05,
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

  async function handleSavePicture(pictureUri: string) {
    await MediaLibrary.saveToLibraryAsync(pictureUri)
    setFinalPicture(null)
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
        <View style={styles.finalPictureContainer}>
          <Image
            source={{ uri: finalPicture }}
            style={styles.image}
            alt="Foto tirada pela câmera"
          />
          <View style={styles.finalPictureButtons}>
            <Pressable
              style={[
                styles.finalPictureButton,
                styles.finalPictureButtonDelete,
              ]}
              onPress={() => setFinalPicture(null)}
            >
              <Text style={styles.finalPictureButtonText}>Excluir</Text>
            </Pressable>
            <Pressable
              style={[styles.finalPictureButton, styles.finalPictureButtonSave]}
              onPress={() => handleSavePicture(finalPicture)}
            >
              <Text style={styles.finalPictureButtonText}>Salvar</Text>
            </Pressable>
          </View>
        </View>
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
  finalPictureButton: {
    alignItems: 'center',
    borderRadius: 5,
    justifyContent: 'center',
    padding: 10,
    width: 130,
  },
  finalPictureButtonDelete: {
    backgroundColor: '#e54',
    marginRight: 10,
  },
  finalPictureButtonSave: {
    backgroundColor: '#54e',
  },
  finalPictureButtonText: {
    color: '#fff',
  },
  finalPictureButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    width: '100%',
  },
  finalPictureContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  image: { height: 500, resizeMode: 'contain', width: 500 },
})
