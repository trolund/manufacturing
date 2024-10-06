import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BASE_URL } from "../contants/constants";
import { EquipmentOverview } from "../models/EquipmentOverview";
import { EquipmentState } from "../models/EquipmentState";

export const useGetEquipmentOverviews = () => {
  const fetchEquipment = async (): Promise<EquipmentOverview[]> => {
    const response = await axios.get(`${BASE_URL}/equipment/overview`);
    return response.data;
  };

  return useQuery({
    queryKey: ["equipment"],
    queryFn: () => fetchEquipment(),
  });
};

export const useGetEquipmentOverview = (equipmentId: number) => {
  const fetchEquipment = async (): Promise<EquipmentOverview> => {
    const response = await axios.get(
      `${BASE_URL}/equipment/${equipmentId}/overview`
    );
    return response.data;
  };

  return useQuery({
    queryKey: ["equipment", equipmentId],
    queryFn: () => fetchEquipment(),
  });
};

export const useUpdateEquipmentStatus = (
  equipmentId: number,
  queryClient: QueryClient
) => {
  return useMutation({
    mutationFn: (state: EquipmentState) => {
      const url = new URL(`${BASE_URL}/equipment/${equipmentId}/status`);
      url.searchParams.append("state", Number(state) + "");

      return axios.put(url.toString());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipment", equipmentId] });
      queryClient.invalidateQueries({ queryKey: ["history"] });
    },
  });
};
