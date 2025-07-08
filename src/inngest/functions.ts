import { inngest } from "./client";
import { gemini,createAgent, createTool, createNetwork} from '@inngest/agent-kit'
import{Sandbox} from '@e2b/code-interpreter'
import { getSandBox, isLastResponseContent } from "./utils";
import z from "zod";
import { PROMPT } from "@/libs/utils";
import prisma from "@/db";
import { MsgRole, MsgType } from "@prisma/client";
export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
   

    return  {}
  },
);

export const CreateAi = inngest.createFunction(
  {id:'create-ai'},
  {event: 'prod/create-ai'},
  async({event,step})=>{
    const prompt = event.data.prompt as string;
 const sandboxId = await step.run("get-sandbox-id",async()=>{
      const sandbox = await Sandbox.create("tiles-test-1");
      return sandbox.sandboxId
    });
    const url = await step.run("get-sandbox-url",async()=>{
      const host = await getSandBox(sandboxId);
      return 'https://'+host.getHost(3000)
    });
    const coder =createAgent({
      name: 'code agent',
      system: PROMPT,
      model: gemini({model: 'gemini-2.0-flash'}),
      description:'an expert coding agent',
      tools:[
        createTool({
          name: 'terminal',
          description: 'use the terminal to run commands',
          parameters: z.object({
            command:z.string()
          }),
          handler:async({command},{step})=>{
            const buffer = {stdout: '',stderr: ''};
            try {
              const sandbox = await getSandBox(sandboxId);
              const result = await sandbox.commands.run(command,{
                onStdout:(data:string)=>{
                  buffer.stdout+=data
                },
                onStderr:(data:string)=>{
                  buffer.stderr+=data
                }
              });
              return result.stdout;
            } catch (error) {
              console.log(error);
            };
            return buffer;
          }
        }),
        createTool({
          name: "createorUpdateFile",
          description: 'create or update ',
          parameters: z.object({
            files: z.array(
              z.object({
                path:z.string(),
                content:z.string()
              })
            )
          }),
          handler :async({files},{step,network})=>{
            const newfiles = await step?.run("createorUpdatefiles",async()=>{
              try {
                const updated_files = network.state.data.files || {};
                const sandbox = await getSandBox(sandboxId);
                for (const file of files){
                  await sandbox.files.write(file.path,file.content);
                  updated_files[file.path] = file.content;
                };
                return updated_files
              } catch (error) {
                return error
              }
            });
            if(typeof newfiles==='object'){
              network.state.data.files = newfiles;
            }
          }
        }),
        createTool({
          name: 'readFiles',
          description:'read files from the sandbox',
          parameters: z.object({
            files: z.array(z.string())
          }),
          handler:async({files}, {step})=>{
            return await step?.run("readFiles",async()=>{
              try {
                const sandbox = await getSandBox(sandboxId);
                const contents = [];
                for  (const file of files){
                  const content = await sandbox.files.read(file);
                  contents.push(content);
                  return JSON.stringify(contents)
                }
              } catch (error) {
                return error
              }
            })
          }
        })
      ],
      lifecycle: {
        onResponse:async({result, network})=>{
          const lastAssistentText = isLastResponseContent(result);
          if(lastAssistentText && network){
            if(lastAssistentText.includes('<task_summary>')){
              network.state.data.summary =  lastAssistentText
            }
          }
          return result
        }
      }
    });
    const network = createNetwork({
      name: 'coding-agent-network',
      agents: [coder],
      maxIter: 15,
      router:async({network})=>{
        const summary = network.state.data.summary;
        if(summary) return;
        return  coder
      }
    });
    const result = await network.run(prompt)
    await step.run("sav to db", async()=>{
      await prisma.message.create({
        data:{
          type: MsgType.RESULT,
          role: MsgRole.ASSISTANT,
          content: result.state.data.summary,
          fragment:{
            create:{
              sandBoxUrl: url,
              files: result.state.data.files,
              title: 'fragment'
            }
          }
        }
      })
    })
    return {prompt,url,files:result.state.data.files,summary:result.state.data.summary}
  }
)