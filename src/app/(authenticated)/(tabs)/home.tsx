import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Pressable,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ProductProps = {
  id: string;
  name: string;
  description: string;
  image: string;
};

const API_URL = "https://6af3f9fe55a1de7dcf03745a.mockapi.io/api/products/items";

const AUTHOR = { handle: "popol and kupa" };

function PostCard({
  item,
  onPress,
  onMenuPress,
}: {
  item: ProductProps;
  onPress: () => void;
  onMenuPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} className="bg-white rounded-2xl overflow-hidden">
      <View className="flex-row items-center px-3 py-3">
        <View className="w-8 h-8 rounded-full bg-[#9CB08A]" />
        <View className="flex-1 ml-2">
          <Text className="text-sm font-semibold">{AUTHOR.handle}</Text>
        </View>
        <Pressable onPress={onMenuPress} hitSlop={16} style={{ padding: 4 }}>
          <Ionicons name="menu" size={24} color="#111" />
        </Pressable>
      </View>

      {item.image ? (
        <Image
          source={{ uri: item.image }}
          style={{ width: "100%", aspectRatio: 16 / 9 }}
          resizeMode="cover"
        />
      ) : (
        <View
          style={{ width: "100%", aspectRatio: 16 / 9 }}
          className="bg-gray-200"
        />
      )}

      <View className="px-3 py-3">
        <Text className="text-sm font-bold">{item.name}</Text>
        <Text className="text-xs text-gray-500 mt-1">{item.description}</Text>
      </View>
    </Pressable>
  );
}

export default function Home() {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selected, setSelected] = useState<ProductProps | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const getProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get<ProductProps[]>(API_URL);
      setProducts([...data].sort((a, b) => Number(b.id) - Number(a.id)));
    } catch (err) {
      console.log(err);
      setError("Could not load posts. Pull down to retry.");
    } finally {
      setLoading(false);
    }
  };

  const closeMenu = () => {
    setSelected(null);
    setConfirmDelete(false);
  };

  const deletePost = async () => {
    if (!selected) return;
    const id = selected.id;
    try {
      await axios.delete(`${API_URL}/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.log(err);
      setError("Could not delete the post.");
    } finally {
      closeMenu();
    }
  };

  const editPost = () => {
    if (!selected) return;
    const id = selected.id;
    closeMenu();
    router.push({ pathname: "/posts/edit", params: { id } });
  };

  useFocusEffect(
    useCallback(() => {
      getProducts();
    }, [])
  );

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-gray-100">
      <View className="bg-white px-4 pt-2 pb-3">
        <View className="flex-row items-center justify-between">
          <Ionicons name="logo-facebook" size={36} color="#1877F2" />
          <Pressable
            onPress={() => router.push("/posts/create")}
            className="w-9 h-9 rounded-full bg-teal-600 items-center justify-center"
          >
            <Ionicons name="add" size={22} color="#fff" />
          </Pressable>
        </View>
        <Text className="text-xs mt-1">Save clips and share them online!!</Text>
      </View>

      {loading && products.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, gap: 16 }}
          refreshing={loading}
          onRefresh={getProducts}
          ListHeaderComponent={
            error ? <Text className="text-red-500">{error}</Text> : null
          }
          ListEmptyComponent={
            !loading && !error ? (
              <Text className="text-center text-gray-500">No posts yet.</Text>
            ) : null
          }
          renderItem={({ item }) => (
            <PostCard
              item={item}
              onPress={() =>
                router.push({ pathname: "/posts/[id]", params: { id: item.id } })
              }
              onMenuPress={() => setSelected(item)}
            />
          )}
        />
      )}

      {/* Edit / Delete menu */}
      <Modal
        visible={selected !== null}
        transparent
        animationType="fade"
        onRequestClose={closeMenu}
      >
        <Pressable
          onPress={closeMenu}
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" }}
        >
          <Pressable
            onPress={() => {}}
            style={{
              backgroundColor: "#fff",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 20,
              gap: 12,
            }}
          >
            {!confirmDelete ? (
              <>
                <Text style={{ fontSize: 16, fontWeight: "700" }} numberOfLines={1}>
                  {selected?.name}
                </Text>

                <Pressable
                  onPress={editPost}
                  style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12 }}
                >
                  <Ionicons name="create-outline" size={22} color="#111" />
                  <Text style={{ fontSize: 16 }}>Edit</Text>
                </Pressable>

                <Pressable
                  onPress={() => setConfirmDelete(true)}
                  style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12 }}
                >
                  <Ionicons name="trash-outline" size={22} color="#dc2626" />
                  <Text style={{ fontSize: 16, color: "#dc2626" }}>Delete</Text>
                </Pressable>

                <Pressable
                  onPress={closeMenu}
                  style={{ paddingVertical: 12, alignItems: "center", borderRadius: 12, backgroundColor: "#f3f4f6" }}
                >
                  <Text style={{ fontSize: 16 }}>Cancel</Text>
                </Pressable>
              </>
            ) : (
              <>
                <Text style={{ fontSize: 16, fontWeight: "700" }}>Delete post?</Text>
                <Text style={{ fontSize: 14, color: "#4b5563" }}>
                  This cannot be undone.
                </Text>

                <Pressable
                  onPress={deletePost}
                  style={{ paddingVertical: 12, alignItems: "center", borderRadius: 12, backgroundColor: "#dc2626" }}
                >
                  <Text style={{ fontSize: 16, color: "#fff", fontWeight: "600" }}>
                    Yes, delete
                  </Text>
                </Pressable>

                <Pressable
                  onPress={closeMenu}
                  style={{ paddingVertical: 12, alignItems: "center", borderRadius: 12, backgroundColor: "#f3f4f6" }}
                >
                  <Text style={{ fontSize: 16 }}>Cancel</Text>
                </Pressable>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}