import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import { Container as ContainerBase } from "components/misc/Layouts";
import tw from "twin.macro";
import logo from "images/logo.svg";
import { Button, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useHistory } from "react-router-dom";

const Container = tw(
  ContainerBase
)`min-h-screen bg-primary-900 text-white font-medium flex justify-center -m-8`;
const Content = tw.div`max-w-screen-xl m-0 sm:mx-20 sm:my-16 bg-white text-gray-900 shadow sm:rounded-lg flex justify-center flex-1`;
const MainContainer = tw.div`lg:w-1/2 xl:w-5/12 p-6 sm:p-12`;
const LogoLink = tw.a``;
const LogoImage = tw.img`h-12 mx-auto`;
const MainContent = tw.div`mt-12 flex flex-col items-center`;
const Heading = tw.h1`text-2xl xl:text-3xl font-extrabold`;

export default ({ logoLinkUrl = "#", headingText = "WELCOME " }) => {
  const [data, setdata] = useState({
    address: "",
    Balance: null,
  });

  const history = useHistory();

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
        params: [address, "latest"],
      })
      .then((balance) => {
        // Setting balance
        // setdata({
        // Balance: ethers.utils.formatEther(balance),
        // });
        setdata((prev) => ({
          ...prev,
          Balance: ethers.utils.formatEther(balance),
        }));
        getFlow(address);
      });

    // forward();
  };

  // Function for getting handling all events
  const accountChangeHandler = (account) => {
    // Setting an address data
    // setdata({
    // address: ethers.utils.formatEther(account),
    console.log("account", account);
    // });
    setdata((prev) => ({
      ...prev,
      address: account,
    }));
    // Setting a balance
    getbalance(account);
  };

  const getFlow = async (address) => {
    let result = await fetch(
      `http://34.220.125.123:8080/api/v1/flow?wallet_address=${address}`,
      {
        method: "get",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    console.log("result", result);
    const flow = await result.json();
    console.log("result after", flow);
    if (flow?.payload?.message) {
      const signmsg = await signMessage(flow?.payload?.message);
      console.log("signmsg", signmsg.signature);
      if (signmsg?.signature) {
        await authWallet({
          flow_id: flow?.payload?.flow,
          signature: signmsg?.signature,
        });
      }
    }
  };

  const signMessage = async (message) => {
    try {
      console.log(message);
      if (!window.ethereum)
        throw new Error("No crypto wallet found. Please install it.");

      await window.ethereum.send("eth_requestAccounts");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const signature = await signer.signMessage(message);
      const address = await signer.getAddress();

      return {
        message,
        signature,
        address,
      };
    } catch (err) {
      console.log(err?.message);
    }
  };

  const authWallet = async (data) => {
	console.log("data", data)
  forward()
	let result = await fetch(
		`http://34.220.125.123:8080/api/v1/authwallet?signature=${data.signature}&flow_id=${data.flow_id}`,
		{
			method: "get",
			headers: {
			  Authorization: `Bearer ${localStorage.getItem("token")}`,
			// Authorization: `Bearer v2.public.eyJhdWQiOiJsYXphcnVzIG5ldHdvcmsgdXNlcnMiLCJleHAiOiIyMDIyLTA2LTMwVDE3OjI3OjMzWiIsImlhdCI6IjIwMjItMDYtMjNUMTc6Mjc6MzNaIiwiaXNzIjoibGF6YXJ1cy5uZXR3b3JrIiwic3ViIjoibXVndUBtYWlsLmNvbSIsIndhbGxldF9hZGRyZXNzIjoiIiwid2FsbGV0X2Nvbm5lY3RlZCI6ImZhbHNlIn3llw0_7KQx_NYk7e8OdvJ-i4nJerN63vH_ajvBmF3N0mrC2TIbftKem2Knn_Kl6J5bte3-smBPD80tdr7MZXwA.bnVsbA`,
			},
		//   body: JSON.stringify({
		// 	flow_id:"4d50be1a-9d0c-4313-bd66-a3fa41e207ac",
		// 	signature:"0xe87a4cbeb2e29a7a19adbcf845381adbe171ce30e6eda5803f3d99063306d32721a63f991acdc945c0e1be9d984d568cf2bde10bd5d19ebb4a085df97a3f94781b"
		// })
		// body: JSON.stringify({
		// 	flow_id:data.flow_id,
		// 	signature:data.signature
		// })
    // body: JSON.stringif
		}
	  );
if(result) {
  const flow = await result?.json();
  console.log("flow", flow)
  localStorage.setItem('token', flow)
  // if(flow?.status == "sucess") {
  // forward()
  // }
}
  };

  const forward = () => {
    history.push("/appp");
  };

  return (
    <AnimationRevealPage>
      <Container>
        <Content>
          <MainContainer>
            <LogoLink href={logoLinkUrl}>
              <LogoImage src={logo} />
            </LogoLink>
            <MainContent>
              <Heading>{headingText}</Heading>
              <p>CONNECT YOUR WALLET TO CONTINUE</p>

              <div className="App">
                {/* Calling all values which we
	have stored in usestate */}

                <Button onClick={btnhandler} variant="primary">
                  {data.address.length > 0 ? "Connected" : "Connect"}
                </Button>
              </div>
            </MainContent>
          </MainContainer>
        </Content>
      </Container>
    </AnimationRevealPage>
  );
};
