import { useAdminCreateGiftCard } from "medusa-react"
import React, { useEffect } from "react"
import { useForm, useWatch, Controller } from "react-hook-form"
import { useTranslation } from "react-i18next"
import GiftCardBalanceForm, {
  GiftCardBalanceFormType,
} from "../../forms/gift-card/gift-card-balance-form"
import GiftCardEndsAtForm, {
  GiftCardEndsAtFormType,
} from "../../forms/gift-card/gift-card-ends-at-form"
import GiftCardReceiverForm, {
  GiftCardReceiverFormType,
} from "../../forms/gift-card/gift-card-receiver-form"
import GiftCardRegionForm, {
  GiftCardRegionFormType,
} from "../../forms/gift-card/gift-card-region-form"
import Button from "../../fundamentals/button"
import Modal from "../../molecules/modal"
import useNotification from "../../../hooks/use-notification"
import { getErrorMessage } from "../../../utils/error-messages"
import { nestedForm } from "../../../utils/nested-form"
import {
  NextSelect,
} from "../../molecules/select/next-select"
import { NestedForm } from "../../../utils/nested-form"
import { Option } from "../../../types/shared"


type CustomGiftcardProps = {
  onClose: () => void
  open: boolean
}
type CustomGiftCardFormType = {
  region: GiftCardRegionFormType
  ends_at: GiftCardEndsAtFormType
  balance: GiftCardBalanceFormType,
  type: Option || null
}
type Props = {
  form: NestedForm<CustomGiftCardFormType>
}
const items = [
  {
    value: "eur",
    label: "EUR",
  },
  {
    value: "usd",
    label: "USD",
  },
  {
    value: "dkk",
    label: "DKK",
  },
]

const CustomGiftcard: React.FC<CustomGiftcardProps> = ({ onClose, open }) => {
  const { t } = useTranslation()
  const form = useForm<Props>()
  const {
    handleSubmit,
    reset,
    control,
    formState: { isDirty },
    path
  } = form

  const currencySubscriber = useWatch({
    control,
    name: "region.region_id.currency_code",
    defaultValue: "usd",
  })

  const notification = useNotification()

  const { mutate, isLoading: isSubmitting } = useAdminCreateGiftCard()

  useEffect(() => {
    if (open) {
      reset()
    }
  }, [open, reset])

  const onSubmit = handleSubmit((data) => {
    mutate(
      {
        region_id: data.region.region_id.value,
        value: data.balance.amount,
        ends_at: data.ends_at.ends_at || undefined,
        metadata: {
          email: data.receiver.email,
          personal_message: data.receiver.message,
        },
      },
      {
        onSuccess: () => {
          notification(
            t("gift-cards-created-gift-card", "Created gift card"),
            t(
              "gift-cards-custom-gift-card-was-created-successfully",
              "Custom gift card was created successfully"
            ),
            "success"
          )
          onClose()
        },
        onError: (error) => {
          notification(
            t("gift-cards-error", "Error"),
            getErrorMessage(error),
            "error"
          )
        },
      }
    )
  })

  return (
    <Modal open={open} handleClose={onClose}>
      <Modal.Body>
        <Modal.Header handleClose={onClose}>
            <h1 className="inter-xlarge-semibold mb-2xsmall">
                { t("withdrawal-modal-add", "Withdrawal Form")}
              </h1>
          </Modal.Header>
          <form onSubmit={ onSubmit }>
            <Modal.Content>
              <div className="gap-y-xlarge flex flex-col">
                <div>
                  <div className="gap-x-xsmall grid grid-cols-2">
                    <GiftCardBalanceForm
                      form={nestedForm(form, "balance")}
                    currencyCode={currencySubscriber}
                  />
                </div>
              </div>
              <div>
              <Controller
                name={path("type")}
                control={control}
                render={({ field: { value, onChange } }) => {
                  return (
                    <NextSelect
                      label="Withdraw Method"
                      onChange={onChange}
                      options={items}
                      value={value}
                      placeholder="Choose a type"
                      isClearable
                    />
                  )
                }}
              />

              </div>
            </div>
          </Modal.Content>
          <Modal.Footer>
            <div className="gap-x-xsmall flex w-full justify-end">
              <Button
                variant="secondary"
                onClick={onClose}
                size="small"
                type="button"
              >
                {t("gift-cards-cancel", "Cancel")}
              </Button>
              <Button
                variant="primary"
                type="submit"
                size="small"
              >
                {t("gift-cards-create-and-send", "Create and send")}
              </Button>
            </div>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  )
}

export default CustomGiftcard
