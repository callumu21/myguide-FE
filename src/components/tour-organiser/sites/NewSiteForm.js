import { useState, useEffect, React } from "react";
// prettier-ignore
import { Text, View, Alert, StyleSheet, ScrollView, Button, Image } from "react-native";
import { Overlay, Input, Icon, ButtonGroup } from "@rneui/themed";
import { useForm, Controller } from "react-hook-form";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { addNewSite } from "../../../utils/api";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import AWS from "aws-sdk";
import { REACT_APP_S3_ACCESS_KEY, REACT_APP_S3_SECRET_ACCESS_KEY } from "@env";

const NewSiteForm = () => {
  const navigation = useNavigation();
  const [error, setError] = useState(null);
  const [status, setStatus] = useState();
  const [userLocation, setUserLocation] = useState();
  const [loading, setLoading] = useState(true);
  const [siteCoords, setSiteCoords] = useState(null);
  const [marker, setMarker] = useState([]);
  const [visible, setVisible] = useState(false);
  // prettier-ignore
  const { control, handleSubmit, reset, setValue, formState: { errors }, } = useForm({ defaultValues: {} });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [image, setImage] = useState(null);
  const [imageInfo, setImageInfo] = useState();
  const authorId = 1;

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setStatus("Permission to access location was denied");
        setLoading(false);
        return;
      } else {
        setStatus(status);

        let { coords } = await Location.getCurrentPositionAsync({});
        const { longitude, latitude } = coords;
        const userCoords = { longitude, latitude };
        setUserLocation(userCoords);
        setLoading(false);
      }
    })();
  }, []);

  const toggleCoordsOverlay = () => {
    setVisible(!visible);
  };

  const backFromLocation = () => {
    siteCoords
      ? (setMarker([siteCoords]), toggleCoordsOverlay())
      : toggleCoordsOverlay();
  };

  const saveLocation = () => {
    setSiteCoords(marker[0]);
    toggleCoordsOverlay();
  };

  const pickImage = async () => {
    // Ask the user for the permission to access the media library
    const medialibraryPermissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (medialibraryPermissionResult.granted === false) {
      alert("Please allow access to your photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      const imagePath = result.uri;
      const imageExt = result.uri.split(".").pop();

      let picture = await fetch(imagePath);
      picture = await picture.blob();
      const imageData = new File([picture], `photo.${imageExt}`);
      setImageInfo(imageData);
      setImage(result.uri);
      setValue("siteImage", imagePath);
    }
  };

  const onFormSubmit = async (data) => {
    const imageName = data.siteName.toLowerCase().replace(/ /g, "_");
    const newSiteData = {
      ...data,
      siteImage: `https://myguideimages.s3.eu-west-2.amazonaws.com/${imageName}.jpg`,
      latitude: siteCoords.latlng.latitude,
      longitude: siteCoords.latlng.longitude,
      authorId,
    };

    const s3 = new AWS.S3({
      accessKeyId: process.env.REACT_APP_S3_ACCESS_KEY,
      secretAccessKey: process.env.REACT_APP_S3_SECRET_ACCESS_KEY,
    });

    s3.upload(
      {
        Bucket: "myguideimages",
        Key: `${imageName}.jpg`,
        Body: imageInfo,
      },
      async function (err, data) {
        try {
          await addNewSite(newSiteData);
          Alert.alert("", `New site successfully added!`, [
            {
              text: "Back to Sites list",
              onPress: () => {
                setSiteCoords();
                setImageInfo();
                setImage();
                setMarker([]);
                reset();
                navigation.navigate("Sites");
              },
            },
            {
              text: "Add Another site",
              onPress: () => {
                setSiteCoords();
                setImageInfo();
                setImage();
                setMarker([]);
                reset();
              },
            },
          ]);
        } catch (err) {
          setError(error.msg);
          Alert.alert(
            "There was an error adding your site!",
            `Error message: ${error.msg} \n\nPlease try again`,
            [
              {
                text: "Back",
                onPress: () => {},
              },
            ]
          );
        }
      }
    );
  };

  if (loading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="Site Name"
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType="default"
            />
          )}
          name="siteName"
        />
        {errors.siteName && <Text>This is required.</Text>}

        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="Site Description"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType="default"
              numberOfLines={3}
              style={{ textAlignVertical: "top", ...styles.input }}
            />
          )}
          name="siteDescription"
        />
        {errors.siteDescription && <Text>This is required.</Text>}

        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <View
              style={{
                flexDirection: "row",
                justifyContent: image ? "space-between" : "center",
                alignContent: "center",
                alignItems: "center",
                marginLeft: image ? 10 : 0,
                marginRight: image ? 20 : 0,
                marginTop: 0,
                marginBottom: image ? 10 : 0,
              }}
            >
              {image && (
                <Image
                  source={{ uri: image }}
                  style={{
                    width: 200,
                    height: 150,
                    marginBottom: 20,
                    marginTop: -10,
                    margin: 5,
                    borderColor: "black",
                    borderStyle: "solid",
                    borderWidth: 1,
                    borderRadius: 10,
                  }}
                />
              )}
              <Icon
                color="grey"
                name="camera"
                onPress={pickImage}
                size={75}
                type="font-awesome-5"
                underlayColor="#fff"
                style={{ marginBottom: 30, marginRight: 20 }}
              />
            </View>
          )}
          name="siteImage"
        />

        {errors.siteImage && <Text>This is required.</Text>}

        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="Site Address"
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType="default"
            />
          )}
          name="siteAddress"
        />
        {errors.siteAddress && <Text>This is required.</Text>}

        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="Site Contact Number"
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType="numeric"
            />
          )}
          name="contactInfo"
        />
        {errors.contactInfo && <Text>This is required.</Text>}

        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="Website"
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType="url"
            />
          )}
          name="websiteLink"
        />
        {errors.websiteLink && <Text>This is required.</Text>}

        <Overlay
          overlayStyle={{ width: 330, borderRadius: 8 }}
          isVisible={visible}
          onBackdropPress={toggleCoordsOverlay}
        >
          <View>
            <MapView
              style={styles.map}
              showsUserLocation
              showsPointsOfInterest={true}
              showsBuildings={true}
              provider={PROVIDER_GOOGLE}
              initialRegion={{
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              onPress={(event) => {
                setMarker([{ latlng: event.nativeEvent.coordinate }]);
              }}
            >
              {marker.map((marker, i) => (
                <Marker coordinate={marker.latlng} key={i} />
              ))}
            </MapView>
          </View>

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Button title="Save Site Location" onPress={saveLocation} />
            <Button title="Back" onPress={backFromLocation} />
          </View>
        </Overlay>

        <View>
          <ButtonGroup
            buttons={["SET SITE LOCATION", "RESET"]}
            selectedIndex={selectedIndex}
            selectedButtonStyle={siteCoords ? { backgroundColor: "green" } : ""}
            onPress={(value) => {
              value === 0
                ? toggleCoordsOverlay()
                : value === 1
                ? (reset(), setMarker([]), setSiteCoords(), setImage(null))
                : null;
            }}
            containerStyle={{ marginBottom: 30 }}
          />

          <Button title="Submit" onPress={handleSubmit(onFormSubmit)} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  label: {
    margin: 20,
    marginLeft: 0,
  },
  button: {
    marginTop: 30,
    color: "white",
    height: 30,
    backgroundColor: "#ec5990",
    borderRadius: 4,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 8,
  },
  input: {
    backgroundColor: "white",
    borderColor: "grey",
    padding: 7,
    borderRadius: 4,
  },

  map: {
    marginBottom: 10,
    width: 310,
    height: 450,
  },
});

export default NewSiteForm;
