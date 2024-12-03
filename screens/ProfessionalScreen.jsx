import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { useQuery, useMutation, gql } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

export const GET_ALL_PROFESSIONALS = gql`
  query GetAllProfessionals {
    getAllProfessionals {
      _id
      name
      specialization
      yearsOfExperience
      isAvailable
      imageUrl
      education
      description
      rating
      totalPatients
      price
      estimatedWaitTime
    }
  }
`;

export const CREATE_CHAT = gql`
  mutation CreateChat($professionalId: ID!) {
    createChat(professionalId: $professionalId) {
      _id
      participants {
        _id
        name
        role
      }
    }
  }
`;

const ProfessionalCard = ({ professional, onChatPress, onVideoPress }) => (
    <View style={styles.card}>
        <Image
            source={{ uri: professional.imageUrl }}
            style={styles.profileImage}
        />
        <View style={styles.cardContent}>
            <Text style={styles.name}>{professional.name}</Text>
            <Text style={styles.specialization}>{professional.specialization}</Text>
            <View style={styles.infoRow}>
                <Text style={styles.experience}>{professional.yearsOfExperience} years exp.</Text>
                <Text style={styles.rating}>⭐ {professional.rating}</Text>
            </View>
            <Text style={styles.price}>${professional.price}/session</Text>

            <View style={styles.cardFooter}>
                <Text style={[
                    styles.availability,
                    { color: professional.isAvailable ? '#4CAF50' : '#F44336' }
                ]}>
                    {professional.isAvailable ? 'Available' : 'Unavailable'}
                </Text>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[
                            styles.actionButton,
                            styles.videoButton,
                            { opacity: professional.isAvailable ? 1 : 0.5 }
                        ]}
                        onPress={() => onVideoPress(professional)}
                        disabled={!professional.isAvailable}
                    >
                        <Feather name="video" size={20} color="#FFF" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.actionButton,
                            styles.chatButton,
                            { opacity: professional.isAvailable ? 1 : 0.5 }
                        ]}
                        onPress={() => onChatPress(professional)}
                        disabled={!professional.isAvailable}
                    >
                        <Feather name="message-circle" size={20} color="#FFF" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </View>
);

const ProfessionalScreen = () => {
    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = useState('');
    const { loading, error, data } = useQuery(GET_ALL_PROFESSIONALS);
    const [createChat] = useMutation(CREATE_CHAT);

    const handleChatPress = async (professional) => {
        try {
            const { data } = await createChat({
                variables: { professionalId: professional._id }
            });
            
            if (data?.createChat?._id) {
                navigation.navigate('Chat', {
                    chatId: data.createChat._id,
                    professionalName: professional.name
                });
            } else {
                throw new Error('Failed to create chat');
            }
        } catch (error) {
            console.error('Error creating chat:', error);
            Alert.alert(
                'Error',
                'Unable to start chat. Please try again.',
                [{ text: 'OK' }]
            );
        }
    };

    const handleVideoPress = async (professional) => {
        try {
            const { data } = await createChat({
                variables: { professionalId: professional._id }
            });
            
            if (data?.createChat?._id) {
                navigation.navigate('VideoCall', {
                    chatId: data.createChat._id,
                    participantId: professional._id
                });
            } else {
                throw new Error('Failed to create chat');
            }
        } catch (error) {
            console.error('Error starting video call:', error);
            Alert.alert(
                'Error',
                'Unable to start video call. Please try again.',
                [{ text: 'OK' }]
            );
        }
    };

    const filteredProfessionals = data?.getAllProfessionals.filter(prof =>
        prof.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prof.specialization.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <Feather name="search" size={20} color="#666" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search by name or specialization..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#FF9A8A" />
            ) : error ? (
                <Text style={styles.errorText}>Error loading professionals</Text>
            ) : (
                <FlatList
                    data={filteredProfessionals}
                    renderItem={({ item }) => (
                        <ProfessionalCard
                            professional={item}
                            onChatPress={handleChatPress}
                            onVideoPress={handleVideoPress}
                        />
                    )}
                    keyExtractor={item => item._id}
                    contentContainerStyle={styles.listContainer}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF5F3',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        margin: 16,
        paddingHorizontal: 12,
        borderRadius: 8,
        elevation: 2,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 16,
    },
    listContainer: {
        padding: 16,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        elevation: 3,
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginRight: 16,
    },
    cardContent: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    specialization: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    experience: {
        fontSize: 12,
        color: '#666',
    },
    rating: {
        fontSize: 12,
        color: '#FFA000',
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FF9A8A',
        marginTop: 8,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
    },
    availability: {
        fontSize: 14,
        fontWeight: '500',
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    videoButton: {
        backgroundColor: '#4CAF50',
    },
    chatButton: {
        backgroundColor: '#FF9A8A',
    },
    errorText: {
        textAlign: 'center',
        color: '#F44336',
        margin: 16,
    },
});

export default ProfessionalScreen; 