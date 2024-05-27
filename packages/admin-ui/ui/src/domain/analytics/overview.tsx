import { Product } from "@medusajs/medusa"
import {
  useAdminDeleteProduct,
  useAdminProducts,
  useAdminStore,
  useAdminUpdateProduct,
  useAdminCustomers,
  useAdminOrders,
  useAdminGetSession
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

const Number = ({ n }: TNumber)=>{

  const { number } = useSpring({
    from: { number: 0}, 
    number: n,
    delay: 200,
    config: { mass: 1, tension: 20, friction: 10}
  })

  return <animated.div >{number.to((n) => n.toFixed(0))}</animated.div>
}


const Overview =  () => {
  const { t } = useTranslation()
  const notification = useNotification()
  const { user }  = useAdminGetSession()
  const { products, count: countProducts,  isLoading } = useAdminProducts()
  const { customers, count: countCustomers, isLoading: customerLoading } = useAdminCustomers()
  const { orders, count: countOrders, isLoading: ordersLoading } = useAdminOrders()
  const [showNewCollection, setShowNewCollection] = useState(false)
  const [merchant,  setMerchant] = useState<any>(null)
  const navigate = useNavigate()
  useEffect(()=>{
    const getMerchant = async () => {
      await Medusa.merchant.retrieve().then((response: any) => {
        if (response) {
          setMerchant(response)
          notification(
            t("gift-cards-success", "Success"),
            t(
              "merchant detail is retrieved successfully."
            ),
            "success"
          )
        }
        else{
          notification(
            t("gift-cards-success", "Success"),
            t(
              response
            ),
            "error"
          )
        }
      }).catch((error: any) => {
        notification(
          t("gift-cards-success", "Success"),
          t(
            error
          ),
          "error"
        )
      })
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
          <div className="w-full flex justify-end space-x-2">
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
        <div className="medium:grid-cols-2 gap-y-xsmall grid grid-cols-1 gap-x-4">
            <div className="rounded-rounded cusrsor-pointer bg-grey-0 border-grey-20 p-base  w-full border">
              <div className=" flex justify-center items-center">
                <div className="w-full flex flex-col justify-center items-center">
                  <h1 className="inter-large-semibold mb-xsmall flex">$ <Number n={merchant.balance}/></h1>
                  <h2 className="inter-base-regular text-grey-50">Total Balance</h2>
                </div>
              </div>
            </div>
            <div className="rounded-rounded cusrsor-pointer bg-grey-0 border-grey-20 p-base  w-full border">
              <div className=" flex justify-center items-center">
                <div className="w-full flex flex-col justify-center items-center">
                  <h1 className="inter-large-semibold mb-xsmall flex">$ <Number n={merchant.debit}/></h1>
                  <h2 className="inter-base-regular text-grey-50">Total debit</h2>
                </div>
              </div>
            </div>
            <div className="rounded-rounded cusrsor-pointer bg-grey-0 border-grey-20 p-base  w-full border">
              <div className=" flex justify-center items-center">
                <div className="w-full flex flex-col justify-center items-center">
                  <h1 className="inter-large-semibold mb-xsmall flex">$ <Number n={merchant.credit}/></h1>
                  <h2 className="inter-base-regular text-grey-50">Total credit</h2>
                </div>
              </div>
            </div>
            <div  className="rounded-rounded cusrsor-pointer bg-grey-0 border-grey-20 p-base  w-full border">
              <div className=" flex justify-center items-center">
                <div className="w-full flex flex-col justify-center items-center" onClick={ () => navigate("/a/orders")}>
                  <h1 className="inter-large-semibold mb-xsmall">{ countOrders?<Number n={countOrders}/> :<Number n={25000}/>}</h1>
                  <h2 className="inter-base-regular text-grey-50">Total Orders</h2>
                </div>
              </div>
            </div>
            <div  className="rounded-rounded cusrsor-pointer bg-grey-0 border-grey-20 p-base  w-full border">
              <div className=" flex justify-center items-center">
                <div className="w-full flex flex-col justify-center items-center" onClick = { () => navigate("/a/products")}>
                  <h1 className="inter-large-semibold mb-xsmall">{ countProducts? <Number n={countProducts}/>: <Number n={200000}/> }</h1>
                  <h2 className="inter-base-regular text-grey-50">Total Products</h2>
                </div>
                
              </div>
            </div>
            <div   className="rounded-rounded cusrsor-pointer bg-grey-0 border-grey-20 p-base  w-full border">
              <div className=" flex justify-center items-center">
                <div className="w-full flex flex-col justify-center items-center" onClick={ () => navigate("/a/customers")}>
                  <h1 className="inter-large-semibold mb-xsmall">{ countCustomers? <Number n={countCustomers}/> : <Number n={100000}/> }</h1>
                  <h2 className="inter-base-regular text-grey-50">Total Customers</h2>
                </div>
              </div>
            </div>
            
        </div>

        {showNewCollection && (
        <WithdrawBalance
          onClose={() => setShowNewCollection(!showNewCollection)}
        />
      )}
      </div>
      <Spacer />
    </>
  )
}

export default Overview
