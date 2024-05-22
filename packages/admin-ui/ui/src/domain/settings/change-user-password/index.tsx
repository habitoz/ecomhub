import { User } from "@medusajs/medusa"
import { useForm } from "react-hook-form"
import InputError from "../../../components/atoms/input-error"
import Button from "../../../components/fundamentals/button"
import SigninInput from "../../../components/molecules/input-signin"

import FormValidator from "../../../utils/form-validator"
import Modal from "../../../components/molecules/modal"
import { getErrorMessage } from "../../../utils/error-messages"

import { useTranslation } from "react-i18next"
import { useState } from "react"
import useNotification from "../../../hooks/use-notification"
import {  useAdminUpdateUser } from "medusa-react"

type Props = {
  user: Omit<User, "password_hash">
  open: boolean
  onClose: () => void
}
type formValues = {
  password: string
  new_password: string
  repeat_password: string
}

const ChangeUserPassword = ({  open, onClose, user }: Props) => {
  const { mutate } = useAdminUpdateUser( user.id )
  const { t } = useTranslation()
  const notification = useNotification()
  const [isSubmitting, setSubmitting] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset
  } = useForm<formValues>({
    defaultValues: {
      password: "",
      new_password: "",
      repeat_password: "",
    },
  })
  const closeAndReset = () => {
    reset()
    onClose()
  }
  const onSubmit = handleSubmit((data: formValues) => {
    setSubmitting (true)
    if (data.new_password !== data.repeat_password) {
      setError(
        "repeat_password",
        {
          type: "manual",
          message: "Passwords do not match",
        },
        {
          shouldFocus: true,
        }
      )
      setSubmitting (false)
      return
    }
    else{
      setSubmitting (false)
      // onClose()
      // notification(
      //   t("edit-user-information-success", "Success"),
      //   t(
      //     "change-your-password-was-successfully-updated",
      //     "Your password was successfully updated"
      //   ),
      //   "success"
      // )
      const newData = { password: data.new_password }

      mutate(
        // @ts-ignore
        newData,
        {
          onSuccess: () => {
            notification(
              t("edit-user-information-success", "Success"),
              t(
                "edit-user-information-your-information-was-successfully-updated",
                "Your information was successfully updated"
              ),
              "success"
            )
            closeAndReset()
          },
          onError: (error) => {
            notification(
              t("return-shipping-options-error", "Error"),
              getErrorMessage(error),
              "error"
            )
          },
        }
      )
      
    }
  })

  return (
    <Modal handleClose={closeAndReset} open={open} isLargeModal={false}>
      <Modal.Header handleClose={closeAndReset}>
        <h1 className="inter-xlarge-semibold">
          {t("change-user-password", "Change Your Password")}
        </h1>
      </Modal.Header>
      <Modal.Body>
        <Modal.Content>
              <div className="gap-y-4 flex flex-col ">
                  
                  <div>
                  <SigninInput
                      placeholder="your current password"
                      type="password"
                      {...register("password", {
                      required: FormValidator.required("Password"),
                      })}
                  />
                  <InputError errors={errors} name="password" />
                  </div>
                  <div>
                  <SigninInput
                      placeholder="New password (8+ characters)"
                      type="password"
                      {...register("new_password", {
                      required: FormValidator.required("Password"),
                      })}
                  />
                  <InputError errors={errors} name="password" />
                  </div>
                  <div>
                  <SigninInput
                      placeholder="Confirm password"
                      type="password"
                      {...register("repeat_password", {
                      required: "You must confirm your password",
                      })}
                  />
                  <InputError errors={errors} name="repeat_password" />
                  </div>
              </div>
        </Modal.Content>
        <Modal.Footer className="border-grey-20 pt-base border-t">
          <div className="gap-x-xsmall flex w-full items-center justify-end">
            <Button variant="secondary" size="small" onClick={closeAndReset}>
              {t("edit-user-information-cancel", "Cancel")}
            </Button>
            <Button
              variant="primary"
              size="small"
              loading={isSubmitting}
              disabled={isSubmitting}
              onClick={onSubmit}
            >
              {t("change", "change password")}
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default ChangeUserPassword
