"use client"

interface LiveNumberProps {
  value: number
  decimals?: number
  compact?: boolean
}

export function LiveNumber({ value, decimals = 0, compact = false }: LiveNumberProps) {
  if (compact && value >= 1_000_000_000) {
    const billions = value / 1_000_000_000
    return <span>{billions.toFixed(1)}B</span>
  }
  
  if (compact && value >= 1_000_000) {
    const millions = value / 1_000_000
    return <span>{millions.toFixed(1)}M</span>
  }
  
  if (compact && value >= 10_000) {
    const thousands = value / 1_000
    return <span>{thousands.toFixed(0)}K</span>
  }

  const formatted = decimals > 0 
    ? value.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    : Math.floor(value).toLocaleString()

  return <span>{formatted}</span>
}
