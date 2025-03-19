import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import axiosinstance from "../utils/axiosinstance";
import { useNavigate } from "react-router-dom"; 

const SignIn = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [Email, setEmail] = useState("");
  const [OTP, setOTP] = useState("");
  const [Password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); 

  const GetCode = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axiosinstance.post("auth/GetCode", { Email });
      if (response.data.Valid) {
        setTimeout(() => {
          setIsLoading(false); // Reset loading state after action is complete
        }, 500);
        toast.success(response.data.message);
      } else {
        setTimeout(() => {
          setIsLoading(false); // Reset loading state after action is complete
        }, 500);
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Network error! Check your connection.");
    }
  };

  const RegisterSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosinstance.post("auth/Register", {
        Email: Email,
        OTP: OTP,
        Password: Password,
      });
      if (response.data.Valid) {
        toast.success(response.data.message);
        setEmail("");
        setOTP("");
        setPassword("");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error);
    }
  };

  const SignIn = async (e) => {
    e.preventDefault(); 
    try {
      const response = await axiosinstance.post("auth/Login", {
        Email: Email,
        Password: Password
      });
      if (response.data.Valid) {
        toast.success(response.data.message);
        sessionStorage.setItem("UserId", response.data.UserId);
        sessionStorage.setItem("UserName", response.data.Name)
        console.log(sessionStorage.getItem("UserId"));
        console.log(sessionStorage.getItem("UserName"));
        setEmail("");
        setPassword("");  
        navigate('/client', { replace: true });
      } else {
        toast.error(response.data.message);
        setPassword("");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <section class="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
      <div className="container">
        <ToastContainer />
        <div className="row justify-content-center">
          {isSignIn ? (
            <div className="col-lg-8 col-md-6 d-flex flex-column align-items-center justify-content-center">
              <div className="card mb-3">
                <div className="row g-0">
                  <div className="col-md-6">
                    {/* <img src="img/logo.png" className="img-fluid rounded-start" alt="Card Image" /> */}
                    <img src="/tabicon1.jpeg" className="img-fluid rounded-start" alt="Card Image" />
                  </div>
                  <div className="col-md-6">
                    <div className="card-body">
                      <div className="">
                        <h5 className="card-title text-center pb-0 fs-4">Login to Your Account</h5>
                        <p className="text-center small">Enter your Email & Password to login</p>
                      </div>
                      <form className="row g-3 needs-validation" noValidate >
                        <div className="col-12">
                          <label htmlFor="yourUsername" className="form-label">Your Email</label>
                          <div className="input-group has-validation">
                            <span className="input-group-text" id="inputGroupPrepend">@</span>
                            <input
                              type="text"
                              name="Email"
                              className="form-control"
                              id="txtEmail"
                              value={Email}
                              onChange={(e) => setEmail(e.target.value)}

                              required
                            />
                            <div className="invalid-feedback">Please enter Email.</div>
                          </div>
                        </div>

                        <div className="col-12">
                          <label htmlFor="yourPassword" className="form-label">Password</label>
                          <input
                            type="password"
                            name="password"
                            className="form-control"
                            id="txtSignInPassword"
                            value={Password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                          <div className="invalid-feedback">Please enter your password!</div>
                        </div>

                        <div className="form-group d-md-flex">
                          <div className="w-50 text-md-start">
                            <a href="#">&nbsp;</a>
                          </div>
                          <div className="w-50 text-md-right">
                            <button
                              type="button"
                              onClick={() => {
                                setIsForgotPassword(true);
                                setIsSignIn(false);
                              }}
                              style={{ color: "#ce1212", border: "none", background: "white" }}
                            >
                              Forgot Password ?
                            </button>
                          </div>
                        </div>

                        <div className="col-12">
                          <button className="btn btn-primary w-100" type="submit" onClick={SignIn} >Login</button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div className="credits">
                <p className="small mb-0">Don't have an account? <a href="#" onClick={() => setIsSignIn(false)} >Create an account</a></p>
              </div>
            </div>

          ) : isForgotPassword ? (
            <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
              <div className="d-flex justify-content-center py-4">
                <a href="index.html" className="logo d-flex align-items-center w-auto">
                  {/* <img src="/img/logo.png" alt="Logo" /> */}
                  <span className="d-none d-lg-block">ABC</span>
                </a>
              </div>

              <div className="card mb-3">
                <div className="card-body">
                  <div className="pt-4 pb-2">
                    <h5 className="card-title text-center pb-0 fs-4">Password Reset</h5>
                  </div>

                  <form className="row g-3 needs-validation" noValidate>
                    <div className="col-12">
                      <label htmlFor="yourUsername" className="form-label">Your Email</label>
                      <div className="input-group has-validation">
                        <span className="input-group-text" id="inputGroupPrepend">@</span>
                        <input
                          type="text"
                          name="Email"
                          className="form-control"
                          id="txtEmail"
                          value={Email}
                          onChange={(e) => setEmail(e.target.value)}

                          required
                        />
                        <div className="invalid-feedback">Please enter Email.</div>
                      </div>
                    </div>
                    <div className="col-12">
                      <button
                        className={`btn btn-primary  w-100 ${isLoading ? 'disabled' : ''}`}
                        type="button"
                        onClick={!isLoading ? GetCode : null}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            Loading...
                          </>
                        ) : (
                          'Get Verification Code'
                        )}
                      </button>
                    </div>
                    <div className="col-12">
                      <label htmlFor="yourUsername" className="form-label">Verification Code</label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        id="txtCode"
                        value={OTP}
                        onChange={(e) => setOTP(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label htmlFor="yourPassword" className="form-label">Password</label>
                      <input
                        type="password"
                        name="password"
                        className="form-control"
                        id="yourPassword"
                        value={Password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <div className="invalid-feedback">Please enter your password!</div>
                    </div>

                    <div className="col-12">
                      <button className="btn btn-primary w-100" type="submit" onClick={RegisterSignUp} >Reset Password</button>
                    </div>

                    <div className="form-group d-md-flex">
                      <div className="w-50 text-md-start">
                        <a href="#">&nbsp;</a>
                      </div>
                      <div className="w-50 text-md-right">
                        <button
                          type="button"
                          style={{ color: "#ce1212", border: "none", background: "white" }}
                          onClick={() => {
                            setIsForgotPassword(false);
                            setIsSignIn(true);
                          }}
                        >
                          Back to Login
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              {/* <div className="credits">
              Designed by <a href="https://bootstrapmade.com/">BootstrapMade</a>
            </div> */}
            </div>
          ) : (
            <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
              <div className="d-flex justify-content-center py-4">
                <a href="index.html" className="logo d-flex align-items-center w-auto">
                  {/* <img src="/img/logo.png" alt="Logo" /> */}
                  <span className="d-none d-lg-block">ABC</span>
                </a>
              </div>

              <div className="card mb-3">
                <div className="card-body">
                  <div className="pt-4 pb-2">
                    <h5 className="card-title text-center pb-0 fs-4">Create an Account</h5>
                    <p className="text-center small">Enter your personal details to create account</p>
                  </div>

                  <form className="row g-3 needs-validation" noValidate>
                    <div className="col-12">
                      <label htmlFor="yourUsername" className="form-label">Your Email</label>
                      <div className="input-group has-validation">
                        <span className="input-group-text" id="inputGroupPrepend">@</span>
                        <input
                          type="text"
                          name="Email"
                          className="form-control"
                          id="txtEmail"
                          value={Email}
                          onChange={(e) => setEmail(e.target.value)}

                          required
                        />
                        <div className="invalid-feedback">Please enter Email.</div>
                      </div>
                    </div>
                    <div className="col-12">
                      <button
                        className={`btn btn-primary  w-100 ${isLoading ? 'disabled' : ''}`}
                        type="button"
                        onClick={!isLoading ? GetCode : null}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            Loading...
                          </>
                        ) : (
                          'Get Verification Code'
                        )}
                      </button>
                    </div>
                    <div className="col-12">
                      <label htmlFor="yourUsername" className="form-label">Verification Code</label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        id="txtCode"
                        value={OTP}
                        onChange={(e) => setOTP(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label htmlFor="yourPassword" className="form-label">Password</label>
                      <input
                        type="password"
                        name="password"
                        className="form-control"
                        id="yourPassword"
                        value={Password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <div className="invalid-feedback">Please enter your password!</div>
                    </div>

                    <div className="col-12">
                      <button className="btn btn-primary w-100" type="submit" onClick={RegisterSignUp} >Create Account</button>
                    </div>

                    <div className="col-12">
                      <p className="small mb-0">
                        Already have an account? <a href="#" onClick={() => setIsSignIn(true)} >Log in</a>
                      </p>
                    </div>
                  </form>
                </div>
              </div>

              {/* <div className="credits">
                Designed by <a href="https://bootstrapmade.com/">BootstrapMade</a>
              </div> */}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SignIn;
