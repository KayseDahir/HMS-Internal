import { useMutation } from "@tanstack/react-query";
import { signup as singupApi } from "../../services/apiAuth";
import toast from "react-hot-toast";

export function useSignup() {
  const { mutate: signup, isLoading } = useMutation({
    mutationFn: singupApi,
    onSuccess: (user) => {
      toast.success(
        "Account successfully created, please verify the new account from user's email address."
      );
    },
  });

  return { signup, isLoading };
}
