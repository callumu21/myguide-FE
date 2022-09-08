import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Text, ListItem, Avatar, Button } from "@rneui/themed";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { fetchSites } from "../../../utils/api";


const Tab = createBottomTabNavigator();

const Sites = () => {
  const navigation = useNavigation();
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const author_id = 2

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
  }, [author_id]);

  if (loading) {
    return (
      <View style={style.container}>
      <Text h4>My Sites</Text>
      <Text>Loading...</Text>
    </View>
    )
  }

  if (error) {
      return (
        <View style={style.container}>
          <Text>{error.msg}</Text>
        </View>
      );
    }
  
  return (
    <ScrollView style={style.container}>
      {sites.map((l, i) => (
        <ListItem key={i} bottomDivider style={style.listitem}>
          <Avatar source={{ uri: l.siteImage }} />
          <ListItem.Content>
            <Text>{l.id}</Text>
            <ListItem.Title>{l.siteName}</ListItem.Title>
            <ListItem.Subtitle>{l.siteDescription}</ListItem.Subtitle>
            <Text>{l.updatedAt}</Text>
            {/* <Link to={{ screen: "EditSiteForm", params: { id: l.id } }}>Edit Link</Link> */}
            <Button
              title="Edit"
              onPress={() => {
                navigation.navigate("EditSiteForm", { id: l.siteId });
              }}
            ></Button>
          </ListItem.Content>
        </ListItem>
      ))}
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
