import React from "react";

const StudentIdTemplate = ({ profile }) => {
  if (!profile) return null;

  const photoUrl = profile?.photoUrl
    ? `http://localhost:5050${profile.photoUrl}`
    : null;

  return (
    <div
      style={{
        width: "900px",
        background: "#fff",
        border: "2px solid #000",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Top Section */}

      <div
        style={{
          display: "flex",
          borderBottom: "2px solid #ff6b00",
        }}
      >
        <div
          style={{
            width: "45%",
            padding: "20px",
            borderRight: "2px solid #000",
          }}
        >
          {/* Header */}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            <div>
              <h2
                style={{
                  color: "#c1121f",
                  margin: 0,
                  fontSize: "28px",
                  fontWeight: "bold",
                }}
              >
                Graphic Era
              </h2>

              <p
                style={{
                  margin: 0,
                  fontSize: "12px",
                }}
              >
                Deemed to be University
              </p>
            </div>

            <div
              style={{
                fontSize: "12px",
                textAlign: "right",
              }}
            >
              NAAC A+
            </div>
          </div>

          {/* Student */}

          <div
            style={{
              display: "flex",
              gap: "15px",
            }}
          >
            <img
              src={photoUrl}
              crossOrigin="anonymous"
              alt="student"
              style={{
                width: "120px",
                height: "150px",
                objectFit: "cover",
                border: "1px solid #ccc",
              }}
            />

            <div
              style={{
                fontSize: "15px",
              }}
            >
              <h3
                style={{
                  margin: "0 0 10px",
                  fontWeight: "bold",
                }}
              >
                {profile.firstName} {profile.lastName}
              </h3>

              <p>
                <strong>{profile.course || "N/A"}</strong>
              </p>

              <p>Admission No : {profile.rollNo || "N/A"}</p>

              <p>Batch : 2023-2027</p>

              <p>Father's Name : N/A</p>

              <p>{profile.enrollmentNo || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Right */}

        <div
          style={{
            flex: 1,
            padding: "20px",
            fontSize: "15px",
          }}
        >
          <p>
            <strong>Contact No :</strong> {profile.phone || "N/A"}
          </p>

          <p>
            <strong>Blood Group :</strong> N/A
          </p>

          <p>
            <strong>E-mail :</strong> {profile.user?.email || "N/A"}
          </p>

          <p>
            <strong>Address :</strong> {profile.address || "N/A"}
          </p>

          <br />

          <p>
            <strong>Valid Through :</strong> 30-06-2027
          </p>

          <p>
            <strong style={{ color: "red" }}>Emergency Contact :</strong> N/A
          </p>

          <div
            style={{
              marginTop: "25px",
              borderTop: "2px solid blue",
              paddingTop: "10px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <strong>If found please return to :</strong>

            <strong>ISSUED BY</strong>
          </div>
        </div>
      </div>

      {/* Footer */}

      <div
        style={{
          textAlign: "center",
          padding: "20px",
          fontSize: "13px",
        }}
      >
        <p
          style={{
            color: "blue",
            marginBottom: "8px",
          }}
        >
          Graphic Era (Deemed to be University)
        </p>

        <p>Bell Road, Clement Town Dehradun, Uttarakhand India - 248002</p>

        <p>www.geu.ac.in</p>
      </div>
    </div>
  );
};

export default StudentIdTemplate;
