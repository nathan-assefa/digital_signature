import LeftSideBar from "../components/LeftSideBar";
import BillingForm from "../forms/BillingForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import AuthToken from "../utils/AuthToken";
import axios from "axios";
import { useEffect } from "react";
// import { useState } from "react";

const Billing = () => {
  // const [error, setError] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const accessToken = AuthToken();

  useEffect(() => {
    // Scroll to the top of the page when the component mounts
    window.scrollTo(0, 0);
  }, []);

  interface UpdatedProfile {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    companyName?: string;
    vatNumber?: string;
    address?: string;
    postalCode?: string | number;
    city?: string;
    country?: string;
  }

  const apiUrl: string = import.meta.env.VITE_SERVER_URL;

  const AccountMutation = useMutation(
    async (updatedPost: UpdatedProfile) => {
      const {
        firstName,
        lastName,
        phoneNumber,
        email,
        companyName,
        vatNumber,
        address,
        postalCode,
        city,
        country,
      } = updatedPost;
      const url = `${apiUrl}/update-profile/`;
      const headers = {
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + String(accessToken),
      };
      const data = {
        first_name: firstName || "",
        last_name: lastName || "",
        email: email || "",
        phone_number: phoneNumber || "",
        company_Name: companyName || "",
        vat_number: vatNumber || "",
        address: address || "",
        postal_code: postalCode || "",
        city: city || "",
        country: country || "",
      };

      try {
        const response = await axios.patch(url, data, { headers });
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["profile"]);
      },
    }
  );

  const onRegistratingUser = async (formData: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    companyName?: string;
    vatNumber?: string;
    address?: string;
    postalCode?: string | number;
    city?: string;
    country?: string;
  }): Promise<void> => {
    try {
      const updatedData: any = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone_number: formData.phoneNumber,
        email: formData.email,
        company_name: formData.companyName,
        vat_number: formData.vatNumber,
        address: formData.address,
        postal_code: formData.postalCode,
        city: formData.city,
        country: formData.country,
      };

      await AccountMutation.mutateAsync(updatedData);
    } catch (error) {
      Promise.reject(error);
    }
  };
  return (
    <>
      <div className="billings-wrapper">
        <div className="dashbord-wrapper">
          <LeftSideBar />
        </div>
        <div className="billings-right-col">
          <div className="billings-header">Billing</div>
          <div className="billing-btn">
            <div className="billing-icon"></div>
            <p className="choose-billing">Choose plan</p>
          </div>
          <div className="billing-plan-container">
            <div className="billing-plan">
              <div className="plan free-plan">
                <h3 className="plan-header">Free</h3>
                <p className="plan-body">
                  Get started and experience the benefits
                </p>
                <p className="plan-price">
                  <span>$</span>0
                </p>
              </div>
              <div className="plan professional-plan">
                <h3 className="plan-header">Professional</h3>
                <p className="plan-body">Get more advanced features</p>
                <p className="plan-price">
                  <span>$</span>9
                </p>
                <p className="price-range">per month, per user</p>
              </div>
              <div className="plan business-plan">
                <h3 className="plan-header">Buisness</h3>
                <p className="plan-body">
                  Unlimited teams, templates and premium features
                </p>
                <p className="plan-price">
                  <span>$</span>15
                </p>
                <p className="price-range">per month, per user</p>
              </div>
            </div>
          </div>
          <p className="subscription-prompt">
            Please scroll down to update your subscription. Confirm the new plan
            subscription by hitting the “Subscribe” button below.
          </p>
          <div className="user-account-from">
            <BillingForm
              isLoading={false}
              isError={false}
              // autoFocus={true}
              onSubmit={onRegistratingUser}
            />
            {/* {error && (
              <p className="error-while-registration">
                <div style={{ color: "red" }}>{error}</div>
              </p>
            )} */}
          </div>
          <div className="billing-footer">
            <div className="billing-subscription-info">
              <p className="billing-subscription-prompt">Subscription</p>
              <div className="subscription-detail">
                <p className="detail-hader">SignRequest FREE (€0,00/month)</p>
                <p className="detail-body">
                  Extra costs for text messages may apply. (€0,20/SMS) Excluding
                  VAT (if applicable) VAT rate: <span>0%</span> (Ethiopia)
                </p>
              </div>
            </div>
            <div className="payment-method">
              <p className="payment-method-prompt">Payment Method</p>
              <button className="add-credit-card payment-btn">
                Add a credit card
              </button>
              <button className="add-sepa-mandate payment-btn">
                Add SEPA mandate
              </button>
            </div>
            <p className="user-notification">
              No payment details at your disposal? Please contact us.
            </p>
            <p className="check-box">
              I understand that this subscription will automatically renew.
            </p>
            <button className="user-subscribe-btn">Subscribe</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Billing;
