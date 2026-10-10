import { useQuery } from "@tanstack/react-query"
import { fetchHealth } from "@/features/dashboard/infrastructure/healthApi"

export function useApiHealth() {
  return useQuery({
    queryKey: ["health"],
    queryFn: fetchHealth,
    retry: false,
  })
}
