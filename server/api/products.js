import { $fetch } from 'ofetch'

const facets = [
  {
    facetId: "@ec_category",
    field: "ec_category",
    type: "hierarchical",
    injectionDepth: 1000,
    delimitingCharacter: "|",
    filterFacetCount: true,
    basePath: ["Products"],
    filterByBasePath: false,
    currentValues: [],
    preventAutoSelect: false,
    numberOfValues: 5,
    isFieldExpanded: false,
  },
  {
    facetId: "@lcbo_varietal_name",
    field: "lcbo_varietal_name",
    type: "specific",
    sortCriteria: "occurrences",
    injectionDepth: 1000,
    filterFacetCount: true,
    currentValues: [],
    numberOfValues: 5,
    freezeCurrentValues: false,
    preventAutoSelect: false,
    isFieldExpanded: false,
  },
  { facetId: "@lcbo_vqa_code", field: "lcbo_vqa_code", type: "specific", injectionDepth: 1000, filterFacetCount: true, currentValues: [], numberOfValues: 8, freezeCurrentValues: false, preventAutoSelect: false, isFieldExpanded: false },
  {
    facetId: "@country_of_manufacture",
    field: "country_of_manufacture",
    type: "specific",
    sortCriteria: "occurrences",
    injectionDepth: 1000,
    filterFacetCount: true,
    currentValues: [],
    numberOfValues: 5,
    freezeCurrentValues: false,
    preventAutoSelect: false,
    isFieldExpanded: false,
  },
  {
    facetId: "@lcbo_region_name",
    field: "lcbo_region_name",
    type: "specific",
    sortCriteria: "occurrences",
    injectionDepth: 1000,
    filterFacetCount: true,
    currentValues: [],
    numberOfValues: 5,
    freezeCurrentValues: false,
    preventAutoSelect: false,
    isFieldExpanded: false,
  },
  {
    facetId: "@lcbo_program",
    field: "lcbo_program",
    type: "specific",
    sortCriteria: "occurrences",
    injectionDepth: 1000,
    filterFacetCount: true,
    currentValues: [],
    numberOfValues: 5,
    freezeCurrentValues: false,
    preventAutoSelect: false,
    isFieldExpanded: false,
  },
  {
    facetId: "@lcbo_current_offer",
    field: "lcbo_current_offer",
    type: "specific",
    sortCriteria: "occurrences",
    injectionDepth: 1000,
    filterFacetCount: true,
    currentValues: [{ value: "Aeroplan Offers]')", state: "selected" }],
    numberOfValues: 8,
    freezeCurrentValues: false,
    preventAutoSelect: false,
    isFieldExpanded: false,
  },
  { facetId: "@stores_stock", field: "stores_stock", type: "specific", injectionDepth: 1000, filterFacetCount: true, currentValues: [], numberOfValues: 8, freezeCurrentValues: false, preventAutoSelect: false, isFieldExpanded: false },
  {
    facetId: "@ec_rating",
    field: "ec_rating",
    type: "numericalRange",
    sortCriteria: "descending",
    injectionDepth: 1000,
    filterFacetCount: true,
    currentValues: [
      { start: 1, end: 1.9, endInclusive: true, state: "idle" },
      { start: 2, end: 2.9, endInclusive: true, state: "idle" },
      { start: 3, end: 3.9, endInclusive: true, state: "idle" },
      { start: 4, end: 4.9, endInclusive: true, state: "idle" },
      { start: 5, end: 5, endInclusive: true, state: "idle" },
    ],
    numberOfValues: 5,
    freezeCurrentValues: false,
    generateAutomaticRanges: false,
  },
]

const formatCategories = (categories) => {
  if (!categories) return []
  return categories.split('|').slice(1)
}

const fetchProducts = async () => {
  const { results } = await $fetch('https://platform.cloud.coveo.com/rest/search/v2', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + 'xx883b5583-07fb-416b-874b-77cce565d927'
    },
    body: JSON.stringify({
      cq: '(@source==ProductsEN @ec_visibility==(2,4) @cp_browsing_category_deny<>0 @ec_category==Products) NOT @enabled==false',
      facets: facets,
      numberOfResults: 9999,
      excerptLength: 200
    })
  })

  return results.map(product => {
    return {
      id: product.uniqueId,
      image: product.raw.ec_thumbnails,
      title: product.title,
      url: product.ClickUri,
      categories: formatCategories(product.raw.ec_category_filter[0]),
      originalPrice: product.raw.ec_price,
      price: product.raw.ec_final_price,
      points: product.raw.loyalty_points,
      endDate: product.raw.loyalty_enddate,
    }
  })
}

export default defineEventHandler(() => {
  return fetchProducts()
})