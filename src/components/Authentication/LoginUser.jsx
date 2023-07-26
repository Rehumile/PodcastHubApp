import { useState } from "react";
import {supabase} from '../../supabaseClient'
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
// import '../Authentication/Auth.css'

export default function LoginUser({setToken}) {
    const [loading, setLoading] = useState(false)
    // set state for email
    const [formData, setFormData] = useState({
      email: '',
      password: ''
    })
    const navigate = useNavigate()
  

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
 const {data, error} = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password
 }) 
    navigate('/')
 setToken(data)
 //console.log(data) // this will log the session. access token to give you access to particular website
 if (error) throw error
 
} catch (error) {
  alert(error)
}
    }
  
    return (

      <>
      <div style={{marginTop: '5rem'}}>
        <form onSubmit={handleSubmit}>
      <input placeholder="Email" name="email" onChange={handleChange}/>
      <input type="password"placeholder="Password" name="password" onChange={handleChange}/>
      <button type="submit">Submit</button>
      </form>
      <p>Do not have an account? <Link to='/signup'>Sign Up</Link></p>

      </div>
      </>
    )
  }