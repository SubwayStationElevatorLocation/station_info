import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

export default async function handler(req, res){
    console.log('gpt 핸들러')
    if(req.method === 'POST'){
        let {system_content, user_prompt} = req.body;

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages:[
                {role:'system', content:'지하철역 엘리베이터 위치를 위도경도로 제공했으니 이를 토대로 해당 지하철역의 출구번호를 안내해줘. '+system_content},
                {role:'user', content:user_prompt}
            ],
            max_tokens:1000,
        });
        console.log(response)
        console.log(response.choices[0].message)

        const answer = response.choices[0].message.content
        res.status(200).json({answer})
    }
}