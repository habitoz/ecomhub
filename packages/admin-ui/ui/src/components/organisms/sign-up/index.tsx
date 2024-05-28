import { useAdminLogin } from "medusa-react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import Button from "../../fundamentals/button"
import InputField from "../../molecules/input"
import { FormImage } from "../../../types/shared"
import Medusa from "../../../services/api"
import ThumbnailForm , { ThumbnailFormType } from "../../forms/product/thumbnail-form"
import { nestedForm } from "../../../utils/nested-form"
import useNotification from "../../../hooks/use-notification"

import { prepareImages } from "../../../utils/images"
import { useQuery } from "@tanstack/react-query"
type FormValues = {
  businessName: string
  contactPersonFullName: string
  contactPersonEmail: string
  contactPersonPhone: string
  logo?: ThumbnailFormType
}

type SignUpProps = {
  toLogin: () => void
}

const SignupCard = ({ toLogin }: SignUpProps) => {
  const notification = useNotification()
  const query = useQuery({
    queryFn: () => getMerchant(),
    queryKey: ["merchant"]
  })
  const getMerchant = async () => {
    return "kbroms' tanstack"
  }
  const form = useForm<FormValues>({
    defaultValues: {
      businessName: "",
      contactPersonFullName: "",
      contactPersonEmail: "",
      contactPersonPhone: "",
      logo:{
        images:[]
      } 
    }
  })
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    reset
  } = form

  const navigate = useNavigate()
  const { mutate, isLoading } = useAdminLogin()
  const { t } = useTranslation()

  const onSubmit = async (values: FormValues) => {
    const formData = new FormData()
    try {
      formData.append("businessName", values.businessName)
      formData.append("contactPersonFullName", values.contactPersonFullName)
      formData.append("contactPersonEmail", values.contactPersonEmail)
      formData.append("contactPersonPhone", values.contactPersonPhone)
      
      if (values.logo?.images?.length) {
        let preppedImages: FormImage[] = []

        try {
          preppedImages = await prepareImages(values.logo.images)
        } catch (error) {
          let errorMessage = t(
            "new-upload-thumbnail-error",
            "Something went wrong while trying to upload the thumbnail."
          )
          const response = (error as any).response as Response

          if (response.status === 500) {
            errorMessage =
              errorMessage +
              " " +
              t(
                "new-no-file-service-configured",
                "You might not have a file service configured. Please contact your administrator"
              )
          }

          notification(t("new-error", "Error"), errorMessage, "error")
          return
        }
        const urls = preppedImages.map((image) => image.url)
        formData.append("logo", urls[0])
      }
      let response = await Medusa.merchant.create(formData)
      if(response.statusText === "OK") {
        notification(
            t("gift-cards-success", "Success"),
            t("you created account successfully"),
            "success"
          )
      }
      else{
        notification(t("new-error", "Error"), "something is wrong please be patient.", "error")
      }
      console.log(formData)
    } catch (error: any) {
      console.log("gererertyertyewyerwyeryewryewrerreerwyeyew" + formData)
      notification(t("new-error", "Error"), error.message, "error")
    }
  }
  return (
    <div className="gap-y-small h-screen  flex flex-col">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex w-ful flex-col items-center">
          <h1 className="inter-xlarge-semibold text-grey-90 mb-large text-[20px]">
            {t("signup-card-sign-up-to-medusa", "Sign Up")}
          </h1>
          <div className="flex flex-col space-y-4">
            <div className="grid grid-cols-4 gap-x-3 ">
              <span className="font-semibold text-sm">Business Name</span>
              <div className="col-span-3">
                <InputField
                    placeholder="electronics"
                    required
                    {...register("businessName", { required: true })}
                    errors={errors}
                  />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-x-3">
              <span className="font-semibold text-sm">Contact Person</span>
              <div className="grid grid-cols-1 col-span-3 gap-y-4">
                <InputField
                    label={t("Full Name")}
                    placeholder="haben mehari"
                    required
                    {...register("contactPersonFullName", { required: true })}
                    errors={errors}
                  />
                <InputField
                    label={t("Email")}
                    placeholder="lebron@james.com"
                    required
                    {...register("contactPersonEmail", { required: true })}
                    errors={errors}
                  />
                <InputField
                    label={t("Phone Number")}
                    placeholder="098765432"
                    required
                    {...register("contactPersonPhone", { required: true })}
                    errors={errors}
                  />
              </div>
            </div>
            <div className="grid-cols-4">
                <span className="font-semibold text-md">Business Logo</span>
                <ThumbnailForm form={nestedForm(form, "logo")} />
            </div>
          </div>
          <div className="flex flex-col w-full justify-end items-center">
            <Button
              className="rounded-rounded inter-base-regular mt-4 w-[300px]"
              variant="secondary"
              size="medium"
              type="submit"
              loading={isLoading}
            >
              create Account
            </Button>
            <div className="inter-small-regular space-x-2 text-grey-50 ">
                <span>Already signed up? </span>
                <span
                  className="inter-small-regular font-semibold  text-grey-50 cursor-pointer"
                  onClick={toLogin}
                >
                  {t("sign-in", "Sign In")}
                </span>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default SignupCard