<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useAppConf } from '@/composables/useAppConf';
import { useStore } from '@/stores/useStore';
import type { Product } from '@/stores/useStore';
const { backgroundIsWhite } = useAppConf();
backgroundIsWhite();

onUnmounted(() => backgroundIsWhite(false));

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const store = useStore();

const currentProduct = ref<Omit<Product, 'id'>>({
  title: '',
  price: 0,
  description: '',
  category: '',
  image: '',
});
const isEditing = ref(false);
const currentEditId = ref<number | null>(null);

const touched = ref({
  title: false,
  price: false,
  description: false,
  category: false,
  image: false,
});

const addProduct = async () => {
  const addedProduct = await $fetch<Product>(
    'https://fakestoreapi.com/products',
    {
      method: 'POST',
      body: JSON.stringify(currentProduct.value),
    }
  );
  store.addProduct(addedProduct);
  resetCurrentProduct();
};

const editProduct = async () => {
  if (currentEditId.value !== null) {
    const editedProduct = await $fetch<Product>(
      `https://fakestoreapi.com/products/${currentEditId.value}`,
      {
        method: 'PUT',
        body: JSON.stringify(currentProduct.value),
      }
    );
    store.editProduct(editedProduct);
    resetCurrentProduct();
    isEditing.value = false;
    currentEditId.value = null;
  }
};

const deleteProduct = async (id: number) => {
  await $fetch(`https://fakestoreapi.com/products/${id}`, {
    method: 'DELETE',
  });
  store.deleteProduct(id);
};

const setProductToEdit = (product: Product) => {
  currentProduct.value = { ...product };
  isEditing.value = true;
  currentEditId.value = product.id;
  resetTouched();
};

const resetCurrentProduct = () => {
  currentProduct.value = {
    title: '',
    price: 0,
    description: '',
    category: '',
    image: '',
  };
  resetTouched();
};

const resetTouched = () => {
  touched.value = {
    title: false,
    price: false,
    description: false,
    category: false,
    image: false,
  };
};

const isFormValid = computed(() => {
  return (
    currentProduct.value.title.trim() !== '' &&
    currentProduct.value.price > 0 &&
    currentProduct.value.description.trim() !== '' &&
    currentProduct.value.category.trim() !== '' &&
    currentProduct.value.image.trim() !== ''
  );
});

onMounted(() => {
  if (!store.products.length) store.fetchProducts();
  if (!store.categories.length) store.fetchCategories();
});

