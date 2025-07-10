"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import TextareaAutosize from "react-textarea-autosize"
import { ArrowUp, Loader2 } from 'lucide-react'
import { cn } from "@/lib/utils"
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { useMutation } from "@tanstack/react-query"
import { useTrpc } from '@/trpc/client'

const formSchema = z.object({
  value: z.string().min(1, {
    message: "Message cannot be empty.",
  }).max(2000, {
    message: "Message must be less than 2000 characters.",
  }),
})

interface ProjectMessageFormProps {
  id: string
  placeholder?: string
  disabled?: boolean
}

const ProjectMessageForm = ({ 
  id, 
  placeholder = "Type your message...", 
  disabled = false 
}: ProjectMessageFormProps) => {
  const [isFocused, setIsFocused] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { value: "" },
  })

  const watchedValue = form.watch("value")
  const characterCount = watchedValue.length
  const isNearLimit = characterCount > 1800
  const trpc = useTrpc()
  const { mutate: sendMessage, isPending: isSubmitting } = useMutation({
    mutationKey: ['send-msg', id],
    mutationFn: async (value: string) =>  await trpc.message.create.mutate({value,projectId:id}),
    onSuccess: () => {
      form.reset()
    },
    onError: (err) => {
      console.error("Error sending message:", err)
    },
  })

  const canSubmit = watchedValue.trim().length > 0 && !isSubmitting && !disabled

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    if (!canSubmit) return
    sendMessage(values.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (canSubmit) form.handleSubmit(handleSubmit)()
    }
  }

  return (
    <div className="sticky bottom-0 left-0 w-full p-4 bg-gradient-to-t from-background via-background/95 to-transparent">
      <div className="w-full max-w-4xl mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-2">

            {/* Input Container */}
            <div
              className={cn(
                "relative rounded-2xl border transition-all duration-200",
                "bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-xl",
                isFocused 
                  ? "border-primary/50 shadow-primary/10" 
                  : "border-border hover:border-border/80",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-end gap-3 p-4">
                        <TextareaAutosize
                          {...field}
                          minRows={1}
                          maxRows={6}
                          placeholder={placeholder}
                          disabled={disabled || isSubmitting}
                          onFocus={() => setIsFocused(true)}
                          onBlur={() => setIsFocused(false)}
                          onKeyDown={handleKeyDown}
                          className={cn(
                            "flex-1 resize-none bg-transparent text-foreground",
                            "placeholder:text-muted-foreground outline-none",
                            "text-sm leading-relaxed py-2"
                          )}
                        />

                        <button
                          type="submit"
                          disabled={!canSubmit}
                          className={cn(
                            "flex-shrink-0 p-2.5 rounded-full transition-all duration-200",
                            "focus:outline-none focus:ring-2 focus:ring-offset-2",
                            canSubmit
                              ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 focus:ring-purple-500"
                              : "bg-muted text-muted-foreground cursor-not-allowed"
                          )}
                        >
                          {isSubmitting ? (
                            <Loader2 size={18} className="animate-spin" />
                          ) : (
                            <ArrowUp size={18} />
                          )}
                        </button>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Char Count */}
              {characterCount > 0 && (
                <div className="absolute -top-6 right-2">
                  <span
                    className={cn(
                      "text-xs px-2 py-1 rounded-full bg-background/80 backdrop-blur-sm",
                      isNearLimit ? "text-destructive" : "text-muted-foreground"
                    )}
                  >
                    {characterCount}/2000
                  </span>
                </div>
              )}
            </div>

            {/* Info Row */}
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 animate-pulse" />
                  <span className="text-xs text-muted-foreground font-medium">
                    Gemini 2.0-flash
                  </span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Shift+Enter</kbd> for new line
              </div>
            </div>

            {/* Validation Message */}
            <FormMessage />
          </form>
        </Form>
      </div>
    </div>
  )
}

export default ProjectMessageForm
