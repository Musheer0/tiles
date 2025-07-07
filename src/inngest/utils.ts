import SandBox from '@e2b/code-interpreter'
import { AgentResult, TextMessage } from '@inngest/agent-kit';

export const getSandBox = async(id:string)=>{
    const sandbox = await SandBox.connect(id);
    return sandbox
};

export function isLastResponseContent(result:AgentResult){
    const  lastMsg = result.output.findLastIndex(
        (msg)=>msg.role==='assistant'
    );
    const msg = result.output[lastMsg] as TextMessage |undefined;
    return msg?.content ? typeof msg.content==='string' ? msg.content : msg.content.map((c)=>c.text).join("")
    : undefined
}