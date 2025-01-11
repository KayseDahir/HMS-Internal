import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { updateBooking } from "../../services/apiBookings";

function useCheckout() {
  const qeuryClient = useQueryClient();

  const { mutate: checkout, isLoading: isCheckingOut } = useMutation({
    mutationFn: (bookingId) =>
      updateBooking(bookingId, {
        status: "checked-out",
      }),

    onSuccess: (data) => {
      toast.success(`Booking #${data.id} successfully checked out`);
      qeuryClient.invalidateQueries({
        active: true,
      });
    },

    onError: () => {
      toast.error("There was an error checking out the booking");
    },
  });

  return { checkout, isCheckingOut };
}

export default useCheckout;
