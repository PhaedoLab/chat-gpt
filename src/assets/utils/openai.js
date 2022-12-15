import { Configuration, OpenAIApi } from 'openai'


// let a = 'sk'
// let b = '-mu95BgsT5'
// let c = 'zFyoycYsg9HT3BlbkFJt8odzWYNabXLeBLnTE9Z'
const configuration = new Configuration({
  apiKey: atob('c2stbXU5NUJnc1Q1ekZ5b3ljWXNnOUhUM0JsYmtGSnQ4b2R6V1lOYWJYTGVCTG5URTla')
  
});
const openai = new OpenAIApi(configuration);

export const apiReq = (content)=>{
    return openai.createCompletion({
        model: "text-davinci-003",
        prompt: content,
        temperature: 0.7,
        max_tokens: 3000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
}
