import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import React, { createContext, useEffect, useState } from 'react';
import auth from '../component/firebase.init';
import axios from 'axios';




export let Context= createContext()

const AuthProvider = ({children}) => {

    let [user,setUser]=useState(null)
    const [loading,setLoading] = useState(true);

    let [darkmode,setdarkmode]=useState(true)

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

    const provider = new GoogleAuthProvider();
    let googleSign=()=>{
 
        return signInWithPopup(auth, provider)
    }
    
       
    
    
        let createRegistered = (email, password) => {
          return createUserWithEmailAndPassword(auth, email, password)
            .catch((error) => {
              // Log the error for debugging
              console.error('Firebase registration error:', error);
              
              // Re-throw the error so the component can handle it
              throw error;
            });
        }
    
        let loginSetup = (email, password) => {
          return signInWithEmailAndPassword(auth, email, password)
            .catch((error) => {
              // Log the error for debugging
              console.error('Firebase login error:', error);
              
              // Re-throw the error so the component can handle it
              throw error;
            });
        }
    
        let signOuts=()=>{
          
            return signOut(auth)
        }
        let updateUserProfile = (user, profileUpdates) => {
            return updateProfile(user, profileUpdates);
          };
    
          useEffect(()=>{
            let unsubscribe= onAuthStateChanged(auth, (currentUser) => {
                
                //   console.log(currentUser)
                  setUser(currentUser)
                  // setLoading(false)

                  if(currentUser){
                    let user={email:currentUser?.email}
        
                    axios.post("http://localhost:3000/jwt",user,{withCredentials:true})
                    .then(async res=>{

                      // console.log(res.data)
                   
                      setLoading(false)
                      // Fetch user role after successful login
                      try {
                        const adminCheck = await axios.get(`http://localhost:3000/users/admin/${currentUser.email}`, { withCredentials: true });
                        if (adminCheck.data.admin) {
                          setUser({...currentUser, role: "admin"});
                          return;
                        }
                        const executiveCheck = await axios.get(`http://localhost:3000/users/employee/${currentUser.email}`, { withCredentials: true });
                        if (executiveCheck.data.executives) {
                          setUser({...currentUser, role: "executives"});
                          return;
                        }
                        setUser({...currentUser, role: "user"}); // Default role if neither admin nor executive
                      } catch (roleError) {
                        console.error("Error fetching user role:", roleError);
                        setUser({...currentUser, role: "unknown"}); // Handle error gracefully
                      }
                    })
                   }
        
                   else{
                    axios.post("http://localhost:3000/logout",{},{withCredentials:true})
                    .then(res=>{
                   
                      setLoading(false)
                      setUser(null)
                    })
                   }
                
                
        
                return ()=>{
                    unsubscribe()
                }
                
              });
          },[])

          

  // Toggle Theme Function
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  // Apply Theme to <html> class
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);



  let handleMode=()=>{
    setdarkmode(!darkmode)
  }

  

    
        let val= {
             createRegistered,
             loginSetup,
             signOuts,
             googleSign,
             updateUserProfile,
             user,
             loading,
             theme,
             toggleTheme,
             handleMode,
             darkmode
    
        }
    

    return (
        <div>
             <Context.Provider value={val}>
                   {children}
            </Context.Provider>
        </div>
    );
};

export default AuthProvider;