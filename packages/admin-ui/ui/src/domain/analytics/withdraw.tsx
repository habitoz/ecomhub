import {
    useAdminCreateProduct,
    useAdminProducts,
    useAdminStore,
  } from "medusa-react"
  import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form"
  import { useNavigate } from "react-router-dom"
  import { useTranslation } from "react-i18next"
  import FileUploadField from "../../components/atoms/file-upload-field"
  import Button from "../../components/fundamentals/button"
  import PlusIcon from "../../components/fundamentals/icons/plus-icon"
  import TrashIcon from "../../components/fundamentals/icons/trash-icon"
  import InputField from "../../components/molecules/input"
  import Modal from "../../components/molecules/modal"
  import FormValidator from "../../utils/form-validator"
  import { formatAmountWithSymbol } from "../../utils/prices"
  import PriceFormInput from "../../components/forms/general/prices-form/price-form-input"
  import {
    NextSelect,
  } from "../../components/molecules/select/next-select"
  import GiftCardRegionForm, {
    GiftCardRegionFormType,
  } from "../../components/forms/gift-card/gift-card-region-form"
  import { Option } from "../../types/shared"
  import TextArea from "../../components/molecules/textarea"
  import CurrencyInput from "../../components/organisms/currency-input"
  import useNotification from "../../hooks/use-notification"
  import Medusa from "../../services/api"
  import { ProductStatus } from "../../types/shared"
  import { getErrorMessage } from "../../utils/error-messages"
  import { focusByName } from "../../utils/focus-by-name"
  
  type WithdrawCardProps = {
    onClose: () => void,
    originalAmount?: number
  }
  
  type WithdrawFormData = {
    // title: string
    // description: string | undefined
    // thumbnail: {
    //   url: string
    //   name: string
    //   size: number
    //   nativeFile: File
    // } | null
    // denominations: {
    //   amount: number | null
    // }[], 
    amount: number | null,
    type: Option | null,
    region: GiftCardRegionFormType
  }
  
  const WithdrawCard = ({ onClose, originalAmount }: WithdrawCardProps) => {
    const { store } = useAdminStore()
    const { refetch } = useAdminProducts()
    const { mutate, isLoading } = useAdminCreateProduct()
    const navigate = useNavigate()
    const notification = useNotification()
    const { t } = useTranslation()
  
    const { register, setValue,formState: { errors},  handleSubmit, control } =
      useForm<WithdrawFormData>({
        shouldUnregister: true,
      })
    const withdrawalMethods = [
        {
            label: "Chapa",
            value: "34534"
        },
        {
            label: "TeleBirr",
            value: "y7632532"
        },
        {
          label: "Kacha",
          value: "k45"
        },
        {
          label: "Paybal",
          value: "p987"
        }
    ]
    const currencySubscriber = useWatch({
        control,
        name: "region.region_id.currency_code",
        defaultValue: "usd",
    })
    // const { fields, append, remove } = useFieldArray({
    //   control,
    //   name: "denominations",
    // })
  
    // const handleFileUpload = (files: File[]) => {
    //   const file = files[0]
    //   const url = URL.createObjectURL(file)
  
    //   setValue("thumbnail", {
    //     url,
    //     name: file.name,
    //     size: file.size,
    //     nativeFile: file,
    //   })
    // }
  
    // const thumbnail = useWatch({
    //   control,
    //   name: "thumbnail",
    // })
  
    const onSubmit = async (data: WithdrawFormData) => {
      console.log("this are with drawal balance and methods",data)
      alert(data.amount)

    //   const trimmedName = data.title.trim()
  
    //   if (!trimmedName) {
    //     notification(
    //       t("gift-cards-error", "Error"),
    //       t(
    //         "gift-cards-please-enter-a-name-for-the-gift-card",
    //         "Please enter a name for the Gift Card"
    //       ),
    //       "error"
    //     )
    //     focusByName("name")
    //     return
    //   }
  
    //   if (!data.denominations?.length) {
    //     notification(
    //       t("gift-cards-error", "Error"),
    //       t(
    //         "gift-cards-please-add-at-least-one-denomination",
    //         "Please add at least one denomination"
    //       ),
    //       "error"
    //     )
    //     focusByName("add-denomination")
    //     return
    //   }
  
    //   let images: string[] = []
  
    //   if (thumbnail) {
    //     const uploadedImgs = await Medusa.uploads
    //       .create([thumbnail.nativeFile])
    //       .then(({ data }) => {
    //         const uploaded = data.uploads.map(({ url }) => url)
    //         return uploaded
    //       })
  
    //     images = uploadedImgs
    //   }
  
    //   mutate(
    //     {
    //       is_giftcard: true,
    //       title: data.title,
    //       description: data.description,
    //       discountable: false,
    //       options: [{ title: t("gift-cards-denominations", "Denominations") }],
    //       variants: data.denominations.map((d, i) => ({
    //         title: `${i + 1}`,
    //         inventory_quantity: 0,
    //         manage_inventory: false,
    //         prices: [
    //           { amount: d.amount!, currency_code: store?.default_currency_code },
    //         ],
    //         options: [{ value: `${d.amount}` }],
    //       })),
    //       images: images.length ? images : undefined,
    //       thumbnail: images.length ? images[0] : undefined,
    //       status: ProductStatus.PUBLISHED,
    //     },
    //     {
    //       onSuccess: () => {
    //         notification(
    //           t("gift-cards-success", "Success"),
    //           t(
    //             "gift-cards-successfully-created-gift-card",
    //             "Successfully created Gift Card"
    //           ),
    //           "success"
    //         )
    //         refetch()
    //         navigate("/a/gift-cards/manage")
    //       },
    //       onError: (err) => {
    //         notification(
    //           t("gift-cards-error", "Error"),
    //           getErrorMessage(err),
    //           "error"
    //         )
    //       },
    //     }
    //   )
    }
    return (
      <Modal handleClose={onClose}>
        <form onSubmit={handleSubmit(onSubmit, (err) => console.log(err))}>
          <Modal.Body>
            <Modal.Header handleClose={onClose}>
              <div>
                <h1 className="inter-xlarge-semibold">
                { t("withdrawal-modal-add", "Withdrawal Balance Form")}
                </h1>
              </div>
            </Modal.Header>
            <Modal.Content>
              
              <div className="mt-xlarge grid grid-cols-2 gap-x-small">
                <Controller
                    name={"amount"}
                    rules={{
                        required: FormValidator.required("Balance"),
                        min: {
                        value: 0,
                        message: "Balance must be greater than 0",
                        },
                        max: originalAmount
                        ? {
                            value: originalAmount,
                            message: `The updated balance cannot exceed the original value of ${formatAmountWithSymbol(
                                {
                                amount: originalAmount,
                                currency: currencySubscriber,
                                }
                            )}`,
                            }
                        : undefined,
                    }}
                    control={control}
                    render={({ field: { value, onChange, name } }) => {
                        return (
                        <PriceFormInput
                            label="Amount"
                            currencyCode={currencySubscriber}
                            onChange={onChange}
                            amount={value}
                            name={name}
                            errors={errors}
                            required
                        />
                        )
                    }}
                />
                <Controller
                    name={"type"}
                    control={control}
                    render={({ field: { value, onChange } }) => {
                        return (
                        <NextSelect
                            label="Withdraw Method"
                            onChange={onChange}
                            options={withdrawalMethods}
                            value={value}
                            placeholder="Choose a type"
                            isClearable
                        />
                        )
                    }}
                />
              </div>
            </Modal.Content>
            <Modal.Footer>
              <div className="flex w-full items-center justify-end">
                <Button
                  type="submit"
                  variant="ghost"
                  size="small"
                  className="w-eventButton"
                  onClick={onClose}
                >
                  {t("gift-cards-cancel", "Cancel")}
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="small"
                  className="w-eventButton"
                >
                  {t("withdraw-new", "withdraw")}
                </Button>
              </div>
            </Modal.Footer>
          </Modal.Body>
        </form>
      </Modal>
    )
  }
  
  export default WithdrawCard
  