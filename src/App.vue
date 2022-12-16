
<template>
  <div class="page-wrapper">
    <div class="msg-wrapper" ref="scroll">
      
      <ul class="msg-list">
        <template v-for="(list, index) in arr" :key="index">
          <div class="time-div" v-if="index">
            {{formatTime(list[0].stamp)}}
          </div>
          <div class="msg-item" :class="{'user-bg':item.type === 'user'}" v-for="(item, idx) in list" :key="idx">
            <template v-if="item.type === 'bot'">
              <div class="msg-title">
                <img class="bot" src="./assets/img/bot.svg" alt="">
                <span class="chat-txt1">Chatwallet</span>
                <span class="chat-txt2">OpenAI</span>
              </div>
              <div v-if="!item.loading" class="msg-content" v-html="item.content"></div>
              <div v-else class="snippet">
                <div class="stage">
                  <div class="dot-flashing"></div>
                </div>
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
      </template>
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
import { ref, onMounted, reactive } from 'vue';
import { localStorage, formatTimer } from "./assets/utils/index";
import { apiReq } from './assets/utils/openai'
import BScroll from '@better-scroll/core'
import Diag from './components/Diag.vue'

const msg = ref('')
const inputRef = ref(null)
const scroll = ref(null)

 setTimeout(() => {
   const bs = new BScroll(scroll.value, {
    probeType: 3,
    click: true
  })
 }, 500);
 

const showDiag = ref(false)
const onOff = ref(false)
let chats = localStorage.get("chats") || [
  [{
    type:'bot',
    loading:false,
    content:'Hello, my friend. Welcome to the Web3 world. I am the Chatwallet bot. You can ask me anything about web3. And I will be your sincere companion during this exploration.',
    response:''
  }],  
];


const toBot = ()=>{
  setTimeout(() => {    
    // window.scrollTo({ left: 0, top: document.body.scrollHeight, behavior: "smooth" });
  }, 100);
}
const arr = reactive(chats)

// input fields
const handleSent = e=>{
  const val = e.target.value;
  msg.value = '';

  inputRef.value && inputRef.value.blur()

  if(!onOff.value){
    arr.push([{
      type:'user',
      loading:false,
      content:val,
      response:val,
      stamp:new Date().getTime()
    }])
    onOff.value = true
  }else{
    arr[arr.length-1].push({
      type:'user',
      loading:false,
      content:val,
      response:val
    })
  }

  toBot()

  const cs = arr[arr.length-1]
  const str = cs.reduce((prev, cur)=> prev + cur.response,'')
  setTimeout(()=>{
    arr[arr.length-1].push({
      type:'bot',
      loading:true,
      content:'',
      response:''
    })

    toBot()

  }, 500)
  

  localStorage.set("chats", arr)

  apiReq(str).then(res=>{
    if(res.status === 200){
      const resTxt = res.data.choices[0].text
      let lastDom = arr[arr.length-1]
      lastDom[lastDom.length -1].loading = false
      lastDom[lastDom.length -1].content = resTxt      
          .replace('？','')
          .replace('。','')
          .replace('.','')
          .replaceAll('\n', '<br/>')
          .replace('<br/><br/>', '\n\n')
      lastDom[lastDom.length -1].response = resTxt
      localStorage.set("chats", arr)
      toBot()
    }
  })
}


// click questions list
const ques = e =>{
  showDiag.value = false
  arr.push([{
    type:'user',
    loading:false,
    content:e,
    response:e,
    stamp:new Date().getTime()
  }])

  toBot()

  const cs = arr[arr.length-1]
  const str = cs.reduce((prev, cur) => prev + cur.response, '')

  setTimeout(()=>{
     arr[arr.length-1].push({
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
      lastDom[lastDom.length -1].loading = false
      lastDom[lastDom.length -1].content = content  
      lastDom[lastDom.length -1].response = content
      localStorage.set("chats", arr)

      toBot()

    }, 1500);
    
    return 
  }

  apiReq(str).then(res=>{
    if(res.status === 200){
      const resTxt = res.data.choices[0].text
      let lastDom = arr[arr.length-1]
      lastDom[lastDom.length -1].loading = false
      lastDom[lastDom.length -1].content = resTxt      
          .replace('？','')
          .replace('。','')
          .replace('.','')
          .replaceAll('\n', '<br/>')
          .replace('<br/><br/>', '\n\n')
      lastDom[lastDom.length -1].response = resTxt
      localStorage.set("chats", arr)

      toBot()

    }
  })

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
  window.fetch('http://54.183.182.125:3000/v1/qas')
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
  min-height: 100vh;
  background: radial-gradient(94.87% 50% at 50% 50%, rgba(9, 106, 105, 0.5) 0%, #096A69 86.87%), #B1FFF1;
}
.msg-wrapper{
  /* height: calc(~"100vh - 150px"); */
  height: calc(100vh - 70px);
  position :relative;
  overflow :hidden;
}
.msg-list{
  padding: 16px;
  padding-bottom: 150px;
  box-sizing: border-box;
  .msg-item{
    margin-bottom: 16px;
    padding: 16px;
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
    padding: 16px 20px;
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


</style>



