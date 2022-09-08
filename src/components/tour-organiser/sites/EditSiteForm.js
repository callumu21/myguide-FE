import { useEffect, useState } from "react";
import { Input, Text } from "@rneui/themed";
import React from "react";
import { View, Button, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import Tours from "../Tours";
import Sites from "./Sites";
// import axios from "axios";

const EditSiteForm = ({ route }) => {
  const { id } = route.params;

  const preloadedValues = {
    siteId: id,
    siteName: `Test Site ${id}`,
    siteDescription: `Test Description for site ${id}`,
    siteImage: "http://",
    siteAddress: `Test address for site ${id}`,
    contactInfo: `Test contact info for site ${id}`,
    websiteLink: `www.testwebsiteforsite${id}.com`,
  };

  const [site, setSite] = useState(preloadedValues);
  // const [loading, setLoading] = useState(true);

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { preloadedValues },
  });

  //   const fetchSiteById = async () => {
  //     try {
  //       const data = await axios.get(
  //         `https://myguidebackend.onrender.com/sites/${id}`
  //       );
  //       return data;
  //     } catch (error) {
  //       throw error;
  //     }
  //   };

  //   useEffect(() => {
  //     fetchSiteById()
  //       .then(({ data }) => {
  //         setLoading(false);
  //         setSiteById(data);
  //       })
  //       .catch((error) => {
  //         setError({ error });
  //       });
  //   }, []);

  //   useEffect(() => {
  //     fetchSiteById()
  //       .then(({ data }) => {
  //         setLoading(false);
  //         setSiteById(data);
  //       })
  //       .catch((error) => {
  //         setError({ error });
  //       });
  //   }, []);

  useEffect(() => {
    // simulate async api call with set timeout
    setTimeout(() => setSite(preloadedValues), 1000);
  }, []);

  useEffect(() => {
    // reset form with user data
    reset(site);
  }, [site]);

  const onSubmit = (data) => console.log(data);

//   if (loading) {
//     return (
//       <View style={style.container}>
//         <Text>Loading...</Text>
//       </View>
//     );
//   }

  return (
    <View>
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
          />
        )}
        name="siteName"
      />
      {errors.firstName && <Text>This is required.</Text>}

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
            numberOfLines={5}
            multiline={true}
            style={{ textAlignVertical: "top" }}
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
          <Input
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            keyboardType="url"
          />
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
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            keyboardType="url"
          />
        )}
        name="websiteLink"
      />
      {errors.websiteLink && <Text>This is required.</Text>}

      <Button title="Reset" onPress={() => reset()} />
      <Button title="Submit" onPress={handleSubmit(onSubmit)} />
    </View>
  );
};

export default EditSiteForm;
