'use client'
import { SearchOutlined } from "@mui/icons-material"
import { Autocomplete, TextField } from "@mui/material"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, FormEvent, Suspense } from "react"

function SearchContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchValue, setSearchValue] = useState(searchParams.get("q") || "")

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (searchValue.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchValue.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ flexGrow: 1 }}>
      <Autocomplete
        freeSolo
        id="busqueda"
        size="small"
        sx={{
          flexGrow: 1
        }}
        options={[]}
        value={searchValue}
        onInputChange={(_, newValue) => {
          setSearchValue(newValue)
        }}
        renderInput={(params) => (
          <TextField
            data-testid="search-bar-textfield"
            color="primary"
            {...params}
            placeholder="Buscar"
            slotProps={{
              input: {
                ...params.InputProps,
                sx: {
                  backgroundColor: "background.default",
                  color: "text.primary",
                },
                startAdornment: <SearchOutlined></SearchOutlined>,
              }
            }}
          />
        )}
      />
    </form>
  )
}

function Search() {
  return (
    <Suspense fallback={<div style={{ flexGrow: 1, height: '40px' }} />}>
      <SearchContent />
    </Suspense>
  )
}

export default Search