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
import { useForm, Controller, } from "react-hook-form";
import { fetchSites } from "../../../utils/api";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import AWS from "aws-sdk";
import { addNewTour } from "../../../utils/api";
import { REACT_APP_S3_ACCESS_KEY, REACT_APP_S3_SECRET_ACCESS_KEY } from "@env";

const NewTourForm = () => {
  const navigation = useNavigation();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [addedSites, setAddedSites] = useState([]);
  const [visible, setVisible] = useState(false);
//prettier-ignore
  const { control, handleSubmit, reset, setValue, formState: { errors }, } = useForm({
    defaultValues: {},
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [imageInfo, setImageInfo] = useState();
  const [fetchedSites, setFetchedSites] = useState([]);
  const authorId = 1;

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
    const newTourData = {
      ...data,
      tourImage: `https:myguideimages.s3.eu-west-2.amazonaws.com/${imageName}.jpg`,
      authorId,
      tourSites: addedSites,
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
           await addNewTour(newTourData);
           Alert.alert("", `New tour successfully added!`, [
             {
               text: "Back to tours list",
               onPress: () => {
                 setAddedSites([]);
                 reset();
                 navigation.navigate("Tours");
               },
             },
             {
               text: "Add another tour",
               onPress: () => {
                 setAddedSites([]);
                 setImageInfo();
                 reset();
               },
             },
           ]);
         } catch (error) {
           setError(error.msg);
           Alert.alert(
             "There was an error adding your tour!",
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
            placeholder="Tour Name"
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
            placeholder="Tour Description"
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
              placeholder="Tour Image"
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

export default NewTourForm;
