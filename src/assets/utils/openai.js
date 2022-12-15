import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
  apiKey: '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',
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

