import { StyleSheet, Text, View } from "react-native";

interface ClassSession {
    day: string;
    start_time: string;
    end_time: string;
    course: string;
    room: string;
    type: string;
    sub_name?: string;
    prof_name?: string;
    slot_code?: string;
    slot?: string;
}

export default function ClassNoteItem({ item }: { item: ClassSession }) {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.courseInfo}>
                    <Text style={styles.course}>{item.course}</Text>
                    {item.sub_name && <Text style={styles.subName}>{item.sub_name}</Text>}
                    {item.prof_name && <Text style={styles.profName}>{item.prof_name}</Text>}
                    <Text style={styles.time}>{item.start_time} - {item.end_time} • {item.room}</Text>
                </View>
                <View style={styles.typeTag}>
                    <Text style={styles.typeText}>{item.type}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1E1E1E',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#333',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    courseInfo: {
        flex: 1,
    },
    course: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    subName: {
        color: '#ccc',
        fontSize: 14,
        fontWeight: '600',
        marginTop: 2,
    },
    profName: {
        color: '#aaa',
        fontSize: 12,
        fontStyle: 'italic',
        marginTop: 2,
    },
    time: {
        color: '#888',
        fontSize: 12,
        marginTop: 2,
    },
    typeTag: {
        backgroundColor: '#333',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    typeText: {
        color: '#aaa',
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
});
