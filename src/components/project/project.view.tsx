"use client"

import { trpc } from "@/trpc/client"
import { Suspense } from "react"
import MessageView from "./message.view"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import ProjectMessageForm from "./project.message.form"
import { Skeleton } from "@/components/ui/skeleton"
import { MessageSquare, Settings, Users } from "lucide-react"

const ProjectView = ({ id }: { id: string }) => {
  const [project] = trpc.project.getOne.useSuspenseQuery({ id: id })

  if (!project)
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading project...</p>
        </div>
      </div>
    )

  return (
    <section className="h-screen w-full bg-background">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel maxSize={50} minSize={28} defaultSize={30} className="flex flex-col border-r">
          <header className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b px-4 py-3 z-10">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h1 className="font-semibold text-lg text-foreground">{project.name}</h1>
                <p className="text-xs text-muted-foreground">Project Chat</p>
              </div>
            </div>
          </header>

          <div className="flex-1 flex flex-col min-h-0">
            <Suspense
              fallback={
                <div className="flex-1 p-4 space-y-4">
                  <div className="space-y-3">
                    <Skeleton className="h-12 w-3/4" />
                    <Skeleton className="h-12 w-1/2 ml-auto" />
                    <Skeleton className="h-12 w-2/3" />
                    <Skeleton className="h-12 w-3/4 ml-auto" />
                  </div>
                </div>
              }
            >
              <div className="flex-1 overflow-hidden">
                <MessageView id={id} />
              </div>
              <div className="border-t bg-background/50 backdrop-blur">
                <ProjectMessageForm id={id} />
              </div>
            </Suspense>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle className="hover:bg-primary/20 transition-colors" />

        <ResizablePanel className="bg-muted/30">
       
        </ResizablePanel>
      </ResizablePanelGroup>
    </section>
  )
}

export default ProjectView
