import { SENDER_TYPE } from "./constants";

export const dummyActivitiesData = [
    {
      id: "1",
      text: "Please submit your academic transcripts by end of this week.",
      sender: SENDER_TYPE.COUNSELOR,
      dateCreated: new Date(2024, 10, 15),
    },
    {
      id: "2",
      text: "I've uploaded my transcripts. Please review them.",
      sender: SENDER_TYPE.STUDENT,
      dateCreated: new Date(2024, 10, 15),
    },
    {
      id: "3",
      text: "Also, please submit your recommendation letters.",
      sender: SENDER_TYPE.COUNSELOR,
      dateCreated: new Date(2024, 10, 15),
    },
    {
      id: "4",
      text: "Your transcripts look good. Please proceed with the application form.",
      sender: SENDER_TYPE.COUNSELOR,
      dateCreated: new Date(2024, 10, 16),
    },      
    {
      id: "5",
      text: "I've completed the application form and submitted it.",
      sender: SENDER_TYPE.STUDENT,
      dateCreated: new Date(2024, 10, 14),
    },
    {
      id: "6",
      text: "Great! I'll review your application and get back to you soon.",
      sender: SENDER_TYPE.COUNSELOR,
      dateCreated: new Date(2024, 10, 13),
    },
    {
      id: "7",
      text: "Please submit your updated resume by tomorrow.",
      sender: SENDER_TYPE.COUNSELOR,
      dateCreated: new Date(2024, 10, 13),
    },
  ];

  export const realMessageObj = [];




  // const messageObj = {
  //   date: '',
  //   message: '',
  //   sender: '',
  //   senderId: '',
  //   recieverId: '',
  // };


  // const messages = {
  //   senderId: '',
  //   counselorId: '',
  //   messages: [
  //     messageObj, messageObj
  //   ];
  // };