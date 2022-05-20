import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import { Container as ContainerBase } from "components/misc/Layouts";
import tw from "twin.macro";
import logo from "images/logo.svg";

const Container = tw(ContainerBase)`min-h-screen bg-primary-900 text-white font-medium flex justify-center -m-8`;
const Content = tw.div`max-w-screen-xl m-0 sm:mx-20 sm:my-16 bg-white text-gray-900 shadow sm:rounded-lg flex justify-center flex-1`;
const MainContainer = tw.div`lg:w-1/2 xl:w-5/12 p-6 sm:p-12`;
const LogoLink = tw.a``;
const LogoImage = tw.img`h-12 mx-auto`;
const MainContent = tw.div`mt-12 flex flex-col items-center`;
const Heading = tw.h1`text-2xl xl:text-3xl font-extrabold`;

export default ({
  logoLinkUrl = "#",
  headingText = "Success Login",
}) => {

  const [data, setdata] = useState({
    address: "",
    Balance: null,
  });
  
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

  useEffect(() => {
    (async() => await btnhandler())()
    console.log("hello")
  }, [])
  
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
    // Setting a balance
    getbalance(account);
  };

  return(<AnimationRevealPage>
    <Container>
      <Content>
        <MainContainer>
          <LogoLink href={logoLinkUrl}>
            <LogoImage src={logo} />
          </LogoLink>
          <MainContent>
            <Heading>{headingText}</Heading>
            {data.address}
          </MainContent>
        </MainContainer>
      </Content>
    </Container>
  </AnimationRevealPage>)
};
