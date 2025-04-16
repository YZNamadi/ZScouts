exports.verify = (fullname, link) => {
    return `
<!DOCTYPE html>
<html lang="en">
 
<head>
   <meta charset="UTF-8">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>Document</title>
   <style>
       * {
           padding: 0;
           margin: 0;
           box-sizing: border-box;
       }

       .email_body {
           width: 100%;
           height: 100vh;
           display: flex;
           align-items: center;
           justify-content: center;
       }

       .email_wrapper {
           width: 50%;
           height: 75%;
           border-radius: 20px;
           display: flex;
           justify-content: center;
           align-items: center;
           box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
       }

       .wrapper_container {
           width: 90%;
           height: 90%;
       }

       .email_header {
           width: 100%;
           height: 10%;
       }

       .app_logo {
           width: 15%;
           height: 50%;

           & img {
               width: 100%;
               height: 100%;
               object-fit: contain;
           }
       }

       .wrapper_content {
           width: 100%;
           height: 70%;
           display: flex;
           flex-direction: column;
           justify-content: space-around;
       }

       .user_name {
           color: #6FD82B;
           font-family: "Poppins", sans-serif;
           font-size: 20px;
           font-style: normal;
           font-weight: 700;
           line-height: 30px;
       }

       .wrapper_content h3 {
           color: #333;
           font-family: "Poppins", sans-serif;
           font-size: 18px;
           font-style: normal;
           font-weight: 400;
           line-height: 24px;
       }

       .verify {
           width: 120px;
           height: 50px;
           border: none;
           border-radius: 10px;
           color: white;
           background-color: #6FD82B;
       }

       .wrapper_footer {
           width: 100%;
           height: 20%;
           display: flex;
           flex-direction: column;
           justify-content: space-between;
       }

       .wrapper_footer p {
           color: #333;
           font-family: "Poppins", sans-serif;
           font-size: 16px;
           font-style: normal;
           font-weight: 400;
           line-height: 24px;
       }

       .wrapper_footer h4 {
           color: #07232F;
           font-family: "Poppins", sans-serif;
           font-size: 20px;
           font-style: normal;
           font-weight: 700;
           line-height: 30px;
       }
   </style>
</head>

<body class="email_body">
   <div class="email_wrapper">
       <div class="wrapper_container">
           <div class="email_header">
            
               <div class="app_logo">
                   <img src="https://res.cloudinary.com/dihonf8ai/image/upload/v1744131034/logo_k5aihj.png "alt="Zscouts Logo">
               </div>
           </div>
           <div class="wrapper_content">
               <h4 class="user_name">${firstname}</h4>
               <h3>Welcome to ZScouts!
                   You’re just one step away from unlocking your football journey.
               </h3>
               <h3>Click the button below to verify your email and activate your account:
               </h3>
               <button class="verify"><a href='${link}'>Verify Account</a></button>
           </div>
           <div class="wrapper_footer">
               <p>If you didn’t sign up for ZScouts, please ignore this email.</p>
               <h4>The ZScouts Team</h4>
           </div>
       </div>
   </div>
</body>

</html>
   
    `
}