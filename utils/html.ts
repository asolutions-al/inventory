export const flyImgInputUpload = ({
  isMultiple = false,
  onChange,
}: {
  isMultiple?: boolean
  onChange: (e: Event, files: File[]) => void
}) => {
  const input = document.createElement("input")
  input.type = "file"
  input.accept = "image/*"
  if (isMultiple) input.multiple = true
  input.click()
  input.addEventListener("change", (e) => {
    const files = (e.target as HTMLInputElement).files
    if (!files) return
    onChange(e, Array.from(files))
  })
  return input
}
