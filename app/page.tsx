"use client"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { BirthdayCard } from "@/components/birthday-card"

function BirthdayContent() {
  const searchParams = useSearchParams()
  const name = searchParams.get("name") || "Birthday Star"
  const dob = searchParams.get("dob") || "2017-02-20"

  return <BirthdayCard name={name} dateOfBirth={dob} />
}

export default function BirthdayPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-muted-foreground mt-4">Calculating numbers...</p>
          </div>
        </div>
      }
    >
      <BirthdayContent />
    </Suspense>
  )
}
