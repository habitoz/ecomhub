import { Route, Routes } from "react-router-dom"
import RouteContainer from "../../components/extensions/route-container"
import { useRoutes } from "../../providers/route-provider"
import Overview from "./overview"

const GiftCard = () => {
  const { getNestedRoutes } = useRoutes()

  const nestedRoutes = getNestedRoutes("/analytics")

  return (
    <Routes>
      <Route path="/" element={<Overview />} />
      {nestedRoutes.map((r, i) => {
        return (
          <Route
            path={r.path}
            key={i}
            element={<RouteContainer route={r} previousPath={"/analytics"} />}
          />
        )
      })}
    </Routes>
  )
}

export default GiftCard
