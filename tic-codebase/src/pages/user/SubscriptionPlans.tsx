import { useState } from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import { FaCheck } from "react-icons/fa";
// Stripe integration
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import BaseApi from "../../services/api";
import { toast } from "react-toastify";

const stripePromise = loadStripe("pk_test_your_publishable_key"); // Replace with your Stripe publishable key

function CheckoutForm({ plan }: { plan: Plan }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  interface CheckoutFormEvent extends React.FormEvent<HTMLFormElement> {}

  interface StripeConfirmCardPaymentResult {
    error?: {
      message?: string | null;
    };
    paymentIntent?: {
      status?: string;
    };
  }

  const handleSubmit = async (e: CheckoutFormEvent): Promise<void> => {
    e.preventDefault();
    setProcessing(true);
    setError(null);
    // For demo: Use Stripe test client secret (replace with backend call in production)
    const clientSecret: string = "set_your_client_secret_here";
    if (!stripe || !elements) return;
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError("Card information is incomplete.");
      setProcessing(false);
      return;
    }
    const result: StripeConfirmCardPaymentResult =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {},
        },
      });
    if (result.error) {
      setError(result.error.message ?? null);
    } else if (
      result.paymentIntent &&
      result.paymentIntent.status === "succeeded"
    ) {
      setSuccess(true);
    }
    setProcessing(false);
  };

  if (success) return <div>Payment successful!</div>;

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "0 auto" }}>
      <h4>Pay for: {plan?.title || "Selected Plan"}</h4>
      <CardElement options={{ hidePostalCode: true }} />
      <button
        type="submit"
        disabled={!stripe || processing}
        className="btn btn-primary mt-3"
      >
        {processing ? "Processing..." : "Pay Now"}
      </button>
      {error && <div className="text-danger mt-2">{error}</div>}
    </form>
  );
}

type Plan = {
  id: string;
  title: string;
  price: string;
  month: string;
  features: string[];
  color: string;
};

export default function PricingPlans() {
  const plans: Plan[] = [
    {
      id: "basic",
      title: "Basic",
      price: "Free",
      month: "month",
      features: [
        "Create your unique profile",
        "Search positions",
        "Receive monthly newsletter",
      ],
      color: "#ffffff",
    },
    {
      id: "premium",
      title: "Premium",
      price: "$25",
      month: "month",
      features: [
        "Create your unique profile",
        "Search & apply for positions",
        "Receive monthly newsletter",
        "Receive email alerts for positions as they are posted",
      ],
      color: "#123a93",
    },
  ];

  const [selected, setSelected] = useState("basic"); // Basic selected by default
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(plans[0]); // Basic plan by default
  const [showPayment, setShowPayment] = useState(false);
  const [loadingCheckout, setLoadingCheckout] = useState(false);

  // Handle plan selection

  // Handle continue button
  const handleContinue = async () => {
    if (!selectedPlan) return;
    setLoadingCheckout(true);
    try {
      const res = await BaseApi.post("/create-checkout-session", {
        planId: selectedPlan.id,
      });
      // Expecting the backend to return a 'url' field for Stripe Checkout
      const checkoutUrl = res.data.sessionUrl;
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        toast.error("something went wrong.");
      }
    } catch (err) {
      toast.error("something went wrong.");
    } finally {
      setLoadingCheckout(false);
    }
  };

  return (
    <div className="container py-5 text-center">
      {!showPayment ? (
        <>
          <h2 className="fw-bold">
            Simple plans that fit your
            <br />
            application goals
          </h2>
          <p className="mt-2 text-muted">
            Discover simple and flexible pricing. Tailored to meet your unique
            application goals. Clear, customizable plans built for educators.
          </p>
          <Row className="justify-content-center mt-4 g-4">
            {plans.map((plan) => (
              <Col md={4} key={plan.id}>
                <Card
                  className="p-3 shadow-sm pricing-card"
                  style={{
                    borderRadius: "20px",
                    border:
                      selected === plan.id
                        ? "2px solid #123a93"
                        : "1px solid #e1e1e1",
                    backgroundColor: selected === plan.id ? "#eaf0ff" : "white",
                    position: "relative",
                  }}
                  onClick={() => {
                    if (plan.id !== "basic") {
                      setSelected(plan.id);
                      setSelectedPlan(plan);
                      setShowPayment(false);
                    }
                  }}
                >
                  {/* Only show tick for selected paid plan */}
                  {plan.id !== "basic" && selected === plan.id && (
                    <div
                      style={{
                        position: "absolute",
                        top: "-18px",
                        right: "-15px",
                        backgroundColor: "#123a93",
                        color: "white",
                        borderRadius: "50%",
                        width: "35px",
                        height: "35px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        boxShadow: "0px 3px 8px rgba(0,0,0,0.3)",
                      }}
                    >
                      <FaCheck />
                    </div>
                  )}

                  {/* Title and badges */}
                  <div className="d-flex align-items-center justify-content-between">
                    <h6 className="text-start fw-semibold mb-0">
                      {plan.title}
                    </h6>
                    {plan.id === "basic" && (
                      <span
                        className="badge bg-success"
                        style={{ fontSize: 12 }}
                      >
                        Active Plan
                      </span>
                    )}
                    {plan.id === "premium" && (
                      <span
                        className="badge bg-primary"
                        style={{ fontSize: 12 }}
                      >
                        Recommended
                      </span>
                    )}
                  </div>

                  {/* Price */}
                  <h2
                    className="fw-bold text-start"
                    style={{ color: selected === plan.id ? "#123a93" : "#000" }}
                  >
                    {plan.price}
                    <span className="fs-6 text-muted ms-1">{plan.month}</span>
                  </h2>

                  {/* Button */}
                  <Button
                    variant={selected === plan.id ? "primary" : "primary"}
                    className="w-75 mx-auto my-2"
                    style={{
                      borderRadius: "20px",
                      padding: "10px",
                      border:
                        selected === plan.id ? "none" : "1px solid #d3d3d3",
                      color: selected === plan.id ? "#fff" : "#fff",
                    }}
                    disabled={plan.id === "basic"}
                  >
                    {plan.id === "basic"
                      ? selected === "basic"
                        ? "Active"
                        : "Active"
                      : selected === plan.id
                      ? "Selected"
                      : "Choose this plan"}
                  </Button>

                  {/* Features */}
                  <ul className="text-start mt-3 list-unstyled">
                    {plan.features.map((item, index) => (
                      <li
                        key={index}
                        className="mb-2 d-flex align-items-center"
                      >
                        <FaCheck style={{ marginRight: "8px" }} /> {item}
                      </li>
                    ))}
                  </ul>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Continue Button */}
          <div className="mt-4">
            <Button
              size="lg"
              style={{
                backgroundColor: "#123a93",
                borderRadius: "8px",
                padding: "10px 40px",
              }}
              disabled={selected !== "premium" || loadingCheckout}
              onClick={handleContinue}
            >
              {loadingCheckout ? "Redirecting..." : "Continue"}
            </Button>
          </div>
        </>
      ) : (
        showPayment &&
        selectedPlan && (
          <Elements stripe={stripePromise}>
            <CheckoutForm plan={selectedPlan} />
          </Elements>
        )
      )}
    </div>
  );
}
