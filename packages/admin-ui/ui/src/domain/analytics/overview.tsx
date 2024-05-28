import { Product } from "@medusajs/medusa"
import {
  useAdminDeleteProduct,
  useAdminProducts,
  useAdminStore,
  useAdminUpdateProduct,
  useAdminCustomers,
  useAdminOrders,
  useAdminGetSession,
} from "medusa-react"
import { useMemo, useState, useEffect } from "react"
import { useSpring, animated } from "react-spring"
import { useNavigate, NavLink } from "react-router-dom"
import { useTranslation } from "react-i18next"
import PageDescription from "../../components/atoms/page-description"
import WithdrawBalance from "./withdraw"
import ExportIcon from "../../components/fundamentals/icons/export-icon"
import Button from "../../components/fundamentals/button"
import Spacer from "../../components/atoms/spacer"
import Spinner from "../../components/atoms/spinner"
import Medusa from "../../services/api"
import useNotification from "../../hooks/use-notification"

type TNumber = {
  n: number
}
type Merchant =  {
  id?: string
  created_at?: string
  updated_at?: string
  businessName?: string
  tin?: string
  contactPersonFullname?: string
  contactPersonEmail?: string
  contactPersonPhone?: string
  logo?: string
  credit: number
  debit: number
  balance: number
  status?: string
  [key: string]: any 
}
const Number = ({ n }: TNumber) => {
  const { number } = useSpring({
    from: { number: 0 },
    number: n,
    delay: 200,
    config: { mass: 1, tension: 20, friction: 10 },
  })

  return <animated.div>{number.to((n) => n.toFixed(0))}</animated.div>
}

const Overview = () => {
  const { t } = useTranslation()
  const notification = useNotification()
  const { user } = useAdminGetSession()
  const { products, count: countProducts, isLoading } = useAdminProducts()
  const {
    customers,
    count: countCustomers,
    isLoading: customerLoading,
  } = useAdminCustomers()
  const {
    orders,
    count: countOrders,
    isLoading: ordersLoading,
  } = useAdminOrders()
  const [showNewCollection, setShowNewCollection] = useState(false)
  const [merchantD, setMerchant] = useState<Merchant | null>(null)
  const navigate = useNavigate()
  useEffect(() => {
    const getMerchant = async () => {
      try {
        let response = await Medusa.merchant.retrieve()
        if (response.statusText === "OK") {
          setMerchant(response.data as Merchant)
          notification(
            t("gift-cards-success", "Success"),
            t("Merchant detail is retrieved successfully."),
            "success"
          )
        } else {
          notification(
            t("gift-cards-error", "Error"),
            t(`error response ${response.status} `),
            "error"
          )
        }
      } catch (error) {
        notification(
          t("gift-cards-error", "Error"),
          t("An error occurred while retrieving the merchant details."),
          "error"
        )
      }
    }
    getMerchant()
  }, [])

  return (
    <>
      <div className="flex flex-col">
        <div className="flex w-full items-center">
          <PageDescription
            title={t("analytics-card", "Analytics")}
            subtitle={t(
              "analytics-card-manage",
              "Manage the Gift Cards of your Medusa store"
            )}
          />
          <div className="flex w-full justify-end space-x-2">
            <Button
              variant="secondary"
              size="small"
              onClick={() => setShowNewCollection(!showNewCollection)}
            >
              <ExportIcon size={20} />
              {t("withdraw-new", "Withdraw")}
            </Button>
          </div>
        </div>
        <div className="medium:grid-cols-3 gap-y-xsmall grid grid-cols-2 gap-x-4">
          <div className="rounded-rounded cusrsor-pointer bg-grey-0 border-grey-20 p-base  w-full border">
            <div className=" flex items-center justify-center">
              <div className="flex w-full flex-col items-center justify-center">
                <h1 className="inter-large-semibold mb-xsmall flex">
                  $ <Number n={merchantD?.balance ?? 0} />
                </h1>
                <h2 className="inter-base-regular text-grey-50">
                  Total Balance
                </h2>
              </div>
            </div>
          </div>
          <div className="rounded-rounded cusrsor-pointer bg-grey-0 border-grey-20 p-base  w-full border">
            <div className=" flex items-center justify-center">
              <div className="flex w-full flex-col items-center justify-center">
                <h1 className="inter-large-semibold mb-xsmall flex">
                  $ <Number n={merchantD?.debit ?? 0} />
                </h1>
                <h2 className="inter-base-regular text-grey-50">debit</h2>
              </div>
            </div>
          </div>
          <div className="rounded-rounded cusrsor-pointer bg-grey-0 border-grey-20 p-base  w-full border">
            <div className=" flex items-center justify-center">
              <div className="flex w-full flex-col items-center justify-center">
                <h1 className="inter-large-semibold mb-xsmall flex">
                  $ <Number n={merchantD?.credit ?? 0} />
                </h1>
                <h2 className="inter-base-regular text-grey-50">credit</h2>
              </div>
            </div>
          </div>
          <div className="rounded-rounded cusrsor-pointer bg-grey-0 border-grey-20 p-base  w-full border">
            <div className=" flex items-center justify-center">
              <div
                className="flex w-full flex-col items-center justify-center"
                onClick={() => navigate("/a/orders")}
              >
                <h1 className="inter-large-semibold mb-xsmall">
                  {countOrders ? <Number n={countOrders} /> : <Number n={0} />}
                </h1>
                <h2 className="inter-base-regular text-grey-50">Orders</h2>
              </div>
            </div>
          </div>
          <div className="rounded-rounded cusrsor-pointer bg-grey-0 border-grey-20 p-base  w-full border">
            <div className=" flex items-center justify-center">
              <div
                className="flex w-full flex-col items-center justify-center"
                onClick={() => navigate("/a/products")}
              >
                <h1 className="inter-large-semibold mb-xsmall">
                  {countProducts ? (
                    <Number n={countProducts} />
                  ) : (
                    <Number n={0} />
                  )}
                </h1>
                <h2 className="inter-base-regular text-grey-50">
                  Total Products
                </h2>
              </div>
            </div>
          </div>
          <div className="rounded-rounded cusrsor-pointer bg-grey-0 border-grey-20 p-base  w-full border">
            <div className=" flex items-center justify-center">
              <div
                className="flex w-full flex-col items-center justify-center"
                onClick={() => navigate("/a/customers")}
              >
                <h1 className="inter-large-semibold mb-xsmall">
                  {countCustomers ? (
                    <Number n={countCustomers} />
                  ) : (
                    <Number n={0} />
                  )}
                </h1>
                <h2 className="inter-base-regular text-grey-50">
                  Total Customers
                </h2>
              </div>
            </div>
          </div>
        </div>

        {showNewCollection && (
          <WithdrawBalance
            onClose={() => setShowNewCollection(!showNewCollection)}
            originalAmount={merchantD?.balance ?? 0}
          />
        )}
      </div>
      <Spacer />
    </>
  )
}

export default Overview
