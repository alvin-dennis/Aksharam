import React from "react"

export const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div className={`rounded-xl bg-white p-4 ${className}`}>
      {children}
    </div>
  )
}
