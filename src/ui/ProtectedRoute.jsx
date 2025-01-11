import styled from "styled-components";
import { useUser } from "../features/authentication/useUser";
import Spinner from "../ui/Spinner";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const FullPage = styled.div`
  height: 100vh;
  background-color: var(--color-grey-50);
  display: flex;
  justify-content: center;
  align-items: center;
`;
function ProtectedRoute({ children }) {
  const navigate = useNavigate();

  // 1. Load authenticated user

  const { isLoading, isAuthenticated } = useUser();

  // 2. if there is NO authenticate user, redirect to the /login
  useEffect(
    function () {
      if (!isAuthenticated && !isLoading) navigate("/login");
    },
    [isAuthenticated, isLoading, navigate]
  );

  // 3. While loading show spinner
  if (isLoading)
    <FullPage>
      <Spinner />
    </FullPage>;

  // 4. if there is a user show the app.
  if (isAuthenticated) return children;
}

export default ProtectedRoute;
