'use client'
import { Autocomplete, TextField } from "@mui/material"

function Search() {
  return (
    <Autocomplete
      freeSolo
      id="busqueda"
      size="small"
      sx={{
        flexGrow: 1
      }}
      disableClearable
      options={[]}
      renderInput={(params) => (
        <TextField
          color="primary"
          {...params}
          label="Buscar"
          slotProps={{
            input: {
              ...params.InputProps,
              type: 'search',
            },
          }}
        />
      )}
    />
  )
}

export default Search