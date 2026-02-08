import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system/legacy";
import Papa from "papaparse";
import { useEffect, useState } from "react";

export default function useTimetable() {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCSV = async () => {
      try {
        const asset = Asset.fromModule(require("../app/assets/timetable.csv"));
        await asset.downloadAsync();
        const fileUri = asset.localUri || asset.uri;

        const csv = await FileSystem.readAsStringAsync(fileUri, {
          encoding: 'utf8',
        });

        const parsed = Papa.parse(csv, {
          header: true,
          skipEmptyLines: true,
        });

        setTimetable(parsed.data);
      } catch (err) {
        console.error("CSV load failed:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCSV();
  }, []);

  return { timetable, loading };
}
