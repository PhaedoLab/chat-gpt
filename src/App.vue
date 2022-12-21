
<template>
  <div class="page-wrapper">
    <div class="msg-wrapper">
      <ul class="msg-list">
          <div class="msg-item" :class="{'user-bg':item.type === 'user'}" v-for="(item, idx) in arr" :key="idx">
            <template v-if="item.type === 'bot'">
              <div class="msg-title">
                <img class="bot" src="./assets/img/bot.svg" alt="">
                <span class="chat-txt1">Chatwallet</span>
                <span class="chat-txt2">OpenAI</span>
              </div>
              <div v-if="!item.loading && item.isSuccess" class="msg-content" v-html="item.content"></div>
              <div v-else-if="item.loading" class="snippet">
                <div class="stage">
                  <div class="dot-flashing"></div>
                </div>
              </div>
              <div class="error-b" v-else>
                <svg class="error-icon" width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M8.00008 1.83341C11.682 1.83341 14.6667 4.81818 14.6667 8.50008C14.6667 12.182 11.682 15.1667 8.00008 15.1667C4.31818 15.1667 1.33341 12.182 1.33341 8.50008C1.33341 4.81818 4.31818 1.83341 8.00008 1.83341ZM7.50008 9.83341L7.50008 5.16675L8.50008 5.16675L8.50008 9.83341L7.50008 9.83341ZM8.00008 10.5001C7.63189 10.5001 7.33341 10.7986 7.33341 11.1667C7.33341 11.5349 7.63189 11.8334 8.00008 11.8334C8.36827 11.8334 8.66675 11.5349 8.66675 11.1667C8.66675 10.7986 8.36827 10.5001 8.00008 10.5001Z" fill="white"/>
                </svg>
                <div class="error-txt">hmm...something went wrong. Please <span @click="tryAgain" class="try-txt">Try again.</span></div>

              </div>
            </template>
            <template v-else>
              <div class="msg-title">
                <img class="bot" src="./assets/img/user.svg" alt="">
                <span class="chat-txt3">Kuper</span>
              </div>
              <div class="user-content">{{item.content}}</div>
            </template>
          </div>
      </ul>
    </div>

    <div class="send-wrapper">
      <div class="send-inner">
        <input ref="inputRef" class="msg-input" type="text" v-model="msg" placeholder="Send message..." @keyup.enter="handleSent">
        <img class="call-icon" src="./assets/img/call.svg" alt="" @click="showDiag = true">
      </div>
    </div>

    <Diag v-if="showDiag" @close="showDiag = false" @ques="ques" :ques="ques_examples"/>
  </div>
</template>
<script setup>
import { ref, reactive } from 'vue';
import { localStorage, formatTimer } from "./assets/utils/index";
import { apiReq } from './assets/utils/openai'
import Diag from './components/Diag.vue'

const msg = ref('')
const inputRef = ref(null)

const showDiag = ref(false)

let chats = localStorage.get("chats2") || [{
  type:'bot',
  loading:false,
  isSuccess:true,
  content:'Hello, my friend. Welcome to the Web3 world. I am the Chatwallet bot. You can ask me anything about web3. And I will be your sincere companion during this exploration.',
  response:''
}]


const toBot = ()=>{
  // setTimeout(() => {    
  //   scroll.value.scrollTo({ left: 0, top: scroll.value.scrollHeight, behavior: "smooth" });
  // }, 100);
}
const arr = reactive(chats)

