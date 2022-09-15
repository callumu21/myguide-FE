import { useState, useEffect, React } from "react";
//prettier-ignore
import {
  Text,
  View,
  Alert,
  StyleSheet,
  ScrollView,
  Button,
  TouchableOpacity,
} from "react-native";
import {
  Overlay,
  Input,
  Icon,
  ButtonGroup,
  Image,
  ListItem,
} from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import { useForm, Controller, set } from "react-hook-form";
import { fetchSites, fetchTourById, updateTour } from "../../../utils/api";
import * as ImagePicker from "expo-image-picker";
import AWS from "aws-sdk";
import { REACT_APP_S3_ACCESS_KEY, REACT_APP_S3_SECRET_ACCESS_KEY } from "@env";

const EditTourForm = ({ route }) => {
  const navigation = useNavigation();
  const { tourId } = route.params;
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addedSites, setAddedSites] = useState([]); // sites in the tour
  const [selectedSites, setSelectedSites] = useState([]); // site clicked
  const [visible, setVisible] = useState(false);
  //prettier-ignore
  const { control, handleSubmit, reset, setValue, formState: { errors }, } = useForm({ defaultValues: { tour } });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [fetchedSites, setFetchedSites] = useState([]); // all sites
  const [imageInfo, setImageInfo] = useState();
  const [tour, setTour] = useState({});
  const authorId = 1;

  useEffect(() => {
    fetchTourById(tourId)
      .then((data) => {
        setLoading(false);
        setError(null);
        setTour({
          tourId: data[0].tourId,
          tourName: data[0].tourName,
          tourImage: data[0].tourImage,
          tourDescription: data[0].tourDescription,
          tourCode: data[0].tourCode,
        });
        setAddedSites(data[0].tourSites);
      })
      .catch((error) => {
        setLoading(false);
        setError(error);
      });
  }, [tourId]);

  useEffect(() => {
    fetchSites(authorId)
      .then(({ data }) => {
        setError(null);
        setLoading(false);
        setFetchedSites(data);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [authorId]);

  useEffect(() => {
    reset(tour);
  }, [tour]);

  const toggleAddSitesOverlay = () => {
    setVisible(!visible);
  };

  const pickImage = async () => {
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
      setValue("tourImage", imagePath);
    }
  };

  const onFormSubmit = async (data) => {
    const imageName = data.tourName.toLowerCase().replace(/ /g, "_");
    
      if (addedSites.length === 0) {
          Alert.alert("There are no sites in your tour - please add some!", "", [{ text: "OK" }]);
      }
      
      const updateTourData = {
      ...data,
      tourImage: `https:myguideimages.s3.eu-west-2.amazonaws.com/${imageName}.jpg`,
      authorId,
      tourSites: [...addedSites],
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
          await updateTour(tourId, updateTourData);
          Alert.alert("Tour successfully updated!", "", [
            {
              text: "Back to tours list",
              onPress: () => {
                setAddedSites([]);
                reset();
                navigation.navigate("Tours");
              },
            },
          ]);
        } catch (error) {
          setError(error.msg);
          Alert.alert(
            "There was an error updating your tour!",
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

  if (error) {
    return (
      <View>
        <Text>{error.msg}</Text>
      </View>
    );
  }

  const addSites = (siteId) => {
    if (!addedSites.includes(siteId)) {
      setAddedSites((addedSites) => [siteId, ...addedSites]);
      Alert.alert("Site added to Tour!", "", [{ text: "OK" }]);
    } else {
      const sitesWithRemovedId = addedSites.filter((site) => site !== siteId )
      setAddedSites([...sitesWithRemovedId]);
      Alert.alert("Site removed from Tour!", "", [{ text: "OK" }]);
    }
  };
  

  const resetForm = () => {
    reset();
    setAddedSites([]);
    setSelectedSites([]);
  };

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            keyboardType="default"
          />
        )}
        name="tourName"
      />
      {errors.tourName && <Text>This is required.</Text>}

      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
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
        name="tourDescription"
      />
      {errors.tourDescription && <Text>This is required.</Text>}

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
        name="tourImage"
      />

      {errors.tourImage && <Text>This is required.</Text>}

      <Overlay
        overlayStyle={{ width: 330, height: "90%", borderRadius: 8 }}
        isVisible={visible}
        onBackdropPress={toggleAddSitesOverlay}
      >
        <ScrollView>
          {fetchedSites.map(({ siteImage, siteName, siteId }, i) => (
            <TouchableOpacity key={i} onPress={() => addSites(siteId)}>
              <ListItem
                containerStyle={
                  addedSites.includes(siteId)
                    ? styles.selectedSite
                    : styles.deselectedSite
                }
              >
                <Image
                  source={{ uri: siteImage }}
                  style={{
                    width: 150,
                    height: 100,
                    borderColor: "grey",
                    borderWidth: 1,
                    borderRadius: 7,
                  }}
                />
                <ListItem.Content>
                  <Text>{siteId}</Text>
                  <ListItem.Title>{siteName}</ListItem.Title>
                </ListItem.Content>
              </ListItem>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
          <Button title="Back" onPress={toggleAddSitesOverlay} />
        </View>
      </Overlay>

      <View>
        <ButtonGroup
          buttons={["ADD SITES", "RESET"]}
          selectedIndex={selectedIndex}
          onPress={(value) => {
            value === 0
              ? toggleAddSitesOverlay()
              : value === 1
              ? resetForm()
              : null;
          }}
          containerStyle={{ marginBottom: 30 }}
        />
        <Button title="Submit" onPress={handleSubmit(onFormSubmit)} />
      </View>
    </View>
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
    justifyContent: "flex-start",
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

  selectedSite: {
    backgroundColor: "lightgreen",
    borderRadius: 7,
    borderWidth: 1,
  },
  deselectedSite: {
    backgroundColor: "white",
  },
});

export default EditTourForm;
