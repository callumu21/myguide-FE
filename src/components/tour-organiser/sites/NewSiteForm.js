import { useState, useEffect, React } from "react";
// prettier-ignore
import { Text, View, Alert, StyleSheet, ScrollView, Button } from "react-native";
import { Overlay, Input, Icon, ButtonGroup } from "@rneui/themed";
import { useForm, Controller } from "react-hook-form";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
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
  const [siteCoords, setSiteCoords] = useState();
  const [visible, setVisible] = useState(false);
  // prettier-ignore
  const { control, handleSubmit, reset, setValue, formState: { errors }, } = useForm({ defaultValues: {} });
  const [selectedIndex, setSelectedIndex] = useState(0);
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

  const getCoords = () => {
    if (!siteCoords) {
      Alert.alert(
        "Coordinates not obtained!",
        `Please go back to the previous screen and click on the site location on the map`,
        [{ text: "Back" }]
      );
    } else {
      Alert.alert(
        "Coordinates obtained!",
        `Latitude: ${String(siteCoords.latitude)} \nLongitude: ${String(
          siteCoords.longitude
        )} \n `,
        [{ text: "Close" }]
      );
    }
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
      mediaTypes: ImagePicker.MediaTypeOptions.All,
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
      setValue("siteImage", imagePath);
    }
  };

  const onFormSubmit = async (data) => {
    const imageName = data.siteName.toLowerCase().replace(/ /g, "_");
    const newSiteData = {
      ...data,
      siteImage: `https://myguideimages.s3.eu-west-2.amazonaws.com/${imageName}.jpg`,
      ...siteCoords,
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
                reset();
                navigation.navigate("Sites");
              },
            },
            {
              text: "Add Another site",
              onPress: () => {
                setSiteCoords();
                setImageInfo();
                reset();
              },
            },
          ]);
        } catch (error) {
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
              multiline={true}
              returnKeyType={"done"}
              blurOnSubmit={true}
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
                justifyContent: "flex-end",
                alignContent: "center",
                marginLeft: 40,
                marginRight: 8,
              }}
            >
              <Input
                placeholder="Site Image"
                style={{ ...styles.input }}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                keyboardType="url"
              />

              <Icon
                color="grey"
                name="camera"
                onPress={pickImage}
                size={40}
                type="font-awesome-5"
                underlayColor="#fff"
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
              onPress={(event) => setSiteCoords(event.nativeEvent.coordinate)}
            />
          </View>

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Button title="Get Coordinates" onPress={getCoords} />
            <Button title="Back" onPress={toggleCoordsOverlay} />
          </View>
        </Overlay>

        <View>
          <ButtonGroup
            buttons={["SET SITE LOCATION", "RESET"]}
            selectedIndex={selectedIndex}
            onPress={(value) => {
              value === 0
                ? toggleCoordsOverlay()
                : value === 1
                ? reset()
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
