
<template>
  <div class="wrapper">
    <div class="msg-wrapper">
      <ul class="msg-list">
        <template v-for="(list, index) in arr" :key="index">
          <div class="msg-item" :class="{'user-bg':item.type === 'user'}" v-for="(item, idx) in list" :key="idx">
            <template v-if="item.type === 'bot'">
              <div class="msg-title">
                <img class="bot" src="./assets/img/bot.svg" alt="">
                <span class="chat-txt1">Chatwallet</span>
                <span class="chat-txt2">OpenAI</span>
              </div>
              <div class="msg-content" v-html="item.content"></div>
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
        <input class="msg-input" type="text" v-model="msg" placeholder="Send message..." @keyup.enter="handleSent">
        <img class="call-icon" src="./assets/img/call.svg" alt="">
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, reactive } from 'vue';
import { localStorage } from "./assets/utils/index";
import { apiReq } from './assets/utils/openai'
const msg = ref('')
const onOff = ref(false)

const handleSent = e=>{
  const val = e.target.value;
  msg.value = '';
  if(!onOff.value){
    arr.push([{
      type:'user',
      loading:false,
      content:val,
      response:val
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



  const cs = arr[arr.length-1]
  const str = cs.reduce((prev, cur)=> prev + cur.response,'')
  console.log(str)
  apiReq(str).then(res=>{
    console.log(res)
    if(res.status === 200){
      const resTxt = res.data.choices[0].text
      arr[arr.length-1].push({
        type:'bot',
        loading:false,
        content:
          resTxt
          .replace('？','')
          .replace('。','')
          .replace('.','')
          .replaceAll('\n', '<br/>')
          .replace('<br/><br/>', '\n\n'),
        response:resTxt
      })
    }
  })

}
const arr = reactive([
  [{
    type:'bot',
    loading:false,
    content:'Hello, my friend. Welcome to the Web3 world. I am the Chatwallet bot. You can ask me anything about web3. And I will be your sincere companion during this exploration.',
    response:''
  }],
  
])




</script>

<style scoped lang="scss">
.wrapper{
  position: relative;
  min-height: 100vh;
  background: radial-gradient(94.87% 50% at 50% 50%, rgba(9, 106, 105, 0.5) 0%, #096A69 86.87%), #B1FFF1;
}
.msg-list{
  padding: 16px;
  padding-bottom: 150px;
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
    /* .user-content{
      background: linear-gradient(0deg, rgba(33, 150, 83, 0.32), rgba(33, 150, 83, 0.32)), rgba(255, 255, 255, 0.2);
    } */
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
</style>



