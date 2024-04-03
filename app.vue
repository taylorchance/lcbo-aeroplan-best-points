<script setup>
const { data, pending } = await useFetch('/api/products')
console.log('data.value', data.value)

const sortBy = ref('pointsPerDollar')
const sortDesc = ref(false)
const currentFilter = ref(null)

const sortedProducts = computed(() => {
  let filteredProducts = data.value
  if (currentFilter.value) {
    filteredProducts = data.value.filter(product => product.categories.includes(currentFilter.value))
  }

  return filteredProducts.sort((a, b) => {
    let aVal, bVal
    if (sortBy.value === 'pointsPerDollar') {
      aVal = a.points / a.price
      bVal = b.points / b.price
    } else if (sortBy.value === 'price') {
      aVal = a.price
      bVal = b.price
    } else if (sortBy.value === 'aeroplanPoints') {
      aVal = a.points
      bVal = b.points
    }
    return sortDesc.value ? aVal - bVal : bVal - aVal
  })
})

const categoryCounts = data.value.reduce((acc, product) => {    
  product.categories.forEach(category => {      
    acc[category] = (acc[category] || 0) + 1
  })
  return acc
}, [])

const filters = Object
  .entries(categoryCounts)
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

  <div class="top-banner-ae"></div>
  
  <section class="ae-content">
    <div v-if="pending" class="hero is-fullheight">
      <div class="hero-body is-justify-content-center">
        <div class="loader is-loading is-size-1"></div>
        </div>
    </div>

    <div v-else-if="data" class="container">
      <h1 class="title mb-0">
        LCBO Aeroplan Points Maximizer
      </h1>
        
      <div class="level">
        <div class="field">
          <label class="label">Filters</label>
          <div class="control">
            <div class="select">
              <select v-model="currentFilter" >
                <option :value="null">Select filter</option>
                <option
                  v-for="filter in filters"
                  :key="filter"
                  :value="filter"
                >
                  {{ filter }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div class="field is-hidden-tablet">
          <label class="label">Sort by</label>
          <div class="control">
            <div class="select">
              <select v-model="sortBy">
                <option>Select sort</option>
                <option value="price">
                  Price
                </option>
                <option value="aeroplanPoints">
                  Points
                </option>
                <option value="pointsPerDollar">
                  Ratio
                </option>
              </select>
            </div>
          </div>
        </div>

        <div class="field is-hidden-tablet">
          <label class="label">Sort order</label>
          <div class="control">
            <div class="select">
              <select v-model="sortDesc">
                <option :value="true">
                  Descending
                </option>
                <option :value="false">
                  Ascending
                </option>
              </select>
            </div>
          </div>
        </div>

        <button v-if="currentFilter" class="button" @click="currentFilter = null">
          Clear filter
        </button>
      </div>

      <div class="table-container">
        <table class="table is-fullwidth is-striped">
          <thead>
            <tr>
              <th></th>
              <th>Category</th>
              <th class="is-clickable" @click="sortBy === 'price' ? sortDesc = !sortDesc : sortBy = 'price'">
                Price
                <span v-if="sortBy === 'price'" class="icon">
                  <img v-if="sortDesc" src="/assets/images/chevron-down.svg" />
                  <img v-else src="/assets/images/chevron-up.svg" />
                </span>
              </th>
              <th class="is-clickable" @click="sortBy === 'aeroplanPoints' ? sortDesc = !sortDesc : sortBy = 'aeroplanPoints'">
                Points
                <span v-if="sortBy === 'aeroplanPoints'" class="icon">
                  <img v-if="sortDesc" src="/assets/images/chevron-down.svg" />
                  <img v-else src="/assets/images/chevron-up.svg" />
                </span>
              </th>
              <th class="is-clickable" @click="sortBy === 'pointsPerDollar' ? sortDesc = !sortDesc : sortBy = 'pointsPerDollar'">
                Ratio
                <span v-if="sortBy === 'pointsPerDollar'" class="icon">
                  <img v-if="sortDesc" src="/assets/images/chevron-down.svg" />
                  <img v-else src="/assets/images/chevron-up.svg" />
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in sortedProducts" :key="product.id">
              <td>
                <div class="is-flex is-relative is-align-items-center">
                  <figure class="image is-96x96">
                    <img :src="product.image" />
                  </figure>
                  <div>
                    <h2 class="subtitle">{{ product.title }}</h2>
                    <a :href="product.url" target="_blank" class="help">View LCBO product</a>

                    <div class="level is-mobile is-hidden-tablet is-size-4 mb-0">
                      <p>${{ product.price }}</p>
                      <p>
                        <span>{{ product.points }}</span>
                        <span class="pts">pts</span>
                      </p>
                      <p>
                        {{ Math.round(product.points / product.price * 100) / 100 }}<span class="pts">pts / $</span>
                      </p>
                    </div>
                    <div class="tags is-hidden-tablet">
                      <span
                        v-for="filter in product.categories"
                        :key="filter"
                        :class="`tag is-clickable ${currentFilter === filter ? 'is-primary' : ''}`"
                        @click="currentFilter = filter"
                      >
                        {{ filter }}
                      </span>
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <div class="tags">
                  <span
                    v-for="filter in product.categories"
                    :key="filter"
                    :class="`tag is-clickable ${currentFilter === filter ? 'is-primary' : ''}`"
                    @click="currentFilter = filter"
                  >
                    {{ filter }}
                  </span>
                </div>

              </td>
              <td>
                ${{ product.price }}
              </td>
              <td style="white-space: nowrap;">
                <span>{{ product.points }}</span>
                <span class="pts">pts</span>
                <p class="help">valid until {{ formatDate(product.endDate) }}</p>
              </td>
              <td style="white-space: nowrap;">
                {{ Math.round(product.points / product.price * 100) / 100 }}<span class="pts">pts / $</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<style>
body, #__nuxt {
  min-height: 100vh;
  -webkit-text-size-adjust: 100%;
  font-variant-ligatures: none;
  -webkit-font-variant-ligatures: none;
  text-rendering: optimizeLegibility;
  -moz-osx-font-smoothing: grayscale;
  font-smoothing: antialiased;
  -webkit-font-smoothing: antialiased;
  font-family: 'Open Sans', sans-serif;
  font-size: 18px;
  overflow: hidden;
}

