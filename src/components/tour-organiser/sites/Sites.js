import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Link } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { Text, ListItem, Avatar, Button } from "@rneui/themed";

const Sites = () => {
    const navigation = useNavigation();
    
  const list = [
    {
      id: 1,
      name: "Site 1",
      site_url: "https://",
      subtitle: "Little snippet about site 1",
    },
    {
      id: 2,
      name: "Site 2",
      site_url: "https://",
      subtitle: "Little snippet about site 2",
    },

    {
      id: 3,
      name: "Site 3",
      site_url: "http://",
      subtitle: "Little snipper about site 3",
    },
  ];

  const [sites, setSites] = useState(list);

  const handlePress = () => {
    console.log("Hey");
  };

  return (
    <View style={style.container}>
      <Text h4>My Sites</Text>
      {list.map((l, i) => (
        <ListItem key={i} bottomDivider style={style.listitem}>
          <Avatar source={{ uri: l.site_url }} />
          <ListItem.Content>
            <Text>{l.id}</Text>
            <ListItem.Title>{l.name}</ListItem.Title>
            <ListItem.Subtitle>{l.subtitle}</ListItem.Subtitle>
                  {/* <Link to={{ screen: "EditSiteForm", params: { id: l.id } }}>Edit Link</Link> */}
                  {/* <Button title="Edit Button" onPress={() => {navigation.navigate('EditSiteForm', {id: l.id})}}></Button> */}
                  <Button title="Edit Button" onPress={() => {}}></Button>
          </ListItem.Content>
        </ListItem>
      ))}
    </View>
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
