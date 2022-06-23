import React, { Fragment } from "react";
import { Base64 } from "js-base64";
import { BsPlusCircle } from "react-icons/bs";
import { useState, useRef } from "react";
import { ethers } from "ethers";
//import ErrorMessage from "./ErrorMessage";
import SignMessage from "./SignMessage";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  FormControl,
  Textarea,
  useToast,
  useDisclosure,
} from "@chakra-ui/core";
import { black } from "tailwindcss/colors";
import Login from "pages/Login";

const signMessage = async ({ setError, message }) => {
  try {
    console.log({ message });
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
      address
    };
  } catch (err) {
    setError(err.message);
  }
};


const SendModel = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const resultBox = useRef();
  const [signatures, setSignatures] = useState([]);
  const [error, setError] = useState();
  const [message, setMessage] = useState()

  const handleSign = async (e) => {
    e.preventDefault();
    // const data = new FormData(e.target);
    console.log("data", message)
    setError();
    const sig = await signMessage({
      setError,
      message
    });
    if (sig) {
      setSignatures([...signatures, sig]);
    }
    
  };
  
  const onChange = (e) => {
    const { name, value } = e.target
    setMessage(value)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const emailTo = form.elements["emailTo"].value;
    const subject = form.elements["subject"].value;
    const message = form.elements["message"].value;

    // Send Simple Mail && Display Toast
    sendMessage(
      {
        To: emailTo,
        Subject: subject,
      },
      message,
      displayToast
    );

    onClose();
  };

  const sendMessage = (headers_obj, message, callback) => {
    let email = "";

    for (var header in headers_obj)
      email += header += ": " + headers_obj[header] + "\r\n";

    email += "\r\n" + message;

    const base64EncodedEmail = Base64.encodeURI(email);
    const request = window.gapi.client.gmail.users.messages.send({
      userId: "me",
      resource: {
        raw: base64EncodedEmail,
      },
    });
    request.execute(callback);
  };

  const displayToast = ({ result }) => {
    if (result.labelIds.indexOf("SENT") !== -1) {
      toast({
        title: "Message Sent.",
        description: "We've Sent your email.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } else {
      toast({
        title: "An error occurred.",
        description: "Unable to sent your email.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <Fragment>
      <Button
        w='100%'
        h='48px'
        leftIcon={BsPlusCircle}
        borderRadius='20px'
        //variant='solid'
        variantColor='green'
        bg='#3C0D99'
        onClick={onOpen}
      >
        compose a msg
      </Button>
      <Modal
        isOpen={isOpen}
        size='xl'
        onClose={onClose}
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New Message</ModalHeader>
          <ModalCloseButton />
          <form id='form' onSubmit={handleSubmit}>
            <ModalBody>
              <FormControl isRequired>
                <Input
                  type='email'
                  id='emailTo'
                  placeholder='To'
                  aria-describedby='email-helper-text'
                />
              </FormControl>
              <FormControl isRequired>
                <Input
                  colour='black'
                  type='text'
                  id='subject'
                  placeholder='Subject'
                  aria-describedby='subject-email-helper-text'
                />
              </FormControl>

              <FormControl isRequired>
                <Textarea
                  // id='message'
                  minH='280px'
                  size='xl'
                  placeholder="Message"
                  value={message}
                  onChange={onChange}
                  aria-describedby='subject-email-helper-text'
                  // resize='vertical'
                />
              </FormControl>

             
                {/* <Textarea
                  id='message'
                  minH='280px'
                  size='xl'
                  resize='vertical'
                  
                /> */}
                {/* <SignMessage id='message' /> */}

                {signatures.map((sig, idx) => {
          // return (
          //   <div className="p-2" key={sig}>
          //     <div className="my-3">
          //       {/* <p>
          //         Message {idx + 1}: {sig.message}
          //       </p>
          //       <p>Signer: {sig.address}</p> */}
          //       {/* <textarea
                
          //         type="text"
          //         readOnly
          //         ref={resultBox}
          //         className="textarea w-full h-24 textarea-bordered focus:ring focus:outline-none"
          //         placeholder="Generated signature"
          //         value={sig.signature}
          //       /> */}
          //     </div>
          //   </div>
          // );
        })}
              

              
                
              
            </ModalBody>

            <ModalFooter>
              <Button type='reset' variantColor='blue' mr={3} onClick={onClose}>
                Close
              </Button>
              {/* <Button type='submit' variantColor='green'>
                Send
              </Button> */}
              <Button type='submit' variantColor='green'
            onClick={handleSign}
            // className="btn btn-primary submit-button focus:ring focus:outline-none w-full"
          >
            Sign message
          </Button>
          
              
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Fragment>
  );

  

};


export default SendModel;
