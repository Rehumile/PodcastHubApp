import { useState } from "react";
import { supabase } from "../../supabaseClient";
import { Link } from "react-router-dom";
import "../Authentication/LoginUser.css";

export default function SignUp() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  /**
   * function that sets state variables for input fields
   * @param {Object} event 
   */
  const handleChange = (event) => {
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [event.target.name]: event.target.value,
      };
    });
  };

  /**
   * Function that handles the submission of form. Using the supabase method
   * to sign in new users. Once submitted an alert to verify email will be sent
   * @param {Object} event 
   */
  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          },
        },
      });
      alert("Check your email for the verification link!");
    } catch (error) {
      alert(error);
    }
  }

  return (
    <>
      <div className="auth--form">
        <div className="form--info">
          <p className="podcast--title">Podcast Hub</p>
          <p className="text">Want to Sign Up?</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="inputBox">
            <input name="fullName" onChange={handleChange} />
            <span>Full Name</span>
          </div>
          <div className="inputBox">
            <input name="email" onChange={handleChange} />
            <span>Email</span>
          </div>
          <div className="inputBox">
            <input type="password" name="password" onChange={handleChange} />
            <span>Password</span>
          </div>

          <button className="submit--button" type="submit">
            Submit
          </button>
        </form>
        <p>
          Already have an account?{" "}
          <Link to="/login">
            <span className="Link">Login</span>
          </Link>
        </p>
      </div>
    </>
  );
}
