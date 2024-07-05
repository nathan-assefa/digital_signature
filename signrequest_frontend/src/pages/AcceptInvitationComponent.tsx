import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { acceptInvitation } from "../utils/teams";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import RegisterUser from "../pages/RegisterUser";
import axios from "axios";
import { Toaster, toast } from "sonner";

const AcceptInvitationComponent = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { username } = useAuth();
  const navigate = useNavigate();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");
  const team_id = searchParams.get("team_id");

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if the user is already authenticated
    if (username) {
      setIsAuthenticated(true);
    }
  }, [username]);

  useEffect(() => {
    // Only call onInvitingUser if the user is authenticated
    if (isAuthenticated) {
      onInvitingUser();
    }
  }, [isAuthenticated]);

  const acceptInvitationMutation = useMutation(
    async () => {
      try {
        await acceptInvitation(token!);
      } catch (err) {
        toast.error("Oops! Something went wrong. Unable to join the team.");
      }
    },
    {
      onSuccess: () => {
        toast.success(
          "Congratulations! You have successfully joined the team."
        );

        // Invitation accepted successfully, redirect to the team dashbord
        setTimeout(() => {
          navigate(`/team-dashbord/${team_id}`);
        }, 4500);
      },
    }
  );

  const onInvitingUser = async (): Promise<void> => {
    try {
      await acceptInvitationMutation.mutateAsync();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.error || "An error occurred");
      }
      throw error;
    }
  };

  return (
    <div className="user-invitation-page">
      <Toaster richColors />
      {isAuthenticated ? (
        <div>
          <button className="join-the-team">Redirecting to team page...</button>
        </div>
      ) : (
        <>
          <RegisterUser
            destination="/accept-invitation"
            team_id={team_id || undefined}
            token={token || undefined}
          />
        </>
      )}
      <div>
        {error && (
          <p className="error-while-registration">
            <div style={{ color: "red" }}>{error}</div>
          </p>
        )}
      </div>
    </div>
  );
};

export default AcceptInvitationComponent;
