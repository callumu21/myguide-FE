import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Text, ListItem, Avatar, Button, Icon } from "@rneui/themed";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { fetchSites } from "../../../utils/api";

const Tab = createBottomTabNavigator();

const Sites = () => {
  const navigation = useNavigation();
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
      {sites.map(
        ({ siteImage, siteName, siteDescription, updatedAt, siteId }, i) => (
          <ListItem.Swipeable
            key={i}
            bottomDivider
            leftContent={(reset) => (
              <Button
                onPress={() => reset()}
                icon={{ name: "info-circle", type: "font-awesome-5", color: "white" }}
                buttonStyle={{ minHeight: "100%" }}
              />
            )}
            rightContent={(reset) => (
              <Button
                onPress={() => reset()}
                icon={{ name: "trash", type: "font-awesome-5", color: "white" }}
                buttonStyle={{
                  minHeight: "100%",
                  backgroundColor: "red",
                }}
              />
            )}
          >
            <Avatar source={{ uri: siteImage }} />
            <ListItem.Content>
              <Text>Site ID: {siteId}</Text>
              <ListItem.Title>{siteName}</ListItem.Title>
              <ListItem.Subtitle>{siteDescription}</ListItem.Subtitle>
              <Text>Last updated @ {updatedAt}</Text>
              {/* <Link to={{ screen: "EditSiteForm", params: { id: siteId } }}>Edit Link</Link> */}
              <Button
                title="Edit"
                onPress={() => {
                  navigation.navigate("EditSiteForm", { id: siteId });
                }}
              ></Button>
            </ListItem.Content>
          </ListItem.Swipeable>
        )
      )}
    </ScrollView>
  );
};

const style = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "grey",
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
