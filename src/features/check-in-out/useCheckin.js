import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { updateBooking } from "../../services/apiBookings";
import { useNavigate } from "react-router-dom";

function useCheckin() {
  const qeuryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: checkin, isLoading: isCheckingIn } = useMutation({
    mutationFn: ({ bookingId, breakfast }) =>
      updateBooking(bookingId, {
        status: "checked-in",
        isPaid: true,
        ...breakfast,
      }),

    onSuccess: (data) => {
      toast.success(`Booking #${data.id} successfully checked in`);
      qeuryClient.invalidateQueries({
        active: true,
      });
      navigate("/");
    },

    onError: () => {
      toast.error("There was an error checking in the booking");
    },
  });

  return { checkin, isCheckingIn };
}

export default useCheckin;
