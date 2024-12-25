"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  insertCategoryFormSchema,
  InsertCategoryFormType,
  insertProductFormSchema,
  InsertProductFormType,
  SelectCategoriesType,
  SelectProductImagesType,
  SelectProductType,
} from "@/db/(inv)/schema"

import { zodResolver } from "@hookform/resolvers/zod"
import { CheckIcon, Eraser, PlusIcon, Upload } from "lucide-react"
import Image from "next/image"
import { useForm } from "react-hook-form"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useGetShopId } from "@/hooks"
import { status } from "@/orm/(inv)/schema"
import { flyImgInputUpload } from "@/utils/html"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { PostgresError } from "postgres"
import { useState } from "react"
import { toast } from "sonner"
import { ConfirmDialog } from "../dialog"
import { FormHeader } from "../form-header"

type Types = {
  performAction: (
    values: InsertProductFormType,
    formData: FormData | null
  ) => Promise<void>
  defaultValues?: SelectProductType & {
    productImages: SelectProductImagesType[]
  }
  title: string
  categoriesList: SelectCategoriesType[]
  createNewCategory: (values: InsertCategoryFormType) => Promise<void>
  deleteCategory: (categoryId: string) => Promise<void>
}

export function ProductForm({
  performAction,
  defaultValues,
  title,
  categoriesList,
  createNewCategory,
  deleteCategory,
}: Types) {
  const t = useTranslations()
  const shopId = useGetShopId()
  const router = useRouter()
  const form = useForm<InsertProductFormType>({
    resolver: zodResolver(insertProductFormSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      barcode: defaultValues?.barcode || "",
      currentStock: defaultValues?.currentStock || 0,
      cost: defaultValues?.cost || 0,
      price: defaultValues?.price || 0,
      commission: defaultValues?.commission || 0,
      status: defaultValues?.status || "ACTIVE",
      description: defaultValues?.description || "",
      // ...(defaultValues?.categoryId && {
      //   // TODO: whats going on here?
      //   categoryId: defaultValues.categoryId,
      // }),
    },
  })

  console.log("form", form.formState.errors)

  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [showCategoryDialog, setShowCategoryDialog] = useState(false)

  async function onSubmit(values: InsertProductFormType) {
    try {
      const formData = new FormData()
      const pickedImgFile = imageFiles[0]
      if (pickedImgFile) formData.append("image", pickedImgFile)

      await performAction(values, formData)
      form.reset()
      toast.success(t("Product saved successfully"))
      // @ts-ignore
      router.push(`/${shopId}/product`)
    } catch (error) {
      console.error("error", error)
      toast.error(
        (error as PostgresError)?.message ||
          "An error occurred. Please try again later."
      )
    }
  }

  const onDiscard = () => {
    form.reset()
  }

  async function onSubmitCategory(values: InsertCategoryFormType) {
    try {
      console.log("values", values)
      await createNewCategory(values)
      toast.success(t("Category saved successfully"))
      setShowCategoryDialog(false)
    } catch (error) {
      console.error("error", error)
    }
  }

  const categoryForm = useForm({
    resolver: zodResolver(insertCategoryFormSchema),
    defaultValues: {
      name: "",
      color: "",
    },
  })

  const [deleteCategoryDialog, setDeleteCategoryDialog] = useState({
    open: false,
    categoryId: "",
  })

  const imageUrls = imageFiles.map((file) => URL.createObjectURL(file))

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <main>
            <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
              <FormHeader title={"Create Product"} form={form} />
              <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                  <Card x-chunk="dashboard-07-chunk-0">
                    <CardHeader>
                      <CardTitle>{t("Product Details")}</CardTitle>
                      <CardDescription>
                        {t("Information about the product")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-6">
                        <div className="grid gap-2">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("Name")}</FormLabel>
                                <FormControl>
                                  <Input placeholder="Pizza" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid gap-2">
                          <FormField
                            control={form.control}
                            name="barcode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("Barcode")}</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="1234567890"
                                    {...field}
                                    value={field.value || ""}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid gap-2">
                          <FormField
                            control={form.control}
                            name="currentStock"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("Current Stock")}</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="0.00"
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(
                                        parseInt(e.target.value) || 0
                                      )
                                    }
                                    onFocus={(e) => e.target.select()}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <FormField
                              control={form.control}
                              name="cost"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t("Cost")}</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      placeholder="0.00"
                                      {...field}
                                      onChange={(e) =>
                                        field.onChange(
                                          parseFloat(e.target.value)
                                        )
                                      }
                                      onFocus={(e) => e.target.select()}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="grid gap-2">
                            <FormField
                              control={form.control}
                              name="price"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t("Price")}</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      placeholder="0.00"
                                      {...field}
                                      onChange={(e) =>
                                        field.onChange(
                                          parseFloat(e.target.value)
                                        )
                                      }
                                      onFocus={(e) => e.target.select()}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <FormField
                            control={form.control}
                            name="commission"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("Commission")}</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="0.00"
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(
                                        parseInt(e.target.value) || 0
                                      )
                                    }
                                    onFocus={(e) => e.target.select()}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid gap-3">
                          <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("Description")}</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder={t(
                                      "A fancy pizza with pepperoni, mushrooms, and olives"
                                    )}
                                    {...field}
                                    value={field.value || ""}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card x-chunk="dashboard-07-chunk-2">
                    <CardHeader>
                      <CardTitle>{t("Product Category")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-6 sm:grid-cols-3">
                        {/* <div className="grid gap-3 col-span-2">
                          <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("Category")}</FormLabel>

                                <FormControl>
                                  <div>
                                    <Combobox
                                      list={categoriesList.map((category) => ({
                                        value: category.id,
                                        label: category.name,
                                        ...(category.color && {
                                          icon: () => (
                                            <div
                                              style={{
                                                background:
                                                  category.color ||
                                                  "transparent",
                                              }}
                                              className="rounded-md h-6 w-6 cursor-pointer active:scale-105"
                                            />
                                          ),
                                        }),
                                        rightIcon: Trash,
                                      }))}
                                      value={field.value || ""}
                                      setValue={(value) => {
                                        field.onChange(value)
                                      }}
                                      onRightIconClick={(item) => {
                                        setDeleteCategoryDialog({
                                          open: true,
                                          categoryId: item.value,
                                        })
                                      }}
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div> */}
                        <div className="flex items-end justify-end">
                          <Button
                            variant="outline"
                            type="button"
                            onClick={() => setShowCategoryDialog(true)}
                          >
                            <PlusIcon size={20} className="mr-1" />
                            {t("Create Category")}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                  <Card x-chunk="dashboard-07-chunk-3">
                    <CardHeader>
                      <CardTitle>{t("Product Status")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-6">
                        <div className="grid gap-3">
                          <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("Status")}</FormLabel>
                                <Select
                                  value={field.value || ""}
                                  onValueChange={field.onChange}
                                >
                                  <FormControl>
                                    <SelectTrigger
                                      aria-label={t("Select status")}
                                    >
                                      <SelectValue
                                        placeholder={t("Select status")}
                                      />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {status.enumValues.map((item) => (
                                      <SelectItem key={item} value={item}>
                                        {t(item)}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card
                    className="overflow-hidden"
                    x-chunk="dashboard-07-chunk-4"
                  >
                    <CardHeader>
                      <CardTitle>{t("Product Images")}</CardTitle>
                      <CardDescription>
                        {t("Upload images for the product")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-2">
                        <Image
                          alt="Product image"
                          className="aspect-square w-full rounded-md object-cover"
                          height="300"
                          src={
                            imageUrls[0] ||
                            // defaultValues?.productImages[0]?.url ||
                            "" ||
                            "/placeholder.svg"
                          }
                          width="300"
                        />
                        <div className="grid grid-cols-3 gap-2">
                          <Image
                            alt="Product image"
                            className="aspect-square w-full rounded-md object-cover"
                            height="84"
                            src={"/placeholder.svg"}
                            width="84"
                          />
                          <Image
                            alt="Product image"
                            className="aspect-square w-full rounded-md object-cover"
                            height="84"
                            src={"/placeholder.svg"}
                            width="84"
                          />
                          <Button
                            variant={"ghost"}
                            className="h-full aspect-square w-full border border-dashed"
                            type="button"
                            onClick={() => {
                              flyImgInputUpload({
                                onChange: (_, files) => {
                                  setImageFiles(files)
                                },
                              })
                            }}
                          >
                            <Upload className="h-4 w-4 text-muted-foreground" />
                            <span className="sr-only">Upload</span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              <div className="flex justify-center md:hidden">
                <SubmitBtns onDiscard={onDiscard} />
              </div>
            </div>
          </main>
        </form>
      </Form>
      {/* <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
        <DialogContent>
          <Form {...categoryForm}>
            <form
              onSubmit={categoryForm.handleSubmit(onSubmitCategory)}
              className="space-y-8"
            >
              <DialogHeader>
                <DialogTitle>{t("New Category")}</DialogTitle>
                <DialogDescription>
                  {t("Create a new category for the product")}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <FormField
                  control={categoryForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Name")}</FormLabel>
                      <FormControl>
                        <Input placeholder="Pizza" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={categoryForm.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem className="overflow-hidden">
                      <FormLabel>{t("Color")}</FormLabel>
                      <div>
                        <GradientPicker
                          background={field.value}
                          setBackground={field.onChange}
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button type="submit">
                  <CheckIcon size={20} className="mr-1" />
                  Save
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog> */}
      {deleteCategoryDialog.open && (
        <ConfirmDialog
          onOpenChange={(open) =>
            setDeleteCategoryDialog({ open, categoryId: "" })
          }
          performAction={() => deleteCategory(deleteCategoryDialog.categoryId)}
          action="Delete"
          table="Category"
          extraDescription="All products using this category will be set to uncategorized"
        />
      )}
    </>
  )
}

const SubmitBtns = ({ onDiscard }: { onDiscard: () => void }) => {
  const t = useTranslations()
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" type="button" onClick={onDiscard}>
        <Eraser size={15} className="mr-1" />
        {t("Discard")}
      </Button>
      <Button size="sm" type="submit">
        <CheckIcon size={15} className="mr-1" />
        {t("Save Product")}
      </Button>
    </div>
  )
}
