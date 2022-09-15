import { useEffect, useState } from "react";
import { Input, Text, Icon, Overlay, ButtonGroup } from "@rneui/themed";
import React from "react";
import { View, Button, StyleSheet, Image, ScrollView } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { fetchSiteById, updateSiteById } from "../../../utils/api";
import * as ImagePicker from "expo-image-picker";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import AWS from "aws-sdk";
import { REACT_APP_S3_ACCESS_KEY, REACT_APP_S3_SECRET_ACCESS_KEY } from "@env";

const EditSiteForm = ({ route }) => {
  const { id } = route.params;
  const navigation = useNavigation();
  const [site, setSite] = useState();
  const [loading, setLoading] = useState(true);
  const [locationLoading, setLocationLoading] = useState(true);
  const [siteCoords, setSiteCoords] = useState(null);
  const [error, setError] = useState(null);
  const [image, setImage] = useState(null);
  const [savedUri, setSavedUri] = useState(null);
  const [imageInfo, setImageInfo] = useState(null);
  const [marker, setMarker] = useState([]);
  const [visible, setVisible] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [status, setStatus] = useState();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [savedLatitude, setSavedLatitude] = useState(null);
  const [savedLongitude, setSavedLongitude] = useState(null);
  const [updatedSite, setUpdatedSite] = useState(null);

  const {
    control,
    reset,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { site },
  });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setStatus("Permission to access location was denied");
        setLocationLoading(false);
        return;
      } else {
        setStatus(status);
        let { coords } = await Location.getCurrentPositionAsync({});
        const { longitude, latitude } = coords;
        const userCoords = { longitude, latitude };
        setUserLocation(userCoords);
        setLocationLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    fetchSiteById(id)
      .then((data) => {
        setLoading(false);
        setError(null);
        setSite({
          siteName: data[0].siteName,
          siteImage: data[0].siteImage,
          contactInfo: data[0].contactInfo,
          siteAddress: data[0].siteAddress,
          siteDescription: data[0].siteDescription,
          websiteLink: data[0].websiteLink,
          latitude: data[0].latitude,
          longitude: data[0].longitude,
        });
        setUpdatedSite({
          siteName: data[0].siteName,
          siteImage: data[0].siteImage,
          contactInfo: data[0].contactInfo,
          siteAddress: data[0].siteAddress,
          siteDescription: data[0].siteDescription,
          websiteLink: data[0].websiteLink,
          latitude: data[0].latitude,
          longitude: data[0].longitude,
        });
        return {
          siteImage: data[0].siteImage,
          latitude: data[0].latitude,
          longitude: data[0].longitude,
        };
      })
      .then(({ siteImage, latitude, longitude }) => {
        setSavedUri(siteImage);
        setImage(siteImage);
        setSavedLatitude(latitude);
        setSavedLongitude(longitude);
        setMarker([{ latlng: { latitude, longitude } }]);
      })
      .catch((error) => {
        setLoading(false);
        setError(error);
      });
  }, [id]);

  useEffect(() => {
    reset(site);
  }, [site]);

  const onSubmit = async (site) => {
    try {
      await updateSiteById(id, updatedSite);
      navigation.navigate("Sites");
    } catch (err) {
      console.log(err);
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

  const toggleCoordsOverlay = () => {
    setVisible(!visible);
  };

  const backFromLocation = () => {
    siteCoords
      ? (setMarker([siteCoords]), toggleCoordsOverlay())
      : (setMarker([
          { latlng: { latitude: savedLatitude, longitude: savedLongitude } },
        ]),
        toggleCoordsOverlay());
  };

  const saveLocation = () => {
    setSiteCoords(marker[0]);
    setUpdatedSite((currSite) => {
      return {
        ...currSite,
        latitude: marker[0].latlng.latitude,
        longitude: marker[0].latlng.longitude,
      };
    });
    toggleCoordsOverlay();
  };

  if (loading || locationLoading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View>
        <Text>Error</Text>
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
              numberOfLines={5}
              multiline={true}
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
                justifyContent: "space-between",
                alignContent: "center",
                alignItems: "center",
                marginLeft: 10,
                marginRight: 20,
                marginTop: 0,
                marginBottom: 10,
              }}
            >
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
                ? (reset(),
                  setMarker([
                    {
                      latlng: {
                        latitude: savedLatitude,
                        longitude: savedLongitude,
                      },
                    },
                  ]),
                  setSiteCoords(),
                  setImage(savedUri))
                : null;
            }}
            containerStyle={{ marginBottom: 30 }}
          />

          <Button
            title="Submit"
            onPress={handleSubmit(onSubmit)}
            style={{ marginLeft: 20, marginRight: 20 }}
          />
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

export default EditSiteForm;
