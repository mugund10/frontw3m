import React, { useEffect, useContext, useState } from "react";
import EmailContext from "../context/email/emailContext"

// Import Components
import MailboxList from "../Components/MailboxList/MailboxList";
import EmailList from "../Components/EmailList/EmailList";
import Email from "../Components/Email/Email";

import { Flex } from "@chakra-ui/core";

const Main = () => {
  const { getMessages } = useContext(EmailContext);
  const [mailList, setMailList] = useState([])
  const [selMail, setSelMail] = useState({})

  const fetchMail = async() => {
	let result = await fetch(
		`http://34.220.125.123:8080/api/v1/mail`,
		{
			method: "get",
			headers: {
			  Authorization: `Bearer ${localStorage.getItem("token")}`,
			// Authorization: `Bearer v2.public.eyJhdWQiOiJsYXphcnVzIG5ldHdvcmsgdXNlcnMiLCJleHAiOiIyMDIyLTA2LTMwVDIyOjQ3OjU5WiIsImlhdCI6IjIwMjItMDYtMjNUMjI6NDc6NTlaIiwiaXNzIjoibGF6YXJ1cy5uZXR3b3JrIiwic3ViIjoibXVndW5kaGFuQG1haWxzZXJ2ZXJzZWcubWwiLCJ3YWxsZXRfYWRkcmVzcyI6IiIsIndhbGxldF9jb25uZWN0ZWQiOiJmYWxzZSJ9rr1Axc8N5VcDCmAMg_hwghgmyhjZ2NQnA12IdElg2933c7uIl-ytP6qLGsda8b0ajYeFooqzDNmoay8-MrNDAg.bnVsbA`,
			},
		}
	  );

	  const flow = await result.json();
    console.log("flow", flow)
    if(Array.isArray(flow.payload)) {
      setMailList(flow.payload)
    }
	  // localStorage.setItem('token', flow)
  }

  useEffect(() => {
    // getMessages();
    fetchMail()
    // eslint-disable-next-line
  }, []);

  return (
    <Flex
      h='100vh'
      minH='600px'
      justify='space-arround'
      wrap='no-wrap'
      p='1em'
      bg='#3C0D99'
      color='white'
    >
      <MailboxList /> 
      <EmailList mailList={mailList} setSelMail={setSelMail}/>
      <Email selMail={selMail} mailList={mailList}/>
    </Flex>
  );
};

export default Main;
