"use client"

import { Box, Slider } from "@mui/material"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

type Props = {
  min: number,
  max: number
}

export default function PriceRangeSlider({ min, max }: Props) {
  const [priceRange, setPriceRange] = useState(() => {
    if (!min && !max || min === 0 && max == 0 || min > max) {
      return []
    }
    return [min, max]
  })
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleChange = (event: Event, newValue: number[]) => {
    if (priceRange)
      setPriceRange(newValue);
  };

  useEffect(() => {
    let sp = searchParams.entries().reduce((prev, curr) => {
      prev.searchParams.append(curr[0], curr[1])
      return prev
    }, new URL("https://example.com"))

    sp.searchParams.set("min", priceRange[0].toString())
    sp.searchParams.set("max", priceRange[1].toString())

    router.push(`/search?${sp.searchParams.toString()}`)
  }, [priceRange])

  return (
    <Box maxWidth={"70%"}>
      <Box>${priceRange[0] || ""} - ${priceRange[1] || ""}</Box>
      <Slider value={priceRange} onChange={handleChange} disableSwap getAriaLabel={() => "hello"} valueLabelDisplay="auto" min={min || 0} max={max}></Slider>
    </Box>
  )
}
