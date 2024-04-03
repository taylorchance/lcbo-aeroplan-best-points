<script setup>
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

const { data, pending } = await useFetch('https://platform.cloud.coveo.com/rest/search/v2', {
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

const { results } = data.value

console.log('results', results)

const sortBy = ref('pointsPerDollar')
const sortDesc = ref(false)
const currentFilter = ref(null)

const sortedResults = computed(() => {
  let filteredResults = results

  if (currentFilter.value) {
    filteredResults = results.filter(product => {
      console.log('product', product)
      return product.raw.ec_category_filter[0].includes(currentFilter.value)
    })
  }

  return filteredResults.sort((a, b) => {
    let aVal, bVal
    if (sortBy.value === 'pointsPerDollar') {
      aVal = a.raw.loyalty_points / a.raw.ec_price
      bVal = b.raw.loyalty_points / b.raw.ec_price
    } else if (sortBy.value === 'price') {
      aVal = a.raw.ec_price
      bVal = b.raw.ec_price
    } else if (sortBy.value === 'aeroplanPoints') {
      aVal = a.raw.loyalty_points
      bVal = b.raw.loyalty_points
    }
    return sortDesc.value ? aVal - bVal : bVal - aVal
  })
})

const formatCategories = (categories) => {
  if (!categories) return []
  return categories.split('|').slice(1)
}

const filters = Object.entries(
  results.reduce((acc, product) => {
    const keywords = formatCategories(product.raw.ec_category_filter[0])
    keywords.forEach(keyword => {      
      acc[keyword] = (acc[keyword] || 0) + 1
    })
    return acc
  }, []))
  .filter(entry => entry[1] > 2)
  .sort((a, b) => b[1] - a[1])
  .map(entry => entry[0])

const formatDate = (string) => {
  const date = new Date(string)
  const formattedDate = `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}`
  return formattedDate
}
</script>

<template>
  <section class="section">

    <h1 v-if="pending"class="title">
      pending
    </h1>

    <div v-else class="container">
      <h1 class="title">
        LCBO Aeroplan Scraper
      </h1>

      <div class="tags">
        <span
          v-for="filter in filters"
          :key="filter"
          :class="`tag is-clickable ${currentFilter === filter && 'is-black'}`"
          @click="currentFilter = currentFilter === filter ? null : filter"
        >
          {{ filter }}
        </span>
      </div>

      <button v-if="currentFilter" class="button" @click="currentFilter = null">
        Clear filter
      </button>

      <div class="table-container">
        <table class="table is-fullwidth is-striped">
          <thead>
            <tr>
              <th></th>
              <th>Category</th>
              <th class="is-clickable" @click="sortBy === 'price' ? sortDesc = !sortDesc : sortBy = 'price'">
                Price
                <span v-if="sortBy === 'price'" class="icon">
                  <i :class="`fa-solid fa-chevron-${sortDesc ? 'up' : 'down'}`"></i>
                </span>
              </th>
              <th class="is-clickable" @click="sortBy === 'aeroplanPoints' ? sortDesc = !sortDesc : sortBy = 'aeroplanPoints'">
                Aeroplan points
                <span v-if="sortBy === 'aeroplanPoints'" class="icon">
                  <i :class="`fa-solid fa-chevron-${sortDesc ? 'up' : 'down'}`"></i>
                </span>
              </th>
              <th class="is-clickable" @click="sortBy === 'pointsPerDollar' ? sortDesc = !sortDesc : sortBy = 'pointsPerDollar'">
                Points/$
                <span v-if="sortBy === 'pointsPerDollar'" class="icon">
                  <i :class="`fa-solid fa-chevron-${sortDesc ? 'up' : 'down'}`"></i>
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in sortedResults" :key="product.uniqueId">
              <td>
                <div class="is-flex">
                  <figure class="image is-96x96">
                    <img :src="product.raw.ec_thumbnails" />
                  </figure>
                  <div>
                    <h2 class="subtitle">{{ product.title }}</h2>
                    <a :href="product.ClickUri" target="_blank">View LCBO product</a>
                  </div>
                </div>
              </td>
              <td>
                <div class="tags">
                  <span
                    v-for="filter in formatCategories(product.raw.ec_category_filter[0])"
                    :key="filter"class="tag is-clickable"
                    @click="currentFilter = filter"
                  >
                    {{ filter }}
                  </span>
                </div>

              </td>
              <td>
                ${{ product.raw.ec_price }}
              </td>
              <td style="white-space: nowrap;">
                {{ product.raw.loyalty_points }}
                <p>valid until {{ formatDate(product.raw.loyalty_enddate) }}</p>
              </td>
              <td>
                {{ Math.round(product.raw.loyalty_points / product.raw.ec_price * 100) / 100 }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<style>
/* body, #__nuxt {
  min-height: 100vh;
  -webkit-text-size-adjust: 100%;
  font-variant-ligatures: none;
  -webkit-font-variant-ligatures: none;
  text-rendering: optimizeLegibility;
  -moz-osx-font-smoothing: grayscale;
  font-smoothing: antialiased;
  -webkit-font-smoothing: antialiased;
  font-family: Archivo Variable, sans-serif !important;
  font-size: 18px;
  overflow: hidden;
} */

th {
  white-space: nowrap;
}

/* .tags {
  flex-wrap: nowrap;
  overflow: scroll;
} */
</style>