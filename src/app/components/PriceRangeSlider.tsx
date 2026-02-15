"use client"

import { Box, Slider } from "@mui/material"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

type Props = {
  min: number,
  max: number
}

export default function PriceRangeSlider({ min, max }: Props) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [priceRange, setPriceRange] = useState<number[]>(() => {
    const urlMin = searchParams.get("min")
    const urlMax = searchParams.get("max")

    const currentMin = urlMin ? Number(urlMin) : (min ?? 0)
    const currentMax = urlMax ? Number(urlMax) : (max ?? 100)

    return [currentMin, currentMax]
  })

  useEffect(() => {
    const urlMin = searchParams.get("min")
    const urlMax = searchParams.get("max")

    const targetMin = urlMin ? Number(urlMin) : min
    const targetMax = urlMax ? Number(urlMax) : max

    setPriceRange([targetMin, targetMax])
  }, [searchParams, min, max])

  const handleChange = (_: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
  };

  const handleCommit = (_: React.SyntheticEvent | Event, newValue: number | number[]) => {
    const [newMin, newMax] = newValue as number[];
    const sp = new URLSearchParams(searchParams.toString())

    if (newMin === min && newMax === max) {
      sp.delete("min")
      sp.delete("max")
    } else {
      sp.set("min", newMin.toString())
      sp.set("max", newMax.toString())
    }

    const newQuery = sp.toString()
    if (newQuery !== searchParams.toString()) {
      router.push(`/search?${newQuery}`)
    }
  };

  return (
    <Box width={"100%"} display={"flex"} flexDirection={"column"} gap={2} px={1} py={1}>
      <Box fontSize="0.875rem" fontWeight={500}>
        ${priceRange[0]} - ${priceRange[1]}
      </Box>
      <Slider
        value={priceRange}
        onChange={handleChange}
        onChangeCommitted={handleCommit}
        disableSwap
        valueLabelDisplay="auto"
        min={min}
        max={max}
      />
    </Box>
  )
}
