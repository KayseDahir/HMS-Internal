import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getBookings } from "../../services/apiBookings";
import { useSearchParams } from "react-router-dom";
import { PAGE_SIZE } from "../../utils/constants";

export function useBookings() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  // FILTER
  const filterValue = searchParams.get("status");
  const filter =
    !filterValue || filterValue === "all"
      ? null
      : { field: "status", value: filterValue };
  // { field: "totalPrice", value: 5000, method: "gte" };

  // SORT
  const sortByRaw = searchParams.get("sortBy") || "startDate-desc";
  const [field, direction] = sortByRaw.split("-");
  const sortBy = { field, direction };

  // PAGINATION
  const Page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  // QUERY
  const {
    isLoading,
    data: { data: bookings, count } = {},
    error,
  } = useQuery({
    queryKey: ["bookings", filter, sortBy, Page],
    queryFn: () => getBookings({ filter, sortBy, Page }),
  });

  // PRE-FETCHING
  const pageCount = Math.ceil(count / PAGE_SIZE);

  // Prefetch next  page
  if (Page < pageCount)
    queryClient.prefetchQuery({
      queryKey: ["bookings", filter, sortBy, Page + 1],
      queryFn: () => getBookings({ filter, sortBy, Page: Page + 1 }),
    });

  // Prefetch previous page
  if (Page > 1)
    queryClient.prefetchQuery({
      queryKey: ["bookings", filter, sortBy, Page - 1],
      queryFn: () => getBookings({ filter, sortBy, Page: Page - 1 }),
    });

  return { isLoading, error, bookings, count };
}
