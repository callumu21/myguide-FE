import { useEffect, useState } from "react";
import { Input, Text } from "@rneui/themed";
import React from "react";
import { View, Button, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { fetchSiteById, updateSiteById } from "../../../utils/api";

const EditSiteForm = ({ route }) => {
  const { id } = route.params;
  const [site, setSite] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { site },
  });

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
        });
      })
      .catch((error) => {
        setLoading(false);
        setError(error);
      });
  }, [id]);

  useEffect(() => {
    reset(site);
  }, [site]);

  const onSubmit = async (data) => {
    updateSiteById(id, data)
    
  }

  if (loading) {
    return (
      <View>
        <Text h4>My Sites</Text>
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
