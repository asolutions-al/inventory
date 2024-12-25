export const uploadProductImages = async ({
  id,
  formData,
}: {
  id: string
  formData: FormData
}) => {
  "use server"
  formData.append("id", id)
  const edgeFnUrl =
    "https://xczxozyteslsqdxtljzq.supabase.co/functions/v1/productImages"

  await fetch(edgeFnUrl, {
    method: "POST",
    body: formData,
  })
}
