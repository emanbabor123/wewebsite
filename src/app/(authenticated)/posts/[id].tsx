import axios from "axios";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Image, Pressable, Text, View } from "react-native";

type ProductProps = {
  id: string;
  name: string;
  description: string;
  image: string;
};

const API_URL =
  "https://6af3f9fe55a1de7dcf03745a.mockapi.io/api/products/items";

export default function PostById() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<ProductProps>();
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const getProductById = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/${id}`);
      setProduct(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async () => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      router.back();
    } catch (error) {
      console.log(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getProductById();
    }, []),
  );

  return loading ? (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size="large" />
    </View>
  ) : (
    <View className="flex-1 p-6">
      <Image source={{ uri: product?.image }} className="h-40" />
      <View className="gap-2 p-2">
        <Text className="font-bold text-xl">{product?.name}</Text>
        <Text className="text-sm text-gray-700">{product?.description}</Text>
      </View>

      <View style={{ flexDirection: "row", gap: 12, marginTop: 16 }}>
        <Pressable
          onPress={() =>
            router.push({ pathname: "/posts/edit", params: { id } })
          }
          style={{
            flex: 1,
            paddingVertical: 12,
            alignItems: "center",
            borderRadius: 12,
            backgroundColor: "#0d9488",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>Edit</Text>
        </Pressable>

        {!confirming ? (
          <Pressable
            onPress={() => setConfirming(true)}
            style={{
              flex: 1,
              paddingVertical: 12,
              alignItems: "center",
              borderRadius: 12,
              backgroundColor: "#dc2626",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>Delete</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={deletePost}
            style={{
              flex: 1,
              paddingVertical: 12,
              alignItems: "center",
              borderRadius: 12,
              backgroundColor: "#991b1b",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>
              Tap again to confirm
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
