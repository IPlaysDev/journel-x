import { ScrollView, Text, View, Pressable, Linking } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';

export default function CreditsScreen() {
  const handleOpenLink = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Error opening link:', error);
    }
  };

  const socialLinks = [
    {
      name: 'GitHub',
      url: 'https://github.com/IPlaysDev',
      icon: '🐙',
    },
    {
      name: 'YouTube',
      url: 'https://www.youtube.com/@IPlaysDev',
      icon: '▶️',
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/iplaysdev',
      icon: '📷',
    },
  ];

  return (
    <ScreenContainer className="flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="p-4">
          {/* Header */}
          <View className="items-center mb-8">
            <Text className="text-3xl font-bold text-foreground mb-2">Journel X</Text>
            <Text className="text-muted text-center">Your personal offline journaling companion</Text>
          </View>

          {/* Developer Section */}
          <View className="bg-surface rounded-lg p-6 mb-8 border border-border">
            <Text className="text-lg font-semibold text-foreground mb-2">Developed by</Text>
            <Text className="text-2xl font-bold text-primary mb-4">IPlaysDev</Text>
            <Text className="text-muted leading-relaxed">
              Journel X was created with passion to provide a beautiful, distraction-free journaling experience. Write your thoughts, organize your ideas, and keep your memories safe offline.
            </Text>
          </View>

          {/* Social Links */}
          <View className="mb-8">
            <Text className="text-lg font-semibold text-foreground mb-4">Connect with IPlaysDev</Text>
            <View className="gap-3">
              {socialLinks.map((link) => (
                <Pressable
                  key={link.name}
                  onPress={() => handleOpenLink(link.url)}
                  style={({ pressed }) => [
                    {
                      paddingVertical: 12,
                      paddingHorizontal: 14,
                      borderRadius: 8,
                      backgroundColor: '#F9EFE0',
                      borderWidth: 1,
                      borderColor: '#D4A574',
                      flexDirection: 'row',
                      alignItems: 'center',
                    },
                    pressed && { opacity: 0.8 }
                  ]}
                >
                  <Text className="text-2xl mr-4">{link.icon}</Text>
                  <View className="flex-1">
                    <Text className="font-semibold text-foreground">{link.name}</Text>
                    <Text className="text-xs text-muted">{link.url}</Text>
                  </View>
                  <Text className="text-muted">→</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Features Section */}
          <View className="mb-8">
            <Text className="text-lg font-semibold text-foreground mb-4">Features</Text>
            <View className="gap-3">
              <View className="flex-row items-start">
                <Text className="text-xl mr-3">📝</Text>
                <View className="flex-1">
                  <Text className="font-semibold text-foreground">Handwriting Style</Text>
                  <Text className="text-sm text-muted">Beautiful handwriting-like text input</Text>
                </View>
              </View>
              <View className="flex-row items-start">
                <Text className="text-xl mr-3">📖</Text>
                <View className="flex-1">
                  <Text className="font-semibold text-foreground">Multiple Chapters</Text>
                  <Text className="text-sm text-muted">Organize your thoughts into separate chapters</Text>
                </View>
              </View>
              <View className="flex-row items-start">
                <Text className="text-xl mr-3">🖊️</Text>
                <View className="flex-1">
                  <Text className="font-semibold text-foreground">Pen Colors</Text>
                  <Text className="text-sm text-muted">Choose between black and blue ink</Text>
                </View>
              </View>
              <View className="flex-row items-start">
                <Text className="text-xl mr-3">🔒</Text>
                <View className="flex-1">
                  <Text className="font-semibold text-foreground">Offline First</Text>
                  <Text className="text-sm text-muted">All data stored locally on your device</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Footer */}
          <View className="pt-6 border-t border-border items-center">
            <Text className="text-sm text-muted mb-2">Journel X v1.0.0</Text>
            <Text className="text-xs text-muted text-center">
              Made with ❤️ for journaling enthusiasts
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
