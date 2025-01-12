import React, { useState,useEffect } from "react";
import  "./LoginSignup.css"
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from "../Components/Modal";
const LoginSignup = () => {
  const [isRightPanelActive, setRightPanelActive] = useState(false);
  const [isOpen, Setisopen] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const  Nav = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password:""
  });
  const [LoginData, SetLoginData] = useState({
    email: '',
    password:""
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

   const handleloginData = (e ) => {
    const { name, value } = e.target; 
     SetLoginData({ ...LoginData, [name]: value });
   }
  const handleSubmit = (e) => {
    e.preventDefault(); 
    submitForm(formData); 
   
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault(); 
    submitLoginForm(LoginData);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const val = localStorage.getItem("user");
        const User_data = JSON.parse(val)
        if (!User_data) {
          Setisopen(false);
          setIsLoggedIn(false);
          return;
        }
        else{
          setIsLoggedIn(true)
          Setisopen(true);
          
      } } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  },[]);

  const submitLoginForm = async(data) => {
    try{
      const payload = {...data, action: "login"};
    const response = await axios.post('https://fusionfilm-backend.onrender.com/loginSignup',payload);
    const User_data = response.data
    console.log(User_data)
    localStorage.setItem("user", JSON.stringify({ ...User_data, password: "" }));
   
    if(response.status === 200){
      alert("Login Successful!");
      Nav("/dashboard");
    }

    } catch(err){
    if(err.response.status === 401){
      alert("Please Register ");
      SetLoginData({ email: '', password: '' });
      setRightPanelActive(true);
    }
  }
  }
  const submitForm = async (data) => {
    try {
      const payload = { ...data, action: "register" };
      const response = await axios.post('https://fusionfilm-backend.onrender.com/loginSignup', payload);
      const User_data = response.data;
      console.log("before try catch")
      if (response.status === 201) {
        localStorage.setItem("user", JSON.stringify({ ...User_data, password: "" }));
        alert("Successfully registered!");
        setRightPanelActive(false)
      }  
    } catch (err) {
      if (err.response.status === 409) {
        alert("User Already Exist...Please Login");
        setFormData({name:"",email:"",password:""})
        setRightPanelActive(false)
        
      }
      else {
        alert("Registration failed!");
      }
      // console.error("Registration Error:", error);
      // alert("An error occurred during registration.");
    }
  };
  

  const handleSignUpClick = () => {
    setRightPanelActive(true);
    
  };

  const handleSignInClick = () => {
    setRightPanelActive(false);
  };

  return (
    <>{isLoggedIn ? (<Modal isOpen={isOpen} Setisopen ={Setisopen}/>):
    (
     <body className="LoginSignup-body">
      <div
        className={`container ${
          isRightPanelActive ? "right-panel-active" : ""
        }`}
        id="container"
      >
        <div className="form-container sign-up-container">
          <form className="LoginSignup-form" action="#"  onSubmit={handleSubmit}>
            <h1 className="LoginSignup-h1">Create Account</h1>
            <div className="social-container">
              <a href="#" className="social">
                <i className="fab fa-facebook-f"></i> {/* Facebook Icon */}
              </a>
              <a href="#" className="social">
                <i className="fab fa-google-plus-g"></i> {/* Google Icon */}
              </a>
              <a href="#" className="social">
                <i className="fab fa-linkedin-in"></i> {/* LinkedIn Icon */}
              </a>
            </div>

            <span className="LoginSignup-span">
              or use your email for registration
            </span>
            <input
              className="LoginSignup-input"
              type="text"
              name = "name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required ={ true}
            />
            <input
              className="LoginSignup-input"
              name = "email"
              type="email"
              value={formData.email}
              placeholder="Email"
              onChange={handleChange}
              required ={ true}
            />
            <input
              className="LoginSignup-input"
              name = "password"
              type="password"
              value={formData.password}
              placeholder="Password"
              onChange={handleChange}
              required ={ true}
            />
            <button className="LoginSignup-button">Sign Up</button>
          </form>
        </div>

        <div className="form-container sign-in-container">
          <form className="LoginSignup-form" action="#" onSubmit={handleLoginSubmit}>
            <h1 LoginSignup-h1>Sign in</h1>
            <div className="social-container">
              <a href="#" className="social LoginSignup-a">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="social LoginSignup-a">
                <i className="fab fa-google-plus-g"></i>
              </a>
              <a href="#" className="social LoginSignup-a">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
            <span className="LoginSignup-span">or use your account</span>
            <input
              className="LoginSignup-input"
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleloginData }
              value={LoginData.email}
              required ={ true}
            />
            <input
              className="LoginSignup-input"
              type="password"
              placeholder="Password"
              name="password"
              value={LoginData.password}
              onChange={handleloginData}
              required ={ true}
            />
            <a className="LoginSignup-a" href="#">
              Forgot your password?
            </a>
            <button className="LoginSignup-button">Sign In</button>
          </form>
        </div>

        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1 LoginSignup-h1>Welcome Back!</h1>
              <p className="LoginSignup-p">
                To keep connected with us please login with your personal info
              </p>
              <button
                className="ghost LoginSignup-button"
                onClick={handleSignInClick}
                id="signIn"
              >
                Sign In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1 className="LoginSignup-h1">Hello, Friend!</h1>
              <p className="LoginSignup-p">
                Enter your personal details and start your journey with us
              </p>
              <button
                className="ghost LoginSignup-button"
                onClick={handleSignUpClick}
                id="signUp"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </body>)}
    </>
  );
};

export default LoginSignup;
