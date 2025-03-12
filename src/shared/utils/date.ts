import dayjs from "dayjs";

export const YYYYMMDD = (date?: any) => {
  if (!!date) {
    return dayjs(new Date(date)).format("YYYY. MM. DD");
  }

  return "";
};
