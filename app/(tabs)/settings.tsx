import { ScrollView, Text, View, Pressable } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useJournal } from '@/lib/journal-context';

export default function SettingsScreen() {
  const { penColor, setPenColor } = useJournal();

  return (
    <ScreenContainer className="flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="p-4">
          <Text className="text-2xl font-bold text-foreground mb-6">Settings</Text>

          {/* Pen Color Section */}
          <View className="mb-8">
            <Text className="text-lg font-semibold text-foreground mb-4">Pen Color</Text>
            <Text className="text-muted mb-4">Choose the color of your pen for writing</Text>

            <View className="gap-3">
              {/* Black Pen */}
              <Pressable
                onPress={() => setPenColor('black')}
                style={({ pressed }) => [
                  {
                    paddingVertical: 14,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                    borderWidth: 2,
                    borderColor: penColor === 'black' ? '#1A1A1A' : '#D4A574',
                    backgroundColor: penColor === 'black' ? '#1A1A1A' : '#F9EFE0',
                    flexDirection: 'row',
                    alignItems: 'center',
                  },
                  pressed && { opacity: 0.8 }
                ]}
              >
                <View className="flex-1">
                  <Text style={{ color: penColor === 'black' ? '#F5E6D3' : '#1A1A1A' }} className="font-semibold text-lg">
                    ● Black Pen
                  </Text>
                  <Text style={{ color: penColor === 'black' ? '#D4A574' : '#8B7355' }} className="text-sm mt-1">
                    Classic black ink for writing
                  </Text>
                </View>
                {penColor === 'black' && (
                  <Text style={{ color: '#F5E6D3' }} className="text-lg">✓</Text>
                )}
              </Pressable>

              {/* Blue Pen */}
              <Pressable
                onPress={() => setPenColor('blue')}
                style={({ pressed }) => [
                  {
                    paddingVertical: 14,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                    borderWidth: 2,
                    borderColor: penColor === 'blue' ? '#2E5090' : '#D4A574',
                    backgroundColor: penColor === 'blue' ? '#2E5090' : '#F9EFE0',
                    flexDirection: 'row',
                    alignItems: 'center',
                  },
                  pressed && { opacity: 0.8 }
                ]}
              >
                <View className="flex-1">
                  <Text style={{ color: penColor === 'blue' ? '#F5E6D3' : '#1A1A1A' }} className="font-semibold text-lg">
                    ● Blue Pen
                  </Text>
                  <Text style={{ color: penColor === 'blue' ? '#D4A574' : '#8B7355' }} className="text-sm mt-1">
                    Elegant blue ink for journaling
                  </Text>
                </View>
                {penColor === 'blue' && (
                  <Text style={{ color: '#F5E6D3' }} className="text-lg">✓</Text>
                )}
              </Pressable>
            </View>
          </View>

          {/* About Section */}
          <View className="mt-8 pt-6 border-t border-border">
            <Text className="text-lg font-semibold text-foreground mb-4">About Journel X</Text>
            <Text className="text-muted leading-relaxed">
              Journel X is an offline journaling application designed to provide a warm, nostalgic writing experience. Write in multiple chapters and keep your thoughts organized in a beautiful, book-like interface.
            </Text>
            <Text className="text-muted text-sm mt-4">
              All your data is stored locally on your device and never leaves your phone.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
