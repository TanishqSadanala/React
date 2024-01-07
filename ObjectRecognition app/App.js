import { StatusBar } from "expo-status-bar";
import {
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  View,
} from "react-native";
import { styles } from "./styles";
import { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import * as tensorflow from "@tensorflow/tfjs";
import * as cocoSSD from "@tensorflow-models/coco-ssd";
import { decodeJpeg } from "@tensorflow/tfjs-react-native";
import * as FileSystem from "expo-file-system";
import { Dimensions } from 'react-native';


const MyButton = ({ title, onPress, color }) => (
  <TouchableOpacity
    style={[styles.button, { backgroundColor: color }]}
    onPress={onPress}
  >
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

const App = () => {
  const windowWidth = Dimensions.get('window').width;
  const [selecImageUri, setImageUri] = useState(
    "https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg"
  );
  const [isloading, setisloading] = useState(false);
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    (async () => {
      const { status: mediaLibraryStatus } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();  
      if (mediaLibraryStatus !== "granted") {
        alert("Permission to access the media library is required.");
      }

      const { status: cameraStatus } =
        await ImagePicker.requestCameraPermissionsAsync();
      if (cameraStatus !== "granted") {
        alert("Permission to access the camera is required.");
      }
    })();
  }, []);

  async function handleUploadPhoto() {
    setisloading(true);
    try {
      const uploadResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
      });
      if (!uploadResult.canceled) {
        const { uri } = uploadResult.assets[0];
        setImageUri(uri);
        await imageClassification(uri);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setisloading(false);
    }
  }

  async function handleTakePhoto() {
    setisloading(true);
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
      });

      if (!result.canceled) {
        const { uri } = result;
        setImageUri(uri);
        await imageClassification(uri);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setisloading(false);
    }
  }

  async function imageClassification(imageuri) {
    await tensorflow.ready();
    const Model = await cocoSSD.load();

    const imageBase64 = await FileSystem.readAsStringAsync(imageuri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const imgBuffer = Buffer.from(imageBase64, "base64");
    const raw = new Uint8Array(imgBuffer);
    const imageTensor = decodeJpeg(raw);
    const predictions = await Model.detect(imageTensor);
    setPredictions(predictions);
  }

  const getHealthBarColor = (score) => {
    if (score >= 0.8) {
      return "green";
    } else if (score >= 0.5) {
      return "yellow";
    } else {
      return "red";
    }
  };
  return (
    
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="transparent" translucent />
      <Text style={styles.text}>Image Classification</Text>
      <Image
        source={{
          uri:
            selecImageUri ||
            "https://cdn-icons-png.flaticon.com/512/4823/4823463.png",
        }}
        style={styles.image}
      />
      {predictions.length > 0 && (
        <View style={styles.predictionsContainer}>
          <Text style={styles.predictionsHeader}>Predictions:</Text>
          {predictions.map((prediction, index) => (
            <View key={index} style={styles.predictionText}>
              <Text style = {styles.scoretext}>
                Class: {prediction.class} | Score: {Math.round(prediction.score * 100)}%
              </Text>
              <View
                style={[
                  styles.healthBar,
                  {
                    width: (prediction.score * windowWidth) / 2, 
                    backgroundColor: getHealthBarColor(prediction.score),
                  },
                ]}
              />
            </View>
          ))}
        </View>
      )}
      <View>
        {isloading ? (
          <ActivityIndicator color="white" />
        ) : (
          <MyButton
            title="Upload Photo"
            onPress={handleUploadPhoto}
            color="#3498db"
          />
        )}
      </View>
  
      <MyButton title="Camera" onPress={handleTakePhoto} color="#2ecc71" />
    </View>
  );
}  

export default App

