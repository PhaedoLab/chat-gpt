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
        max_tokens: 4000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
}

