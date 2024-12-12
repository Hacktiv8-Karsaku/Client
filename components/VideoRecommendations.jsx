import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Linking } from 'react-native';

const VideoRecommendations = ({ videos }) => {
  const handleVideoPress = (url) => {
    Linking.openURL(url);
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {videos?.map((video, index) => (
        <TouchableOpacity 
          key={index} 
          style={styles.videoCard}
          onPress={() => handleVideoPress(video.url)}
        >
          <Image 
            source={{ uri: video.thumbnail }} 
            style={styles.thumbnail}
          />
          <View style={styles.textContainer}>
            <Text style={styles.title} numberOfLines={2}>
              {video.title}
            </Text>
            <Text style={styles.description} numberOfLines={2}>
              {video.description}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  videoCard: {
    width: 280,
    marginRight: 15,
    marginBottom: 40,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  thumbnail: {
    width: '100%',
    height: 157,
  },
  textContainer: {
    padding: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    fontSize: 12,
    color: '#666',
  },
});

export default VideoRecommendations; 