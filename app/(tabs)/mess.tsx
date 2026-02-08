import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import useMessMenu from '../../hooks/useMessMenu';

interface MessMenu {
    Day: string;
    Month: string;
    Date: string;
    Breakfast: string;
    Lunch: string;
    Snacks: string;
    Dinner: string;
}

export default function MessScreen() {
    const { menu, loading } = useMessMenu();

    const [today, setToday] = useState(dayjs());

    // Update 'today' at midnight while app is open
    useEffect(() => {
        const timer = setInterval(() => {
            const now = dayjs();
            if (!now.isSame(today, 'day')) {
                setToday(now);
                setSelectedDate(now); // Reset selection to new Today
            }
        }, 60000); // Check every minute
        return () => clearInterval(timer);
    }, [today]);

    // Rolling 7 days starting from today
    const next7Days = useMemo(() => {
        const days = [];
        for (let i = 0; i < 7; i++) {
            days.push(today.clone().add(i, 'day'));
        }
        return days;
    }, [today]);

    const [selectedDate, setSelectedDate] = useState(today);

    const selectedMenu = useMemo(() => {
        if (loading || !menu.length) return null;

        // Match exactly by Date and Month matching the selectedDate
        const match = (menu as any[]).find((item: any) =>
            parseInt(item.Date) === selectedDate.date() &&
            parseInt(item.Month) === (selectedDate.month() + 1)
        );

        return (match as MessMenu) || null;
    }, [menu, loading, selectedDate]);

    if (loading) {
        return (
            <View style={styles.center}>
                <Text style={styles.loadingText}>Loading menu...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>Mess Menu</Text>
            </View>

            <View style={styles.daySelector}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.daySelectorContent}>
                    {next7Days.map((date, index) => {
                        const isSelected = date.isSame(selectedDate, 'day');
                        return (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.dayButton,
                                    isSelected && styles.dayButtonActive,
                                ]}
                                onPress={() => setSelectedDate(date)}
                            >
                                <Text
                                    style={[
                                        styles.dayButtonText,
                                        isSelected && styles.dayButtonTextActive,
                                    ]}
                                >
                                    {date.format('ddd').toUpperCase()}
                                </Text>
                                <Text
                                    style={[
                                        styles.dayButtonDate,
                                        isSelected && styles.dayButtonTextActive,
                                    ]}
                                >
                                    {date.format('DD')}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {selectedMenu ? (
                    <>
                        <View style={styles.dateBadge}>
                            <Text style={styles.dateText}>
                                {selectedMenu.Date}/{selectedMenu.Month} • {selectedDate.format('dddd')}
                            </Text>
                        </View>

                        <MealCard title="Breakfast" icon="sunny-outline" items={selectedMenu.Breakfast} color="#FFB74D" />
                        <MealCard title="Lunch" icon="pizza-outline" items={selectedMenu.Lunch} color="#FF8A65" />
                        <MealCard title="Snacks" icon="cafe-outline" items={selectedMenu.Snacks} color="#AED581" />
                        <MealCard title="Dinner" icon="moon-outline" items={selectedMenu.Dinner} color="#9575CD" />
                    </>
                ) : (
                    <View style={styles.emptyState}>
                        <Ionicons name="restaurant-outline" size={48} color="#666" />
                        <Text style={styles.emptyText}>No menu found for {selectedDate.format('DD/MM')}.</Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

function MealCard({ title, icon, items, color }: { title: string, icon: any, items: string, color: string }) {
    return (
        <View style={styles.card}>
            <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
                <Ionicons name={icon} size={24} color={color} />
            </View>
            <View style={styles.contentContainer}>
                <Text style={[styles.cardTitle, { color: color }]}>{title}</Text>
                <Text style={styles.cardItems}>{items}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#050505",
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#050505",
    },
    loadingText: {
        color: "#888",
        fontSize: 16,
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
        marginBottom: 20,
        backgroundColor: '#121212',
        paddingVertical: 12,
    },
    daySelectorContent: {
        paddingHorizontal: 16,
        gap: 8,
    },
    dayButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: '#222',
        alignItems: 'center',
        minWidth: 50,
    },
    dayButtonActive: {
        backgroundColor: '#BB86FC',
    },
    dayButtonText: {
        color: '#888',
        fontWeight: '700',
        fontSize: 12,
        marginBottom: 2,
    },
    dayButtonDate: {
        color: '#DDD',
        fontWeight: '600',
        fontSize: 14,
    },
    dayButtonTextActive: {
        color: '#000',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    card: {
        backgroundColor: '#1A1A1A',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    contentContainer: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 8,
    },
    cardItems: {
        color: '#ccc',
        fontSize: 14,
        lineHeight: 20,
    },
    dateBadge: {
        alignSelf: 'center',
        backgroundColor: '#222',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        marginBottom: 20,
    },
    dateText: {
        color: '#888',
        fontSize: 12,
        fontWeight: '600',
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 40,
    },
    emptyText: {
        color: '#666',
        marginTop: 16,
        fontSize: 16,
    }
});
