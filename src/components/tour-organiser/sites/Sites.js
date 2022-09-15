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
import { fetchSites, deleteSiteById } from "../../../utils/api";
import * as Linking from "expo-linking";
import moment from "moment";

const Tab = createBottomTabNavigator();

const Sites = () => {
  const navigation = useNavigation();
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visible, setVisible] = useState(false);
  const [selectedSite, setSelectedSite] = useState({});
  const author_id = 1;

  useEffect(() => {
    fetchSites(author_id)
      .then(({ data }) => {
        setLoading(false);
        setError(null);
        setSites(data);
      })
      .catch((error) => {
        setLoading(false);
        setError(error);
      });
  }, [author_id, sites]);

  const checkDelete = (siteId, siteName) => {
    Alert.alert(`Are you sure you want to delete ${siteName}?`, "", [
      {
        text: "Yes",
        onPress: () => {
          deleteSiteById(siteId)
            .then(() => {
              Alert.alert(`Site deleted!`, "", [{ text: "Back" }]);
              console.log("Site deleted!");
            })
            .catch((error) => {
              setError(error);
            });
        },
      },
      { text: "No" },
    ]);
  };

  const toggleSiteInfoOverlay = () => {
    setVisible(!visible);
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
        onBackdropPress={toggleSiteInfoOverlay}
      >
        <View>
          <Image
            source={{ uri: selectedSite.siteImage }}
            style={{ height: 200, width: "100%", borderRadius: 6 }}
          />
          <Text>{selectedSite.siteName}</Text>

          <Text>{selectedSite.siteDescription}</Text>
          <Text>{selectedSite.siteAddress}</Text>
          <Text>{selectedSite.contactInfo}</Text>
          <Text
            style={{ color: "blue" }}
            onPress={() => Linking.openURL(selectedSite.websiteLink)}
          >
            Visit Website
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
        >
          <Button title="Back" onPress={toggleSiteInfoOverlay} />
        </View>
      </Overlay>
      {sites.map(
        (
          {
            siteImage,
            siteName,
            siteDescription,
            siteAddress,
            contactInfo,
            websiteLink,
            updatedAt,
            siteId,
          },
          i
        ) => (
          <ListItem key={i} bottomDivider>
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
              <Text>Site ID: {siteId}</Text>
              <ListItem.Title>{siteName}</ListItem.Title>
              <Text>
                Last updated @ {moment(updatedAt).format("DD/MM/YYYY")},
                {moment(updatedAt).format("LT")}
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
                    navigation.navigate("EditSiteForm", { id: siteId });
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
                    setSelectedSite({
                      siteImage,
                      siteName,
                      siteDescription,
                      siteAddress,
                      contactInfo,
                      websiteLink,
                      updatedAt,
                      siteId,
                    });
                    toggleSiteInfoOverlay();
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
                <TouchableOpacity onPress={() => checkDelete(siteId, siteName)}>
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

export default Sites;