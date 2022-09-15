import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Text, ListItem, Button, Icon, Image, Overlay } from "@rneui/themed";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { fetchTours, deleteTourById } from "../../../utils/api";
import moment from "moment";

const Tab = createBottomTabNavigator();

const Tours = () => {
  const navigation = useNavigation();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visible, setVisible] = useState(false);
  const [selectedTour, setSelectedTour] = useState({});
  const [selectedTourSites, setSelectedTourSites] = useState([]);
  const author_id = 1;

  useEffect(() => {
    fetchTours(author_id)
      .then(({ data }) => {
        setLoading(false);
        setError(null);
        setTours(data);
      })
      .catch((error) => {
        setLoading(false);
        setError(error);
      });
  }, [author_id, tours]);

  const toggleTourInfoOverlay = () => {
    setVisible(!visible);
  };

    const checkDelete = (tourId, tourName) => {
      Alert.alert(`Are you sure you want to delete ${tourName}?`, "", [
        {
          text: "Yes",
          onPress: () => {
            deleteTourById(tourId)
              .then(() => {
                Alert.alert(`Tour deleted!`, "", [{ text: "Back" }]);
              })
              .catch((error) => {
                setError(error);
              });
          },
        },
        { text: "No" },
      ]);
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

  return (
    <ScrollView>
      <Overlay
        overlayStyle={{ width: 330, borderRadius: 6 }}
        isVisible={visible}
        onBackdropPress={toggleTourInfoOverlay}
      >
        <View>
          <Image
            source={{ uri: selectedTour.tourImage }}
            style={{ height: 200, width: "100%", borderRadius: 6 }}
          />
          <Text>Tour ID: {selectedTour.tourId}</Text>
          <Text>{selectedTour.tourName}</Text>
          <Text>Tour code: {selectedTour.tourCode}</Text>

          <Text>{selectedTour.tourDescription}</Text>
          <Text>
            Tour Sites:
            {selectedTourSites.map((siteId, i) => (
              <Text key={i}>{siteId}</Text>
            ))}
          </Text>
          <Text>
            Last updated: {moment(selectedTour.updatedAt).format("l")},{" "}
            {moment(selectedTour.updatedAt).format("LT")}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
        >
          <Button title="Back" onPress={toggleTourInfoOverlay} />
        </View>
      </Overlay>
      {tours.map(
        (
          {
            tourImage,
            tourName,
            tourDescription,
            tourCode,
            updatedAt,
            tourId,
            tourSites,
          },
          i
        ) => (
          <ListItem key={i} bottomDivider>
            <Image
              source={{ uri: tourImage }}
              style={{
                width: 150,
                height: 100,
                borderColor: "grey",
                borderWidth: 1,
                borderRadius: 7,
              }}
            />
            <ListItem.Content>
              <Text>Tour ID: {tourId}</Text>
              <ListItem.Title>{tourName}</ListItem.Title>
              <Text>Tour code: {tourCode}</Text>
              <Text>
                Last updated @ {moment(updatedAt).format("DD/MM/YYYY" )}, {moment(updatedAt).format("LT")}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("EditTourForm", { tourId });
                  }}
                >
                  <Icon
                    color="blue"
                    name="edit"
                    size={28}
                    type="font-awesome-5"
                    underlayColor="#fff"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedTour({
                      tourImage,
                      tourName,
                      tourDescription,
                      tourCode,
                      updatedAt,
                      tourId,
                    });
                    setSelectedTourSites(tourSites);
                    toggleTourInfoOverlay();
                  }}
                >
                  <Icon
                    color="grey"
                    name="info-circle"
                    size={30}
                    type="font-awesome-5"
                    underlayColor="#fff"
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => checkDelete(tourId, tourName)}>
                  <Icon
                    color="red"
                    name="trash"
                    size={28}
                    type="font-awesome-5"
                    underlayColor="#fff"
                  />
                </TouchableOpacity>
              </View>
            </ListItem.Content>
          </ListItem>
        )
      )}
    </ScrollView>
  );
};

const style = StyleSheet.create({
  container: {
    padding: 10,
  },
  listitem: {
    margin: 5,
    borderColor: "black",
    borderStyle: "solid",
    borderWidth: 2,
    borderRadius: 10,
    overflow: "hidden",
    elevation: 5,
  },
});

export default Tours;
