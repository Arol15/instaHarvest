import React from "react"; 
import { useForm } from "react-hook-form"


const Signup = () => {
    const { register, handleSubmit } = useForm(); 

    const onSubmit = (data) => {
        console.log(data)
    }

    return(
       <form onSubmit={handleSubmit(onSubmit)}>
           {/* <input type="text" placeholder="Username" name="username"/> */}
           <input type="text" placeholder="First Name" name="first_name" ref={register}/>
           <input type="text" placeholder="Email" name="email" ref={register}/>
           <input type="password" placeholder="Password" name="password" ref={register}/>
           <input type="text" placeholder="State" name="state" ref={register}/>
           <input type="text" placeholder="City" name="city" ref={register}/>
           <input type="submit" />
       </form>
    )
}

export default Signup;