.top-banner-ae {
  background: url('https://www.aircanada.com/content/dam/aircanada/loyalty-content/images/hero-aeroplan.png') center center;
  background-repeat: no-repeat;
  height: 500px;
  background-size: cover;
  margin-top: -100px;
}

.ae-content {
  background: #fff;
  padding: 4em;
  position: relative;
  margin: 0px auto;
  margin-top: -200px;
  width: calc(100% - 60px);
}

.title {
  font: normal 300 36px Open Sans;
  color: #000;
}

.subtitle, th {
  font: normal 400 20px Open Sans;
  color: #000;
  margin-bottom: 0 !important;
}

.table th {
  white-space: nowrap;
  font-size: 18px;
}

.table th .icon {
  width: 18px;
  padding-left: 5px;
  position: absolute;
}

.table td {
  font-weight: 600;
  font-size: 16px;
  line-height: 1.5;
  max-width: 150px;
}

.table td:not(:first-child) {
  padding-top: 1rem;
}

.help {
  color: #5f5f5f;
  font-weight: 700;
  margin-top: 0;
}

span.pts {
  font-weight: 400;
  font-size: 10px;
  margin-left: 3px;
}

.image img {
  display: block;
  height: 100%;
  width: auto;
}

.tag {
  border-radius: 0;
  font-weight: 400;
}

.tag.is-primary {
  background: #005078;
  color: #fff;
}

.button {
  background: #005078;
  color: #fff;
  border-radius: 0;
  border: 0;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.25px;
  padding: 12px 30px;
  text-decoration: underline;
}

@media only screen and (max-width: 1023px) {
  .ae-content {
    width: calc(100% - 30px);
    padding: 4em 2em;
    padding: 30px;
  }

  .table-container {
    margin-inline: -45px;
    max-width: 100vw;
    width: 100vw;
  }
}

@media only screen and (max-width: 768px) {
  .table thead {
    display: none;
  }

  .table td {
    max-width: none;
    border: 0;
  }

  .table tbody tr td:nth-child(n+2) {
    display: none;
  }

  .field, .select, select {
    width: 100%;
  }
}
</style>