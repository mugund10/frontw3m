import React, { useState } from "react";
import { ethers } from "ethers";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import { Container as ContainerBase } from "components/misc/Layouts";
import tw from "twin.macro";
import styled from "styled-components";
import illustration from "images/login-illustration.svg";
import logo from "images/logo.svg";
import { ReactComponent as LoginIcon } from "feather-icons/dist/icons/log-in.svg";
import { useHistory } from "react-router-dom";
//import axios from "axios"


const Container = tw(ContainerBase)`min-h-screen bg-primary-900 text-white font-medium flex justify-center -m-8`;
const Content = tw.div`max-w-screen-xl m-0 sm:mx-20 sm:my-16 bg-white text-gray-900 shadow sm:rounded-lg flex justify-center flex-1`;
const MainContainer = tw.div`lg:w-1/2 xl:w-5/12 p-6 sm:p-12`;
const LogoLink = tw.a``;
const LogoImage = tw.img`h-12 mx-auto`;
const MainContent = tw.div`mt-12 flex flex-col items-center`;
const Heading = tw.h1`text-2xl xl:text-3xl font-extrabold`;
const FormContainer = tw.div`w-full flex-1 mt-8`;


const SocialButtonsContainer = tw.div`flex flex-col items-center`;
const SocialButton = styled.a`
  ${tw`w-full max-w-xs font-semibold rounded-lg py-3 border text-gray-900 bg-gray-100 hocus:bg-gray-200 hocus:border-gray-400 flex items-center justify-center transition-all duration-300 focus:outline-none focus:shadow-outline text-sm mt-5 first:mt-0`}
  .iconContainer {
    ${tw`bg-white p-2 rounded-full`}
  }
  .icon {
    ${tw`w-4`}
  }
  .text {
    ${tw`ml-4`}
  }
`;

const DividerTextContainer = tw.div`my-12 border-b text-center relative`;
const DividerText = tw.div`leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform -translate-y-1/2 absolute inset-x-0 top-1/2 bg-transparent`;

const Form = tw.div`mx-auto max-w-xs`;
const Input = tw.input`w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5 first:mt-0`;
const SubmitButton = styled.button`
  ${tw`mt-5 tracking-wide font-semibold bg-primary-500 text-gray-100 w-full py-4 rounded-lg hover:bg-primary-900 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none`}
  .icon {
    ${tw`w-6 h-6 -ml-2`}
  }
  .text {
    ${tw`ml-3`}
  }
`;
const IllustrationContainer = tw.div`sm:rounded-r-lg flex-1 bg-purple-100 text-center hidden lg:flex justify-center`;
const IllustrationImage = styled.div`
  ${props => `background-image: url("${props.imageSrc}");`}
  ${tw`m-12 xl:m-16 w-full max-w-sm bg-contain bg-center bg-no-repeat`}
`;

export default ({
  
  logoLinkUrl = "#",
  illustrationImageSrc = illustration,
  headingText = "Sign In To W3",
  submitButtonText = "Sign In",
  SubmitButtonIcon = LoginIcon,
  forgotPasswordUrl = "#",
  signupUrl = "#",

}) => {
  const history = useHistory()
  const [data, setdata] = useState({
    address: "",
    Balance: null,
  });

  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  
  // Button handler button for handling a
  // request event for metamask
  const btnhandler = () => {
  
    // Asking if metamask is already present or not
    if (window.ethereum) {
  
    // res[0] for fetching a first wallet
    window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then((res) => accountChangeHandler(res[0]));
    } else {
    alert("install metamask extension!!");
    }
    
  };
  
  // getbalance function for getting a balance in
  // a right format with help of ethers
  const getbalance = (address) => {
  
    // Requesting balance method
    window.ethereum
    .request({
      method: "eth_getBalance",
      params: [address, "latest"]
    })
    .then((balance) => {
      // Setting balance
      // setdata({
      // Balance: ethers.utils.formatEther(balance),
      // });
      setdata((prev) => ({
        ...prev,
        Balance: ethers.utils.formatEther(balance)
      }))
    });
  };
  
  // Function for getting handling all events
  const accountChangeHandler = (account) => {
    // Setting an address data
    // setdata({
    // address: ethers.utils.formatEther(account),
    // });
    setdata((prev) => ({
      ...prev,
      address: account,
  
    }))
     //history.push('\IthirajPage')
    history.push('/appp')
    // Setting a balance
    getbalance(account);
  };

  async function login(){
    let item={email,password};
    let result = await fetch("http://34.220.125.123:8080/api/v1/signin",{
      method: "POST",
      // headers: {
      //   "Content-Type": "application/json",
      //   "Accept": 'application/json'
      // },
      body: JSON.stringify(item)

    });
       console.log("before", result)
       result = await result.json();
       console.log("after", result.payload.token)
       localStorage.setItem('token', result.payload.token)
      if (result?.payload?.token?.length > 0){
        history.push('\ithi')
      }
  }

  return(<AnimationRevealPage>
    <Container>
      <Content>
        <MainContainer>
          <LogoLink href={logoLinkUrl}>
            <LogoImage src={logo} />
          </LogoLink>
          <MainContent>
            <Heading>{headingText}</Heading>
            <FormContainer>
              <SocialButtonsContainer>
                  <SocialButton onClick={btnhandler}>Using Wallet
                    {/* <span className="text">WALLET</span> */}
                  </SocialButton>
              </SocialButtonsContainer>
              <DividerTextContainer>
                <DividerText><span className="text">Or Sign In With Email</span></DividerText>
              </DividerTextContainer>
              <Form>
                <Input type="email" placeholder="Email" onChange={(e)=>setEmail(e.target.value)} />
                <Input type="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)} />
                
                {/* <button onClick={login} className="btn btn-primary">SignIn</button> */}
                
                <SubmitButton type="submit" onClick={login}>
                  <SubmitButtonIcon className="icon" />
                  <span className="text">{submitButtonText}</span>
                </SubmitButton>


              </Form>
              {/* <p tw="mt-6 text-xs text-gray-600 text-center">
                <a href={forgotPasswordUrl} tw="border-b border-gray-500 border-dotted">
                  Forgot Password ?
                </a>
              </p> */}
              {/* <p tw="mt-8 text-sm text-gray-600 text-center">
                Dont have an account?{" "}
                <a href={signupUrl} tw="border-b border-gray-500 border-dotted">
                  Sign Up
                </a>
              </p> */}
            </FormContainer>
          </MainContent>
        </MainContainer>
        <IllustrationContainer>
          <IllustrationImage imageSrc={illustrationImageSrc} />
        </IllustrationContainer>
      </Content>
    </Container>
  </AnimationRevealPage>)
};
