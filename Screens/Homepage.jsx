import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomePage = () => {

    return (
        <SafeAreaView style={{ flex: 1 }} >
            {/* greetings and profile pic */}
            <View style={{ flex: 1 }}>
                <ScrollView style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.greeting}>Hello, username 👋</Text>
                        <TouchableOpacity style={styles.circle}>
                        <View style={styles.circle} />
                        </TouchableOpacity>
                    </View>

                    {/* what's new section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>What's New?</Text>
                        <View style={styles.cardLarge}>
                            <Text style={styles.cardText}>Graph Carousel</Text>
                        </View>
                    </View>

                    <View style={styles.navBar}>
                        <TouchableOpacity style={styles.navButton}>
                            <Text style={styles.navText}>To Do List</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.navButton}>
                            <Text style={styles.navText}>Mood Tracker</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.navButton}>
                            <Text style={styles.navText}>Calories Tracker</Text>
                        </TouchableOpacity>
                    </View>

                    {/* preview to do list */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Preview To Do List</Text>
                        <TouchableOpacity style={styles.card}>
                            <Text style={styles.cardText}>To do list 1</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.card}>
                            <Text style={styles.cardText}>To do list 2</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.card}>
                            <Text style={styles.cardText}>To do list 3</Text>
                        </TouchableOpacity>
                        <Text style={styles.seeAll}>See All</Text>
                    </View>

                    {/* preview healing act */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Healing Activity / Destination</Text>
                        <TouchableOpacity style={styles.card}>
                            <View style={styles.cardLarge}>
                                <Text style={styles.cardText}>Graph Carousel</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.card}>
                            <Text style={styles.cardText}>Note Activity</Text>
                        </TouchableOpacity>
                        <Text style={styles.seeAll}>See All</Text>
                    </View>

                    {/* food recomendation */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Food Recomendations</Text>
                        <View style={styles.cardLarge}>
                            <Text style={styles.cardText}>Graph or Data</Text>
                        </View>
                        <Text style={styles.seeAll}>See All</Text>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    greeting: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333333',
    },
    circle: {
        width: 40,
        height: 40,
        backgroundColor: '#FF9A8A',
        borderRadius: 20,
    },
    navBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 16,
    },
    navButton: {
        padding: 8,
        backgroundColor: '#FF9A8A',
        borderRadius: 8,
    },
    navText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 8,
    },
    card: {
        padding: 16,
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        marginBottom: 8,
    },
    cardLarge: {
        height: 150,
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardText: {
        color: '#333333',
    },
    seeAll: {
        textAlign: 'right',
        color: '#FF9A8A',
        marginTop: 8,
    },
});

export default HomePage;
