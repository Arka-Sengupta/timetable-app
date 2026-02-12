import { Ionicons } from '@expo/vector-icons';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system/legacy';
import * as IntentLauncher from 'expo-intent-launcher';
import { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Subject {
    name: string;
    pdfFileName: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
}

const PDF_ASSETS: Record<string, any> = {
    'DBMS.pdf': require('../assets/syllb/DBMS.pdf'),
    'SE.pdf': require('../assets/syllb/SE.pdf'),
    'maths.pdf': require('../assets/syllb/maths.pdf'),
    'ECE.pdf': require('../assets/syllb/ECE.pdf'),
    'DIP.pdf': require('../assets/syllb/DIP.pdf'),
};

const SUBJECTS: Subject[] = [
    {
        name: 'DBMS',
        pdfFileName: 'DBMS.pdf',
        icon: 'server-outline',
        color: '#FF6B6B',
    },
    {
        name: 'SWE',
        pdfFileName: 'SE.pdf',
        icon: 'code-slash-outline',
        color: '#4ECDC4',
    },
    {
        name: 'Statistics',
        pdfFileName: 'maths.pdf',
        icon: 'calculator-outline',
        color: '#FFE66D',
    },
    {
        name: 'COA',
        pdfFileName: 'ECE.pdf',
        icon: 'hardware-chip-outline',
        color: '#A8E6CF',
    },
    {
        name: 'DIP',
        pdfFileName: 'DIP.pdf',
        icon: 'image-outline',
        color: '#C7CEEA',
    },
];

export default function SubjectsScreen() {
    const [loadingSubject, setLoadingSubject] = useState<string | null>(null);

    const openSyllabus = async (subject: Subject) => {
        try {
            setLoadingSubject(subject.name);

            // Load the asset using the pre-mapped require
            const assetModule = PDF_ASSETS[subject.pdfFileName];
            if (!assetModule) {
                throw new Error('PDF asset not found');
            }

            const asset = Asset.fromModule(assetModule);
            await asset.downloadAsync();

            if (!asset.localUri) {
                throw new Error('Failed to load PDF');
            }

            // Copy the PDF to cache directory so we can get a proper content URI
            const cacheDir = FileSystem.cacheDirectory;
            const cachedFilePath = `${cacheDir}${subject.pdfFileName}`;

            // Copy the file to cache
            await FileSystem.copyAsync({
                from: asset.localUri,
                to: cachedFilePath,
            });

            // Get a content URI from the cached file path
            const contentUri = await FileSystem.getContentUriAsync(cachedFilePath);

            // Open the PDF with explicit MIME type so the viewer knows it's a PDF
            await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
                data: contentUri,
                flags: 1, // FLAG_GRANT_READ_URI_PERMISSION
                type: 'application/pdf',
            });

        } catch (error) {
            console.error('Error opening PDF:', error);
            Alert.alert('Error', 'Failed to open syllabus. Please try again.');
        } finally {
            setLoadingSubject(null);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>Subject List</Text>
                <Text style={styles.subheader}>View course syllabi</Text>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {SUBJECTS.map((subject, index) => (
                    <View key={index} style={styles.subjectCard}>
                        <View style={[styles.iconContainer, { backgroundColor: `${subject.color}20` }]}>
                            <Ionicons name={subject.icon} size={32} color={subject.color} />
                        </View>

                        <View style={styles.subjectInfo}>
                            <Text style={styles.subjectName}>{subject.name}</Text>
                            <Text style={styles.pdfFileName}>{subject.pdfFileName}</Text>
                        </View>

                        <TouchableOpacity
                            style={[styles.viewButton, { backgroundColor: subject.color }]}
                            onPress={() => openSyllabus(subject)}
                            disabled={loadingSubject === subject.name}
                        >
                            {loadingSubject === subject.name ? (
                                <ActivityIndicator color="#000" size="small" />
                            ) : (
                                <>
                                    <Ionicons name="document-text-outline" size={20} color="#000" />
                                    <Text style={styles.viewButtonText}>View Syllabus</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#050505',
    },
    headerContainer: {
        paddingHorizontal: 20,
        marginTop: 60,
        marginBottom: 20,
    },
    header: {
        fontSize: 28,
        fontWeight: '800',
        color: '#fff',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    subheader: {
        fontSize: 14,
        color: '#888',
        fontWeight: '500',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    subjectCard: {
        backgroundColor: '#1A1A1A',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    subjectInfo: {
        flex: 1,
    },
    subjectName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 4,
    },
    pdfFileName: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
    },
    viewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 10,
        gap: 6,
        minWidth: 140,
        justifyContent: 'center',
    },
    viewButtonText: {
        color: '#000',
        fontSize: 14,
        fontWeight: '700',
    },
});
