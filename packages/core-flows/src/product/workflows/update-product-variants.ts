import { PricingTypes, ProductTypes } from "@medusajs/types"
import {
  WorkflowData,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import { updateProductVariantsStep } from "../steps"
import { updatePriceSetsStep } from "../../pricing"
import { getVariantPricingLinkStep } from "../steps/get-variant-pricing-link"

type UpdateProductVariantsStepInput = {
  selector: ProductTypes.FilterableProductVariantProps
  update: ProductTypes.UpdateProductVariantDTO & {
    prices?: PricingTypes.CreateMoneyAmountDTO[]
  }
}

type WorkflowInput = UpdateProductVariantsStepInput

export const updateProductVariantsWorkflowId = "update-product-variants"
export const updateProductVariantsWorkflow = createWorkflow(
  updateProductVariantsWorkflowId,
  (
    input: WorkflowData<WorkflowInput>
  ): WorkflowData<ProductTypes.ProductVariantDTO[]> => {
    // Passing prices to the product module will fail, we want to keep them for after the variant is updated.
    const updateWithoutPrices = transform({ input }, (data) => {
      return {
        selector: data.input.selector,
        update: {
          ...data.input.update,
          prices: undefined,
        },
      }
    })

    const updatedVariants = updateProductVariantsStep(updateWithoutPrices)

    // We don't want to do any pricing updates if the prices didn't change
    const variantIds = transform({ input, updatedVariants }, (data) => {
      if (!data.input.update.prices) {
        return []
      }

      return data.updatedVariants.map((v) => v.id)
    })

    const variantPriceSetLinks = getVariantPricingLinkStep({
      ids: variantIds,
    })

    const pricesToUpdate = transform(
      { input, variantPriceSetLinks },
      (data) => {
        if (!data.variantPriceSetLinks.length) {
          return {}
        }

        return {
          selector: {
            id: data.variantPriceSetLinks.map((link) => link.price_set_id),
          } as PricingTypes.FilterablePriceSetProps,
          update: {
            prices: data.input.update.prices,
          } as PricingTypes.UpdatePriceSetDTO,
        }
      }
    )

    const updatedPriceSets = updatePriceSetsStep(pricesToUpdate)

    // We want to correctly return the variants with their associated price sets and the prices coming from it
    return transform(
      {
        variantPriceSetLinks,
        updatedVariants,
        updatedPriceSets,
      },
      (data) => {
        return data.updatedVariants.map((variant, i) => {
          const linkForVariant = data.variantPriceSetLinks?.find(
            (link) => link.variant_id === variant.id
          )

          const priceSetForVariant = data.updatedPriceSets?.find(
            (priceSet) => priceSet.id === linkForVariant?.price_set_id
          )

          return { ...variant, price_set: priceSetForVariant }
        })
      }
    )
  }
)
