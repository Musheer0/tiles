"use client"

import type { Fragment, Message, MsgType } from "@prisma/client"
import { cn } from "@/lib/utils"
import { ArrowRight, Bot, User, AlertCircle } from "lucide-react"

interface MessageCardProps {
  message: Message
  type: MsgType
  fragment: Fragment | null
  onFragmentClick?: () => void
}

const MessageCard = ({ message, type, fragment, onFragmentClick }: MessageCardProps) => {
  const isUser = message.role === "USER"
  const isError = type === "ERROR"

  return (
    <div className={cn("flex w-full gap-3 group", isUser ? "justify-end" : "justify-start")}>
      {/* Avatar */}
      {!isUser && (
        <div
          className={cn(
            "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm",
            isError ? "bg-gradient-to-br from-red-500 to-red-600" : "bg-gradient-to-br from-purple-500 to-blue-600",
          )}
        >
          {isError ? <AlertCircle size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
        </div>
      )}

      {/* Message Content */}
      <div className={cn("flex flex-col max-w-[85%] ", isUser ? "items-end" : "items-start")}>
        {/* Role Label */}
        <div
          className={cn(
            "text-xs mb-1 px-1 flex items-center gap-1",
            isUser ? "flex-row-reverse" : "flex-row",
            isError ? "text-red-600 dark:text-red-400" : "text-muted-foreground",
          )}
        >
          {isUser ? (
            <>
              <span>You</span>
              <User size={12} />
            </>
          ) : (
            <>
              {isError ? <AlertCircle size={12} /> : <Bot size={12} />}
              <span>{isError ? "Error" : "AI Assistant"}</span>
            </>
          )}
        </div>

        {/* Message Bubble */}
        <div
          className={cn(
            "relative rounded-2xl px-4 py-3 shadow-sm transition-all duration-200",
            isUser
              ? "bg-primary text-primary-foreground hover:shadow-md"
              : isError
                ? "bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 hover:shadow-md hover:border-red-300 dark:hover:border-red-700"
                : "bg-card border border-border hover:shadow-md hover:border-border/80",
          )}
        >
          {/* Error Icon for Error Messages */}
          {isError && !isUser && (
            <div className="flex items-center gap-2 mb-2 text-red-600 dark:text-red-400">
              <AlertCircle size={16} />
              <span className="text-sm font-medium">Something went wrong</span>
            </div>
          )}

          {/* Message Content */}
          <div
            className={cn("prose prose-sm max-w-none dark:prose-invert", isError && "text-red-800 dark:text-red-200")}
          >
            <p className="whitespace-pre-wrap break-words leading-relaxed m-0">{message.content}</p>
          </div>

          {/* Message Tail */}
          <div
            className={cn(
              "absolute top-4 w-3 h-3 rotate-45",
              isUser
                ? "right-[-6px] bg-primary"
                : isError
                  ? "left-[-6px] bg-red-50 dark:bg-red-950/20 border-l border-b border-red-200 dark:border-red-800"
                  : "left-[-6px] bg-card border-l border-b border-border",
            )}
          />
        </div>

        {/* Fragment Button - Hidden for Error Messages */}
        {fragment && !isError && (
          <button
            onClick={onFragmentClick}
            className={cn(
              "mt-3 group/fragment inline-flex items-center gap-2 px-4 py-2.5 rounded-xl",
              "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700",
              "text-white font-medium text-sm shadow-lg hover:shadow-xl",
              "transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]",
              "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2",
              isUser ? "self-end" : "self-start",
            )}
          >
            <span className="capitalize">{fragment.title}</span>
            <ArrowRight size={16} className="transition-transform duration-200 group-hover/fragment:translate-x-0.5" />
          </button>
        )}

       
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-sm">
          <User size={16} className="text-primary-foreground" />
        </div>
      )}
    </div>
  )
}

export default MessageCard
