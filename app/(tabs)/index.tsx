import { ScrollView, Text, View, TextInput, Pressable, Alert } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useJournal } from '@/lib/journal-context';
import { useState, useEffect } from 'react';

export default function HomeScreen() {
  const { chapters, currentChapterId, currentEntry, penColor, updateEntry, createChapter, setCurrentChapter, isLoading } = useJournal();
  const [content, setContent] = useState('');
  const [showNewChapterDialog, setShowNewChapterDialog] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState('');

  useEffect(() => {
    if (currentEntry) {
      setContent(currentEntry.content);
    } else {
      setContent('');
    }
  }, [currentEntry]);

  const handleSaveContent = async () => {
    if (currentChapterId) {
      await updateEntry(content);
    }
  };

  const handleCreateChapter = async () => {
    if (newChapterTitle.trim()) {
      await createChapter(newChapterTitle);
      setNewChapterTitle('');
      setShowNewChapterDialog(false);
    } else {
      Alert.alert('Error', 'Please enter a chapter title');
    }
  };

  const handleChapterSelect = async (chapterId: string) => {
    await setCurrentChapter(chapterId);
  };

  const currentChapter = chapters.find(c => c.id === currentChapterId);
  const textColor = penColor === 'blue' ? '#2E5090' : '#1A1A1A';

  if (isLoading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <Text className="text-foreground text-lg">Loading your journal...</Text>
      </ScreenContainer>
    );
  }

  if (chapters.length === 0) {
    return (
      <ScreenContainer className="items-center justify-center p-6">
        <Text className="text-3xl font-bold text-foreground mb-4">Welcome to Journel X</Text>
        <Text className="text-center text-muted mb-8 text-lg">
          Create your first chapter to begin your journey
        </Text>
        <Pressable
          onPress={() => setShowNewChapterDialog(true)}
          style={({ pressed }) => [
            { backgroundColor: '#8B7355', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
            pressed && { opacity: 0.8 }
          ]}
        >
          <Text className="text-background font-semibold text-lg">Create First Chapter</Text>
        </Pressable>

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

  return (
    <ScreenContainer className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        {/* Book Header */}
        <View className="px-4 pt-4 pb-2">
          <Text className="text-2xl font-bold text-foreground">Journel X</Text>
          {currentChapter && (
            <Text className="text-lg text-muted font-semibold mt-2">{currentChapter.title}</Text>
          )}
        </View>

        {/* Book Page */}
        <View className="mx-4 mb-4 bg-surface rounded-lg p-6 shadow-md border border-border" style={{ minHeight: 400 }}>
          <TextInput
            placeholder="Start writing..."
            value={content}
            onChangeText={setContent}
            onBlur={handleSaveContent}
            multiline
            className="text-lg leading-relaxed flex-1"
            style={{
              color: textColor,
              fontFamily: 'Caveat',
              fontSize: 18,
              lineHeight: 28,
            }}
            placeholderTextColor="#A89968"
          />
        </View>

        {/* Pen Color Selector */}
        <View className="px-4 mb-4">
          <Text className="text-sm text-muted mb-2 font-semibold">Pen Color</Text>
          <View className="flex-row gap-3">
            <Pressable
              onPress={() => setShowNewChapterDialog(false)}
              style={({ pressed }) => [
                { flex: 1, paddingVertical: 10, borderRadius: 6, alignItems: 'center', borderWidth: 2, borderColor: penColor === 'black' ? '#1A1A1A' : '#D4A574', backgroundColor: penColor === 'black' ? '#1A1A1A' : '#F9EFE0' },
                pressed && { opacity: 0.8 }
              ]}
            >
              <Text style={{ color: penColor === 'black' ? '#F5E6D3' : '#1A1A1A' }} className="font-semibold">
                Black
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setShowNewChapterDialog(false)}
              style={({ pressed }) => [
                { flex: 1, paddingVertical: 10, borderRadius: 6, alignItems: 'center', borderWidth: 2, borderColor: penColor === 'blue' ? '#2E5090' : '#D4A574', backgroundColor: penColor === 'blue' ? '#2E5090' : '#F9EFE0' },
                pressed && { opacity: 0.8 }
              ]}
            >
              <Text style={{ color: penColor === 'blue' ? '#F5E6D3' : '#1A1A1A' }} className="font-semibold">
                Blue
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Chapter List */}
        <View className="px-4 pb-4">
          <Text className="text-sm text-muted mb-2 font-semibold">Chapters ({chapters.length})</Text>
          {chapters.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => handleChapterSelect(item.id)}
              style={({ pressed }) => [
                { paddingVertical: 10, paddingHorizontal: 12, marginBottom: 8, borderRadius: 6, backgroundColor: currentChapterId === item.id ? '#D4A574' : '#F9EFE0', borderLeftWidth: 4, borderLeftColor: currentChapterId === item.id ? '#8B7355' : '#D4A574' },
                pressed && { opacity: 0.8 }
              ]}
            >
              <Text className="font-semibold text-foreground">{item.title}</Text>
              <Text className="text-xs text-muted">
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