const products = computed(() => store.products);
const categories = computed(() => store.categories);
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button
        variant="outline"
        @click="
          isEditing = false;
          resetCurrentProduct();
        "
        >Add product</Button
      >
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{{ isEditing ? 'Edit' : 'Add' }} product</DialogTitle>
        <DialogDescription>{{
          isEditing ? 'Edit the product details' : 'Add a new product'
        }}</DialogDescription>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="title" class="text-right">Name</Label>
          <Input
            v-model="currentProduct.title"
            id="title"
            class="col-span-3 !ring-offset-0 !ring-0 border-grey-100"
            @blur="touched.title = true"
            :class="{
              'border-red-500':
                touched.title && currentProduct.title.trim() === '',
            }"
          />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="price" class="text-right">Price</Label>
          <Input
            v-model="currentProduct.price"
            id="price"
            type="number"
            class="col-span-3 !ring-offset-0 !ring-0 border-grey-100"
            @blur="touched.price = true"
            :class="{
              'border-red-500': touched.price && currentProduct.price <= 0,
            }"
          />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="description" class="text-right">Description</Label>
          <Input
            v-model="currentProduct.description"
            id="description"
            class="col-span-3 !ring-offset-0 !ring-0 border-grey-100"
            @blur="touched.description = true"
            :class="{
              'border-red-500':
                touched.description && currentProduct.description.trim() === '',
            }"
          />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="category" class="text-right">Category</Label>
          <Select
            v-model="currentProduct.category"
            id="category"
            class="w-full border !ring-offset-0 !ring-0 border-grey-100"
            @blur="touched.category = true"
            :class="{
              'border-red-500':
                touched.category && currentProduct.category.trim() === '',
            }"
          >
            <SelectTrigger
              class="w-full flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 col-span-3 !ring-offset-0 !ring-0 border-grey-100"
            >
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Categories</SelectLabel>
                <SelectItem
                  v-for="category in categories"
                  :key="category.id"
                  :value="category.name"
                >
                  {{ category.name }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="image" class="text-right">Image URL</Label>
          <Input
            v-model="currentProduct.image"
            id="image"
            class="col-span-3 !ring-offset-0 !ring-0 border-grey-100"
            @blur="touched.image = true"
            :class="{
              'border-red-500':
                touched.image && currentProduct.image.trim() === '',
            }"
          />
        </div>
      </div>
      <DialogFooter>
        <DialogClose as-child>
          <Button
            @click="isEditing ? editProduct() : addProduct()"
            type="submit"
            :disabled="!isFormValid"
            >{{ isEditing ? 'Save' : 'Add' }}</Button
          >
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead class="w-[100px]">ID</TableHead>
        <TableHead>Title</TableHead>
        <TableHead>Price</TableHead>
        <TableHead>Category</TableHead>
        <TableHead class="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="product in products" :key="product.id">
        <TableCell class="font-medium">{{ product.id }}</TableCell>
        <TableCell>{{ product.title }}</TableCell>
        <TableCell>{{ product.price }}</TableCell>
        <TableCell>{{ product.category }}</TableCell>
        <TableCell class="text-right">
          <Dialog>
            <DialogTrigger as-child>
              <Button @click="setProductToEdit(product)" variant="outline"
                >Edit</Button
              >
            </DialogTrigger>
            <DialogContent class="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit product</DialogTitle>
                <DialogDescription>Edit the product details</DialogDescription>
              </DialogHeader>
              <div class="grid gap-4 py-4">
                <div class="grid grid-cols-4 items-center gap-4">
                  <Label for="title" class="text-right">Name</Label>
                  <Input
                    v-model="currentProduct.title"
                    id="title"
                    class="col-span-3 !ring-offset-0 !ring-0 border-grey-100"
                    @blur="touched.title = true"
                    :class="{
                      'border-red-500':
                        touched.title && currentProduct.title.trim() === '',
                    }"
                  />
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                  <Label for="price" class="text-right">Price</Label>
                  <Input
                    v-model="currentProduct.price"
                    id="price"
                    type="number"
                    class="col-span-3 !ring-offset-0 !ring-0 border-grey-100"
                    @blur="touched.price = true"
                    :class="{
                      'border-red-500':
                        touched.price && currentProduct.price <= 0,
                    }"
                  />
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                  <Label for="description" class="text-right"
                    >Description</Label
                  >
                  <Input
                    v-model="currentProduct.description"
                    id="description"
                    class="col-span-3 !ring-offset-0 !ring-0 border-grey-100"
                    @blur="touched.description = true"
                    :class="{
                      'border-red-500':
                        touched.description &&
                        currentProduct.description.trim() === '',
                    }"
                  />
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                  <Label for="category" class="text-right">Category</Label>
                  <Select
                    v-model="currentProduct.category"
                    id="category"
                    class="col-span-3 !ring-offset-0 !ring-0 border-grey-100"
                    @blur="touched.category = true"
                    :class="{
                      'border-red-500':
                        touched.category &&
                        currentProduct.category.trim() === '',
                    }"
                  >
                    <SelectTrigger
                      class="w-full flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 col-span-3 !ring-offset-0 !ring-0 border-grey-100"
                    >
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Categories</SelectLabel>
                        <SelectItem
                          v-for="category in categories"
                          :key="category.id"
                          :value="category.name"
                        >
                          {{ category.name }}
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                  <Label for="image" class="text-right">Image URL</Label>
                  <Input
                    v-model="currentProduct.image"
                    id="image"
                    class="col-span-3 !ring-offset-0 !ring-0 border-grey-100"
                    @blur="touched.image = true"
                    :class="{
                      'border-red-500':
                        touched.image && currentProduct.image.trim() === '',
                    }"
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose as-child>
                  <Button
                    @click="editProduct()"
                    type="submit"
                    :disabled="!isFormValid"
                    >Save</Button
                  >
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button
            @click="() => deleteProduct(product.id)"
            variant="outline"
            class="ml-2"
            >Delete</Button
          >
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
