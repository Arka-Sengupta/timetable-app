import dayjs from "dayjs";

export function getCurrentClass(timetable) {
  const now = dayjs();
  // Map standard day names to our CSV format (MON, TUE, etc.)
  const dayMap = {
    Monday: "MON",
    Tuesday: "TUE",
    Wednesday: "WED",
    Thursday: "THU",
    Friday: "FRI",
    Saturday: "SAT",
    Sunday: "SUN"
  };
  const day = dayMap[now.format("dddd")];
  const time = now.format("HH:mm");

  return timetable.find(cls => {
    return (
      cls.day === day &&
      time >= cls.start_time &&
      time <= cls.end_time
    );
  });
}
