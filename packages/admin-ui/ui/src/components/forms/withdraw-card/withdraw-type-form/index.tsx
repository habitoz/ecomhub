import { Controller } from "react-hook-form"
import { Option } from "../../../../types/shared"
import { NestedForm } from "../../../../utils/nested-form"
import {
  NextSelect,
} from "../../../molecules/select/next-select"

export type OrganizeFormType = {
  type: Option | null
  tags: string[] | null
  categories: string[] | null
}

type Props = {
  form: NestedForm<OrganizeFormType>
}

const OrganizeForm = ({ form }: Props) => {
  const { control, path, setValue } = form
  const collectionOptions = [
    {
        label: "Chapa",
        value: "34534"
    },
    {
        label: "Tele Birr",
        value: "y7632532"
    }
  ]

  return (
    <div>
      <div className="mb-large gap-x-large grid grid-cols-2">
        <Controller
          name={path("type")}
          control={control}
          render={({ field: { value, onChange } }) => {
            return (
              <NextSelect
                label="Withdraw Method"
                onChange={onChange}
                options={collectionOptions}
                value={value}
                placeholder="Choose a type"
                isClearable
              />
            )
          }}
        />
      </div>
    </div>
  )
}

export default OrganizeForm
