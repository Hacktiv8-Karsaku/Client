import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProfilePage = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Feather name="arrow-left" size={24} color="#FF9A8A" />
          <Text style={styles.title}>Your Profile</Text>
          <Feather name="menu" size={24} color="#FF9A8A" />
        </View>
        <View style={styles.profileContainer}>
          <Image
            source={{ uri: 'https://i.pinimg.com/736x/87/06/ee/8706ee1d850898c03d1e0a845df81040.jpg' }}
            style={styles.profileImage}
          />
          <Text style={styles.name}>Sukijan Wamena</Text>
        </View>

        <View style={styles.pointsContainer}>
          <View style={styles.pointsItem}>
            <Feather name="star" size={24} color="#FF9A8A" />
            <Text style={styles.pointsText}>85</Text>
          </View>
          <View style={styles.pointsItem}>
            <Feather name="code" size={24} color="#FF9A8A" />
            <Text style={styles.pointsText}>HTML/CSS</Text>
          </View>
          <View style={styles.pointsItem}>
            <Feather name="monitor" size={24} color="#FF9A8A" />
            <Text style={styles.pointsText}>Graphic design</Text>
          </View>
        </View>

        <View style={styles.placeToGoContainer}>
          <Text style={styles.placeToGoTitle}>Place To Go</Text>
          <View style={styles.placeToGoGrid}>
            <TouchableOpacity style={styles.placeToGoGrid}>
              <Image
                source={{ uri: 'https://cdn.idntimes.com/content-images/community/2022/09/tempat-wisata-dunia-yang-bikin-pengunjung-bahagia-tempat-wisata-dunia-paling-bahagia-bali-destinasi-wisata-paling-bahagia-bali-indoensia-wisata-9cde86371d7fc78c91ae80a6ffab250e-404157d92ecd7d9e35661cbe798808dc.jpg' }}
                style={styles.placeToGo}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.placeToGoGrid}>
              <Image
                source={{ uri: 'https://cdn1.sisiplus.co.id/media/sisiplus/asset/uploads/artikel/g2OEbKl2aTEIp1x5hFNYEE9ad615uVenBexDAcVW.jpg' }}
                style={styles.placeToGo}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.placeToGoGrid}>
              <Image
                source={{ uri: 'https://img.inews.co.id/media/600/files/networks/2024/05/13/d4b74_rans-nusantara-hebat.jpeg' }}
                style={styles.placeToGo}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.placeToGoGrid}>
              <Image
                source={{ uri: 'https://media.disneylandparis.com/d4th/en-int/images/HD13302_2_2050jan01_world_disneyland-park-dlp-website-visual_5-2_tcm787-248638.jpg?w=1920' }}
                style={styles.placeToGo}
              />
            </TouchableOpacity>

          </View>
          <Text style={styles.viewAll}>View all</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F3',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 12,
  },
  level: {
    fontSize: 16,
    color: '#888',
    marginTop: 4,
  },
  pointsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 24,
    backgroundColor: '#FFF5F3',
  },
  pointsItem: {
    alignItems: 'center',
  },
  pointsText: {
    fontSize: 16,
    marginTop: 4,
    color: '#FF9A8A',
  },
  placeToGoContainer: {
    marginHorizontal: 16,
  },
  placeToGoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  placeToGoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  placeToGo: {
    width: 75,
    height: 75,
    borderRadius: 25,
  },
  viewAll: {
    fontSize: 14,
    color: '#FF9A8A',
    textAlign: 'right',
    marginTop: 8,
  },
});

export default ProfilePage;