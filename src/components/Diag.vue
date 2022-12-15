<template>
 <div class="wrapper" @click="modalClick">
  <div @click.stop="noop" class="modal-diag">  
    <div class="top-icon" @click="modalClick">
        <svg width="40" height="16" viewBox="0 0 40 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="16" rx="8" fill="white" fill-opacity="0.3"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M20.7044 10.5356C20.3139 10.9261 19.6807 10.9261 19.2902 10.5356L15.7547 7.00004L16.6975 6.05723L19.9973 9.35706L23.2971 6.05723L24.24 7.00004L20.7044 10.5356Z" fill="white" fill-opacity="0.5"/>
        </svg>
    </div>
    <div class="top-content">
        <div class="top-title">
            <img class="call-icon" src="../assets/img/top.svg" alt="">
            <span>Basic knowledge about web3</span>
        </div>
        <div class="msg-list">
            <div class="msg-item" v-for="item in items" :key="item.id" @click="handleClick(item)">
                {{ item }}
            </div>
        </div>
    </div>    
  </div>  
</div>
</template>

<script setup>
import { ref } from 'vue';
const emit = defineEmits(["close",'ques']);


const noop =  () => {

}
const items = ref([
    'What is Crypto?',
    'What is a web3 wallet?',
    'What is a web3 wallet?',
    'What is a web3 wallet?',
    'What is a web3 wallet?',
    'What is a web3 wallet?',
    'What is a web3 wallet?',
])
const modalClick =  () => {
    emit("close");    
}
const handleClick = (item)=>{
    // console.log(item)
    emit("ques", item);
}
</script>

<style lang="scss" scoped>

.wrapper{
  position: fixed;
  z-index: 100;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, .6);
  left: 0; 
  bottom:0;
}

.modal-diag{
  z-index: 200;
  position: fixed;  
  width: 100%;
  height: 50vh;
  bottom: 0;  
  background: rgba(49, 49, 50, 0.7);
  backdrop-filter: blur(57.2707px);
  border-radius: 10px 10px 0px 0px;
}
.msg-list{
    height: 40vh;  
    overflow: auto;  
}
.msg-item{
    height: 53px;
    line-height: 53px;
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.02), rgba(0, 0, 0, 0.02)), rgba(255, 255, 255, 0.16);
    border: 0.5px solid rgba(255, 255, 255, 0.4);
    
    border-radius: 16px;
    font-size: 17px;
    color: #fff;
    padding-left: 16px;
    margin-bottom: 12px;
}

.top-icon{
    display: flex;
    justify-content: center;
    padding-top: 8px;
}
.top-content{
    padding: 0 24px;
}
.top-title{
    display: flex;
    align-items: center;
    padding-top: 17.5px;
    padding-bottom: 16px;
    span{
        color: rgba(255, 255, 255, 0.8);
    }
    .call-icon{
        width: 24px;
        margin-right: 8px;
    }
}
</style>
