import { useState } from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import { FaCheck } from "react-icons/fa";

export default function PricingPlans() {
  const [selected, setSelected] = useState("premium");

  const plans = [
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

  return (
    <div className="container py-5 text-center">
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
              onClick={() => setSelected(plan.id)}
            >
              {/* Selection Tick */}
              {selected === plan.id && (
                <div
                  style={{
                    position: "absolute",
                    top: "-10px",
                    right: "-10px",
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

              {/* Title */}
              <h6 className="text-start fw-semibold">{plan.title}</h6>

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
                variant={selected === plan.id ? "primary" : "light"}
                className="w-75 mx-auto my-2"
                style={{
                  borderRadius: "20px",
                  padding: "10px",
                  border: selected === plan.id ? "none" : "1px solid #d3d3d3",
                  color: selected === plan.id ? "#fff" : "#000",
                }}
                onClick={() => setSelected(plan.id)}
              >
                Choose this plan
              </Button>

              {/* Features */}
              <ul className="text-start mt-3 list-unstyled">
                {plan.features.map((item, index) => (
                  <li key={index} className="mb-2 d-flex align-items-center">
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
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
