import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BASE_URL } from "../contants/constants";

export const useGetHistory = () => {
  const fetchHistory = async () => {
    const response = await axios.get(`${BASE_URL}/history/recent`);
    return response.data;
  };

  return useQuery({
    queryKey: ["history"],
    queryFn: () => fetchHistory(),
  });
};
