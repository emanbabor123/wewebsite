import axios from "axios";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

const API_URL =
  "https://6af3f9fe55a1de7dcf03745a.mockapi.io/api/products/items";

const inputStyle = {
  borderWidth: 1,
  borderColor: "#d1d5db",
  borderRadius: 10,
  paddingHorizontal: 12,
  paddingVertical: 10,
  backgroundColor: "#fff",
} as const;

export default function Edit() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/${id}`);
        setName(data.name ?? "");
        setDescription(data.description ?? "");
        setImage(data.image ?? "");
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const updatePost = async () => {
    setSaving(true);
    try {
      await axios.put(`${API_URL}/${id}`, { name, description, image });
      router.back();
    } catch (error) {
      console.log(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ padding: 24, gap: 16 }}>
      <View style={{ gap: 6 }}>
        <Text style={{ fontWeight: "600" }}>Name</Text>
        <TextInput style={inputStyle} value={name} onChangeText={setName} />
      </View>

      <View style={{ gap: 6 }}>
        <Text style={{ fontWeight: "600" }}>Description</Text>
        <TextInput
          style={inputStyle}
          value={description}
          onChangeText={setDescription}
        />
      </View>

      <View style={{ gap: 6 }}>
        <Text style={{ fontWeight: "600" }}>Image Url</Text>
        <TextInput
          style={inputStyle}
          value={image}
          onChangeText={setImage}
          autoCapitalize="none"
        />
      </View>

      <Pressable
        onPress={updatePost}
        disabled={saving}
        style={{
          paddingVertical: 14,
          alignItems: "center",
          borderRadius: 12,
          backgroundColor: saving ? "#99d5cf" : "#0d9488",
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "600" }}>
          {saving ? "Saving..." : "Save Changes"}
        </Text>
      </Pressable>
    </View>
  );
}
