import { useState } from "react";
import { supabase } from "../../supabaseClient";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../Authentication/LoginUser.css";

// eslint-disable-next-line react/prop-types
export default function LoginUser({ setSession }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

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
   * to sign exisiting users. Once authenticated the page will be redirected to the
   * podcast previews page
   * @param {Object} event 
   */
  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      navigate("/");
      setSession(data);

      if (error) throw error;
    } catch (error) {
      alert(error);
    }
  }

  return (
    <>
      <div className="auth--form">
        <div className="form--info">
          <p className="podcast--title">Podcast Hub</p>
          <p className="text">Want to Log in?</p>
        </div>
        <form onSubmit={handleSubmit}>
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
          Do not have an account?{" "}
          <Link to="/signup">
            <span className="Link">Sign Up</span>
          </Link>
        </p>
      </div>
    </>
  );
}
