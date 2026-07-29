import { ScrollView, Text, View, Pressable, FlatList, Alert, TextInput } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useJournal } from '@/lib/journal-context';
import { useState } from 'react';

export default function ChaptersScreen() {
  const { chapters, currentChapterId, createChapter, deleteChapter, setCurrentChapter } = useJournal();
  const [showNewChapterDialog, setShowNewChapterDialog] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState('');

  const handleCreateChapter = async () => {
    if (newChapterTitle.trim()) {
      await createChapter(newChapterTitle);
      setNewChapterTitle('');
      setShowNewChapterDialog(false);
    } else {
      Alert.alert('Error', 'Please enter a chapter title');
    }
  };

  const handleDeleteChapter = (id: string) => {
    Alert.alert(
      'Delete Chapter',
      'Are you sure you want to delete this chapter? This action cannot be undone.',
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'Delete',
          onPress: () => deleteChapter(id),
          style: 'destructive',
        },
      ]
    );
  };

  const handleChapterSelect = async (id: string) => {
    await setCurrentChapter(id);
  };

  return (
    <ScreenContainer className="flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="p-4">
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-2xl font-bold text-foreground">My Chapters</Text>
            <Pressable
              onPress={() => setShowNewChapterDialog(true)}
              style={({ pressed }) => [
                { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#8B7355', borderRadius: 6 },
                pressed && { opacity: 0.8 }
              ]}
            >
              <Text className="text-background font-semibold">+ New</Text>
            </Pressable>
          </View>

          {chapters.length === 0 ? (
            <View className="items-center justify-center py-12">
              <Text className="text-muted text-lg mb-4">No chapters yet</Text>
              <Pressable
                onPress={() => setShowNewChapterDialog(true)}
                style={({ pressed }) => [
                  { paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#D4A574', borderRadius: 6 },
                  pressed && { opacity: 0.8 }
                ]}
              >
                <Text className="text-foreground font-semibold">Create Your First Chapter</Text>
              </Pressable>
            </View>
          ) : (
            <FlatList
              data={chapters}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => handleChapterSelect(item.id)}
                  style={({ pressed }) => [
                    { paddingVertical: 12, paddingHorizontal: 14, marginBottom: 10, borderRadius: 8, backgroundColor: currentChapterId === item.id ? '#D4A574' : '#F9EFE0', borderLeftWidth: 4, borderLeftColor: currentChapterId === item.id ? '#8B7355' : '#D4A574' },
                    pressed && { opacity: 0.8 }
                  ]}
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="font-semibold text-foreground text-lg">{item.title}</Text>
                      <Text className="text-xs text-muted mt-1">
                        Created {new Date(item.createdAt).toLocaleDateString()}
                      </Text>
                    </View>
                    <Pressable
                      onPress={() => handleDeleteChapter(item.id)}
                      style={({ pressed }) => [
                        { paddingHorizontal: 10, paddingVertical: 6, backgroundColor: '#EF4444', borderRadius: 4 },
                        pressed && { opacity: 0.8 }
                      ]}
                    >
                      <Text className="text-background font-semibold text-sm">Delete</Text>
                    </Pressable>
                  </View>
                </Pressable>
              )}
            />
          )}
        </View>
      </ScrollView>

      {showNewChapterDialog && (
        <View className="absolute inset-0 bg-black/50 items-center justify-center">
          <View className="bg-background rounded-lg p-6 w-4/5">
            <Text className="text-xl font-bold text-foreground mb-4">New Chapter</Text>
            <TextInput
              placeholder="Chapter title"
              value={newChapterTitle}
              onChangeText={setNewChapterTitle}
              className="border border-border rounded-lg p-3 mb-4 text-foreground"
              placeholderTextColor="#8B7355"
            />
            <View className="flex-row gap-3">
              <Pressable
                onPress={() => setShowNewChapterDialog(false)}
                style={({ pressed }) => [
                  { flex: 1, backgroundColor: '#D4A574', paddingVertical: 10, borderRadius: 6, alignItems: 'center' },
                  pressed && { opacity: 0.8 }
                ]}
              >
                <Text className="text-foreground font-semibold">Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handleCreateChapter}
                style={({ pressed }) => [
                  { flex: 1, backgroundColor: '#2E5090', paddingVertical: 10, borderRadius: 6, alignItems: 'center' },
                  pressed && { opacity: 0.8 }
                ]}
              >
                <Text className="text-background font-semibold">Create</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </ScreenContainer>
  );
}
