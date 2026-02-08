import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import ClassNoteItem from "../../components/ClassNoteItem";
import useTimetable from "../../hooks/useTimetable";
import { getCurrentClass } from "../../utils/getCurrentClass";

const { width } = Dimensions.get("window");

interface ClassSession {
  day: string;
  start_time: string;
  end_time: string;
  course: string;
  room: string;
  type: string;
  slot_code?: string;
  sub_name?: string;
  prof_name?: string;
}

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export default function TabHome() {
  const { timetable, loading } = useTimetable();
  const [selectedDay, setSelectedDay] = useState(() => {
    const today = dayjs().format("ddd").toUpperCase();
    return DAYS.includes(today) ? today : "MON";
  });
  const router = useRouter();

  const timetableData = timetable as ClassSession[];

  const currentClass = useMemo(
    () => getCurrentClass(timetableData),
    [timetableData]
  );

  const selectedDayClasses = useMemo(() => {
    if (loading || !timetableData.length) return [];

    return timetableData
      .filter((cls) => cls.day === selectedDay)
      .sort((a, b) => a.start_time.localeCompare(b.start_time));
  }, [timetableData, loading, selectedDay]);

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Loading timetable...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Week Overview</Text>
      </View>

      <View style={styles.daySelector}>
        {DAYS.map((day) => (
          <TouchableOpacity
            key={day}
            style={[
              styles.dayButton,
              selectedDay === day && styles.dayButtonActive,
            ]}
            onPress={() => setSelectedDay(day)}
          >
            <Text
              style={[
                styles.dayButtonText,
                selectedDay === day && styles.dayButtonTextActive,
              ]}
            >
              {day}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Current Class Section - Only show if selected day is TODAY */}
        {selectedDay === dayjs().format("ddd").toUpperCase() && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Happening Now</Text>
            {currentClass ? (
              <View style={[styles.card, styles.activeCard]}>
                <View style={styles.cardHeader}>
                  <Ionicons name="school" size={24} color="#000" />
                  <Text style={styles.cardBadge}>IN PROGRESS</Text>
                </View>

                <Text style={styles.courseCode}>{currentClass.course}</Text>
                {currentClass.sub_name && <Text style={styles.subNameLarge}>{currentClass.sub_name}</Text>}
                {currentClass.prof_name && <Text style={styles.profNameLarge}>{currentClass.prof_name}</Text>}
                <Text style={styles.courseType}>{currentClass.type}</Text>

                <View style={styles.divider} />

                <View style={styles.row}>
                  <View style={styles.infoItem}>
                    <Ionicons name="time-outline" size={20} color="#333" />
                    <Text style={styles.infoText}>
                      {currentClass.start_time} - {currentClass.end_time}
                    </Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Ionicons name="location-outline" size={20} color="#333" />
                    <Text style={styles.infoText}>{currentClass.room}</Text>
                  </View>
                </View>

                <View style={styles.footer}>
                  <Text style={styles.slotText}>
                    Slot: {currentClass.slot_code || currentClass.slot}
                  </Text>
                </View>
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="cafe-outline" size={48} color="#666" />
                <Text style={styles.freeTitleSmall}>No Class Right Now</Text>
              </View>
            )}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{selectedDay}'s Schedule</Text>
          {selectedDayClasses.length > 0 ? (
            selectedDayClasses.map((cls, index) => {
              const noteKey = `${cls.course}-${cls.start_time}-${selectedDay}`;
              const todayDate = dayjs().format('YYYY-MM-DD');
              // Note: Saving notes here might need a better key strategy if we want notes to persist per DATE not just per WEEKDAY. 
              // But for now, sticking to the requested UI change. 
              // If user wants specific date notes, they should use Calendar. 
              // If they want generic notes for "Every Monday's Math Class", we'd use a generic key.
              // Assuming they want to see notes for 'current instance' or just generic notes.
              // For Week Overview, let's treat it as "Generic Notes for this slot" or just hide notes logic if it complicates things too much, 
              // but the user asked to "remove notes section", implying maybe they just want the list.
              // However, reusing ClassNoteItem is good. Let's use a generic date or just today's date if selected day is today.

              // Simplification: We will just list the classes. If we want notes, we can keep ClassNoteItem but maybe with a read-only or generic key.
              // Let's use ClassNoteItem but use a key that represents "This semester's note for this slot" OR just today's date if it matches.
              // Given the previous requirement of "Notes & Calendar", notes seem date-specific. 
              // Validating: "remove the calender and notes section... show resultant classes".
              // I will use ClassNoteItem because it's already built for displaying class info nicely, 
              // and if I pass a dummy onSave it works as a display.

              return (
                <ClassNoteItem
                  key={index}
                  item={cls}
                />
              );
            })
          ) : (
            <View style={styles.emptyList}>
              <Text style={styles.emptyListText}>No classes scheduled for {selectedDay}.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050505",
  },
  headerContainer: {
    paddingHorizontal: 20,
    marginTop: 60,
    marginBottom: 10,
  },
  header: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.5,
  },
  daySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 20,
    backgroundColor: '#121212',
    paddingVertical: 12,
  },
  dayButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#222',
  },
  dayButtonActive: {
    backgroundColor: '#BB86FC',
  },
  dayButtonText: {
    color: '#888',
    fontWeight: '700',
    fontSize: 12,
  },
  dayButtonTextActive: {
    color: '#000',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
    marginLeft: 4,
  },
  card: {
    borderRadius: 24,
    padding: 24,
    width: "100%",
  },
  activeCard: {
    backgroundColor: "#BB86FC",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  cardBadge: {
    fontSize: 10,
    fontWeight: "900",
    color: "#fff",
    backgroundColor: "#000",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: "hidden",
  },
  courseCode: {
    fontSize: 32,
    fontWeight: "900",
    color: "#000",
    marginBottom: 2,
  },
  subNameLarge: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
    marginBottom: 2,
  },
  profNameLarge: {
    fontSize: 14,
    fontStyle: 'italic',
    color: "#444",
    marginBottom: 8,
  },
  courseType: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.1)",
    marginBottom: 16,
  },
  row: {
    flexDirection: "column",
    gap: 10,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoText: {
    fontSize: 16,
    color: "#111",
    fontWeight: "600",
  },
  footer: {
    marginTop: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  slotText: {
    color: "#000",
    fontWeight: "700",
    fontSize: 12,
  },
  emptyState: {
    padding: 24,
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  freeTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 16,
    marginBottom: 8,
  },
  freeTitleSmall: {
    fontSize: 16,
    fontWeight: "600",
    color: "#888",
    marginTop: 12,
  },
  freeSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  emptyList: {
    padding: 30,
    alignItems: 'center',
  },
  emptyListText: {
    color: '#666',
    fontSize: 16,
  },
  loadingText: {
    color: "#888",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#050505",
  },
});
