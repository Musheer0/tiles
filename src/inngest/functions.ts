import { inngest } from "./client";
import { gemini,createAgent} from '@inngest/agent-kit'
export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    console.log('dd')
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  },
);

export const CreateAi = inngest.createFunction(
  {id:'create-ai'},
  {event: 'prod/create-ai'},
  async({event,step})=>{
    const prompt = event.data.prompt as string;

    const motivationer =createAgent({
      name: 'code agent',
      system: 'your and expert expressjs  dev you provide snippets with js docs comments highly detailed in the end you will provide task summary and yes and without gretings just code and task summary',
      model: gemini({model: 'gemini-2.0-flash'})
    });
    const {output} =await motivationer.run(prompt);
    return {prompt,output}
  }
)