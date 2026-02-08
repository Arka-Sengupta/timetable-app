import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system/legacy';
import Papa from 'papaparse';
import { useEffect, useState } from 'react';

const MESS_MENU_FILE = require('../app/assets/data.csv');

export default function useMessMenu() {
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadMenu();
    }, []);

    const loadMenu = async () => {
        try {
            const asset = Asset.fromModule(MESS_MENU_FILE);
            await asset.downloadAsync();
            const fileUri = asset.localUri;

            if (!fileUri) {
                console.error("Failed to get local URI for mess menu CSV");
                setLoading(false);
                return;
            }

            const csv = await FileSystem.readAsStringAsync(fileUri, {
                encoding: 'utf8',
            });

            const parsed = Papa.parse(csv, {
                header: true,
                skipEmptyLines: true,
            });

            console.log("Parsed Mess Menu Data:", parsed.data.length);
            setMenu(parsed.data);
        } catch (error) {
            console.error("Error loading mess menu:", error);
        } finally {
            setLoading(false);
        }
    };

    return { menu, loading };
}
