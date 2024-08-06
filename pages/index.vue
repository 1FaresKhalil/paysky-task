<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useStore } from '@/stores/useStore';
import {
  Activity,
  ArrowUpRight,
  CreditCard,
  DollarSign,
  Users,
} from 'lucide-vue-next';

const store = useStore();
definePageMeta({
  middleware: 'auth',
});
const isLoading = ref(false);
const error = ref<string | null>(null);

const fetchData = async () => {
  try {
    isLoading.value = true;
    await Promise.all([store.fetchProducts(), store.fetchCategories()]);
  } catch (fetchError) {
    const errorObj = fetchError as Error;
    error.value = errorObj.message;
  } finally {
    isLoading.value = false;
  }
};

const calculateRevenueAndAvgPrice = () => {
  if (store.products.length > 0) {
    const total = store.products.reduce(
      (sum, product) => sum + product.price,
      0
    );
    return {
      totalRevenue: total,
      avgPrice: total / store.products.length,
    };
  }
  return { totalRevenue: 0, avgPrice: 0 };
};

const { totalRevenue, avgPrice } = calculateRevenueAndAvgPrice();

onMounted(() => {
  fetchData();
});
</script>

<template>
  <div class="w-full flex flex-col gap-4">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <h2 class="text-3xl font-bold tracking-tight">Dashboard</h2>
    </div>
    <main class="flex flex-1 flex-col gap-4 md:gap-8">
      <div class="grid gap-4 lg:grid-cols-4 md:grid-cols-2 md:gap-8">
        <Card>
          <CardHeader
            class="flex flex-row items-center justify-between pb-2 space-y-0"
          >
            <CardTitle class="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">${{ totalRevenue.toFixed(2) }}</div>
            <p class="text-xs text-muted-foreground">
              Calculated from products
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader
            class="flex flex-row items-center justify-between pb-2 space-y-0"
          >
            <CardTitle class="text-sm font-medium">Total Products</CardTitle>
            <Users class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">{{ store.products.length }}</div>
            <p class="text-xs text-muted-foreground">Products in store</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader
            class="flex flex-row items-center justify-between pb-2 space-y-0"
          >
            <CardTitle class="text-sm font-medium">Average Price</CardTitle>
            <CreditCard class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">${{ avgPrice.toFixed(2) }}</div>
            <p class="text-xs text-muted-foreground">
              Average price of products
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader
            class="flex flex-row items-center justify-between pb-2 space-y-0"
          >
            <CardTitle class="text-sm font-medium">Total Categories</CardTitle>
            <Activity class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">{{ store.categories.length }}</div>
            <p class="text-xs text-muted-foreground">Product categories</p>
          </CardContent>
        </Card>
      </div>
      <div class="grid gap-4 lg:grid-cols-2 xl:grid-cols-3 md:gap-8">
        <Card class="xl:col-span-2">
          <CardHeader class="flex flex-row items-center">
            <div class="grid gap-2">
              <CardTitle>Products</CardTitle>
              <CardDescription
                >Recent products from your store.</CardDescription
              >
            </div>
            <Button as-child size="sm" class="ml-auto gap-1">
              <a href="#">
                View All
                <ArrowUpRight class="h-4 w-4" />
              </a>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead class="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="product in store.products" :key="product.id">
                  <TableCell>
                    <div class="font-medium">{{ product.title }}</div>
                  </TableCell>
                  <TableCell class="text-right">${{ product.price }}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent class="grid gap-8">
            <div
              v-for="category in store.categories"
              :key="category.id"
              class="flex items-center gap-4"
            >
              <div class="grid gap-1">
                <p class="text-sm font-medium leading-none">
                  {{ category.name }}
                </p>
                <p class="text-xs text-muted-foreground">
                  Products: {{ category.productCount }}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  </div>
</template>