// input fields
const handleSent = e=>{
  const val = e.target.value;
  msg.value = '';

  inputRef.value && inputRef.value.blur()
    arr.push({
      type:'user',
      loading:false,
      content:val,
      response:val,
      stamp:new Date().getTime()
    })

  toBot()

  const cs = arr[arr.length-1]
  
  setTimeout(()=>{

    arr.push({
      type:'bot',
      loading:true,
      content:'',
      response:''
    })

    toBot()

  }, 500)
  

  localStorage.set("chats2", arr)


  const inputArr = val.toLowerCase().replace(/[|&;$%@"<>()+,?？]/g, '').split(' ');
  const findItem = initQues.value.findIndex(item=>{
    const ansArr = item.ques.toLowerCase().replace(/[|&;$%@"<>()+,?？]/g, '').split(' ');    
    return ansArr.every(i => inputArr.indexOf(i) !== -1)    
  });
  
  if(findItem !== -1){
    setTimeout(() => {
      const content = initQues.value[findItem].ans
      let lastDom = arr[arr.length-1]
      lastDom.loading = false
      lastDom.isSuccess = true
      lastDom.content = content  
      lastDom.response = content
      localStorage.set("chats2", arr)
      toBot()

    }, 1500);
    
    return 
  }


  
  apiReq(cs.response).then(res=>{
    if(res.status === 200){
      const resTxt = res.data.choices[0].text
      if(!resTxt.length){
        lastDom.loading = false
        lastDom.isSuccess = false  
        return
      }
      let lastDom = arr[arr.length-1]
      lastDom.loading = false
      lastDom.isSuccess = true
      lastDom.content = resTxt      
          .replace('？','')
          .replace('。','')
          .replace('.','')
          .replaceAll('\n', '<br/>')
          .replace('<br/><br/>', '\n\n')
      lastDom.response = resTxt
      localStorage.set("chats2", arr)
      toBot()
    }
  }).catch(err=>{
    let lastDom = arr[arr.length-1]
    lastDom.loading = false
    lastDom.isSuccess = false  
    return 
  })
}


// click questions list
const ques = e =>{
  showDiag.value = false
  arr.push({
    type:'user',
    loading:false,
    content:e,
    response:e,
    stamp:new Date().getTime()
  })

  toBot()

  const cs = arr[arr.length-1]

  setTimeout(()=>{
     arr.push({
      type:'bot',
      loading:true,
      content:'',
      response:''
    })

    toBot()

  }, 500)

  const findIdx = initQues.value.findIndex(i => i.ques.toLowerCase().indexOf(e.toLowerCase()) !== -1)  

  if(findIdx !== -1){
    setTimeout(() => {
      const content = initQues.value[findIdx].ans
      let lastDom = arr[arr.length-1]
      lastDom.loading = false
      lastDom.isSuccess = true
      lastDom.content = content  
      lastDom.response = content
      localStorage.set("chats2", arr)

      toBot()

    }, 1500);
    
    return 
  }

  apiReq(cs.response).then(res=>{
    if(res.status === 200){
      const resTxt = res.data.choices[0].text
      let lastDom = arr[arr.length-1]
      if(!resTxt.length){
        lastDom.loading = false
        lastDom.isSuccess = false  
        return
      }
      lastDom.loading = false
      lastDom.content = resTxt      
          .replace('？','')
          .replace('。','')
          .replace('.','')
          .replaceAll('\n', '<br/>')
          .replace('<br/><br/>', '\n\n')
      lastDom.response = resTxt
      localStorage.set("chats2", arr)

      toBot()

    }
  }).catch(err=>{
    let lastDom = arr[arr.length-1]
    lastDom.loading = false
    lastDom.isSuccess = false  
    return 
  })

}

const tryAgain = ()=>{
  inputRef.value && inputRef.value.focus()
}


const formatTime = t =>{
  const isToday = new Date().toDateString() === new Date(t).toDateString()
  if(isToday){
    return formatTimer(new Date(t), 'hh:mm')
  }else{
    return formatTimer(new Date(t), 'yyyy-MM-dd')
  }
}

const initQues = ref([])
const ques_examples = ref([])


// get all question database
const getQues = ()=>{
  window.fetch('https://chatbot.ingroup.chat/v1/qas')
  .then((response) => response.json())
  .then((data) => {
    initQues.value = data.data
    console.log(initQues.value)
    ques_examples.value = initQues.value.reduce((prev, cur)=> [...prev, cur.ques], [])
  });
}

getQues()



</script>

<style scoped lang="scss">
.time-div{
  display: flex;
  justify-content: center;
  padding-bottom: 14px;
  color: rgba(255, 255, 255, 0.5);
}
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.page-wrapper{
  position: relative;
  height: 100vh;
  overflow: hidden;
  background: radial-gradient(94.87% 50% at 50% 50%, rgba(9, 106, 105, 0.5) 0%, #096A69 86.87%), #B1FFF1;
}
.msg-wrapper{
  height:calc(100vh - 70px);
  
  overflow:auto;
  
}
::-webkit-scrollbar {
    width: 0px;
    background: transparent; /* make scrollbar transparent */
}
.msg-list{
  padding: 14px;  
  box-sizing: border-box;
  .msg-item{
    margin-bottom: 16px;
    padding: 15px;
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.02), rgba(0, 0, 0, 0.02)), rgba(255, 255, 255, 0.16);
    border: 0.5px solid rgba(255, 255, 255, 0.4);
    backdrop-filter: blur(4px);
    border-radius: 16px;
    color: #fff;
    font-size: 17px;
    line-height: 21px;
    &.user-bg{
      background: linear-gradient(0deg, rgba(33, 150, 83, 0.32), rgba(33, 150, 83, 0.32)), rgba(255, 255, 255, 0.2);
    }
    .msg-content{
      word-break: break-all;
    }
    .msg-title{
      display: flex;
      align-items: center;
      font-weight: 500;      
      padding-bottom: 12px;
      .chat-txt1{
        padding: 0 4px 0 8px;
        color: #fff;
      }
      .chat-txt2{
        color: rgba(255, 255, 255, 0.5);
      }
      .chat-txt3{
        color: rgba(255, 255, 255, 0.8);
        padding-left: 4px;
      }
    }
  }
}
.send-wrapper{
  position: fixed;
  bottom:0;
  left: 0;
  width: 100%;
  background: rgba(49, 49, 50, 0.7);
  backdrop-filter: blur(57.2707px);
  border-radius: 16px 16px 0px 0px;
  .send-inner{
    display: flex;
    justify-content: space-between;
    padding: 16px 20px 30px 20px;
    .msg-input{
      flex: 1;
      margin-right: 16px;
      border-radius: 16px;
      background: rgba(255, 255, 255, 0.16);
      outline: 0;
      border: 0.5px solid #fff;
      padding-left: 14px;
      color: #fff;
    }
    .call-icon{
      width: 32px;
      height: 32px;
    }
  }
}

.snippet{
  padding-top: 18px;
  padding-bottom: 7px;
}
.stage{
  display: flex;
  justify-content: center;
}
    

.dot-flashing {
    position: relative;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.2);
    color: rgba(255, 255, 255, 0.2);
    animation: dot-flashing 1s infinite linear alternate;
    animation-delay: 0.5s;
   }
   .dot-flashing::before, .dot-flashing::after {
    content: "";
    display: inline-block;
    position: absolute;
    top: 0;
   }
   .dot-flashing::before {
    left: -10px;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.2);
    color: rgba(255, 255, 255, 0.2);
    animation: dot-flashing 1s infinite alternate;
    animation-delay: 0s;
   }
   .dot-flashing::after {
    left: 10px;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.2);
    color: rgba(255, 255, 255, 0.2);
    animation: dot-flashing 1s infinite alternate;
    animation-delay: 1s;
   }
   
   @keyframes dot-flashing {
    0% {
      background-color: rgba(255, 255, 255, 0.2);
    }
    50%, 100% {
      background-color: #fff;
    }
   }


   ::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
  color: rgba(255, 255, 255, 0.3);
  opacity: 1; /* Firefox */
}

:-ms-input-placeholder { /* Internet Explorer 10-11 */
  color: rgba(255, 255, 255, 0.3);
}

::-ms-input-placeholder { /* Microsoft Edge */
  color: rgba(255, 255, 255, 0.3);
}

.error-b{
  display: flex;
  align-items: flex-start;
}
.error-icon{
  margin-right: 6px;  
}
.error-txt{
  font-size: 14px;
  line-height: 17px;
  word-break: break-all;
  font-weight: 500;
}
.try-txt{
  color: #68FFFF;
}
</style>



