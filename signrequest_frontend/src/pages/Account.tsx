import { useMutation, useQueryClient } from "@tanstack/react-query";
import UserAccountForm from "../forms/UserAccountForm";
import useProfile from "../hooks/useUserAccount";
import axios from "axios";
import AuthToken from "../utils/AuthToken";
import LeftSideBar from "../components/LeftSideBar";
import { useEffect } from "react";
import { Toaster, toast } from "sonner";

const Account = () => {
  const { profile, isLoading, isError } = useProfile();

  const accessToken = AuthToken();

  const queryClient = useQueryClient();

  useEffect(() => {
    // Scroll to the top of the page when the component mounts
    window.scrollTo(0, 0);
  }, []);

  interface UpdatedProfile {
    first_name: string;
    last_name: string;
    email: string;
  }

  const apiUrl: string = import.meta.env.VITE_SERVER_URL;

  const AccountMutation = useMutation(
    async (updatedPost: UpdatedProfile) => {
      const { first_name, last_name, email } = updatedPost;
      const url = `${apiUrl}/update-profile/`;
      const headers = {
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + String(accessToken),
      };
      const data = {
        first_name: first_name || "",
        last_name: last_name || "",
        email: email || "",
      };

      try {
        const response = await axios.patch(url, data, { headers });
        return response.data;
      } catch (error) {
        toast.error("Error updating account");
        throw error;
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["profile"]);
        toast.success("Account has been updated");
      },
    }
  );

  const onProfileUpdate = async (formData: {
    first_name: string;
    last_name: string;
    email: string;
  }): Promise<void> => {
    try {
      const updatedData: any = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
      };

      await AccountMutation.mutateAsync(updatedData);
    } catch (error) {
      Promise.reject(error);
    }
  };

  if (isLoading) {
    return <div className="account-page-loading">loading...</div>;
  }

  if (isError) {
    return <div>Can't fetch user profile</div>;
  }
  return (
    <div>
      <Toaster richColors />
      <div>
        <div className="account-wrapper">
          <div className="account-left-col">
            <LeftSideBar />
          </div>
          <div className="account-right-col">
            <div className="account-header">Account</div>
            <div className="account-detail">Details</div>
            <div className="user-account-from">
              <UserAccountForm
                isLoading={AccountMutation.isLoading}
                isError={AccountMutation.isError}
                autoFocus={true}
                initialValue={{
                  first_name: profile?.user.first_name || "",
                  last_name: profile?.user.last_name || "",
                  email: profile?.user.email || "",
                }}
                onSubmit={onProfileUpdate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
