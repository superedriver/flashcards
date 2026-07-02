import { Redirect } from 'expo-router'
import { Text, View } from 'react-native'

export default function IndexScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Flashcards</Text>
      <Redirect href="/(tabs)" />
    </View>
  )
}
