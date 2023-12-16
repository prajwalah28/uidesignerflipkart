/* Function to Fetch Chats from backend */
function fetchChats(){
    fetch("https://my-json-server.typicode.com/codebuds-fk/chat/chats")
                        .then((response)=>{
                                return response.json();
                        }).then((response)=>{
                            let listOfChats = response;
                            /* Store All Chats in local storage  for future use */
                            localStorage.setItem("chatList",JSON.stringify(listOfChats));
                            displayListOfChats(listOfChats);
                            

                        }).catch(error=>{
                            console.log(error);
                        })
        
}

/* Fetch All Chats */
fetchChats();


/* Handle click event for selection of single chat from the list  */
function selectChat(){
        let chatList = JSON.parse(localStorage.getItem("chatList"));
        let chatItem = chatList.find(({id}) =>id==this.id);
        displaySpecificChatMessage(chatItem.messageList,this.id,chatItem.title);
}

/* Display all the messages of a specifc chat */
function displaySpecificChatMessage(chatMessageList,id,chatTitle) {

        let chatLogs = document.querySelector('.chat-logs')


        let isChatHeading = document.querySelector('.chat-heading')

        if(isChatHeading==null) {
            let chatheading = document.createElement('h2');
            chatheading.setAttribute('class','chat-heading')
            chatheading.innerText = chatTitle;
            chatLogs.appendChild(chatheading);
        }else{
            isChatHeading.innerText = chatTitle;
        }

        let specifcChatSection = document.querySelector('.specifc-chat-section')
        
        if(specifcChatSection==null) {
            specificChatList = document.createElement('specifc-chat-section')
            specificChatList.setAttribute('class','specifc-chat-section')
            specificChatList.setAttribute('id',id)
        }
        else{
            let inputSec =  document.querySelector('.chat-text-area')
            let sentButton =  document.querySelector('.send-button')
            specifcChatSection.remove()
            sentButton.remove()
            inputSec.remove()
            specificChatList = document.createElement('specifc-chat-section')
            specificChatList.setAttribute('class','specifc-chat-section')
            specificChatList.setAttribute('id',id)
        }

        chatMessageList.forEach(chatMessage =>{

            let messageBlock = document.createElement('section')

           
            let message = document.createElement('div')
            let messageTime = document.createElement('div')
            message.innerText = chatMessage.message;

            let formatedTime = new Date(chatMessage.timestamp);

            messageTime.innerText = formatedTime.toLocaleTimeString()

            messageBlock.appendChild(message);
            messageBlock.appendChild(messageTime);
            messageBlock.setAttribute('class','single-message');

            if(chatMessage.options){
                chatMessage.options.forEach(function(option){
                    let op = document.createElement("div");
                    op.innerText = option.optionText
                    op.setAttribute('class','message-options')
                    messageBlock.appendChild(op)
                    if(option.optionSubText){
                        let optionSubText = document.createElement("div");
                        optionSubText.innerText = option.optionSubText
                        optionSubText.setAttribute('class','message-sub-options');
                        messageBlock.appendChild(optionSubText)
                    }

                })
            }

            if(chatMessage.sender=="BOT"){
               
            }else{
                messageBlock.setAttribute("class","aligh-chat-left");
            }
            specificChatList.appendChild(messageBlock);
            chatLogs.appendChild(specificChatList);

           
        })

        
        let inputSection = document.createElement("textarea")
        inputSection.setAttribute("class","chat-text-area")
        inputSection.setAttribute("placeholder","Type a message")
        let sendButton = document.createElement("button")
        sendButton.innerText = "Send"
        sendButton.setAttribute("class","send-button")
        /* Adding click event for a new message  additon to the chat */
        sendButton.onclick = addMessage
        chatLogs.appendChild(inputSection)
        chatLogs.append(sendButton)  
}

/* Adds a new message to the chat */
function addMessage(){

    let msg = document.querySelector(".chat-text-area")

    const element = document.querySelector("specifc-chat-section")   

    let messageBlock = document.createElement('section')
    messageBlock.setAttribute("class","aligh-chat-left");
           
    let message = document.createElement('div')
    let messageTime = document.createElement('div')
    message.innerText = msg.value
    
    let formatedTime = new Date().toLocaleTimeString(); 

    messageTime.innerText =formatedTime;
    messageBlock.appendChild(message);
    messageBlock.appendChild(messageTime);

    element.append(messageBlock)
    
}


 /* Display All Chats in a list view  */
function  displayListOfChats(listOfChats) {

        let chatSection = document.querySelector('.chat-list');

        let chatListItem = document.querySelector('chat-item-list')

        let chatList = ""
        if(chatListItem==null) {
            chatList = document.createElement('chat-item-list')
            chatList.setAttribute('class','chat-item-list')
        }
        else{
            chatListItem.remove()
            chatList = document.createElement('chat-item-list')
            chatList.setAttribute('class','chat-item-list')
        }


        listOfChats.forEach((chat)=>{

                let singleChatBlock = createChatBlock(chat);
                singleChatBlock.setAttribute('id',chat.id);
                singleChatBlock.setAttribute('class',"chat-block-summary")
                chatList.appendChild(singleChatBlock);
                let br = document.createElement('br');
                chatList.appendChild(br);
                /* Adding click event for selecting a single chat */
                singleChatBlock.onclick = selectChat

        })
        chatSection.appendChild(chatList);
}

/* Create a chat block for chat list with summary having  Product Image, Chat Title, Order ID, Date in DD/MM/YYYY format of the last message */
function createChatBlock(chat) {
    let chatBox = document.createElement('section');

    let imageSpan = document.createElement('span');

    let imageTag = document.createElement('img');
    imageTag.setAttribute('src', chat.imageURL);
    imageTag.setAttribute('width','50px');
    imageTag.setAttribute('height','50px');
    imageTag.setAttribute('class',"image-item")

    imageSpan.appendChild(imageTag)



    let titleSpanText = document.createElement('span');
    titleSpanText.innerText = chat.title;


    let formatedTime =convertDate(chat.latestMessageTimestamp);
          
    let spanTextDate = document.createElement('span');
    spanTextDate.innerText =formatedTime;
    spanTextDate.setAttribute('class','item-date')

    let orderDiv = document.createElement('div');
    orderDiv.innerText = "Order "+chat.orderId;
    orderDiv.setAttribute('class','order-item')

    let lastMessage = document.createElement('div');
    if(chat.messageList.length > 0) {
        lastMessage.innerText = chat.messageList[0].message;
        lastMessage.setAttribute('class','order-item')
    }
   chatBox.appendChild(imageSpan)
   chatBox.appendChild(titleSpanText)
   chatBox.appendChild(spanTextDate)
   chatBox.appendChild(orderDiv)
   chatBox.appendChild(lastMessage)
   return chatBox;
}

/* Event used for searching a chat using order ID and chat title */
function searchChat(){
    let searchText = document.querySelector(".search-filter")
    filterChat(searchText.value.toLowerCase())
}

/* Filter util fucntion for filterind chat based on  order ID and chat title */
function filterChat(searchText){

    let chatList = JSON.parse(localStorage.getItem("chatList"));
    chatList =chatList.filter(chat =>{
        if(chat.title.toLowerCase().indexOf(searchText)>-1 || chat.orderId.toLowerCase().indexOf(searchText)>-1){
            return chat
        }
    })
    /* Display the latest newly added chat in the UI */
    displayListOfChats(chatList);



}

/* Util function to convert data in a specfic format */
function convertDate(inputFormat) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date(inputFormat)
    return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/')
  }