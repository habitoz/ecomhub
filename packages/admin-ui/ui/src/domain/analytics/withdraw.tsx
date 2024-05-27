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
import { NextSelect } from "../../components/molecules/select/next-select"
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
  onClose: () => void
  originalAmount?: number
}

type WithdrawFormData = {
  amount: number | null
  type: Option | null
  region: GiftCardRegionFormType
  description: String
}

const WithdrawCard = ({ onClose, originalAmount }: WithdrawCardProps) => {
  const { store } = useAdminStore()
  const { refetch } = useAdminProducts()
  const { mutate, isLoading } = useAdminCreateProduct()
  const navigate = useNavigate()
  const notification = useNotification()
  const { t } = useTranslation()

  const {
    register,
    setValue,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm<WithdrawFormData>({
    shouldUnregister: true,
  })
  const withdrawalMethods = [
    {
      label: "Abyssinia",
      value: "k45",
    },
    {
      label: "Anbesa",
      value: "34534",
    },
    {
      label: "CBE",
      value: "y7632532",
    },
  ]
  const currencySubscriber = useWatch({
    control,
    name: "region.region_id.currency_code",
    defaultValue: "usd",
  })

  const onSubmit = async (data: WithdrawFormData) => {
    notification(
      t("gift-cards-success", "Success"),
      t(
        "gift-cards-successfully-created-gift-card",
        "Successfully created Gift Card"
      ),
      "success"
    )

    //   const trimmedName = data.title.trim()
  }
  return (
    <Modal handleClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit, (err) => console.log(err))}>
        <Modal.Body>
          <Modal.Header handleClose={onClose}>
            <div>
              <h1 className="inter-xlarge-semibold">
                {t("withdrawal-modal-add", "Withdrawal Balance Form")}
              </h1>
            </div>
          </Modal.Header>
          <Modal.Content>
            <div className="mt-xlarge gap-y-small gap-x-small grid grid-cols-2">
              <Controller
                name={"amount"}
                rules={{
                  required: FormValidator.required("Balance"),
                  min: {
                    value: 0,
                    message: "Amount must be greater than 0",
                  },
                  max: originalAmount
                    ? {
                        value: originalAmount,
                        message: `The withdrawal amount cannot exceed your current balance of  ${formatAmountWithSymbol(
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
                      label="transfer Methods"
                      onChange={onChange}
                      options={withdrawalMethods}
                      value={value}
                      placeholder="Choose a type"
                      isClearable
                    />
                  )
                }}
              />
              <div className="col-span-2">
                <TextArea
                  label={t("gift-cards-description", "Description")}
                  placeholder={t(
                    "withdrawal-description",
                    "write some descriptions here........"
                  )}
                  {...register("description")}
                />
              </div>
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
