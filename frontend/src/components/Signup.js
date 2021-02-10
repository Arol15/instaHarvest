import { useForm } from "react-hook-form"
// import config from "../config"

const Signup = () => {
    const { register, handleSubmit } = useForm(); 

    const onSubmit = (data) => {
        console.log(data)
        fetch("/api/auth/signup", {
            method: "POST", 
            headers: {
                "Content-Type": "application/json", 
            }, 
            body: JSON.stringify(data)
        })
        .then((res) => {
            console.log(res)
            return res.json()
        })
        .then((data) => {
            console.log(data)
        })
    }

    return(
       <form onSubmit={handleSubmit(onSubmit)}>
           <input type="text" placeholder="Username" name="username" ref={register}/>
           <input type="text" placeholder="First Name" name="first_name" ref={register}/>
           <input type="text" placeholder="Last Name" name="last_name" ref={register}/>
           <input type="text" placeholder="Email" name="email" ref={register}/>
           <input type="password" placeholder="Password" name="password" ref={register}/>
           <input type="text" placeholder="State" name="state" ref={register}/>
           <input type="text" placeholder="City" name="city" ref={register}/>
           <input type="text" placeholder="Image" name="image_url" ref={register} />
           <input type= "text" placeholder="User Role" name="user_role" ref={register} /> 
           <input type= "text" placeholder="User Role" name="address" ref={register} /> 
           <input type= "text" placeholder="Longitude" name="lgt" ref={register} /> 
           <input type= "text" placeholder="Latitude" name="lat" ref={register} /> 
           <input type= "text" placeholder="User Role" name="zip_code" ref={register} /> 

           <input type="submit" />
       </form>
    )
}

export default Signup;