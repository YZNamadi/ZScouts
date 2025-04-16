exports.reset = (firstName, link) => {
    return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Zscouts Email Verification</title>

    <style>
*{
    padding: 0;
    margin: 0;
    box-sizing: border-box;
}

.email_body{
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.email_wrapper{
    width: 50%;
    height: 65%;
    border-radius: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
}
.wrapper_container{
    width: 90%;
    height: 90%;
}

.email_header{
    width: 100%;
    height: 10%;
}
.app_logo{
    width: 15%;
    height: 50%;

    & img{
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
}

.wrapper_content{
    width: 100%;
    height: 60%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
}

.user_name{
    color: #6FD82B;
    font-family: "Poppins", sans-serif;
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: 30px; 
}
.wrapper_content h3{
    color: var(--Colors-Neutral-1000, #333);
    font-family: "Poppins", sans-serif;
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px;
    /* width: 70%; */
}

.verify{
    width: 150px;
    height: 45px;
    border: none;
    border-radius: 10px;
    color: white;
    background-color: #6FD82B;
}
.wrapper_footer{
    width: 100%;
    height: 30%;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.wrapper_footer p{
    color: #333;
    font-family: "Poppins", sans-serif;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px;
    width: 70%; 
}
.wrapper_footer h4{
    color:#07232F;
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
                    <img src="https://res.cloudinary.com/dihonf8ai/image/upload/v1744131034/logo_k5aihj.png " alt="Zscouts Logo">
                </div>
            </div>
            <div class="wrapper_content">
                <h4 class="user_name">${firstName}</h4>
                <h3>Forgot your password? No worries! 
                    Click the button below to set a new one and get back in the game.
                </h3>
                <button class="verify"><a href='${link}'>Reset Password<a></button>
            </div>
            <div class="wrapper_footer">
                <p>If you didn’t request this, you can safely ignore this email. Your account is secure.</p>
                <h4>The ZScouts Team</h4>
            </div>
        </div>
    </div>
</body>
</html>
    `
}