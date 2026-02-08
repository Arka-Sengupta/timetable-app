import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Calendar } from "react-native-calendars";
import ClassNoteItem from "../components/ClassNoteItem";
import useNotes from "../hooks/useNotes";
import useTimetable from "../hooks/useTimetable";

interface ClassSession {
    day: string;
    start_time: string;
    end_time: string;
    course: string;
    room: string;
    type: string;
    sub_name?: string;
    prof_name?: string;
}

interface MarkedDate {
    marked?: boolean;
    dotColor?: string;
    selected?: boolean;
    selectedColor?: string;
    disableTouchEvent?: boolean;
}

export default function CalendarScreen() {
    const router = useRouter();
    const { timetable } = useTimetable();
    const { notes, saveNote, getNote } = useNotes();
    const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));

    // Cast timetable to our session type
    const timetableData = timetable as ClassSession[];

    // Compute marked dates based on notes
    const markedDates = Object.keys(notes).reduce<Record<string, MarkedDate>>((acc, date) => {
        acc[date] = { marked: true, dotColor: '#BB86FC' };
        return acc;
    }, {});

    // Highlight selected date
    markedDates[selectedDate] = {
        ...(markedDates[selectedDate] || {}),
        selected: true,
        selectedColor: '#BB86FC',
        disableTouchEvent: true
    };

    // Get classes for selected date
    const selectedClasses = (() => {
        const dayName = dayjs(selectedDate).format('dddd');
        const dayMap: Record<string, string> = {
            Monday: "MON",
            Tuesday: "TUE",
            Wednesday: "WED",
            Thursday: "THU",
            Friday: "FRI",
            Saturday: "SAT",
            Sunday: "SUN",
        };
        const csvDay = dayMap[dayName];

        return timetableData
            .filter(cls => cls.day === csvDay)
            .sort((a, b) => a.start_time.localeCompare(b.start_time));
    })();

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.title}>History</Text>
                <View style={{ width: 40 }} />
            </View>

            <Calendar
                theme={{
                    backgroundColor: '#050505',
                    calendarBackground: '#121212',
                    textSectionTitleColor: '#b6c1cd',
                    selectedDayBackgroundColor: '#BB86FC',
                    selectedDayTextColor: '#000',
                    todayTextColor: '#BB86FC',
                    dayTextColor: '#fff',
                    textDisabledColor: '#333',
                    dotColor: '#BB86FC',
                    selectedDotColor: '#000',
                    arrowColor: '#BB86FC',
                    monthTextColor: '#fff',
                    indicatorColor: '#BB86FC',
                }}
                onDayPress={(day: { dateString: string }) => {
                    setSelectedDate(day.dateString);
                }}
                markedDates={markedDates}
                style={styles.calendar}
            />

            <View style={styles.listContainer}>
                <Text style={styles.dateTitle}>
                    {dayjs(selectedDate).format('MMMM D, YYYY')}
                </Text>

                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {selectedClasses.length > 0 ? (
                        selectedClasses.map((cls, index) => {
                            const noteKey = `${cls.course}-${cls.start_time}`;
                            return (
                                <ClassNoteItem
                                    key={`${selectedDate}-${index}`}
                                    item={cls}
                                    initialNote={getNote(selectedDate, noteKey)}
                                    onSave={(text: string) => saveNote(selectedDate, noteKey, text)}
                                />
                            );
                        })
                    ) : (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>No classes on this day.</Text>
                        </View>
                    )}
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#050505',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: '#050505',
    },
    backButton: {
        padding: 8,
    },
    title: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    calendar: {
        borderRadius: 16,
        marginHorizontal: 16,
        marginBottom: 20,
        overflow: 'hidden',
    },
    listContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    dateTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 40,
    },
    emptyText: {
        color: '#666',
        fontSize: 16,
    }
});
