import { SalesChannelDTO, UserDTO } from "@medusajs/types"
import { Navigate, Outlet, RouteObject, useLocation } from "react-router-dom"

import { Spinner } from "@medusajs/icons"
import { AdminCollectionsRes } from "@medusajs/medusa"
import { ErrorBoundary } from "../../components/error/error-boundary"
import { MainLayout } from "../../components/layout-v2/main-layout"
import { SettingsLayout } from "../../components/layout/settings-layout"
import { useMe } from "../../hooks/api/users"
import { ApiKeyRes } from "../../types/api-responses"
import { SearchProvider } from "../search-provider"
import { SidebarProvider } from "../sidebar-provider"

export const ProtectedRoute = () => {
  const { user, isLoading } = useMe()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="text-ui-fg-interactive animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return (
    <SidebarProvider>
      <SearchProvider>
        <Outlet />
      </SearchProvider>
    </SidebarProvider>
  )
}

/**
 * Experimental V2 routes.
 *
 * These routes are only available if the `MEDUSA_V2` feature flag is enabled.
 */
export const v2Routes: RouteObject[] = [
  {
    path: "/login",
    lazy: () => import("../../v2-routes/login"),
  },
  {
    path: "/",
    lazy: () => import("../../v2-routes/home"),
  },
  {
    path: "*",
    lazy: () => import("../../routes/no-match"),
  },
  {
    path: "/invite",
    lazy: () => import("../../v2-routes/invite"),
  },
  {
    element: <ProtectedRoute />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "/",
        element: <MainLayout />,
        children: [
          {
            path: "/orders",
            handle: {
              crumb: () => "Orders",
            },
            children: [
              {
                path: "",
                lazy: () => import("../../v2-routes/orders/order-list"),
              },
            ],
          },
          {
            path: "/promotions",
            handle: {
              crumb: () => "Promotions",
            },
            children: [
              {
                path: "",
                lazy: () => import("../../v2-routes/promotions/promotion-list"),
              },
            ],
          },
          {
            path: "/collections",
            handle: {
              crumb: () => "Collections",
            },
            children: [
              {
                path: "",
                lazy: () =>
                  import("../../v2-routes/collections/collection-list"),
                children: [
                  {
                    path: "create",
                    lazy: () =>
                      import("../../v2-routes/collections/collection-create"),
                  },
                ],
              },
              {
                path: ":id",
                lazy: () =>
                  import("../../v2-routes/collections/collection-detail"),
                handle: {
                  crumb: (data: AdminCollectionsRes) => data.collection.title,
                },
                children: [
                  {
                    path: "edit",
                    lazy: () =>
                      import("../../v2-routes/collections/collection-edit"),
                  },
                  {
                    path: "products",
                    lazy: () =>
                      import(
                        "../../v2-routes/collections/collection-add-products"
                      ),
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "/settings",
        element: <SettingsLayout />,
        handle: {
          crumb: () => "Settings",
        },
        children: [
          {
            index: true,
            lazy: () => import("../../v2-routes/settings"),
          },
          {
            path: "profile",
            lazy: () => import("../../v2-routes/profile/profile-detail"),
            handle: {
              crumb: () => "Profile",
            },
            children: [
              {
                path: "edit",
                lazy: () => import("../../v2-routes/profile/profile-edit"),
              },
            ],
          },
          {
            path: "store",
            lazy: () => import("../../v2-routes/store/store-detail"),
            handle: {
              crumb: () => "Store",
            },
            children: [
              {
                path: "edit",
                lazy: () => import("../../v2-routes/store/store-edit"),
              },
              {
                path: "currencies",
                lazy: () =>
                  import("../../v2-routes/store/store-add-currencies"),
              },
            ],
          },
          {
            path: "users",
            element: <Outlet />,
            handle: {
              crumb: () => "Users",
            },
            children: [
              {
                path: "",
                lazy: () => import("../../v2-routes/users/user-list"),
                children: [
                  {
                    path: "invite",
                    lazy: () => import("../../v2-routes/users/user-invite"),
                  },
                ],
              },
              {
                path: ":id",
                lazy: () => import("../../v2-routes/users/user-detail"),
                handle: {
                  crumb: (data: { user: UserDTO }) => data.user.email,
                },
                children: [
                  {
                    path: "edit",
                    lazy: () => import("../../v2-routes/users/user-edit"),
                  },
                ],
              },
            ],
          },
          {
            path: "locations",
            element: <Outlet />,
            handle: {
              crumb: () => "Locations",
            },
            children: [
              {
                path: "",
                lazy: () => import("../../v2-routes/locations/location-list"),
                children: [
                  {
                    path: "create",
                    lazy: () =>
                      import("../../v2-routes/locations/location-create"),
                  },
                ],
              },
              {
                path: ":id",
                lazy: () => import("../../v2-routes/locations/location-detail"),
                children: [
                  {
                    path: "edit",
                    lazy: () =>
                      import("../../v2-routes/locations/location-edit"),
                  },
                  {
                    path: "add-sales-channels",
                    lazy: () =>
                      import(
                        "../../v2-routes/locations/location-add-sales-channels"
                      ),
                  },
                ],
              },
            ],
          },
          {
            path: "sales-channels",
            element: <Outlet />,
            handle: {
              crumb: () => "Sales Channels",
            },
            children: [
              {
                path: "",
                lazy: () =>
                  import("../../v2-routes/sales-channels/sales-channel-list"),
                children: [
                  {
                    path: "create",
                    lazy: () =>
                      import(
                        "../../v2-routes/sales-channels/sales-channel-create"
                      ),
                  },
                ],
              },
              {
                path: ":id",
                lazy: () =>
                  import("../../v2-routes/sales-channels/sales-channel-detail"),
                handle: {
                  crumb: (data: { sales_channel: SalesChannelDTO }) =>
                    data.sales_channel.name,
                },
                children: [
                  {
                    path: "edit",
                    lazy: () =>
                      import(
                        "../../v2-routes/sales-channels/sales-channel-edit"
                      ),
                  },
                  {
                    path: "add-products",
                    lazy: () =>
                      import(
                        "../../v2-routes/sales-channels/sales-channel-add-products"
                      ),
                  },
                ],
              },
            ],
          },
          {
            path: "workflows",
            element: <Outlet />,
            handle: {
              crumb: () => "Workflows",
            },
            children: [
              {
                path: "",
                lazy: () =>
                  import(
                    "../../v2-routes/workflow-executions/workflow-execution-list"
                  ),
              },
              {
                path: ":id",
                lazy: () =>
                  import(
                    "../../v2-routes/workflow-executions/workflow-execution-detail"
                  ),
                handle: {
                  crumb: (data: { workflow: any }) => {
                    if (!data) {
                      return ""
                    }

                    return data.workflow.name
                  },
                },
              },
            ],
          },
          {
            path: "api-key-management",
            element: <Outlet />,
            handle: {
              crumb: () => "API Key Management",
            },
            children: [
              {
                path: "",
                lazy: () =>
                  import(
                    "../../v2-routes/api-key-management/api-key-management-list"
                  ),
                children: [
                  {
                    path: "create",
                    lazy: () =>
                      import(
                        "../../v2-routes/api-key-management/api-key-management-create"
                      ),
                  },
                ],
              },
              {
                path: ":id",
                lazy: () =>
                  import(
                    "../../v2-routes/api-key-management/api-key-management-detail"
                  ),
                handle: {
                  crumb: (data: ApiKeyRes) => {
                    console.log("data", data)
                    return data.apiKey.title
                  },
                },
                children: [
                  {
                    path: "edit",
                    lazy: () =>
                      import(
                        "../../v2-routes/api-key-management/api-key-management-edit"
                      ),
                  },
                  {
                    path: "add-sales-channels",
                    lazy: () =>
                      import(
                        "../../v2-routes/api-key-management/api-key-management-add-sales-channels"
                      ),
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]
