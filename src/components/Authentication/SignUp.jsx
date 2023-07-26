import { useState } from "react";
import {supabase} from '../../supabaseClient'
import { Link } from "react-router-dom";
// import '../Authentication/Auth.css'

export default function SignUp() {
    const [loading, setLoading] = useState(false)
    // set state for email
    const [formData, setFormData] = useState({
      fullName: '',
      email: '',
      password: ''
    })
  

    const handleChange =(event) => {
     setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [event.target.name] : event.target.value
      }
     })
    }
    
    async function handleSubmit(event){
      event.preventDefault()
try {
  const { data, error } = await supabase.auth.signUp(
    {
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName,
        }
      }
    }
  )
  alert('Check your email for the verification link!')
} catch (error) {
  alert(error)
}
    }
  
    return (

      <>
      <div style={{marginTop: '5rem'}}>
        <form onSubmit={handleSubmit}>
      <input placeholder="Full Name" name="fullName" onChange={handleChange}/>
      <input placeholder="Email" name="email" onChange={handleChange}/>
      <input type="password"placeholder="Password" name="password" onChange={handleChange}/>
      <button type="submit">Submit</button>
      </form>
      <p>Already have an account? <Link to='/login'>Login</Link></p>

      </div>
      </>
    )
  }