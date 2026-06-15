export const sampleData = [
  {
    id: 1,
    parentId: -1,
    type: "trigger", // done
    data: {
      type: "conversationOpened",
      oncePerContact: false,
    },
  },
  {
    id: "b6a0c1",
    parentId: "28c4b9",
    name: "Away Message",
    type: "sendMessage", // done
    data: {
      payload: [
        {
          type: "text",
          text: "Sorry, we are currently away. We will respond as soon as possible.",
        },
      ],
    },
  },
  {
    id: "d09c08",
    parentId: 1,
    name: "Business Hours",
    type: "dateTime", // done
    data: {
      times: [
        {
          startTime: "09:00",
          endTime: "17:00",
          day: "mon",
        },
        {
          startTime: "09:00",
          endTime: "17:00",
          day: "tue",
        },
        {
          startTime: "09:00",
          endTime: "17:00",
          day: "wed",
        },
        {
          startTime: "09:00",
          endTime: "17:00",
          day: "thu",
        },
        {
          startTime: "09:00",
          endTime: "17:00",
          day: "fri",
        },
        {
          startTime: "09:00",
          endTime: "17:00",
          day: "sat",
        },
        {
          startTime: "09:00",
          endTime: "17:00",
          day: "sun",
        },
      ],
      connectors: ["161f52", "28c4b9"],
      timezone: "UTC",
      action: "businessHours",
    },
  },
  {
    id: "161f52",
    parentId: "d09c08",
    name: "Success",
    type: "dateTimeConnector", // done
    data: {
      connectorType: "success",
    },
  },
  {
    id: "28c4b9",
    parentId: "d09c08",
    name: "Failure",
    type: "dateTimeConnector", // done
    data: {
      connectorType: "failure",
    },
  },
  {
    id: "b0653a",
    parentId: "161f52",
    name: "Welcome Message",
    type: "sendMessage", // done
    data: {
      payload: [
        {
          type: "text",
          text: "Hello there\n\nwelcome to the chat!",
        },
        {
          type: "attachment",
          attachment:
            "https://fastly.picsum.photos/id/396/536/354.jpg?hmac=GmUosOuXb6nGkFhmTE-83i0ciQcaleMyvIyqzeFbW58",
        },
      ],
    },
  },
  {
    id: "e879e4",
    parentId: "b6a0c1",
    name: "Add Comment #1",
    type: "addComment",
    data: {
      comment: "User message during off hours",
    },
  },
]
