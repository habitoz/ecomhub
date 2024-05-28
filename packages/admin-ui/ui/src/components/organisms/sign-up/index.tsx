import { useAdminLogin } from "medusa-react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { useWidgets } from "../../../providers/widget-provider"
import { useTranslation } from "react-i18next"
import InputError from "../../atoms/input-error"
import WidgetContainer from "../../extensions/widget-container"
import Button from "../../fundamentals/button"
import InputField from "../../molecules/input"
import FileUploadField from "../../atoms/file-upload-field"
import Medusa from "../../../services/api"

type FormValues = {
  businessName: string
  contactPersonFullName: string
  contactPersonEmail: string
  contactPersonPhone: string
  logo?: string | null
}

type SignUpProps = {
  toLogin: () => void
}

const SignupCard = ({ toLogin }: SignUpProps) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    reset
  } = useForm<FormValues>()
  const navigate = useNavigate()
  const { mutate, isLoading } = useAdminLogin()
  const { t } = useTranslation()

  const onSubmit = async (values: FormValues) => {
    const formData = new FormData()
    formData.append("businessName", values.businessName)
    formData.append("contactPersonFullName", values.contactPersonFullName)
    formData.append("contactPersonEmail", values.contactPersonEmail)
    formData.append("contactPersonPhone", values.contactPersonPhone)
    formData.append("logo", "")
    let response = await Medusa.merchant.create(formData)
    if(response.statusText === "OK") console.log("success")
  }
  return (
    <div className="gap-y-small flex flex-col">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col items-center">
          <h1 className="inter-xlarge-semibold text-grey-90 mb-large text-[20px]">
            {t("signup-card-sign-up-to-medusa", "Sign Up")}
          </h1>
          <div className="grid grid-cols-2 gap-4">
            <InputField
                label={t("Business Name")}
                placeholder="electronics"
                required
                {...register("businessName", { required: true })}
                errors={errors}
              />
            <InputField
                label={t("contact Person Full Name")}
                placeholder="haben mehari"
                required
                {...register("contactPersonFullName", { required: true })}
                errors={errors}
              />
            <InputField
                label={t("contact Person Email")}
                placeholder="lebron@james.com"
                required
                {...register("contactPersonEmail", { required: true })}
                errors={errors}
              />
            <InputField
                label={t("contact Person Phone")}
                placeholder="098765432"
                required
                {...register("contactPersonPhone", { required: true })}
                errors={errors}
              />

          </div>
          <Button
            className="rounded-rounded inter-base-regular mt-4 w-[300px]"
            variant="secondary"
            size="medium"
            type="submit"
            loading={isLoading}
          >
            create Account
          </Button>
          <div className="flex w-full justify-between inter-small-regular space-x-2 text-grey-50 mt-xlarge">
              <span>Already signed up? </span>
              <span
                className="inter-small-regular font-semibold  text-grey-50 cursor-pointer"
                onClick={toLogin}
              >
                {t("sign-in", "Sign In")}
              </span>
          </div>
        </div>
      </form>
    </div>
  )
}

export default SignupCard
